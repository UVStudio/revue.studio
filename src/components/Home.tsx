import React from 'react';
import { Box, Typography } from '@mui/material';
import HomeAccordion from './nested/HomeAccordion';
import HomeFooter from './nested/HomeFooter';
import ReactPlayer from 'react-player';

const Home = () => {
  return (
    <Box>
      <Box className="section">
        <Typography className="text-overlay" fontSize={'4vw'}>
          Manage all your cloud assets on one platform
        </Typography>
        <ReactPlayer
          data-testid="react-player"
          url="revue-hero.mp4"
          playing={true}
          loop={true}
          muted={true}
          width="100%"
          height="100%"
        />
      </Box>
      <Box className="section">
        <Box className="full-length-copy-container">
          <Typography>
            For the serious video production professionals, Revue will help you
            decrease your cloud storage and transfer costs by amalgamating all
            your paid cloud services into one. Not only will Revue save you your
            hard earned money, it will also decrease your administrative
            overhead by shrinking the number of subscription services.
          </Typography>
        </Box>
        <Box data-testid="home-accordion" className="section" sx={{ my: 3 }}>
          <HomeAccordion />
        </Box>
      </Box>
      <Box data-testid="home-footer">
        <HomeFooter />
      </Box>
    </Box>
  );
};

export default Home;
