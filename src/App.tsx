import React, { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import { loginUserState } from './features/user/userSlice';
import Navbar from './components/Navbar';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { selectUser } from './features/user/userSlice';
import { getProjectsList } from './features/projects/projectsSlice';

export const awsProjectsAPI = '912ggori07.execute-api.us-east-1.amazonaws.com';

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
        const response = await axios.get(
          `https://${awsProjectsAPI}/projects/${userState.id}`,
          config
        );
        dispatch(getProjectsList(response.data.Items));
      };
      if (userState.id) {
        console.log('API called from APP');
        getProjectsByUserId();
      }
    }
  }, [userState.id, dispatch]);

  return (
    <Router>
      <Navbar />
    </Router>
  );
};
