import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './app/hooks';
import Navbar from './components/Navbar';
import {
  loginUserState,
  getUserState,
  selectUser,
} from './features/user/userSlice';
import { getProjectsList } from './features/projects/projectsSlice';
import { dynamoDBGetProjectsByUserId } from './features/projects/projectsAPI';
import { dynamoDBGetProfile } from './features/user/userAPI';

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

      const fetchProjects = async () => {
        const response = await dynamoDBGetProjectsByUserId(userState.id);
        dispatch(getProjectsList(response.data.Items));
      };

      const fetchProfile = async () => {
        const response = await dynamoDBGetProfile(userState.id);
        dispatch(getUserState(response.data.Item));
      };

      if (userState.id) {
        console.log('Get Projects and Profile API from APP');
        fetchProjects();
        fetchProfile();
      }
    }
  }, [userState.id, dispatch]);

  return (
    <Router>
      <Navbar />
    </Router>
  );
};
