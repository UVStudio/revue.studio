import React, { useState, useEffect } from 'react';
import VideoListing from './nested/VideoListing';
import { dynamoDBGetVideosByProjectId } from '../features/videos/videosAPI';
import { dynamoDBGetProjectByProjectId } from '../features/projects/projectsAPI';
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { ProjectObject } from '../features/projects/projectsSlice';
import { VideoObject } from './ProjectDetails';

const initialProject = {
  id: '',
  userId: '',
  projectName: '',
  projectDescription: '',
  timeStamp: '',
  projectPassword: '',
};

const initialPassword = {
  projectPassword: '',
};

export interface projectPasswordLocalStorage {
  projectPassword: string;
  timeStamp: number;
}

const Project = () => {
  const [videos, setVideos] = useState<VideoObject[]>([]);
  const [project, setProject] = useState<ProjectObject>(initialProject);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState(initialPassword);
  const [allowed, setAllowed] = useState(false);

  const params = useParams();
  const projectId = params.projectId as string;

  useEffect(() => {
    const fetchProject = async () => {
      const response = await dynamoDBGetProjectByProjectId(projectId);
      //console.log('UE fetched from DDB Project: ', response.data.Item);
      setProject(response.data.Item);
    };

    const fetchVideos = async () => {
      const response = await dynamoDBGetVideosByProjectId(projectId);
      // console.log('UE fetched from DDB Videos');
      setVideos(response.data.Items.reverse());
    };

    const result = localStorage.getItem('projectPassword');
    const parsedData: projectPasswordLocalStorage = JSON.parse(result!);

    if (parsedData && parsedData.timeStamp + 60000 < Date.now()) {
      localStorage.removeItem('projectPassword');
    }

    const retrieveStoredPassword = () => {
      const storedPassword: string = parsedData.projectPassword;
      if (storedPassword === project.projectPassword) {
        setAllowed(true);
      } else {
        setAllowed(false);
      }
    };

    setLoading(true);
    fetchVideos();
    fetchProject();
    setLoading(false);

    if (result) {
      retrieveStoredPassword();
    }
  }, [projectId, project.projectPassword]);

  const onChangeForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword({ ...password, [e.target.id]: e.target.value });
  };

  const enterPassword = () => {
    if (project.projectPassword === password.projectPassword) {
      setAllowed(true);
      localStorage.setItem(
        'projectPassword',
        JSON.stringify({
          projectPassword: password.projectPassword,
          timeStamp: Date.now(),
        })
      );
    }
  };

  return (
    <Box className="App">
      {loading ? (
        <CircularProgress />
      ) : allowed ? (
        <Box className="section">
          <Typography variant="h6" sx={{ marginY: '20px' }}>
            {project.projectName}
          </Typography>
          <Typography sx={{ marginY: '20px' }}>
            {project.projectDescription}
          </Typography>
          {videos.map((video) => {
            return (
              <Box key={video.timeStamp} className="outer-video-container">
                <VideoListing video={video} videos={videos} project={project} />
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box className="section">
          <Box
            className="section"
            component="form"
            sx={{
              marginY: '20px',
            }}
          >
            <TextField
              required
              id="projectPassword"
              label="Project Password?"
              value={password.projectPassword}
              onChange={(e) => onChangeForm(e)}
            />
          </Box>
          <Button onClick={enterPassword}>
            <Typography>Enter Project</Typography>
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Project;
