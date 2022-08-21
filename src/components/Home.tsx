import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Link } from '@mui/material';
import ReactPlayer from 'react-player';

const Home = () => {
  const navigate = useNavigate();

  const toAbout = () => {
    navigate('../About', { replace: false });
  };

  return (
    <Box>
      <Box className="section">
        <Typography className="text-overlay" fontSize={'4vw'}>
          Manage all your cloud assets in one platform
        </Typography>
        <ReactPlayer
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
      </Box>

      <Box sx={{ flexGrow: 1 }} className="home-footer-section">
        <Grid
          container
          columnSpacing={2}
          sx={{ marginX: '2vw', paddingBottom: '50px', paddingTop: '30px' }}
        >
          <Grid item xs={4}>
            <Typography className="home-footer-text" variant="h4">
              Revue
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              onClick={toAbout}
              sx={{ cursor: 'pointer' }}
              className="home-footer-text"
            >
              About Revue
            </Typography>
            <Typography className="home-footer-text">
              Become a beta tester
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography className="home-footer-text">
              revue.studio.app@gmail.com
            </Typography>
            <Link
              href="http://www.dreamsoftproductions.com"
              target="_blank"
              rel="noopener"
            >
              <Typography
                sx={{ cursor: 'pointer' }}
                className="home-footer-text"
              >
                Dreamsoft Productions
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
