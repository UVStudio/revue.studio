import React from 'react';
import { Box, Grid, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomeFooter = () => {
  const navigate = useNavigate();

  const sendMail = () => {
    const mailto: string =
      'mailto:revue.studio.app@gmail.com?subject=Test subject&body=Hey Revue! Just wanted to say hi!';
    window.location.href = mailto;
  };

  const toAbout = () => {
    navigate('../About', { replace: false });
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="home-footer-section">
      <Grid
        container
        columnSpacing={2}
        marginX="20px"
        paddingTop="20px"
        paddingBottom="40px"
        width={'90%'}
      >
        <Grid item xs={12} sm={4}>
          <Typography className="home-footer-text" variant="h4">
            Revue
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
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
        <Grid item xs={12} sm={4}>
          <Typography className="home-footer-text" onClick={sendMail}>
            Email us
          </Typography>
          <Link
            href="http://www.dreamsoftproductions.com"
            target="_blank"
            rel="noopener"
          >
            <Typography
              sx={{ cursor: 'pointer', color: 'white' }}
              className="home-footer-text"
            >
              Dreamsoft Productions
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeFooter;
