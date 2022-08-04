import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const AddProject = () => {
  const [file, setFile] = useState('');

  const fileSelectHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setFile(e.target.value);
  };

  return (
    <Box className="section">
      <Typography>Add Project</Typography>
      <input
        id="contained-button-file"
        type="file"
        style={{ display: 'none' }}
        onChange={fileSelectHandler}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" component="span">
          Upload Video
        </Button>
      </label>
      <Typography>{file}</Typography>
    </Box>
  );
};

export default AddProject;
