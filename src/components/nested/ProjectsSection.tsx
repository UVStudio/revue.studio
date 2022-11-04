import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material';
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
import { convertTime } from '../../utils/convertTime';

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
      <Box className="section">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="section" sx={{ width: '100%' }}>
      <Box className="section" sx={{ mt: 2 }}>
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
            <Paper
              elevation={2}
              className="project-list-item"
              sx={{ paddingY: 3, paddingX: 7 }}
              onClick={() => toProjectDetailsHandler(project)}
            >
              <Typography variant="h6">{project.projectName}</Typography>
              <Box className="project-listing-text">
                <Typography variant="body2">
                  {project.projectDescription}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ alignSelf: 'flex-end' }}>
                Created: {convertTime(project.timeStamp)}
              </Typography>
            </Paper>
          </Box>
        );
      })}
    </Box>
  );
};

export default ProjectsSection;
