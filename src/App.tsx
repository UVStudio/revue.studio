import React from 'react';
import './App.css';
import Home from './components/Home';
import About from './components/About';
import Dashboard from './components/Dashboard';
import Project from './components/Project';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import logo from './assets/logo.svg';

export const App = () => {
  return (
    <Router>
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
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project" element={<Project />} />
        </Routes>
      </Box>
    </Router>
  );
};
