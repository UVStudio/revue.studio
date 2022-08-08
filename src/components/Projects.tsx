import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ReactPlayer from 'react-player/lazy';
import { Link, useNavigate } from 'react-router-dom';

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const Projects = () => {
  const navigate = useNavigate();

  const downloadHandler = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ): void => {
    e.preventDefault();
    window.location.href =
      'https://revue-video-testing.s3.amazonaws.com/squirrel1.mp4'; // it will open download of filepath
    console.log('download');
  };

  const toNewProjectHandler = () => {
    navigate('../AddProject', { replace: false });
  };

  return (
    <Box className="App">
      <Box className="section">
        <Box className="section">
          <Button variant="contained" onClick={toNewProjectHandler}>
            Add Project
          </Button>
        </Box>
        <Box className="video-container">
          <Box className="video-info-container">
            <Typography>Video Name</Typography>
            <FileDownloadOutlinedIcon onClick={(e) => downloadHandler(e)} />
          </Box>
          <Box className="video-player-container">
            <Box className="video-player">
              <ReactPlayer
                controls={true}
                onStart={() => console.log('playing')}
                onDuration={(dur) => console.log(dur)}
                onBufferEnd={() => console.log('buffer ends')}
                onPause={() => {
                  console.log('I have been paused');
                }}
                light={true}
                url="https://revue-video-testing.s3.amazonaws.com/squirrel1.mp4"
              />
            </Box>
          </Box>
        </Box>

        <Box className="video-container">
          <Box className="video-info-container">
            <Typography>Video Name</Typography>
            <Link
              to="https://revue-video-testing.s3.amazonaws.com/squirrel2.mp4"
              target="_blank"
              download
            >
              <FileDownloadOutlinedIcon />
            </Link>
          </Box>
          <Box className="video-player-container">
            <Box className="video-player">
              <ReactPlayer
                controls={true}
                light={true}
                url="https://revue-video-testing.s3.amazonaws.com/squirrel2.mp4"
              />
            </Box>
          </Box>
        </Box>
        <Box className="video-container">
          <Box className="video-info-container">
            <Typography>Video Name</Typography>
            <FileDownloadOutlinedIcon onClick={downloadHandler} />
          </Box>
          <Box className="video-player-container">
            <Box className="video-player">
              <ReactPlayer
                controls={true}
                light={true}
                url="https://revue-video-testing.s3.amazonaws.com/squirrel3.mp4"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Projects;
