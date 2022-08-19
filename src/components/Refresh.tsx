import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectUser } from '../features/user/userSlice';
import { Navigate } from 'react-router-dom';

const Refresh = () => {
  const userState = useAppSelector(selectUser);

  const state = useLocation().state as string;

  if (userState.email) {
    return <Navigate to={state} replace />;
  } else {
    return <Navigate to="../" replace />;
  }
};

export default Refresh;
