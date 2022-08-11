import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { awsS3Url } from '../constants/awsLinks';
import { timeStampConverter } from '../utils/timeConversion';
import ReactPlayer from 'react-player/lazy';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

export interface VideoObject {
  userId: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  s3Url: string;
  timeStamp: string;
}

const Video = ({ video }: { video: VideoObject }): JSX.Element => {
  const downloadHandler = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ): void => {
    e.preventDefault();
  };

  return (
    <Box className="video-container">
      <Box className="video-info-container">
        <Typography>{video.fileName}</Typography>
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
