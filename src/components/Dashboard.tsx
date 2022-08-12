import React from 'react';
import ReactPlayer from 'react-player/lazy';
import { Box, Button, Typography } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectUser, logoutUserState } from '../features/user/userSlice';
import {
  selectProjects,
  Project,
  removeProjectsList,
} from '../features/projects/projectsSlice';
import {
  cognitoUserLogout,
  getCognitoUserAttributes,
  dynamoDBEditUserName,
} from '../features/user/userAPI';
import { poolData } from '../constants/poolData';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { useNavigate } from 'react-router-dom';

export const userPool = new CognitoUserPool(poolData);

const Dashboard = () => {
  //GLOBAL STATE
  const userState = useAppSelector(selectUser);
  const projectsState = useAppSelector(selectProjects);

  console.log('dashboard rerenders');

  //STATE AND NAV HOOKS
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userLogoutHandler = () => {
    localStorage.clear();
    cognitoUserLogout();
    dispatch(logoutUserState());
    dispatch(removeProjectsList());
    navigate('../', { replace: true });
  };

  const downloadHandler = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ): void => {
    e.preventDefault();
    window.location.href =
      'https://revue-video-testing.s3.amazonaws.com/squirrel1.mp4'; // it will open download of filepath
  };

  const dynamoDBEditUserNameHandler = async () => {
    await dynamoDBEditUserName(userState.id, userState.email, 'Leo');
  };

  const getUserAttrHandler = async () => {
    await getCognitoUserAttributes();
  };

  const toProjectDetailsHandler = (project: Project) => {
    navigate(`../projectDetails/${project.id}`, {
      replace: false,
      state: project,
    });
  };

  return (
    <Box className="section">
      <Box className="section">
        <Typography>{userState.email}</Typography>
        {userState.email ? (
          <Button variant="contained" onClick={userLogoutHandler}>
            Logout
          </Button>
        ) : (
          <Typography>You are not authenticated.</Typography>
        )}
      </Box>
      <Box className="section">
        <Button variant="contained" onClick={getUserAttrHandler}>
          User Attribute
        </Button>
      </Box>
      <Box className="section">
        <Button variant="contained" onClick={dynamoDBEditUserNameHandler}>
          Update DDB Username
        </Button>
      </Box>
      <Box>
        {projectsState.projects.map((project: Project) => {
          return (
            <Box
              key={project.id}
              className="add-project-row"
              onClick={() => toProjectDetailsHandler(project)}
            >
              <Typography className="add-project-row-text">
                {project.projectName}
              </Typography>
            </Box>
          );
        })}
      </Box>
      <Box className="video-container">
        <Box className="video-info-container">
          <Typography>Video Name</Typography>
          <FileDownloadOutlinedIcon onClick={(e) => downloadHandler(e)} />
        </Box>
        <Box className="video-player-container">
          <Box className="video-player">
            <ReactPlayer
              controls={true}
              onDuration={(dur) => console.log('duration: ', dur)}
              light={true}
              url="https://revue-video-testing.s3.amazonaws.com/squirrel1.mp4"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
