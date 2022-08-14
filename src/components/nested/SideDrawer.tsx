import React, { useState } from 'react';
import { Box, Drawer, IconButton } from '@mui/material';
import { MenuOpen } from '@mui/icons-material';
import DrawerComponent from './DrawerComponent';

const drawerWidth = 160;

const SideDrawer = ({
  setSection,
}: {
  setSection: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
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
        <DrawerComponent setSection={setSection} />
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
        <DrawerComponent setSection={setSection} />
      </Drawer>
    </Box>
  );
};

export default SideDrawer;
