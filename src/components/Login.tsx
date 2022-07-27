import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectUser } from '../features/user/userSlice';
import {
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';

import {
  userPool,
  attributeList,
  userSignUp,
  sendConfirm,
  userLogin,
} from '../features/user/userAPI';

const initialFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
};

const initialConfirmData = {
  confirmEmail: '',
  confirmCode: '',
};

const Login = () => {
  //GLOBAL STATE
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  //OBTAIN USER FORM INPUTS
  const [formData, setFormData] = useState(initialFormData);
  const [confirmData, setConfirmData] = useState(initialConfirmData);
  const [register, setRegister] = useState(true);

  const { name, email, password, confirmPassword, phone } = formData;
  const { confirmEmail, confirmCode } = confirmData;

  //FORM CHANGE HANDLERS
  const onChangeForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const onChangeCode = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setConfirmData({ ...confirmData, [e.target.id]: e.target.value });
  };

  //DATA COGNITO USER POOL USER REGISTRATION DATA & SIGN UP
  const dataEmail = {
    Name: 'email',
    Value: email,
  };

  const dataPhoneNumber = {
    Name: 'phone_number',
    Value: phone,
  };

  const attributeEmail = new CognitoUserAttribute(dataEmail);
  const attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);

  attributeList.push(attributeEmail);
  attributeList.push(attributePhoneNumber);

  //DATA FOR COGNITO USER AUTHENTICATION
  const userData = {
    Username: confirmEmail,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  //DATA FOR COGNITO LOGIN & OBTAIN TOKEN
  const loginUserData = {
    Username: email,
    Pool: userPool,
  };

  const authenticationData = {
    Username: email,
    Password: password,
  };

  const loginCognitoUser = new CognitoUser(loginUserData);
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  //loginUserHandler -> dispatch

  //UI RENDERS
  return (
    <Box>
      <Box
        className="section"
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <Box>
          <Button onClick={() => setRegister(false)}>
            I already have an account
          </Button>
          /<Button onClick={() => setRegister(true)}>I am a new user</Button>
        </Box>
        <Box className="title-container">
          <Typography variant="h6">
            {register ? 'Register' : 'Login'}
          </Typography>
        </Box>
        {register ? (
          <TextField
            required
            id="name"
            label="Username"
            value={name}
            onChange={(e) => onChangeForm(e)}
          />
        ) : null}
        <TextField
          required
          id="email"
          label="E-mail"
          value={email}
          onChange={(e) => onChangeForm(e)}
        />
        <TextField
          required
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => onChangeForm(e)}
        />
        {register ? (
          <TextField
            required
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            autoComplete="confirm-password"
            value={confirmPassword}
            onChange={(e) => onChangeForm(e)}
          />
        ) : null}
        {register ? (
          <TextField
            required
            id="phone"
            label="Phone Number"
            value={phone}
            onChange={(e) => onChangeForm(e)}
          />
        ) : null}

        {register ? (
          <Button
            variant="contained"
            onClick={() =>
              userSignUp(email, password, attributeList, setFormData)
            }
          >
            Register
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => userLogin(loginCognitoUser, authenticationDetails)}
          >
            Login
          </Button>
        )}
      </Box>
      {register ? (
        <Box
          className="section"
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <Box className="title-container">
            <Typography variant="h6">Confirm Registration</Typography>
          </Box>
          <TextField
            required
            id="confirmEmail"
            label="E-mail"
            value={confirmEmail}
            onChange={(e) => onChangeCode(e)}
          />
          <TextField
            required
            id="confirmCode"
            label="Confirmation Code"
            value={confirmCode}
            onChange={(e) => onChangeCode(e)}
          />
          <Button
            variant="contained"
            onClick={() => sendConfirm(cognitoUser, confirmCode)}
          >
            Confirm
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

export default Login;
