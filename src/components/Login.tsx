import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectUser, loginUserState } from '../features/user/userSlice';
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
  cognitoUserLogin,
  getCognitoUserAttributes,
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
  const userState = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  //OBTAIN USER FORM INPUTS
  const [formData, setFormData] = useState(initialFormData);
  const [confirmData, setConfirmData] = useState(initialConfirmData);
  const [register, setRegister] = useState(true);
  const [confirmSent, setConfirmSent] = useState(false);

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

  const signUpHandler = async () => {
    try {
      await userSignUp(email, password, attributeList);
      setConfirmSent(true);
    } catch (error) {
      throw new Error('Did not sign up');
    }
  };

  //DATA FOR COGNITO USER AUTHENTICATION
  const userData = {
    Username: email ? email : confirmEmail,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  const sendConfirmHandler = async () => {
    try {
      await sendConfirm(cognitoUser, confirmCode);
      setConfirmData(initialConfirmData);
      setConfirmSent(false);
      setFormData(initialFormData);
    } catch (error) {
      throw new Error('Did not send confirm code');
    }
  };

  //HANDLER FOR COGNITO USER LOGIN & OBTAIN TOKEN
  const loginUserStateData = {
    Username: email,
    Pool: userPool,
  };

  const authenticationData = {
    Username: email,
    Password: password,
  };

  const loginCognitoUser = new CognitoUser(loginUserStateData);
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  const loginUserHandler = async () => {
    try {
      const result = await cognitoUserLogin(
        loginCognitoUser,
        authenticationDetails
      );
      const email = result.getIdToken().payload.email;
      const token = result.getAccessToken().getJwtToken();
      dispatch(loginUserState({ email, token }));
    } catch (error) {
      throw new Error('Did not login');
    }
  };

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
          <Button onClick={() => getCognitoUserAttributes()}>
            Get User Attributes
          </Button>
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
        {!confirmSent ? (
          register ? (
            <Box className="section">
              <TextField
                required
                id="name"
                label="Username"
                value={name}
                onChange={(e) => onChangeForm(e)}
              />
              <TextField
                required
                id="email"
                label="E-mail"
                value={email}
                onChange={(e) => onChangeForm(e)}
              />
              <TextField
                required
                id="phone"
                label="Phone Number"
                placeholder="+1"
                helperText={'Please use +1 at the beginning'}
                value={phone}
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
              <TextField
                required
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                autoComplete="confirm-password"
                value={confirmPassword}
                onChange={(e) => onChangeForm(e)}
              />
              <Button variant="contained" onClick={signUpHandler}>
                Register
              </Button>
            </Box>
          ) : (
            <Box className="section">
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
              <Button variant="contained" onClick={loginUserHandler}>
                Login
              </Button>
            </Box>
          )
        ) : null}
      </Box>
      {confirmSent ? (
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
            value={email ? email : confirmEmail}
            onChange={(e) => onChangeCode(e)}
          />
          <TextField
            required
            id="confirmCode"
            label="Confirmation Code"
            value={confirmCode}
            onChange={(e) => onChangeCode(e)}
          />
          <Button variant="contained" onClick={sendConfirmHandler}>
            Confirm
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

export default Login;
