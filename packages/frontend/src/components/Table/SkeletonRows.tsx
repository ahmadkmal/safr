import React from 'react';
import { Skeleton, TableRow, TableCell } from '@mui/material';
import { TableColumn } from '../../types/tableTypes';

interface SkeletonRowsProps<T> {
  columns: TableColumn<T>[];
  count?: number;
}

const SkeletonRows = <T extends Record<string, any>>({
  columns,
  count = 5,
}: SkeletonRowsProps<T>) => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell colSpan={columns.length}>
            <Skeleton 
              variant="rectangular" 
              height={60} 
              sx={{ 
                mb: 1,
                borderRadius: 1,
              }} 
            />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
export default SkeletonRows;