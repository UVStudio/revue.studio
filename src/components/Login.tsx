import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectUser, loginUserState } from '../features/user/userSlice';
import {
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  ISignUpResult,
} from 'amazon-cognito-identity-js';
import {
  userPool,
  attributeList,
  userSignUp,
  sendConfirm,
  cognitoUserLogin,
} from '../features/user/userAPI';
import { useNavigate } from 'react-router-dom';

const initialFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
};

const initialConfirmData = {
  confirmEmail: '',
  confirmCode: '',
};

export const emailValidation = (input: string) => {
  return input.includes('@');
};

const Login = () => {
  //OBTAIN USER FORM INPUTS & COMPONENT HOOKS
  const [formData, setFormData] = useState(initialFormData);
  const [confirmData, setConfirmData] = useState(initialConfirmData);
  const [register, setRegister] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  const { email, password, confirmPassword, phone } = formData;
  const { confirmEmail, confirmCode } = confirmData;

  //GLOBAL STATE
  const userState = useAppSelector(selectUser);

  //STATE AND NAV HOOKS
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
      const result: ISignUpResult | undefined = await userSignUp(
        email,
        password,
        attributeList
      );
      console.log('result: ', result);
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
      const id = result.getAccessToken().payload.sub;
      const email = result.getIdToken().payload.email;
      const token = result.getAccessToken().getJwtToken();
      dispatch(loginUserState({ id, email, token }));
      navigate('../Dashboard', { replace: true });
    } catch (error) {
      throw new Error('Did not login');
    }
  };

  //UI RENDERS
  return (
    <Box className="background" sx={{ minHeight: '700px' }}>
      {userState.email ? (
        <Box>
          <Typography>You are logged in as {userState.email}</Typography>
        </Box>
      ) : (
        <Card raised>
          <Box
            className="whiteCard"
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
              /
              <Button onClick={() => setRegister(true)}>I am a new user</Button>
            </Box>
            <Box className="title-container">
              <Typography variant="h6">
                {register ? 'Register' : 'Login'}
              </Typography>
            </Box>
            {!confirmSent ? (
              register ? (
                <Box className="whiteCard">
                  <TextField
                    required
                    id="email"
                    label="E-mail"
                    value={email}
                    onChange={onChangeForm}
                  />
                  <TextField
                    required
                    id="phone"
                    label="Phone Number"
                    placeholder="+1"
                    helperText={'Please use +1 at the beginning'}
                    value={phone}
                    onChange={onChangeForm}
                  />
                  <TextField
                    required
                    id="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={onChangeForm}
                  />
                  <TextField
                    required
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    autoComplete="confirm-password"
                    value={confirmPassword}
                    onChange={onChangeForm}
                  />
                  <Button variant="contained" onClick={signUpHandler}>
                    Register
                  </Button>
                </Box>
              ) : (
                <Box className="whiteCard">
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
                    data-testid="passwordLogin"
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
              className="whiteCard"
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
        </Card>
      )}
    </Box>
  );
};

export default Login;
