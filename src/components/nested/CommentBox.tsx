import { Box, Typography, Paper } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

export interface CommentObject {
  id: string;
  comment: string;
  timeStamp: string;
  userId: string;
  videoId: string;
}

const CommentBox = ({
  comment,
  editComment,
  deleteComment,
}: {
  comment: CommentObject;
  editComment: (comment: CommentObject) => void;
  deleteComment: (comment: CommentObject) => void;
}) => {
  let backgColor = '#DAF9DE';
  if (comment.userId === 'guest') backgColor = '#FDFDFF';

  return (
    <Paper
      className="comment-box"
      square={false}
      elevation={2}
      sx={{ backgroundColor: backgColor }}
    >
      <Box className="flex-row">
        <Typography className="comment-text">{comment.comment}</Typography>
        <Box className="flex-row">
          <EditIcon onClick={() => editComment(comment)} />
          <DeleteForeverIcon onClick={() => deleteComment(comment)} />
        </Box>
      </Box>
    </Paper>
  );
};

export default CommentBox;
