import React, { useState } from 'react';
import '../App.css';
import {
  AppBar,
  Menu,
  MenuItem,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from '../utils/ProtectedRoute';
import { selectUser } from '../features/user/userSlice';
import { useAppSelector } from '../app/hooks';
import Home from './Home';
import About from './About';
import Dashboard from './Dashboard';
import Project from './Project';
import Login from './Login';
import AddProject from './nested/AddProject';
import ProjectDetails from './ProjectDetails';
import VideoDetails from './nested/VideoDetails';
import Refresh from './Refresh';
import logo from '../assets/logo.svg';

export const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const userState = useAppSelector(selectUser);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const authPages = ['About', 'Dashboard'];
  const unAuthPages = ['About', 'Login'];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="relative" sx={{ zIndex: 'snackbar' }}>
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
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                    zIndex: 'tooltip',
                  }}
                >
                  {authPages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Link to={`/${page}`}>
                        <Typography textAlign="center">{page}</Typography>
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: 'none', md: 'flex' },
                }}
              >
                {authPages.map((page) => (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, display: 'block' }}
                  >
                    <Link to={`/${page}`}>
                      <Typography className="AppBar-type">{page}</Typography>
                    </Link>
                  </Button>
                ))}
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {unAuthPages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Link to={`/${page}`}>
                        <Typography textAlign="center">{page}</Typography>
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {unAuthPages.map((page) => (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, display: 'block' }}
                  >
                    <Link to={`/${page}`}>
                      <Typography color="white">{page}</Typography>
                    </Link>
                  </Button>
                ))}
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Refresh" element={<Refresh />} />
        <Route path="/Project/:projectId" element={<Project />} />
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute userState={userState} redirect={'/Dashboard'}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/ProjectDetails/:projectId" element={<ProjectDetails />} />
        <Route
          path="/AddProject"
          element={
            <ProtectedRoute userState={userState} redirect={'/AddProject'}>
              <AddProject />
            </ProtectedRoute>
          }
        />
        <Route path="/VideoDetails/:videoId" element={<VideoDetails />} />
      </Routes>
    </Box>
  );
};

export default Navbar;
