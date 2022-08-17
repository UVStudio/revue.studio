import React, { useState, useEffect } from 'react';
import Video from './nested/Video';
import { dynamoDBGetVideosByProjectId } from '../features/videos/videosAPI';
import { dynamoDBGetProjectByProjectId } from '../features/projects/projectsAPI';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { ProjectObject } from '../features/projects/projectsSlice';

export interface VideoObject {
  userId: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  file: File;
  s3Url: string;
  timeStamp: string;
}

const initialProject = {
  id: '',
  userId: '',
  projectName: '',
  projectDescription: '',
  timeStamp: '',
};

const Project = () => {
  const [videos, setVideos] = useState<VideoObject[]>([]);
  const [project, setProject] = useState<ProjectObject>(initialProject);

  const params = useParams();
  const projectId = params.projectId as string;

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await dynamoDBGetVideosByProjectId(projectId);
      console.log('UE fetched from DDB Videos');
      setVideos(response.data.Items.reverse());
    };
    fetchVideos();
  }, [projectId]);

  useEffect(() => {
    const fetchProject = async () => {
      const response = await dynamoDBGetProjectByProjectId(projectId);
      console.log('UE fetched from DDB Project: ', response.data.Item);
      setProject(response.data.Item);
    };
    fetchProject();
  }, [projectId]);

  return (
    <Box className="App">
      <Box className="section">
        <Typography variant="h6">{project.projectName}</Typography>
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

export default Project;
