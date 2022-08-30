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
  startMultiUpload,
  uploadMultipartFile,
} from '../../features/videos/videosAPI';

const UploadComponent = ({
  upload,
  projectId,
  setVideos,
  removeVideoFromListHandler,
  dynamoDBGetVideosByProjectId,
}: {
  upload: UploadFileObject;
  projectId: string;
  setVideos: React.Dispatch<React.SetStateAction<VideoObject[]>>;
  removeVideoFromListHandler: (id: string) => void;
  dynamoDBGetVideosByProjectId: (projectId: string) => any;
}) => {
  const [uploadDone, setUploadDone] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removeUploadComp, setRemoveUploadComp] = useState(false);

  const uploadVideoHandler = async () => {
    setUploading(true);
    const presignedUrl = await s3GetPresignedUrl(upload);
    await s3UploadVideo(presignedUrl, upload);
    setTimeout(async () => {
      const response = await dynamoDBGetVideosByProjectId(projectId);
      setVideos(response.data.Items.reverse());
      setUploading(false);
      setUploadDone(true);
      setTimeout(() => {
        setRemoveUploadComp(true);
      }, 2000);
    }, 3000); //wait for DDB to be written
  };

  const startUploadHandler = async () => {
    const uploadId = await startMultiUpload(upload);
    console.log('step 1 done');
    await uploadMultipartFile(upload, uploadId);
    console.log('step 2 done');
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
    <Box>
      <Button onClick={startUploadHandler}>MultiUpload Test</Button>
      {removeUploadComp ? null : (
        <Box className="add-video-container">
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
      )}
    </Box>
  );
};

export default UploadComponent;
