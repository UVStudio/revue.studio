import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectUser } from '../features/user/userSlice';
import { Project } from '../features/projects/projectsSlice';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';

export interface UploadFileObject {
  id: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  s3Url: string;
}

export interface UploadProjectObject {
  userId: string;
  projectId: string;
  projectName: string;
  projectDescription: string;
  timeStamp: string;
  uploads: UploadFileObject[];
}

const ProjectDetails = () => {
  //PARAMS FROM NAVIGATE
  const projectState = useLocation().state as Project;

  //GLOBAL STATE
  const userState = useAppSelector(selectUser);

  //COMPONENT STATE HOOKS
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploads, setUploads] = useState<UploadFileObject[]>([]);

  const s3Url = 'https://revue-studio-users.s3.amazonaws.com';

  const fileSelectHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slicePathToName = (str: string): string => {
      for (let i = str.length; i > 0; i--) {
        if (str[i] === '\\') {
          return str.slice(i + 1, str.length);
        }
      }
      return str;
    };

    setUploads([
      ...uploads,
      {
        id: Date.now().toString(),
        projectId: projectState.id,
        fileName: slicePathToName(e.target.value),
        fileUrl: e.target.value,
        s3Url: `${s3Url}/${userState.id}/${
          projectState.id
        }/${Date.now().toString()}-${slicePathToName(e.target.value)}`,
      },
    ]);
    setFileUrl(e.target.value);
  };

  useEffect(() => {
    for (let i = fileUrl.length; i > 0; i--) {
      if (fileUrl[i] === '\\') {
        return setFileName(fileUrl.slice(i + 1, fileUrl.length));
      }
    }
  }, [fileUrl, fileName]);

  const uploadVideosHandler = () => {
    console.log('uploads obj: ', uploads);
  };

  const removeVideoHandler = (fileName: string) => {
    setUploads(uploads.filter((upload) => upload.fileName !== fileName));
  };

  return (
    <Box>
      <Box className="section">
        <Typography variant="h6">ProjectDetails</Typography>
        <Typography>Project Name: {projectState.projectName}</Typography>
        <Typography>Project ID: {projectState.id}</Typography>
      </Box>
      <Box className="section">
        <Box marginTop={'20px'}>
          <input
            id="contained-button-file"
            type="file"
            style={{ display: 'none' }}
            onChange={fileSelectHandler}
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" component="span">
              Select Video
            </Button>
          </label>
        </Box>
        <Box>
          {uploads.map((upload) => {
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
          })}
        </Box>
        <Box marginTop={'20px'}>
          <Button variant="contained" onClick={uploadVideosHandler}>
            Upload Videos to Project
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectDetails;
