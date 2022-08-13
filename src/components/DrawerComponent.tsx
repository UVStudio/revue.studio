import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';

const DrawerComponent = () => {
  return (
    <Box sx={{ paddingTop: 8 }}>
      <List>
        {['Profile', 'Account', 'Notifications', 'Storage'].map((text) => (
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
