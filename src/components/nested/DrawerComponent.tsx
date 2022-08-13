import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';

const DrawerComponent = ({
  section,
  setSection,
}: {
  section: string;
  setSection: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <Box sx={{ paddingTop: 8 }}>
      <List>
        {['Profile', 'Projects', 'Account', 'Notifications', 'Storage'].map(
          (text) => (
            <ListItem key={text}>
              <ListItemButton>
                <ListItemText primary={text} onClick={() => setSection(text)} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Box>
  );
};

export default DrawerComponent;
