import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { poolData } from '../../constants/poolData';
import {
  cognitoUserLogout,
  getCognitoUserAttributes,
  dynamoDBEditUserName,
} from '../../features/user/userAPI';
import { removeProjectsList } from '../../features/projects/projectsSlice';
import { logoutUserState } from '../../features/user/userSlice';
import { UserState } from '../../features/user/userSlice';

export const userPool = new CognitoUserPool(poolData);

const Profile = ({ userState }: { userState: UserState }) => {
  //STATE AND NAV HOOKS
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const dynamoDBEditUserNameHandler = async () => {
    await dynamoDBEditUserName(userState.id, userState.email, 'Leo');
  };

  const getUserAttrHandler = async () => {
    await getCognitoUserAttributes();
  };

  const userLogoutHandler = () => {
    localStorage.clear();
    cognitoUserLogout();
    dispatch(logoutUserState());
    dispatch(removeProjectsList());
    navigate('../', { replace: true });
  };

  return (
    <Box>
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
    </Box>
  );
};

export default Profile;
