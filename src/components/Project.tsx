import React, { useState, useEffect } from 'react';
import VideoListing from './nested/VideoListing';
import { dynamoDBGetVideosByProjectId } from '../features/videos/videosAPI';
import { dynamoDBGetProjectByProjectId } from '../features/projects/projectsAPI';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { ProjectObject } from '../features/projects/projectsSlice';
import { VideoObject } from './ProjectDetails';

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
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const projectId = params.projectId as string;

  useEffect(() => {
    const fetchProject = async () => {
      const response = await dynamoDBGetProjectByProjectId(projectId);
      console.log('UE fetched from DDB Project: ', response.data.Item);
      setProject(response.data.Item);
    };

    const fetchVideos = async () => {
      const response = await dynamoDBGetVideosByProjectId(projectId);
      console.log('UE fetched from DDB Videos');
      setVideos(response.data.Items.reverse());
    };
    setLoading(true);
    fetchVideos();
    fetchProject();
    setLoading(false);
  }, [projectId]);

  return (
    <Box className="App">
      {loading ? (
        <CircularProgress />
      ) : (
        <Box className="section">
          <Typography variant="h6" sx={{ marginY: '20px' }}>
            {project.projectName}
          </Typography>
          {videos.map((video) => {
            return (
              <Box key={video.timeStamp} className="outer-video-container">
                <VideoListing video={video} videos={videos} />
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default Project;
