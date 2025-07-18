import React from 'react';
import { Box, Chip } from '@mui/material';
import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material';

const styles = {
  container: {
    mt: 2,
    textAlign: 'center' as const
  }
};

const DragInstructions: React.FC = () => {
  return (
    <Box sx={styles.container}>
      <Chip 
        label="Drag column headers to reorder" 
        size="small" 
        variant="outlined" 
        color="info"
        icon={<DragIndicatorIcon />}
      />
    </Box>
  );
}; 
export default DragInstructions;