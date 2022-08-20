import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ReactPlayer from 'react-player/lazy';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/user/userSlice';
import { awsS3Url } from '../../constants/awsLinks';
import { VideoObject } from '../ProjectDetails';

const VideoDetails = () => {
  //PARAMS FROM NAVIGATE
  const videoState = useLocation().state as VideoObject;

  const userState = useAppSelector(selectUser);

  console.log('state: ', videoState);

  if (useLocation().state === null || !userState)
    return <Navigate to="../" replace />;

  return (
    <Box className="section">
      <Typography>{videoState.id}</Typography>

      <Box className="video-player-container">
        <Box className="video-player">
          <ReactPlayer
            controls={true}
            light={false}
            url={`${awsS3Url}/${videoState.s3Url}`}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default VideoDetails;
