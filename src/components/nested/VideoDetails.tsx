import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Card,
  Paper,
  FormControl,
} from '@mui/material';
import ReactPlayer from 'react-player/lazy';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/user/userSlice';
import { awsS3Url } from '../../constants/awsLinks';
import { VideoObject } from '../ProjectDetails';
import { ProjectObject } from '../../features/projects/projectsSlice';
import { CommentObject } from './CommentBox';
import { dynamoDBGetVideoByVideoId } from '../../features/videos/videosAPI';
import { dynamoDBGetCommentsByVideoId } from '../../features/comments/commentsAPI';
import { projectPasswordLocalStorage } from '../Project';
import CommentBox from './CommentBox';

interface projVideoState {
  video: VideoObject;
  project: ProjectObject;
}

const initialPassword = {
  projectPassword: '',
};

const initialComment = {
  newComment: '',
};

const VideoDetails = () => {
  const [password, setPassword] = useState(initialPassword);
  const [allowed, setAllowed] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentObject[]>([]);
  const [comment, setComment] = useState(initialComment);

  const params = useParams();

  //PARAMS FROM NAVIGATE
  const projVideoState = useLocation().state as projVideoState;
  console.log('projVideoState: ', projVideoState);

  const videoSlice = projVideoState
    ? (projVideoState.video as VideoObject)
    : null;
  const projectSlice = projVideoState
    ? (projVideoState.project as ProjectObject)
    : null;
  const userState = useAppSelector(selectUser);

  const navigate = useNavigate();
  // console.log('allowed: ', allowed); //allowed logic seems correct

  useEffect(() => {
    const fetchProjectId = async () => {
      const response = await dynamoDBGetVideoByVideoId(params.videoId!);
      setProjectId(response.data.Item.projectId);

      if (!projVideoState && projectId && userState.id !== '') {
        navigate(`../projectDetails/${projectId}`);
      }
      setLoading(false);
    };

    fetchProjectId();
  }, [params, projVideoState, projectId, navigate, userState.id]);

  useEffect(() => {
    const retrieveStoredPassword = () => {
      const storedPassword: string = parsedData.projectPassword;

      if (storedPassword === projectSlice!.projectPassword) {
        setAllowed(true);
      } else {
        setAllowed(false);
        localStorage.removeItem('projectPassword');
      }
    };

    const result = localStorage.getItem('projectPassword');
    const parsedData: projectPasswordLocalStorage = JSON.parse(result!);

    if (parsedData && parsedData.timeStamp + 60000 < Date.now()) {
      localStorage.removeItem('projectPassword');
    }

    if (result) {
      retrieveStoredPassword();
    }

    if (userState.id !== '') {
      setAllowed(true);
    }
  }, [projVideoState, userState, setAllowed, projectSlice, params]);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await dynamoDBGetCommentsByVideoId(params.videoId!);
      setComments(response.data.Items);
    };

    fetchComments();
  }, [params]);

  const onPasswordChangeForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword({ ...password, [e.target.id]: e.target.value });
  };

  const onCommentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setComment({ ...comment, [e.target.id]: e.target.value });
  };

  const enterPassword = () => {
    if (projectSlice!.projectPassword === password.projectPassword) {
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
    <Box className="background" sx={{ height: '100%' }}>
      {loading ? (
        <CircularProgress />
      ) : allowed && projVideoState ? (
        <Paper sx={{ my: 2, mb: 5, px: 4 }}>
          <Box className="center" sx={{ width: '700px' }}>
            <Box className="center">
              <Box sx={{ py: 2 }}>
                <Typography>Video ID: {videoSlice!.id}</Typography>
                <Typography>Video File Name: {videoSlice!.fileName}</Typography>
                <Typography>Data: {videoSlice!.fileSize} Bytes</Typography>
              </Box>
              <Box className="video-player-container">
                <Box className="video-player">
                  <ReactPlayer
                    controls={true}
                    light={false}
                    url={`${awsS3Url}/${videoSlice!.s3Url}`}
                  />
                </Box>
              </Box>
              <Box className="comment-section">
                <FormControl fullWidth sx={{ my: 2 }}>
                  <Box className="flex-column">
                    <TextField
                      id="newComment"
                      label="New Comment"
                      variant="outlined"
                      sx={{ mr: 3, width: '100%' }}
                      value={comment.newComment}
                      onChange={(e) => onCommentChange(e)}
                    />
                    <Button variant="contained">Post</Button>
                  </Box>
                </FormControl>

                <Typography variant="h6">Comments</Typography>
                {comments.length > 0
                  ? comments.map((comment) => {
                      return <CommentBox key={comment.id} comment={comment} />;
                    })
                  : null}
              </Box>
            </Box>
          </Box>
        </Paper>
      ) : (
        <Box className="section">
          <Card className="whiteCard" sx={{ px: 7, py: 5, my: 5 }}>
            <TextField
              required
              id="projectPassword"
              label="Project Password?"
              value={password.projectPassword}
              onChange={(e) => onPasswordChangeForm(e)}
            />
            <Button onClick={enterPassword} sx={{ mt: 3 }}>
              <Typography>Enter Project from Video</Typography>
            </Button>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default VideoDetails;
