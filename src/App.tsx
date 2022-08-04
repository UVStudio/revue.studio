import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { loginUserState } from './features/user/userSlice';
import Navbar from './components/Navbar';
import { useAppDispatch } from './app/hooks';

export interface userDataLocalStorage {
  id: string;
  email: string;
  token: string;
}

export const App = () => {
  //GLOBAL STATE
  //const userState = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.userData) {
      const result: string | null = localStorage.getItem('userData');
      const parsedData: userDataLocalStorage = JSON.parse(result!);

      const id = parsedData.id;
      const email = parsedData.email;
      const token = parsedData.token;
      dispatch(loginUserState({ id, email, token }));
    }
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
    </Router>
  );
};
