import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { UploadFileObject, VideoObject } from '../ProjectDetails';
import {
  s3GetPresignedUrl,
  s3UploadVideo,
} from '../../features/videos/videosAPI';

const UploadComponent = ({
  upload,
  videos,
  projectId,
  setVideos,
  removeVideoFromListHandler,
  dynamoDBGetVideosByProjectId,
}: {
  upload: UploadFileObject;
  videos: VideoObject[];
  projectId: string;
  setVideos: React.Dispatch<React.SetStateAction<VideoObject[]>>;
  removeVideoFromListHandler: (id: string) => void;
  dynamoDBGetVideosByProjectId: (projectId: string) => any;
}) => {
  const [uploadDone, setUploadDone] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadVideoHandler = async () => {
    setUploading(true);
    const presignedUrl = await s3GetPresignedUrl(upload);
    await s3UploadVideo(presignedUrl, upload);
    setUploading(false);
    setUploadDone(true);
    const response = await dynamoDBGetVideosByProjectId(projectId);
    console.log('res: ', response.data.Items);
  };

  const uploadingIndicator = () => {
    if (!uploading) {
      if (uploadDone) {
        return (
          <Box className="column">
            <Typography sx={{ marginRight: '10px' }}>Done!</Typography>
            <CancelOutlinedIcon
              onClick={() => removeVideoFromListHandler(upload.id)}
            />
          </Box>
        );
      } else {
        return (
          <Box className="column">
            <Button onClick={uploadVideoHandler}>
              <FileUploadIcon />
            </Button>
            <CancelOutlinedIcon
              onClick={() => removeVideoFromListHandler(upload.id)}
            />
          </Box>
        );
      }
    } else {
      return (
        <Box className="column">
          <CircularProgress sx={{ marginRight: '10px' }} size={20} />
        </Box>
      );
    }
  };

  return (
    <Box className="add-project-container ">
      <Box key={upload.fileUrl} className="add-video-row">
        <Typography>{upload.fileName}</Typography>
        {uploadingIndicator()}
      </Box>
      <LinearProgress
        sx={{ marginTop: '10px', marginBottom: '10px' }}
        variant="determinate"
        value={40}
      />
    </Box>
  );
};

export default UploadComponent;