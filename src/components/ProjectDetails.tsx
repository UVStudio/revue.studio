import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Video from './Video';
import UploadsList from './UploadsList';
import { useAppSelector } from '../app/hooks';
import { selectUser } from '../features/user/userSlice';
import { Project } from '../features/projects/projectsSlice';
import { awsS3Url } from '../constants/awsLinks';
import { dynamoDBGetVideosByProjectId } from '../features/videos/videosAPI';

export interface UploadFileObject {
  id: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  s3Url: string;
}

export interface VideoObject {
  userId: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  s3Url: string;
  timeStamp: string;
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
  const [videos, setVideos] = useState<VideoObject[]>([]);

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
        s3Url: `${awsS3Url}/${userState.id}/${
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await dynamoDBGetVideosByProjectId(projectState.id);
      console.log('videos: ', response.data.Items);
      setVideos(response.data.Items.reverse());
    };
    fetchData();
  }, [projectState.id]);

  const uploadVideosHandler = () => {
    console.log('uploads obj: ', uploads);
  };

  return (
    <Box>
      <Box className="section">
        <Typography variant="h6">ProjectDetails</Typography>
        <Typography>Project Name: {projectState.projectName}</Typography>
        <Typography>Project ID: {projectState.id}</Typography>
        <Typography>
          Project Description: {projectState.projectDescription}
        </Typography>
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
              <UploadsList
                uploads={uploads}
                upload={upload}
                setUploads={setUploads}
              />
            );
          })}
        </Box>
        <Box marginTop={'20px'}>
          <Button variant="contained" onClick={uploadVideosHandler}>
            Upload Videos to Project
          </Button>
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
