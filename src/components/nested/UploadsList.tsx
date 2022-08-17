import React from 'react';
import { Box, Button, Typography } from '@mui/material';
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
  uploads: UploadFileObject[];
  setUploads: React.Dispatch<React.SetStateAction<UploadFileObject[]>>;
  removeVideoHandler: (id: string) => void;
}) => {
  const uploadVideoHandler = async () => {
    const presignedUrl = await s3GetPresignedUrl(upload);
    console.log('response: ', presignedUrl);
    await s3UploadVideos(presignedUrl, upload);
  };

  return (
    <Box key={upload.fileUrl} className="add-project-row">
      <Typography className="add-project-row-text">
        {upload.fileName}
      </Typography>
      <Box className="column">
        <Button onClick={uploadVideoHandler}>
          <FileUploadIcon />
        </Button>
        <CancelOutlinedIcon onClick={() => removeVideoHandler(upload.id)} />
      </Box>
    </Box>
  );
};

export default UploadsList;
