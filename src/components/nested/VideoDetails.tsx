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
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/user/userSlice';
import { awsS3Url } from '../../constants/awsLinks';
import { VideoObject } from '../ProjectDetails';
import { ProjectObject } from '../../features/projects/projectsSlice';
import { CommentObject } from './CommentBox';
import { dynamoDBGetProjectByProjectId } from '../../features/projects/projectsAPI';
import { dynamoDBGetVideoByVideoId } from '../../features/videos/videosAPI';
import {
  postComment,
  deleteCommentById,
  dynamoDBGetCommentsByVideoId,
} from '../../features/comments/commentsAPI';
import { projectPasswordLocalStorage } from '../Project';
import CommentBox from './CommentBox';
import PublishIcon from '@mui/icons-material/Publish';

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
  const [videoState, setVideoState] = useState<null | VideoObject>(null);
  const [projectState, setProjectState] = useState<null | ProjectObject>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentObject[]>([]);
  const [comment, setComment] = useState(initialComment);

  const params = useParams();

  //PARAMS FROM NAVIGATE
  //projVideoState will yield both video and project state, which is ideal,
  //but we can only get projVideoState in one step from useLocation by the user
  //navigating from ProjectDetails.
  //But for direct URL access, useLocation will be null
  const projVideoState = useLocation().state as projVideoState;

  const videoSlice = projVideoState
    ? (projVideoState.video as VideoObject)
    : videoState;
  const projectSlice = projVideoState
    ? (projVideoState.project as ProjectObject)
    : projectState;
  const userState = useAppSelector(selectUser);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectId = async () => {
      const videoResponse = await dynamoDBGetVideoByVideoId(params.videoId!);
      setProjectId(videoResponse.data.Item.projectId);
      setVideoState(videoResponse.data.Item);
      //getting videoState from reading the database
      const projectResponse = await dynamoDBGetProjectByProjectId(
        videoResponse.data.Item.projectId
      );
      setProjectState(projectResponse.data.Item);
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
  }, [params, comments]);

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

  const deleteComment = async (comment: CommentObject) => {
    await deleteCommentById(comment);
    setComments(comments.filter((commt) => commt.id !== comment.id));
  };

  const toProjectDetails = () => {
    navigate(`../projectDetails/${projectSlice!.id}`);
  };

  const signature = userState.id !== '' ? ` - ${userState.name}` : ' - guest';

  const submitComment = async () => {
    const id = uuidv4();
    const userId = userState.id !== '' ? userState.id : 'guest';
    const videoId = videoSlice!.id;
    const videoComment = comment.newComment + signature;
    const timeStamp = Date.now().toString();

    const response = await postComment(
      id,
      userId,
      videoId,
      videoComment,
      timeStamp
    );
    if (response.status === 200) {
      setComment(initialComment);
    }
  };

  if (loading) {
    return (
      <Box className="background" sx={{ height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="background" sx={{ height: '100%' }}>
      {allowed && videoSlice ? (
        <Paper sx={{ my: 2, mb: 5, px: 4 }}>
          <Box className="center" sx={{ width: '700px' }}>
            <Box className="center">
              <Box sx={{ py: 2 }}>
                <Typography>Video ID: {videoSlice!.id}</Typography>
                <Typography>
                  File Name: {videoSlice!.fileName.split('-')[1]}
                </Typography>
                <Typography>
                  File Size:{' '}
                  {(Number(videoSlice!.fileSize) / 1000000).toFixed(2)} MB
                </Typography>
                <Button onClick={toProjectDetails}>
                  Project Name: {projectSlice!.projectName}
                </Button>
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
                  <Box className="flex-row">
                    <TextField
                      multiline
                      id="newComment"
                      label="New Comment"
                      variant="outlined"
                      sx={{ mr: 3, width: '100%' }}
                      value={comment.newComment}
                      onChange={(e) => onCommentChange(e)}
                    />
                    <Button
                      variant="contained"
                      onClick={submitComment}
                      sx={{ height: '55px' }}
                    >
                      <PublishIcon />
                    </Button>
                  </Box>
                </FormControl>

                <Typography variant="h6">Comments</Typography>
                {comments.length > 0
                  ? comments.map((comment) => {
                      return (
                        <CommentBox
                          key={comment.id}
                          comment={comment}
                          stateUserId={userState.id}
                          // editComment={editComment}
                          deleteComment={deleteComment}
                        />
                      );
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
