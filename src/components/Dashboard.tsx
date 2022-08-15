import React, { useState } from 'react';
import SideDrawer from './nested/SideDrawer';
import Profile from './nested/Profile';
import ProjectsSection from './nested/ProjectsSection';
import Account from './nested/Account';
import Notifications from './nested/Notifications';
import Storage from './nested/Storage';
import { Box } from '@mui/material';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { useAppSelector } from '../app/hooks';
import { selectUser } from '../features/user/userSlice';
import { selectProjects } from '../features/projects/projectsSlice';
import { poolData } from '../constants/poolData';
import { dashboardSections } from '../constants/dashboardSections';
import { drawerWidth } from '../constants/layouts';

export const userPool = new CognitoUserPool(poolData);

const Dashboard = () => {
  //STATE HOOKS
  const [section, setSection] = useState('Projects');

  //GLOBAL STATE
  const userState = useAppSelector(selectUser);
  const projectsState = useAppSelector(selectProjects);

  return (
    <Box sx={{ display: 'flex' }}>
      <SideDrawer setSection={setSection} />
      <Box
        component="main"
        className="section"
        sx={{
          p: 2,
          width: `calc(100% + ${drawerWidth}px)`,
        }}
      >
        {section === dashboardSections.projects ? (
          <ProjectsSection projectsState={projectsState} />
        ) : null}
        {section === dashboardSections.profile ? (
          <Profile userState={userState} />
        ) : null}
        {section === dashboardSections.account ? <Account /> : null}
        {section === dashboardSections.notifications ? <Notifications /> : null}
        {section === dashboardSections.storage ? <Storage /> : null}
      </Box>
    </Box>
  );
};

export default Dashboard;
