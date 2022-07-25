import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import {
  CognitoUserPool,
  CognitoUserAttribute,
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

  const { name, email, password, confirmPassword, phone } = formData;

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log(e.target.id);
    console.log(e.target.value);
    setFormData({ ...formData, [e.target.id]: e.target.value });
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

  const testSignUp = () => {
    userPool.signUp(
      email,
      password,
      attributeList,
      attributeList,
      (err: any, result: any) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        const cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
      }
    );
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
          <Typography variant="h5">Login</Typography>
        </Box>
        <Box className="section">
          <TextField
            required
            id="name"
            label="Username"
            value={name}
            onChange={(e) => onChange(e)}
          />
          <TextField
            required
            id="email"
            label="E-mail"
            value={email}
            onChange={(e) => onChange(e)}
          />
          <TextField
            required
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => onChange(e)}
          />
          <TextField
            required
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            autoComplete="confirm-password"
            value={confirmPassword}
            onChange={(e) => onChange(e)}
          />
          <TextField
            required
            id="phone"
            label="Phone Number"
            value={phone}
            onChange={(e) => onChange(e)}
          />
        </Box>
      </Box>
      <Box className="section">
        <Button variant="contained" onClick={testSignUp}>
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
