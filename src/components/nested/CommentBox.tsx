import { Typography, Paper } from '@mui/material';

export interface CommentObject {
  id: string;
  comment: string;
  timeStamp: string;
  userId: string;
  videoId: string;
}

const CommentBox = ({ comment }: { comment: CommentObject }) => {
  let backgColor = '#DAF9DE';
  if (comment.userId === 'guest') backgColor = '#FDFDFF';

  return (
    <Paper
      className="comment-box"
      square={false}
      elevation={2}
      sx={{ backgroundColor: backgColor }}
    >
      <Typography className="comment-text">{comment.comment}</Typography>
    </Paper>
  );
};

export default CommentBox;
