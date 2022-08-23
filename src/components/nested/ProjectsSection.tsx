import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import {
  ProjectObject,
  ProjectsArray,
} from '../../features/projects/projectsSlice';
import { dynamoDBDeleteProjectByProjectId } from '../../features/projects/projectsAPI';
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

  const s3DeleteProjectHandler = async (project: ProjectObject) => {
    console.log('delete: ', project);
    const response = await dynamoDBDeleteProjectByProjectId(project);
    console.log('response: ', response);
  };

  const projects = [...projectsState.projects];
  const reversedProjects = projects.reverse();

  if (projectsState.loading === 'loading') {
    return (
      <Box className="section" marginTop={'20px'}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="section" sx={{ width: '100%' }}>
      <Box className="section" marginTop={'20px'}>
        <Button variant="contained" onClick={toNewProjectHandler}>
          New Project
        </Button>
      </Box>
      <Typography>Your Projects:</Typography>
      {reversedProjects.map((project: ProjectObject) => {
        return (
          <Box key={project.id} className="outer-project-container">
            <Button onClick={() => s3DeleteProjectHandler(project)}>
              <Typography variant="body2" color={'red'}>
                DELETE PROJECT
              </Typography>
            </Button>
            <Box
              className="project-list-item"
              sx={{ paddingY: '8px', paddingX: '15px' }}
              onClick={() => toProjectDetailsHandler(project)}
            >
              <Typography variant="subtitle1">{project.projectName}</Typography>
              <Typography variant="body2">
                {project.projectDescription}
              </Typography>
              <Typography variant="body2">{project.id}</Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default ProjectsSection;
