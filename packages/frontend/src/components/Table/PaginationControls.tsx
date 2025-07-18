import React, { useCallback } from 'react';
import { Table } from '@tanstack/react-table';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Paper,
  SelectChangeEvent,
} from '@mui/material';
import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';

interface PaginationControlsProps<T> {
  table: Table<T>;
  pageSizeOptions?: number[];
}

const styles = {
  container: {
    mt: 3,
    p: 3,
    background: 'rgba(248, 250, 252, 0.8)',
    border: '1px solid',
    borderColor: 'divider',
  },
};

const PaginationControls = <T extends Record<string, any>>({
  table,
  pageSizeOptions = [5, 10, 20, 30, 40, 50],
}: PaginationControlsProps<T>) => {
  const handlePageSizeChange = useCallback((event: SelectChangeEvent<number>) => {
    const newSize = Number(event.target.value);
    table.setPageSize(newSize);
  }, [table]);

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;
  const filteredRows = table.getFilteredRowModel().rows.length;
  const startItem = table.getState().pagination.pageIndex * pageSize + 1;
  const endItem = Math.min((table.getState().pagination.pageIndex + 1) * pageSize, filteredRows);

  return (
    <Paper elevation={0} sx={styles.container}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Showing {startItem} to {endItem} of {filteredRows} results
          </Typography>
        </Box>


        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="First page">
            <IconButton
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              size="small"
            >
              <FirstPageIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Previous page">
            <IconButton
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              size="small"
            >
              <NavigateBeforeIcon />
            </IconButton>
          </Tooltip>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Page
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {currentPage} of {totalPages}
            </Typography>
          </Box>

          <Tooltip title="Next page">
            <IconButton
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              size="small"
            >
              <NavigateNextIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Last page">
            <IconButton
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              size="small"
            >
              <LastPageIcon />
            </IconButton>
          </Tooltip>
        </Stack>


        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Page Size</InputLabel>
          <Select
            value={pageSize}
            label="Page Size"
            onChange={handlePageSizeChange}
          >
            {pageSizeOptions.map((size) => (
              <MenuItem key={size} value={size}>
                Show {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
}; 
export default PaginationControls;