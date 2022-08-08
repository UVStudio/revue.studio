import React from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Project } from '../features/projects/projectsSlice';

const ProjectDetails = () => {
  const state = useLocation().state as Project;
  console.log('state: ', state);

  return (
    <Box className="section">
      <Typography variant="h6">ProjectDetails</Typography>
      <Typography variant="h6">{state.id}</Typography>
      <Typography variant="h6">{state.projectName}</Typography>
    </Box>
  );
};

export default ProjectDetails;
