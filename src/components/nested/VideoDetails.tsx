import { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Box, Typography, Button, TextField } from '@mui/material';
import ReactPlayer from 'react-player/lazy';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/user/userSlice';
import { awsS3Url } from '../../constants/awsLinks';
import { VideoObject } from '../ProjectDetails';
import { ProjectObject } from '../../features/projects/projectsSlice';

interface projVideoState {
  video: VideoObject;
  project: ProjectObject;
}

const initialPassword = {
  projectPassword: '',
};

const VideoDetails = () => {
  const [password, setPassword] = useState(initialPassword);
  const [allowed, setAllowed] = useState(false);

  //PARAMS FROM NAVIGATE
  const projVideoState = useLocation().state as projVideoState;
  const videoState = projVideoState
    ? (projVideoState.video as VideoObject)
    : null;
  const projectState = projVideoState
    ? (projVideoState.project as ProjectObject)
    : null;
  const userState = useAppSelector(selectUser);

  useEffect(() => {
    if (userState) {
      setAllowed(true);
    }
  }, [projVideoState, userState, setAllowed]);

  const onChangeForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword({ ...password, [e.target.id]: e.target.value });
  };

  const enterPassword = () => {
    if (projectState!.projectPassword === password.projectPassword) {
      setAllowed(true);
      localStorage.setItem(
        'projectPassword',
        JSON.stringify({ projectPassword: password.projectPassword })
      );
    }
  };

  if (projVideoState === null) return <Navigate to="../" replace />;

  return (
    <Box className="section">
      {allowed ? (
        <Box className="section">
          <Typography>{videoState!.id}</Typography>
          <Typography>{videoState!.fileName}</Typography>
          <Typography>{videoState!.fileSize} Bytes</Typography>

          <Box className="video-player-container">
            <Box className="video-player">
              <ReactPlayer
                controls={true}
                light={false}
                url={`${awsS3Url}/${videoState!.s3Url}`}
              />
            </Box>
          </Box>
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

export default VideoDetails;
