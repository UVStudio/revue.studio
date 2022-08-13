import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { awsS3Url } from '../../constants/awsLinks';
import { timeStampConverter } from '../../utils/timeConversion';
import { VideoObject } from './ProjectDetails';
import ReactPlayer from 'react-player/lazy';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const Video = ({ video }: { video: VideoObject }): JSX.Element => {
  const downloadHandler = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ): void => {
    e.preventDefault();
  };

  const shortenedFileName = (fileName: string) => {
    for (let i = 0; i < fileName.length; i++) {
      const element = fileName[i];
      if (element === '-') {
        return fileName.slice(i + 1, fileName.length);
      }
    }
  };

  return (
    <Box className="video-container">
      <Box className="video-info-container">
        <Typography>{shortenedFileName(video.fileName)}</Typography>
        <Typography>
          Uploaded: {timeStampConverter(Number(video.timeStamp))}
        </Typography>
        <Link to={`${awsS3Url}/${video.s3Url}`} target="_blank" download>
          <FileDownloadOutlinedIcon onClick={downloadHandler} />
        </Link>
      </Box>
      <Box className="video-player-container">
        <Box className="video-player">
          <ReactPlayer
            controls={true}
            light={false}
            url={`${awsS3Url}/${video.s3Url}`}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Video;
