import React from 'react';
import '../App.css';
import { Routes, Route, Link } from 'react-router-dom';
import { selectUser } from '../features/user/userSlice';
import { useAppSelector } from '../app/hooks';
import Home from './Home';
import About from './About';
import Dashboard from './Dashboard';
import Project from './Project';
import Login from './Login';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import logo from '../assets/logo.svg';

export const Navbar = () => {
  const userState = useAppSelector(selectUser);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton>
            <Link to="/">
              <img src={logo} className="AppBar-logo" alt="logo" />
            </Link>
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Revue.Studio
          </Typography>
          {userState.email ? (
            <Box>
              <Button color="inherit">
                <Link to="/about">
                  <Typography>About</Typography>
                </Link>
              </Button>
              <Button color="inherit">
                <Link to="/dashboard">
                  <Typography>Dashboard</Typography>
                </Link>
              </Button>
              <Button color="inherit">
                <Link to="/project">
                  <Typography>Project</Typography>
                </Link>
              </Button>
            </Box>
          ) : (
            <Box>
              <Button color="inherit">
                <Link to="/about">
                  <Typography>About</Typography>
                </Link>
              </Button>
              <Button color="inherit">
                <Link to="/project">
                  <Typography>Project</Typography>
                </Link>
              </Button>
              <Button color="inherit">
                <Link to="/login">
                  <Typography>Login</Typography>
                </Link>
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project" element={<Project />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Box>
  );
};

export default Navbar;
