import React from 'react';
import { Box, Typography } from '@mui/material';
import { Project, ProjectsArray } from '../../features/projects/projectsSlice';
import { useNavigate } from 'react-router-dom';

const ProjectsSection = ({
  projectsState,
}: {
  projectsState: ProjectsArray;
}) => {
  const navigate = useNavigate();

  const toProjectDetailsHandler = (project: Project) => {
    navigate(`../projectDetails/${project.id}`, {
      replace: false,
      state: project,
    });
  };

  return (
    <Box className="section">
      <Typography variant="h5">Your Projects:</Typography>
      {projectsState.projects.map((project: Project) => {
        return (
          <Box
            key={project.id}
            className="add-project-row"
            sx={{ textAlign: 'center' }}
            onClick={() => toProjectDetailsHandler(project)}
          >
            <Typography>{project.projectName}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default ProjectsSection;
