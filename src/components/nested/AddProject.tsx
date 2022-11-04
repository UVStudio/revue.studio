import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectUser } from '../../features/user/userSlice';
import {
  selectProjects,
  getProjectsList,
  projectsLoading,
} from '../../features/projects/projectsSlice';
import {
  dynamoDBAddProject,
  dynamoDBGetProjectsByUserId,
} from '../../features/projects/projectsAPI';
import { useNavigate } from 'react-router-dom';

const initialFormData = {
  projectName: '',
  projectDescription: '',
  projectPassword: '',
};

const AddProject = () => {
  //GLOBAL STATE
  const userState = useAppSelector(selectUser);
  const projectsState = useAppSelector(selectProjects);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //OBTAIN PROJECT FORM INPUTS & COMPONENT HOOKS
  const [formData, setFormData] = useState(initialFormData);
  const [projectId] = useState(uuidv4());

  const { projectName, projectDescription, projectPassword } = formData;

  const userId = userState.id;

  const onChangeForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const createProjectObject = async () => {
    const timeStamp = Date.now().toString();

    try {
      if (
        projectName === '' ||
        projectDescription === '' ||
        projectPassword === ''
      ) {
        throw new Error('Please fill out form');
      }
      dispatch(projectsLoading());
      await dynamoDBAddProject(
        projectId,
        userId,
        projectName,
        projectDescription,
        timeStamp,
        projectPassword
      );
      const response = await dynamoDBGetProjectsByUserId(userId);
      dispatch(getProjectsList(response.data.Items));
      setFormData(initialFormData);
      navigate('../Dashboard', { replace: true });
    } catch (error: unknown) {
      const err = error as Error;
      console.log(err.message);
    }
  };

  if (projectsState.loading === 'loading' || userState.loading === 'loading') {
    return (
      <Box className="section" paddingTop={'20px'}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="section">
      <Typography variant="h6">Create Project</Typography>
      <Box
        className="section"
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' },
        }}
      >
        <TextField
          required
          id="projectName"
          label="Project Name"
          value={projectName}
          onChange={(e) => onChangeForm(e)}
        />
        <TextField
          fullWidth
          multiline
          id="projectDescription"
          label="Project Description"
          value={projectDescription}
          onChange={(e) => onChangeForm(e)}
        />
        <TextField
          fullWidth
          required
          id="projectPassword"
          label="Project Password"
          value={projectPassword}
          onChange={(e) => onChangeForm(e)}
        />
      </Box>
      <Box className="section" mt={'20px'}>
        <Button variant="contained" onClick={createProjectObject}>
          Create Project
        </Button>
      </Box>
    </Box>
  );
};

export default AddProject;

// useEffect(() => {
//   for (const project of projectsState.projects) {
//     if (project.id === projectId) {
//       navigate(`../projectDetails/${projectId}`, {
//         replace: false,
//         state: projectsState.projects[projectsState.projects.length - 1],
//       });
//     }
//   }
// }, [projectId, navigate, projectsState.projects]);
