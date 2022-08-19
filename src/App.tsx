import React, { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './app/hooks';
import Navbar from './components/Navbar';
import { awsProjectsAPI, awsUserAPI } from './constants/awsLinks';
import { loginUserState, getUserState } from './features/user/userSlice';
import { selectUser } from './features/user/userSlice';
import { getProjectsList } from './features/projects/projectsSlice';

export interface userDataLocalStorage {
  id: string;
  email: string;
  token: string;
}

export const App = () => {
  //GLOBAL STATE
  const userState = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.userData) {
      const result: string | null = localStorage.getItem('userData');
      const parsedData: userDataLocalStorage = JSON.parse(result!);

      const id = parsedData.id;
      const email = parsedData.email;
      const token = parsedData.token;

      dispatch(loginUserState({ id, email, token }));

      const config = {
        headers: {
          'content-type': 'application/json',
        },
      };

      const getProjectsByUserId = async () => {
        try {
          const response = await axios.get(
            `https://${awsProjectsAPI}/projects/${userState.id}`,
            config
          );
          dispatch(getProjectsList(response.data.Items));
        } catch (error) {
          throw new Error('Cannot fetch Projects list');
        }
      };

      if (userState.id) {
        console.log('Get Projects API called from APP');
        getProjectsByUserId();
      }

      const dynamoDBGetProfile = async () => {
        const config = {
          headers: {
            'content-type': 'application/json',
          },
        };
        try {
          const data = await axios.get(
            `https://${awsUserAPI}/users/${userState.id}`,
            config
          );
          dispatch(getUserState(data.data.Item));
        } catch (error) {
          throw new Error('Could not get your profile');
        }
      };

      if (userState.id) {
        console.log('Get User API called from APP');
        dynamoDBGetProfile();
      }
    }
  }, [userState.id, dispatch]);

  return (
    <Router>
      <Navbar />
    </Router>
  );
};
