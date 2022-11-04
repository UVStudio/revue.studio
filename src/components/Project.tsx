import React, { useState, useEffect } from 'react';
import { selectUser } from '../features/user/userSlice';
import { useAppSelector } from '../app/hooks';
import VideoListing from './nested/VideoListing';
import { dynamoDBGetVideosByProjectId } from '../features/videos/videosAPI';
import { dynamoDBGetProjectByProjectId } from '../features/projects/projectsAPI';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  Paper,
  TextField,
  Button,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { ProjectObject } from '../features/projects/projectsSlice';
import { VideoObject } from './ProjectDetails';
import { convertTime } from '../utils/convertTime';

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

  const userState = useAppSelector(selectUser);
  const params = useParams();
  const projectId = params.projectId as string;

  useEffect(() => {
    const fetchProject = async () => {
      const response = await dynamoDBGetProjectByProjectId(projectId);
      setProject(response.data.Item);
    };

    const fetchVideos = async () => {
      const response = await dynamoDBGetVideosByProjectId(projectId);
      setVideos(response.data.Items.reverse());
    };

    if (userState.id !== '') {
      setAllowed(true);
    }

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
        localStorage.removeItem('projectPassword');
      }
    };

    setLoading(true);
    fetchVideos();
    fetchProject();
    if (result && project.projectPassword) {
      retrieveStoredPassword();
    }
    setLoading(false);
  }, [projectId, allowed, project.projectPassword, userState]);

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
        <Box className="section" sx={{ minHeight: '700px' }}>
          <Paper
            elevation={2}
            className="section"
            sx={{ width: '80%', backgroundColor: 'white', my: 3 }}
          >
            <Typography variant="h6" sx={{ mt: 3 }}>
              {project.projectName}
            </Typography>
            <Typography sx={{ my: 3 }}>{project.projectDescription}</Typography>
            {videos.map((video) => {
              return (
                <Box key={video.timeStamp} className="outer-video-container">
                  <VideoListing
                    video={video}
                    videos={videos}
                    project={project}
                  />
                </Box>
              );
            })}
            <Typography>Created: {convertTime(project.timeStamp)}</Typography>
          </Paper>
        </Box>
      ) : (
        <Box className="section" sx={{ minHeight: '700px' }}>
          <Box
            className="section"
            component="form"
            sx={{
              marginY: '20px',
            }}
          >
            <Card className="whiteCard" sx={{ px: 7, py: 5, my: 5 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Project: {project?.projectName}
              </Typography>
              <Typography sx={{ mb: 3 }}>
                Please enter project password to browse project.
              </Typography>
              <TextField
                required
                id="projectPassword"
                label="Project Password?"
                value={password.projectPassword}
                onChange={(e) => onChangeForm(e)}
              />
              <Button onClick={enterPassword} sx={{ mt: 4 }}>
                <Typography>Enter Project</Typography>
              </Button>
            </Card>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Project;
