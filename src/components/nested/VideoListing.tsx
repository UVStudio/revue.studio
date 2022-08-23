import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { timeStampConverter } from '../../utils/timeConversion';
import { VideoObject } from '../ProjectDetails';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const VideoListing = ({
  video,
  videos,
}: {
  video: VideoObject;
  videos: VideoObject[];
}): JSX.Element => {
  const navigate = useNavigate();

  const shortenedFileName = (fileName: string) => {
    for (let i = 0; i < fileName.length; i++) {
      const element = fileName[i];
      if (element === '-') {
        return fileName.slice(i + 1, fileName.length);
      }
    }
  };

  const toVideoDetailsHandler = () => {
    navigate(`../VideoDetails/${video.id}`, {
      replace: false,
      state: video,
    });
  };

  return (
    <Box className="video-info-container" onClick={toVideoDetailsHandler}>
      <Typography>{shortenedFileName(video.fileName)}</Typography>
      <Typography>
        Upload: {timeStampConverter(Number(video.timeStamp))}
      </Typography>
      <PlayCircleOutlineIcon sx={{ cursor: 'pointer' }} fontSize={'medium'} />
    </Box>
  );
};

export default VideoListing;
