import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { loginUserState } from './features/user/userSlice';
import Navbar from './components/Navbar';
import { useAppDispatch } from './app/hooks';

export const App = () => {
  //GLOBAL STATE
  //const userState = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.userData) {
      const parsedData = JSON.parse(localStorage.userData);
      const email = parsedData.email;
      const token = parsedData.token;
      dispatch(loginUserState({ email, token }));
    }
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
    </Router>
  );
};
