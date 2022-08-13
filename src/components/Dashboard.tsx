import React from 'react';
import DrawerComponent from './DrawerComponent';
import { Box, Button, Typography, Drawer, IconButton } from '@mui/material';
import { MenuOpen } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectUser, logoutUserState } from '../features/user/userSlice';
import {
  selectProjects,
  Project,
  removeProjectsList,
} from '../features/projects/projectsSlice';
import {
  cognitoUserLogout,
  getCognitoUserAttributes,
  dynamoDBEditUserName,
} from '../features/user/userAPI';
import { poolData } from '../constants/poolData';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { useNavigate } from 'react-router-dom';

export const userPool = new CognitoUserPool(poolData);
const drawerWidth = 160;

const Dashboard = () => {
  //GLOBAL STATE
  const userState = useAppSelector(selectUser);
  const projectsState = useAppSelector(selectProjects);

  console.log('dashboard rerenders');

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  //STATE AND NAV HOOKS
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userLogoutHandler = () => {
    localStorage.clear();
    cognitoUserLogout();
    dispatch(logoutUserState());
    dispatch(removeProjectsList());
    navigate('../', { replace: true });
  };

  const dynamoDBEditUserNameHandler = async () => {
    await dynamoDBEditUserName(userState.id, userState.email, 'Leo');
  };

  const getUserAttrHandler = async () => {
    await getCognitoUserAttributes();
  };

  const toProjectDetailsHandler = (project: Project) => {
    navigate(`../projectDetails/${project.id}`, {
      replace: false,
      state: project,
    });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ mt: 8 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuOpen />
          </IconButton>
        </Toolbar>
      </AppBar> */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
        <Drawer variant="permanent">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              pl: 3,
              pt: 10,
              display: { sm: 'none' },
            }}
          >
            <MenuOpen />
          </IconButton>
        </Drawer>

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          <DrawerComponent />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          <DrawerComponent />
        </Drawer>
      </Box>
      <Box
        component="main"
        className="section"
        sx={{
          p: 2,
          width: `calc(100% + ${drawerWidth}px)`,
        }}
      >
        <Typography variant="h5">Dashboard</Typography>
        <Box className="section">
          <Typography>{userState.email}</Typography>
          {userState.email ? (
            <Button variant="contained" onClick={userLogoutHandler}>
              Logout
            </Button>
          ) : (
            <Typography>You are not authenticated.</Typography>
          )}
        </Box>
        <Box className="section">
          <Button variant="contained" onClick={getUserAttrHandler}>
            User Attribute
          </Button>
        </Box>
        <Box className="section">
          <Button variant="contained" onClick={dynamoDBEditUserNameHandler}>
            Update DDB Username
          </Button>
        </Box>
        <Box className="section">
          <Typography variant="h5">Your Projects:</Typography>
          {projectsState.projects.map((project: Project) => {
            return (
              <Box
                key={project.id}
                className="add-project-row"
                onClick={() => toProjectDetailsHandler(project)}
              >
                <Typography className="add-project-row-text">
                  {project.projectName}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
