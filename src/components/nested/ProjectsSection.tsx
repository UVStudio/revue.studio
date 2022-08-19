import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import {
  ProjectObject,
  ProjectsArray,
} from '../../features/projects/projectsSlice';
import { useNavigate } from 'react-router-dom';

const ProjectsSection = ({
  projectsState,
}: {
  projectsState: ProjectsArray;
}) => {
  const navigate = useNavigate();

  const toProjectDetailsHandler = (project: ProjectObject) => {
    navigate(`../projectDetails/${project.id}`, {
      replace: false,
      state: project,
    });
  };

  const toNewProjectHandler = () => {
    navigate('../AddProject', { replace: false });
  };

  return (
    <Box className="section">
      <Box className="section" marginTop={'20px'}>
        <Button variant="contained" onClick={toNewProjectHandler}>
          New Project
        </Button>
      </Box>
      <Typography>Your Projects:</Typography>
      {projectsState.projects.map((project: ProjectObject) => {
        return (
          <Box
            key={project.id}
            className="project-list-item"
            sx={{ textAlign: 'center' }}
            onClick={() => toProjectDetailsHandler(project)}
          >
            <Typography variant="body2">{project.projectName}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default ProjectsSection;