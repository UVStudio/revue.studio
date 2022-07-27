import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { poolData } from '../../constants/poolData';
import * as AWS from 'aws-sdk/global';

export const userPool = new CognitoUserPool(poolData);
export const attributeList: CognitoUserAttribute[] = [];

const initialFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
};

//COGNITO USER POOL USER REGISTRATION DATA & SIGN UP
export const userSignUp = (
  email: string,
  password: string,
  attributeList: CognitoUserAttribute[],
  setFormData: Function
) => {
  userPool.signUp(
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
      setFormData(initialFormData);
    }
  );
};

//COGNITO USER AUTHENTICATION
export const sendConfirm = (cognitoUser: CognitoUser, confirmCode: string) => {
  cognitoUser.confirmRegistration(confirmCode, true, (err, result) => {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }
    console.log('call result: ' + result);
  });
};

//COGNITO LOGIN AND GET SESSION TOKEN
export const userLogin = (
  cognitoUser: CognitoUser,
  authenticationDetails: AuthenticationDetails
) => {
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
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
            console.log('result: ', result);
          }
        }
      );
    },

    onFailure: (err) => {
      alert(err.message || JSON.stringify(err));
    },
  });
};
