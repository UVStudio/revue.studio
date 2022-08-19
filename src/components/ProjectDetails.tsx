import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import Video from './nested/Video';
import UploadsList from './nested/UploadsList';
import { useAppSelector } from '../app/hooks';
import { selectUser } from '../features/user/userSlice';
import { ProjectObject } from '../features/projects/projectsSlice';
import { awsS3Url } from '../constants/awsLinks';
import { dynamoDBGetVideosByProjectId } from '../features/videos/videosAPI';

export interface UploadFileObject {
  id: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  file: File;
  key: string;
  s3Url: string;
}

export interface VideoObject {
  userId: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  file: File;
  s3Url: string;
  timeStamp: string;
}

const ProjectDetails = () => {
  //PARAMS FROM NAVIGATE
  const projectState = useLocation().state as ProjectObject;

  //GLOBAL STATE
  const userState = useAppSelector(selectUser);
  const navigate = useNavigate();

  //COMPONENT STATE HOOKS
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploads, setUploads] = useState<UploadFileObject[]>([]);
  const [videos, setVideos] = useState<VideoObject[]>([]);

  const addVideoHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const slicePathToName = (str: string): string => {
      for (let i = str.length; i > 0; i--) {
        if (str[i] === '\\') {
          return str.slice(i + 1, str.length);
        }
      }
      return str;
    };

    const timeStamp = Date.now().toString();

    const videoObj = {
      id: timeStamp,
      projectId: projectState.id,
      fileName: slicePathToName(e.target.value),
      fileUrl: e.target.value,
      file: e.target.files![0],
      key: `${userState.id}/${projectState.id}/${timeStamp}-${slicePathToName(
        e.target.value
      )}`,
      s3Url: `${awsS3Url}/${userState.id}/${
        projectState.id
      }/${timeStamp}-${slicePathToName(e.target.value)}`,
    };

    setUploads([...uploads, videoObj]);
    setFileUrl(e.target.value);
  };

  console.log('uploads: ', uploads);

  useEffect(() => {
    for (let i = fileUrl.length; i > 0; i--) {
      if (fileUrl[i] === '\\') {
        return setFileName(fileUrl.slice(i + 1, fileUrl.length));
      }
    }
  }, [fileUrl, fileName]);

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await dynamoDBGetVideosByProjectId(projectState.id);
      console.log('UE fetched from DDB Projects');
      setVideos(response.data.Items.reverse());
    };
    if (projectState) fetchVideos();
  }, [projectState]);

  const toPublicProject = (projectId: string) => {
    navigate(`../project/${projectId}`, {
      replace: false,
    });
  };

  const removeVideoHandler = (id: string) => {
    setUploads(uploads.filter((upload: UploadFileObject) => upload.id !== id));
  };

  if (useLocation().state === null || !userState)
    return <Navigate to="../" replace />;

  return (
    <Box>
      <Box className="section" paddingTop={'20px'}>
        <Typography>Project Name: {projectState.projectName}</Typography>
        <Typography>Project ID: {projectState.id}</Typography>
        <Typography>
          Project Description: {projectState.projectDescription}
        </Typography>
        <Button
          variant="contained"
          onClick={() => toPublicProject(projectState.id)}
        >
          <Typography>Project Public Page</Typography>
        </Button>
      </Box>
      <Box className="section">
        {uploads.map((upload) => {
          return (
            <UploadsList
              key={upload.id}
              upload={upload}
              removeVideoHandler={removeVideoHandler}
            />
          );
        })}
        <Box className="column">
          <Box>
            <input
              id="contained-button-file"
              type="file"
              style={{ display: 'none' }}
              onChange={addVideoHandler}
              value={''}
            />
            <label htmlFor="contained-button-file">
              <Button component="span">Select Video</Button>
            </label>
          </Box>
        </Box>
      </Box>
      <Box className="section">
        {videos.map((video) => {
          return (
            <Box key={video.timeStamp}>
              <Video video={video} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ProjectDetails;
