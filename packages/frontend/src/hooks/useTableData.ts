import { useState, useCallback, useEffect } from "react";
import { TableColumn } from "../types/tableTypes";

const defaultValueSetter = <T extends Record<string, any>>(
  row: T,
  column: string,
  value: any
): T => ({
  ...row,
  [column]: value,
});

interface UseTableDataOptions<T extends Record<string, any>> {
  data: T[];
  columns: TableColumn<T>[];
  getRowId?: (row: T) => string;
  valueSetter?: (row: T, value: any) => T;
  onRowsUpdate?: (rows: T[]) => void;
}

export const useTableData = <T extends Record<string, any>>({
  data,
  columns,
  getRowId = (row: T) => row.id,
  onRowsUpdate,
}: UseTableDataOptions<T>) => {
  const [tableData, setTableData] = useState<T[]>(data);
  const [editedCells, setEditedCells] = useState<Set<string>>(new Set());


  useEffect(() => {
    if (data.length > 0) {
      setTableData(data);
    } else if (tableData.length > 0) {
      setTableData([]);
    }
  }, [data, tableData.length]);

  const saveChanges = useCallback(() => {
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
    onRowsUpdate?.(updatedRows);
    setEditedCells(new Set());
  }, [editedCells, tableData, getRowId, onRowsUpdate]);

  const updateCell = useCallback((rowId: string, columnId: string, value: any) => {
    setTableData((prevData) => {
      const newData = [...prevData];
      const rowIndex = newData.findIndex((row) => getRowId(row) === rowId);
      
      if (rowIndex === -1) return prevData;
      
      const column = columns.find((c) => c.field === columnId);
      const valueSetter = column?.valueSetter || defaultValueSetter;
      
      newData[rowIndex] = valueSetter(newData[rowIndex], columnId, value);
      return newData;
    });
    
    setEditedCells((prev) => new Set(prev).add(`${rowId}-${columnId}`));
  }, [columns, getRowId]);

  return {
    data: tableData,
    editedCells,
    updateCell,
    saveChanges,
  };
};
