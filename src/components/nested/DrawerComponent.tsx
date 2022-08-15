import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { dashboardSectionsArray } from '../../constants/dashboardSections';

const DrawerComponent = ({
  setSection,
}: {
  setSection: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <Box sx={{ paddingTop: 8 }}>
      <List>
        {dashboardSectionsArray.map((text) => (
          <ListItem key={text}>
            <ListItemButton onClick={() => setSection(text)}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default DrawerComponent;
