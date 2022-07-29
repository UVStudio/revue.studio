import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { poolData } from '../../constants/poolData';
import * as AWS from 'aws-sdk/global';

export const userPool = new CognitoUserPool(poolData);
export const attributeList: CognitoUserAttribute[] = [];

//COGNITO USER POOL USER REGISTRATION DATA & SIGN UP
export const userSignUp = (
  email: string,
  password: string,
  attributeList: CognitoUserAttribute[]
) => {
  return new Promise((resolve, reject) => {
    userPool.signUp(
      email,
      password,
      attributeList,
      attributeList,
      (err, result) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
          reject(new Error('Did not sign up'));
          return;
        }
        const cognitoUser = result!.user;
        console.log('cognito user: ', cognitoUser);
        resolve(result);
      }
    );
  });
};

//COGNITO USER AUTHENTICATION
export const sendConfirm = (cognitoUser: CognitoUser, confirmCode: string) => {
  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(confirmCode, true, (err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        reject(new Error('Did not send confirm code'));
        return;
      }
      resolve(result);
      console.log('call result: ' + result);
    });
  });
};

//COGNITO LOGIN AND GET SESSION TOKEN
export const cognitoUserLogin = (
  cognitoUser: CognitoUser,
  authenticationDetails: AuthenticationDetails
) => {
  return new Promise<CognitoUserSession>((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        //const accessToken = result.getAccessToken().getJwtToken();
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
              console.log('user authenticated: ', result);
              resolve(result);
            }
          }
        );
      },

      onFailure: (err) => {
        alert(err.message || JSON.stringify(err));
        reject(new Error('Did not login.'));
      },
    });
  });
};

//GET AUTHENTICATED COGNITO USER ATTRIBUTES
export const getCognitoUserAttributes = () => {
  const cognitoUser = userPool.getCurrentUser();

  if (cognitoUser != null) {
    cognitoUser.getSession((err: Error | null, session: CognitoUserSession) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      if (session) {
        console.log('session validity: ' + session.isValid());
      }

      cognitoUser.getUserAttributes((err, result) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        for (let i = 0; i < result!.length; i++) {
          console.log(
            'attribute ' +
              result![i].getName() +
              ' has value ' +
              result![i].getValue()
          );
        }
      });
    });
  } else {
    return console.log('No user is currently authenticated.');
  }
};

//COGNITO CURRENT AUTH USER
export const getCognitoUser = () => {
  const cognitoUser = userPool.getCurrentUser();
  if (!cognitoUser) {
    return false;
  }
  return cognitoUser;
};

//COGNITO LOGOUT
export const cognitoUserLogout = () => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
    cognitoUser.getSession((err: Error | null, session: CognitoUserSession) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      if (session) {
        console.log('session validity: ' + session.isValid());
      }

      cognitoUser.globalSignOut({
        onSuccess: (msg: string) => {
          alert(msg || JSON.stringify(msg));
        },
        onFailure: (err: Error) => {
          alert(err.message || JSON.stringify(err));
        },
      });
    });
  } else {
    return console.log('No user is currently logged in nor authenticated.');
  }
};
