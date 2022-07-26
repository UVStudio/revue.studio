import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { poolData } from '../constants/poolData';
import * as AWS from 'aws-sdk/global';

interface formData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

const defaultFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
};

const Login = () => {
  //OBTAIN USER FORM INPUTS
  const [formData, setFormData] = useState<formData>(defaultFormData);
  const [confirmCode, setConfirmCode] = useState<string>('');
  const [register, setRegister] = useState<boolean>(true);

  const { name, email, password, confirmPassword, phone } = formData;

  //FORM CHANGE HANDLERS
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

  //COGNITO USER POOL USER REGISTRATION DATA
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

  //COGNITO USER POOL SIGN UP
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
          console.log('cognito user: ', cognitoUser);
          setFormData(defaultFormData);
        }
      );
    } catch {
      throw new Error('User did not get registered');
    }
  };

  //COGNITO USER AUTHENTICATION
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

  //COGNITO LOGIN & OBTAIN TOKEN
  const login = async () => {
    try {
      const authenticationData = {
        Username: email,
        Password: password,
      };

      const authenticationDetails = new AuthenticationDetails(
        authenticationData
      );

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          const accessToken = result.getAccessToken().getJwtToken();

          //POTENTIAL: Region needs to be set if not already set previously elsewhere.
          AWS.config.region = poolData.Region;

          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: poolData.IdentityPoolId, // your identity pool id here
            Logins: {
              // Change the key below according to the specific region your user pool is in.
              'cognito-idp.us-east-1.amazonaws.com/us-east-1_CXLp3WVpF': result
                .getIdToken()
                .getJwtToken(),
            },
          });

          //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
          (AWS.config.credentials as AWS.CognitoIdentityCredentials).refresh(
            (error) => {
              if (error) {
                console.error(error);
              } else {
                // Instantiate aws sdk service objects now that the credentials have been updated.
                // example: const s3 = new AWS.S3();
                console.log('Successfully logged! Access Token: ', accessToken);
              }
            }
          );
        },

        onFailure: function (err) {
          alert(err.message || JSON.stringify(err));
        },
      });
    } catch {
      throw new Error('Could not login user');
    }
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
          <Button variant="contained" onClick={signUp}>
            Register
          </Button>
        ) : (
          <Button variant="contained" onClick={login}>
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
            id="confirmationCode"
            label="Confirmation Code"
            value={confirmCode}
            onChange={(e) => onChangeCode(e)}
          />
          <Button variant="contained" onClick={sendConfirm}>
            Confirm
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

export default Login;
