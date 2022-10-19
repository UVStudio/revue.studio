import { Typography, Paper } from '@mui/material';

const CommentBox = () => {
  return (
    <Paper
      className="comment-box"
      square={false}
      elevation={2}
      sx={{ backgroundColor: '#DAF9DE' }}
    >
      <Typography className="comment-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed
        sapien dui. Vivamus iaculis eros vel maximus placerat.
      </Typography>
    </Paper>
  );
};

export default CommentBox;
