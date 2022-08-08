import React from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const ProjectDetails = () => {
  const params = useParams();
  console.log(params);

  return (
    <Box className="section">
      <Typography variant="h6">ProjectDetails</Typography>
      <Typography variant="h6">{params.projectId}</Typography>
    </Box>
  );
};

export default ProjectDetails;
