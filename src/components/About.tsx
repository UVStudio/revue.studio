import { Box, Typography } from '@mui/material';
import HomeFooter from './nested/HomeFooter';
import heroPic from '../assets/about-1.jpg';
import picTwo from '../assets/about-2.jpg';
import picThree from '../assets/about-3.jpg';

const About = () => {
  return (
    <Box>
      <Box className="section" sx={{ backgroundColor: 'white' }}>
        <Typography className="text-overlay" fontSize={'4vw'}>
          App for video content producers
        </Typography>
        <img src={heroPic} alt="heroPic" className="backgroundImage" />
      </Box>
      <Box className="section" sx={{ backgroundColor: 'white' }}>
        <Box className="full-length-copy-container">
          <Box className="center" sx={{ marginBottom: 7 }}>
            <Typography variant="h5" sx={{ marginY: 4 }}>
              Save. Time and Money.
            </Typography>
            <Typography>
              Revue is made by videographers for videographers. We understand
              how you are paying excessive cloud storage and file transfer fees
              from redundant apps. We are here to streamline all those apps to
              one.
            </Typography>
          </Box>
          <Box className="side-image-box">
            <img src={picTwo} alt="picTwo" className="sideImage" />
            <Box sx={{ marginX: 5, marginY: 4 }}>
              <Typography
                variant="h5"
                className="center"
                sx={{ marginBottom: 4 }}
              >
                Save Time
              </Typography>
              <Typography sx={{ marginBottom: 4 }}>
                Spend less time dealing with apps, and more time with your
                clients, you projects and your gear.
              </Typography>
              <Typography>Focus on your passion.</Typography>
            </Box>
          </Box>
          <Box className="side-image-box">
            <img src={picThree} alt="picThree" className="sideImageNarrow" />
            <Box sx={{ marginX: 5, marginY: 4 }}>
              <Typography
                variant="h5"
                className="center"
                sx={{ marginBottom: 4 }}
              >
                Save Money
              </Typography>
              <Typography sx={{ marginBottom: 4 }}>
                We've built a very cost efficient backend server to handle all
                your upload, download and storage needs while keeping cost down.
              </Typography>
              <Typography>
                We pass the savings down to our fellow videographers.
              </Typography>
            </Box>
            <img src={picThree} alt="picThree" className="sideImageWide" />
          </Box>
          <Box className="center" sx={{ marginY: 5 }}>
            <Typography variant="h5" sx={{ marginY: 3 }}>
              Be one of the first to join.
            </Typography>
            <Typography>
              We are currently in beta release, and welcome you to try our app
              free of charge.
            </Typography>
          </Box>
        </Box>
      </Box>
      <HomeFooter />
    </Box>
  );
};

export default About;
