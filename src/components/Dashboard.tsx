import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectUser, logoutUserState } from '../features/user/userSlice';
import {
  cognitoUserLogout,
  getCognitoUserAttributes,
} from '../features/user/userAPI';
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

  const getUserAttrHandler = async () => {
    const value = await getCognitoUserAttributes();
    console.log('value: ', value);
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
    </Box>
  );
};

export default Dashboard;
