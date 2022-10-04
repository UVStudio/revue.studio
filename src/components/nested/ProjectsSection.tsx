import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import {
  ProjectObject,
  ProjectsArray,
  projectsLoading,
  getProjectsList,
} from '../../features/projects/projectsSlice';
import {
  dynamoDBDeleteProjectByProjectId,
  dynamoDBGetProjectsByUserId,
} from '../../features/projects/projectsAPI';
import { useNavigate } from 'react-router-dom';

const ProjectsSection = ({
  projectsState,
}: {
  projectsState: ProjectsArray;
}) => {
  const dispatch = useAppDispatch();
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
    dispatch(projectsLoading());
    await dynamoDBDeleteProjectByProjectId(project);
    const response = await dynamoDBGetProjectsByUserId(project.userId);
    dispatch(getProjectsList(response.data.Items));
  };

  const projects = [...projectsState.projects];
  const reversedProjects = projects.reverse();

  if (projectsState.loading === 'loading') {
    return (
      <Box className="section" paddingTop={'20px'}>
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
              <Typography variant="h6">{project.projectName}</Typography>
              <Box className="project-listing-text">
                <Typography variant="body2">
                  {project.projectDescription}
                </Typography>
              </Box>
              <Typography variant="body2">{project.id}</Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default ProjectsSection;
