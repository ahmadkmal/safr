import React from 'react';
import { Box, Button, Stack, Chip } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

interface SaveChangesBarProps {
  editedCellsCount: number;
  onSaveChanges: () => void;
}

const styles = {
  container: {
    p: 2,
    borderBottom: '1px solid',
    borderColor: 'divider'
  },
  saveButton: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    '&:hover': {
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    },
  },
};

const SaveChangesBar: React.FC<SaveChangesBarProps> = ({
  editedCellsCount,
  onSaveChanges,
}) => {
  return (
    <Box sx={styles.container}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Chip 
          label={`${editedCellsCount} unsaved changes`} 
          color="warning" 
          variant="outlined"
          icon={<SaveIcon />}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={onSaveChanges}
          sx={styles.saveButton}
        >
          Save Changes
        </Button>
      </Stack>
    </Box>
  );
}; 
export default SaveChangesBar;