import React, { useState } from 'react';
import { Box, Typography, Paper, TextField } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PublishIcon from '@mui/icons-material/Publish';
import EditIcon from '@mui/icons-material/Edit';
import { editCommentById } from '../../features/comments/commentsAPI';

export interface CommentObject {
  id: string;
  comment: string;
  timeStamp: string;
  userId: string;
  videoId: string;
}

const CommentBox = ({
  comment,
  // editComment,
  deleteComment,
}: {
  comment: CommentObject;
  // editComment: (comment: CommentObject) => void;
  deleteComment: (comment: CommentObject) => void;
}) => {
  const initialComment = {
    newComment: comment.comment,
  };

  const [editOrNot, setEditOrNot] = useState(false);
  const [commentEdit, setCommentEdit] = useState(initialComment);

  let backgColor = '#DAF9DE';
  if (comment.userId === 'guest') backgColor = '#FDFDFF';

  const onCommentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCommentEdit({ ...commentEdit, [e.target.id]: e.target.value });
  };

  const editTrigger = () => {
    setEditOrNot(!editOrNot);
  };

  const editComment = async () => {
    //updating the passed-down comment object with the new updated comment
    comment.comment = commentEdit.newComment;
    // console.log(comment);
    const id = comment.id;
    const userId = comment.userId;
    const videoId = comment.videoId;
    const timeStamp = comment.timeStamp;
    await editCommentById(id, userId, videoId, comment.comment, timeStamp);
  };

  return (
    <Paper
      className="comment-box"
      square={false}
      elevation={2}
      sx={{ backgroundColor: backgColor }}
    >
      <Box className="flex-row">
        {editOrNot ? (
          <TextField
            multiline
            id="newComment"
            label="Edit Comment"
            variant="outlined"
            sx={{ width: '100%' }}
            value={commentEdit.newComment}
            onChange={(e) => onCommentChange(e)}
          />
        ) : (
          <Typography className="comment-text">{comment.comment}</Typography>
        )}
        <Box className="flex-row">
          <EditIcon onClick={editTrigger} sx={{ marginRight: 1 }} />
          {editOrNot ? (
            <PublishIcon onClick={editComment} sx={{ marginRight: 1 }} />
          ) : (
            <DeleteForeverIcon
              onClick={() => deleteComment(comment)}
              sx={{ marginRight: 1 }}
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default CommentBox;
