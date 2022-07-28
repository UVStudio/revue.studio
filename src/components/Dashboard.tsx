import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectUser, logoutUserState } from '../features/user/userSlice';
import { cognitoUserLogout } from '../features/user/userAPI';
import { poolData } from '../constants/poolData';

import { CognitoUserPool } from 'amazon-cognito-identity-js';

export const userPool = new CognitoUserPool(poolData);

const Dashboard = () => {
  const userState = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const userLogoutHandler = async () => {
    cognitoUserLogout();
    dispatch(logoutUserState());
  };

  return (
    <Box className="section">
      <Typography>Dashboard</Typography>
      <Box className="section">
        <Typography>{userState.email}</Typography>
        <Button variant="contained" onClick={userLogoutHandler}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
