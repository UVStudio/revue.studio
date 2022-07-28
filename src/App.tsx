import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';

export const App = () => {
  return (
    <Router>
      <Navbar />
    </Router>
  );
};
