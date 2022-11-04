import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const CustomCircularProgress = () => {
  return (
    <Box className="flex-row" sx={{ minHeight: '650px' }}>
      <CircularProgress />
    </Box>
  );
};

export default CustomCircularProgress;
