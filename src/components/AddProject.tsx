import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { useAppSelector } from '../app/hooks';
import { selectUser } from '../features/user/userSlice';
import { dynamoDBAddProjectName } from '../features/projects/projectsAPI';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';

const initialFormData = {
  projectName: '',
  projectDescription: '',
};

export interface UploadFileObject {
  id: string;
  fileName: string;
  fileUrl: string;
}

export interface UploadProjectObject {
  userId: string;
  projectId: string;
  projectName: string;
  projectDescription: string;
  uploads: UploadFileObject[];
}

const AddProject = () => {
  //GLOBAL STATE
  const userState = useAppSelector(selectUser);

  //OBTAIN PROJECT FORM INPUTS & COMPONENT HOOKS
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [formData, setFormData] = useState(initialFormData);
  const [uploads, setUploads] = useState<UploadFileObject[]>([]);

  const { projectName, projectDescription } = formData;

  const fileSelectHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    function slicePathToName(str: string): string {
      for (let i = str.length; i > 0; i--) {
        if (str[i] === '\\') {
          return str.slice(i + 1, str.length);
        }
      }
      return str;
    }
    setUploads([
      ...uploads,
      {
        id: Date.now().toString(),
        fileName: slicePathToName(e.target.value),
        fileUrl: e.target.value,
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

  const onChangeForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const removeVideoHandler = (fileName: string) => {
    setUploads(uploads.filter((upload) => upload.fileName !== fileName));
  };

  const createProjectObject = () => {
    const newProjectObject: UploadProjectObject = {
      userId: userState.id,
      projectId: Date.now().toString(),
      projectName,
      projectDescription,
      uploads,
    };
    console.log('newProjectObject: ', newProjectObject);
    dynamoDBAddProjectName(
      newProjectObject.userId,
      newProjectObject.projectId,
      projectName,
      projectDescription
    );
  };

  //1, create Project in DynamoDB, populate newProjectObject
  //2, hit API Gateway to activate Lambda to create preSignedURL to upload to S3
  //3, upload file(s) to S3 using preSignedURL(s)
  //4, add S3 link(s) to DynamoDB's project rows

  return (
    <Box className="section">
      <Typography variant="h6">Add Project</Typography>
      <Box
        className="section"
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' },
        }}
      >
        <TextField
          required
          id="projectName"
          label="Project Name"
          value={projectName}
          onChange={(e) => onChangeForm(e)}
        />
        <TextField
          fullWidth
          multiline
          id="projectDescription"
          label="Project Description"
          value={projectDescription}
          onChange={(e) => onChangeForm(e)}
        />
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
              <Box key={upload.fileUrl} className="add-video-row">
                <Typography className="ad-video-row-text">
                  {upload.fileName}
                </Typography>
                <RemoveCircleOutlineOutlinedIcon
                  onClick={() => removeVideoHandler(upload.fileName)}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box className="section" marginTop={'20px'}>
        <Button variant="contained" onClick={createProjectObject}>
          Upload Videos to Project
        </Button>
      </Box>
    </Box>
  );
};

export default AddProject;
