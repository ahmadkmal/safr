import React from 'react';
import { Table } from '@tanstack/react-table';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import { StyledTable } from '../StyledComponents';
import ShowIf from '../ShowIf';
import { TableColumn } from '../../types/tableTypes';
import DraggableTableHeader from './DraggableTableHeader';
import TableRows from './TableRows';
import SkeletonRows from './SkeletonRows';

interface DraggableTableContentProps<T> {
  table: Table<T>;
  columns: TableColumn<T>[];
  getRowId: (row: T) => string;
  isLoading: boolean;
  onFilter: (columnId: string, value: string) => void;
  onColumnOrderChange: (newOrder: string[]) => void;
  skeletonRowsCount?: number;
}

const SKELETON_ROWS_COUNT = 5;

export const DraggableTableContent = <T extends Record<string, any>>({
  table,
  columns,
  getRowId,
  isLoading,
  onFilter,
  onColumnOrderChange,
  skeletonRowsCount = SKELETON_ROWS_COUNT,
}: DraggableTableContentProps<T>) => {

  const columnOrder = table.getState().columnOrder as string[];
  

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over || active.id === over.id) {
      return;
    }

    try {
      const oldIndex = columnOrder.indexOf(active.id as string);
      const newIndex = columnOrder.indexOf(over.id as string);

      if (oldIndex === -1 || newIndex === -1) {
        console.warn('Invalid column indices during drag operation');
        return;
      }

      const newColumnOrder = arrayMove(columnOrder, oldIndex, newIndex);
      

      table.setColumnOrder(newColumnOrder);
      

      onColumnOrderChange(newColumnOrder);
    } catch (error) {
      console.error('Error during drag operation:', error);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
    >
      <StyledTable>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              <SortableContext
                items={columnOrder}
                strategy={horizontalListSortingStrategy}
              >
                {headerGroup.headers.map((header) => (
                  <DraggableTableHeader
                    key={header.id}
                    header={header}
                    onFilter={onFilter}
                  />
                ))}
              </SortableContext>
            </tr>
          ))}
        </thead>
        <tbody>
          <ShowIf
            condition={!isLoading}
            fallback={<SkeletonRows columns={columns} count={skeletonRowsCount} />}
          >
            <TableRows
              rows={table.getRowModel().rows}
              table={table}
              getRowId={getRowId}
            />
          </ShowIf>
        </tbody>
      </StyledTable>
    </DndContext>
  );
};
export default DraggableTableContent;