import React, { useState } from 'react';
import { Box, Button, Typography, LinearProgress } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { UploadFileObject } from '../ProjectDetails';
import {
  s3GetPresignedUrl,
  s3UploadVideos,
} from '../../features/videos/videosAPI';

const UploadsList = ({
  upload,
  removeVideoHandler,
}: {
  upload: UploadFileObject;
  removeVideoHandler: (id: string) => void;
}) => {
  const [uploadDone, setUploadDone] = useState(false);

  const uploadVideoHandler = async () => {
    const presignedUrl = await s3GetPresignedUrl(upload);
    console.log('response: ', presignedUrl);
    await s3UploadVideos(presignedUrl, upload);
    setUploadDone(true);
  };

  return (
    <Box className="add-project-container ">
      <Box key={upload.fileUrl} className="add-project-row">
        <Typography>{upload.fileName}</Typography>
        {uploadDone ? (
          <Typography>Done!</Typography>
        ) : (
          <Box className="column">
            <Button onClick={uploadVideoHandler}>
              <FileUploadIcon />
            </Button>
            <CancelOutlinedIcon onClick={() => removeVideoHandler(upload.id)} />
          </Box>
        )}
      </Box>
      <LinearProgress
        sx={{ marginTop: '10px', marginBottom: '10px' }}
        variant="determinate"
        value={40}
      />
    </Box>
  );
};

export default UploadsList;
