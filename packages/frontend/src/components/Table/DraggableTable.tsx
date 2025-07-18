import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  ColumnFiltersState,
  PaginationState,
  RowData,
} from '@tanstack/react-table';
import { Box } from '@mui/material';

import { TableColumn } from '../../types/tableTypes';
import SaveChangesBar from './SaveChangesBar';
import DraggableTableContent from './DraggableTableContent';
import PaginationControls from './PaginationControls';
import DragInstructions from './DragInstructions';


declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowId: string, columnId: string, value: unknown) => void;
    editedCells: Set<string>;
  }
}


const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_COLUMN_SIZE = 150;


const CONTAINER_STYLES = {
  overflow: 'hidden',
  position: 'relative' as const
};


const defaultValueSetter = <T extends Record<string, any>>(
  row: T,
  column: string,
  value: any
): T => ({
  ...row,
  [column]: value,
});


function useSkipper() {
  const shouldSkipRef = useRef(true);
  const shouldSkip = shouldSkipRef.current;

  const skip = useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

interface DraggableTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading: boolean;
  getRowId?: (row: T) => string;
  onColumnOrderChange?: (newOrder: string[]) => void;
  pageSize?: number;
  onSaveChanges?: (updatedRows: T[]) => void;
}

const DraggableTable = <T extends Record<string, any>>({
  columns,
  data,
  isLoading,
  getRowId = (row: T) => row.id,
  onColumnOrderChange,
  pageSize = DEFAULT_PAGE_SIZE,
  onSaveChanges,
}: DraggableTableProps<T>) => {
  const [tableData, setTableData] = useState<T[]>(data);
  const [editedCells, setEditedCells] = useState<Set<string>>(new Set());
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    columns.map((col) => col.field)
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
  const columnHelper = createColumnHelper<T>();


  useEffect(() => {
    if (data.length > 0) {
      setTableData(data);
    } else if (tableData.length > 0) {
      setTableData([]);
    }
  }, [data, tableData.length]);


  useEffect(() => {
    const newColumnOrder = columns.map((col) => col.field);
    setColumnOrder(newColumnOrder);
  }, [columns]);


  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      pageSize: pageSize,
      pageIndex: 0,
    }));
  }, [pageSize]);


  useEffect(() => {
    if (autoResetPageIndex) {
      setPagination(prev => ({
        ...prev,
        pageIndex: 0,
      }));
    }
  }, [data.length, autoResetPageIndex]);


  const tableColumns = useMemo(() => {
    return columns.map((col) =>
      columnHelper.accessor(
        (row) => col.valueGetter?.(row) ?? row[col.field as keyof T],
        {
          id: col.field,
          header: col.headerName,
          size: DEFAULT_COLUMN_SIZE,
          enableSorting: false,
          enableColumnFilter: true,
          filterFn: 'includesString',
          meta: { renderCell: col.renderCell },
        }
      )
    );
  }, [columns, columnHelper]);


  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnOrder,
      columnFilters,
      pagination,
    },
    onColumnOrderChange: setColumnOrder,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    manualPagination: false,
    manualSorting: true,
    autoResetPageIndex, 
    meta: {
      updateData: (rowId, columnId, value) => {
        skipAutoResetPageIndex();
        setTableData(old => {
          const newData = [...old];
          const rowIndex = newData.findIndex(r => getRowId(r) === rowId);
          
          if (rowIndex === -1) return old;
          
          const column = columns.find((c) => c.field === columnId);
          const valueSetter = column?.valueSetter || defaultValueSetter;
          
          newData[rowIndex] = valueSetter(newData[rowIndex], columnId, value);
          return newData;
        });
        
        const cellKey = `${rowId}-${columnId}`;
        setEditedCells(prev => new Set(prev).add(cellKey));
      },
      editedCells,
    },
  });

  const handleFilterChange = useCallback((columnId: string, value: string) => {
    table.getColumn(columnId)?.setFilterValue(value);
  }, [table]);

  const handleColumnOrderChange = useCallback((newOrder: string[]) => {
    onColumnOrderChange?.(newOrder);
  }, [onColumnOrderChange]);

  const handleSaveChanges = useCallback(() => {
    skipAutoResetPageIndex();
    const cellsToUpdate = Array.from(editedCells).reduce<Record<string, T>>(
      (acc, cell) => {
        const [rowId] = cell.split("-");
        const row = tableData.find((row) => getRowId(row) === rowId);
        if (row) {
          acc[rowId] = row;
        }
        return acc;
      },
      {}
    );
    
    const updatedRows = Object.values(cellsToUpdate);
    onSaveChanges?.(updatedRows);
    setEditedCells(new Set());
  }, [editedCells, tableData, getRowId, onSaveChanges, skipAutoResetPageIndex]);

  const hasEdits = useMemo(() => editedCells.size > 0, [editedCells.size]);
  const showSaveButton = useMemo(() => hasEdits && onSaveChanges, [hasEdits, onSaveChanges]);

  return (
    <Box sx={CONTAINER_STYLES}>
      {showSaveButton && (
        <SaveChangesBar
          editedCellsCount={editedCells.size}
          onSaveChanges={handleSaveChanges}
        />
      )}

      <DraggableTableContent
        table={table}
        columns={columns}
        getRowId={getRowId}
        isLoading={isLoading}
        onFilter={handleFilterChange}
        onColumnOrderChange={handleColumnOrderChange}
      />

      <PaginationControls table={table} />
      <DragInstructions />
    </Box>
  );
};

export default DraggableTable; 