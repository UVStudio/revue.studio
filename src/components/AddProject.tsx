import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectUser } from '../features/user/userSlice';
import {
  selectProjects,
  getProjectsList,
} from '../features/projects/projectsSlice';
import {
  dynamoDBAddProject,
  dynamoDBGetProjectsByUserId,
} from '../features/projects/projectsAPI';
import { useNavigate } from 'react-router-dom';

const initialFormData = {
  projectName: '',
  projectDescription: '',
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

  const { projectName, projectDescription } = formData;

  const userId = userState.id;

  useEffect(() => {
    // setProjectId(uuidv4());
    for (const project of projectsState.projects) {
      console.log('each project: ', project);
      console.log('projectId: ', projectId);
      if (project.id === projectId) {
        navigate(`../projectDetails/${projectId}`, {
          replace: false,
          state: projectsState.projects[projectsState.projects.length - 1],
        });
      }
    }
  }, [projectId, navigate, projectsState.projects]);

  const onChangeForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const createProjectObject = async () => {
    const timeStamp = Date.now().toString();

    try {
      if (projectName === '' || projectDescription === '') {
        throw new Error('Please fill out form');
      }
      await dynamoDBAddProject(
        projectId,
        userId,
        projectName,
        projectDescription,
        timeStamp
      );
      const result = await dynamoDBGetProjectsByUserId(userId);
      dispatch(getProjectsList(result.data.Items));
      setFormData(initialFormData);
    } catch (error: unknown) {
      const err = error as Error;
      console.log(err.message);
    }
  };

  console.log('project state: ', projectsState);

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
      </Box>
      <Box className="section" marginTop={'20px'}>
        <Button variant="contained" onClick={createProjectObject}>
          Create Project
        </Button>
      </Box>
    </Box>
  );
};

export default AddProject;
