import React, { useState, useCallback } from 'react';
import { Cell } from '@tanstack/react-table';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, TextField, Tooltip, Chip, Typography } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

import { TableCell } from '../StyledComponents';


const EDIT_CHIP_STYLES = {
  position: 'absolute',
  top: -8,
  right: -8,
  fontSize: '0.6rem',
  height: 16,
  '& .MuiChip-label': {
    px: 0.5,
  },
} as const;

const TEXT_FIELD_STYLES = {
  '& .MuiOutlinedInput-root': {
    fontSize: '0.875rem',
    py: 0.5,
    '& fieldset': {
      borderColor: 'primary.main',
    },
  },
} as const;

const CELL_CONTENT_STYLES = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  minHeight: '24px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 1,
  },
} as const;

const EDIT_ICON_STYLES = {
  color: 'text.secondary',
  opacity: 0,
  transition: 'opacity 0.1s',
  '&:hover': {
    color: 'primary.main',
  },
} as const;

interface DragAlongCellProps<T> {
  cell: Cell<T, unknown>;
  rowId: string;
}

export const DragAlongCell = <T extends Record<string, any>>({
  cell,
  rowId,
}: DragAlongCellProps<T>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(cell.getValue() as string);
  
  const columnId = cell.column.id;
  const cellValue = cell.getValue() as string;
  const row = cell.row.original;

  const {
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: columnId });

  const cellKey = `${rowId}-${columnId}`;
  const isEdited = cell.getContext().table.options.meta?.editedCells.has(cellKey) || false;

  const updateCell = useCallback((value: any) => {
    cell.getContext().table.options.meta?.updateData(rowId, columnId, value);
  }, [cell, rowId, columnId]);

  const column = cell.getContext().table.getAllColumns().find(col => col.id === columnId);
  const renderCell = (column?.columnDef.meta as any)?.renderCell;

  const handleEditStart = useCallback(() => {
    setIsEditing(true);
    setEditValue(cellValue);
  }, [cellValue]);

  const handleEditSave = useCallback(() => {
    if (editValue !== cellValue) {
      updateCell(editValue);
    }
    setIsEditing(false);
  }, [editValue, cellValue, updateCell]);

  const handleEditCancel = useCallback(() => {
    setEditValue(cellValue);
    setIsEditing(false);
  }, [cellValue]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  }, [handleEditSave, handleEditCancel]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  }, []);

  const dragStyle = {
    transform: CSS.Translate.toString(transform),
    transition: 'transform 0.1s ease-out',
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  const renderEditIndicator = () => (
    isEdited && (
      <Chip
        label="Edited"
        size="small"
        color="warning"
        variant="outlined"
        sx={EDIT_CHIP_STYLES}
      />
    )
  );

  const renderTextField = () => (
    <TextField
      value={editValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onBlur={handleEditSave}
      size="small"
      fullWidth
      autoFocus
      variant="outlined"
      sx={TEXT_FIELD_STYLES}
    />
  );

  const renderCellContent = () => (
    <Box sx={CELL_CONTENT_STYLES} onClick={handleEditStart}>
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          color: isEdited ? 'warning.main' : 'text.primary',
          fontWeight: isEdited ? 600 : 400,
        }}
      >
        {cellValue || '—'}
      </Typography>
      <Tooltip title="Click to edit">
        <EditIcon fontSize="small" sx={EDIT_ICON_STYLES} />
      </Tooltip>
    </Box>
  );

  const renderCellContentBasedOnState = () => {
    if (renderCell) {
      return renderCell(cellValue, row, rowId, updateCell, isEdited);
    }
    
    if (isEditing) {
      return renderTextField();
    }
    
    return renderCellContent();
  };

  return (
    <TableCell ref={setNodeRef} isEdited={isEdited} style={dragStyle}>
      <Box sx={{ position: 'relative', width: '100%' }}>
        {renderEditIndicator()}
        {renderCellContentBasedOnState()}
      </Box>
    </TableCell>
  );
};

export const MemoizedDragAlongCell = React.memo(DragAlongCell) as typeof DragAlongCell;