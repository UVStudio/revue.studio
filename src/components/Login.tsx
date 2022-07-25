import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from 'amazon-cognito-identity-js';

interface formData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

const Login = () => {
  const [formData, setFormData] = useState<formData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [confirmCode, setConfirmCode] = useState<string>('');

  const { name, email, password, confirmPassword, phone } = formData;

  const onChangeForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const onChangeCode = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setConfirmCode(e.target.value);
  };

  const poolData = {
    UserPoolId: 'us-east-1_CXLp3WVpF', // Your user pool id here
    ClientId: '5f609ok63mm90jlrrmc6lvh7f8', // Your client id here
  };
  const userPool = new CognitoUserPool(poolData);

  const attributeList: CognitoUserAttribute[] = [];

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

  const signUp = async () => {
    try {
      await userPool.signUp(
        email,
        password,
        attributeList,
        attributeList,
        (err, result) => {
          if (err) {
            alert(err.message || JSON.stringify(err));
            return;
          }
          const cognitoUser = result!.user;
          console.log(cognitoUser);
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
          });
        }
      );
    } catch {
      throw new Error('User did not get registered');
    }
  };

  const userData = {
    Username: 'leonard.shen@gmail.com',
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  const sendConfirm = () => {
    cognitoUser.confirmRegistration(confirmCode, true, (err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      console.log('call result: ' + result);
    });
  };

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
        <Box className="title-container">
          <Typography variant="h6">Register</Typography>
        </Box>
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
        <TextField
          required
          id="phone"
          label="Phone Number"
          value={phone}
          onChange={(e) => onChangeForm(e)}
        />
        <Button variant="contained" onClick={signUp}>
          Register
        </Button>
      </Box>
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
          id="confirmationCode"
          label="Confirmation Code"
          value={confirmCode}
          onChange={(e) => onChangeCode(e)}
        />
        <Button variant="contained" onClick={sendConfirm}>
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
