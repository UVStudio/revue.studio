import React, { useReducer, useCallback } from 'react';
import { Box, Button, Typography, FormGroup, TextField } from '@mui/material';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { poolData } from '../../constants/poolData';
import {
  cognitoUserLogout,
  getCognitoUserAttributes,
  dynamoDBEditProfile,
} from '../../features/user/userAPI';
import { removeProjectsList } from '../../features/projects/projectsSlice';
import { logoutUserState } from '../../features/user/userSlice';
import { UserState } from '../../features/user/userSlice';

export const userPool = new CognitoUserPool(poolData);

const FORM_UPDATE = 'FORM_UPDATE';

const initialForm = {
  name: '',
  city: '',
  country: '',
  company: '',
  description: '',
};

export interface ProfileForm {
  name: string;
  city: string;
  country: string;
  company: string;
  description: string;
}

export interface FormAction {
  type: string;
  field: string;
  payload: string;
}

const formReducer = (state: ProfileForm, action: FormAction) => {
  switch (action.type) {
    case FORM_UPDATE:
      return {
        ...state,
        [action.field]: action.payload,
      };
    default:
      return state;
  }
};

const Profile = ({ userState }: { userState: UserState }) => {
  const [formState, dispatchFormState] = useReducer(formReducer, initialForm);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      dispatchFormState({
        type: FORM_UPDATE,
        field: e.target.id,
        payload: e.target.value,
      });
    },
    []
  );

  //STATE AND NAV HOOKS
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const dynamoDBEditProfileHandler = async () => {
    console.log('formState: ', formState);
    await dynamoDBEditProfile(userState, formState);
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
      <Box sx={{ width: { xs: '30ch', sm: '45ch' } }}>
        <Typography variant="h6">Your Profile Info</Typography>
        <Typography variant="body2">(all fields voluntary)</Typography>
        <FormGroup>
          <TextField
            margin="dense"
            id="name"
            label="Name"
            value={formState.name}
            onChange={handleTextChange}
            variant="outlined"
          />
          <Box className="column">
            <TextField
              margin="dense"
              id="city"
              label="City"
              value={formState.city}
              onChange={handleTextChange}
              variant="outlined"
            />
            <TextField
              margin="dense"
              id="country"
              label="Country"
              value={formState.country}
              onChange={handleTextChange}
              variant="outlined"
            />
          </Box>
          <TextField
            margin="dense"
            id="company"
            label="Company Name"
            value={formState.company}
            onChange={handleTextChange}
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="description"
            label="Brief description of your work"
            value={formState.description}
            onChange={handleTextChange}
            multiline={true}
            maxRows={4}
            variant="outlined"
          />
        </FormGroup>
        <Box className="section" marginTop={'20px'}>
          <Button variant="contained" onClick={dynamoDBEditProfileHandler}>
            Update Profile Info
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
