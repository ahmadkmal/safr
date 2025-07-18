import React, { useCallback, useMemo } from 'react';
import { flexRender, Header } from '@tanstack/react-table';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import debounce from 'lodash/debounce';

import { TableHeader, SearchInput } from '../StyledComponents';

interface DraggableTableHeaderProps<T> {
  header: Header<T, unknown>;
  onFilter: (column: string, value: string) => void;
}

export const DraggableTableHeader = <T extends Record<string, any>>({
  header,
  onFilter,
}: DraggableTableHeaderProps<T>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: header.column.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as const,
    whiteSpace: 'nowrap' as const,
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
    boxShadow: isDragging ? '0 8px 25px rgba(0, 0, 0, 0.15)' : 'none',
  };


  const debouncedFilter = useMemo(
    () => debounce((value: string) => {
      onFilter(header.column.id, value);
    }, 300),
    [onFilter, header.column.id]
  );

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedFilter(value);
  }, [debouncedFilter]);

  const handleFilterClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const headerContent = flexRender(header.column.columnDef.header, header.getContext());

  return (
    <TableHeader ref={setNodeRef} style={style} colSpan={header.colSpan}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          gap: 1,
        }}
      >

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            gap: 1,
          }}
        >

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {header.isPlaceholder ? null : (
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: '0.875rem',
                }}
              >
                {headerContent}
              </Typography>
            )}
          </Box>


          <SearchInput
            placeholder={`Filter ${headerContent as string}...`}
            onChange={handleFilterChange}
            onClick={handleFilterClick}
            style={{
              fontSize: '0.75rem',
              padding: '6px 8px',
            }}
          />
        </Box>


        <Tooltip title="Drag to reorder column">
          <IconButton
            {...attributes}
            {...listeners}
            size="small"
            sx={{
              color: 'text.secondary',
              cursor: 'grab',
              p: 0.5,
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
              },
              '&:active': {
                cursor: 'grabbing',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
              },
            }}
          >
            <DragIndicatorIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </TableHeader>
  );
};


export default React.memo(DraggableTableHeader) as typeof DraggableTableHeader;