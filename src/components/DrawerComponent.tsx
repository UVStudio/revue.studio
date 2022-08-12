import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';

const DrawerComponent = () => {
  return (
    <Box sx={{ paddingTop: 2 }}>
      <Toolbar />
      <Divider />
      <List>
        {['Profile', 'Account', 'Notifications'].map((text) => (
          <ListItem key={text}>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Storage', 'Data'].map((text) => (
          <ListItem key={text}>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default DrawerComponent;
