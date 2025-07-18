import React, { useMemo } from 'react';
import { Row } from '@tanstack/react-table';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { DragAlongCell } from './DragAlongCell';

interface TableRowsProps<T> {
  rows: Row<T>[];
  table: any;
  getRowId: (row: T) => string;
}

const TableRows = <T extends Record<string, any>>({
  rows,
  table,
  getRowId,
}: TableRowsProps<T>) => {

  const columnOrder = table.getState().columnOrder as string[];
  

  const sortedCells = useMemo(() => {
    return rows.map(row => {
      const visibleCells = row.getVisibleCells();
      return visibleCells.sort((a, b) => {
        const aIndex = columnOrder.indexOf(a.column.id);
        const bIndex = columnOrder.indexOf(b.column.id);
        return aIndex - bIndex;
      });
    });
  }, [rows, columnOrder]);

  return (
    <>
      {rows.map((row, rowIndex) => (
        <tr key={getRowId(row.original)}>
          {sortedCells[rowIndex].map((cell) => {
            const rowId = getRowId(row.original);
            
            return (
              <SortableContext
                key={cell.id}
                items={columnOrder}
                strategy={horizontalListSortingStrategy}
              >
                <DragAlongCell
                  cell={cell}
                  rowId={rowId}
                />
              </SortableContext>
            );
          })}
        </tr>
      ))}
    </>
  );
};

export default React.memo(TableRows) as typeof TableRows;