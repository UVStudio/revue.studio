import React from 'react';
import { Box, Typography } from '@mui/material';
import { UploadFileObject } from '../ProjectDetails';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';

const UploadsList = ({
  upload,
  uploads,
  setUploads,
}: {
  upload: UploadFileObject;
  uploads: UploadFileObject[];
  setUploads: React.Dispatch<React.SetStateAction<UploadFileObject[]>>;
}) => {
  const removeVideoHandler = (fileName: string) => {
    setUploads(
      uploads.filter((upload: UploadFileObject) => upload.fileName !== fileName)
    );
  };

  return (
    <Box key={upload.fileUrl} className="add-project-row">
      <Typography className="add-project-row-text">
        {upload.fileName}
      </Typography>
      <RemoveCircleOutlineOutlinedIcon
        onClick={() => removeVideoHandler(upload.fileName)}
      />
    </Box>
  );
};

export default UploadsList;
