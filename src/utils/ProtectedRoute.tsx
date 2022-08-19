import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserState } from '../features/user/userSlice';

const ProtectedRoute = ({
  userState,
  children,
  redirect,
}: {
  userState: UserState;
  children: JSX.Element;
  redirect: string;
}) => {
  if (!userState.email) {
    return <Navigate to="../Refresh" state={redirect} replace />;
  }

  return children;
};

export default ProtectedRoute;
