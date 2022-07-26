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
  username: string | undefined;
  videoId: string;
}

const CommentBox = ({
  comment,
  stateUserId,
  deleteComment,
}: {
  comment: CommentObject;
  stateUserId: string;
  deleteComment: (comment: CommentObject) => void;
}) => {
  const initialComment = {
    newComment: comment.comment,
  };

  const [editOrNot, setEditOrNot] = useState(false);
  const [commentEdit, setCommentEdit] = useState(initialComment);

  let backgColor = '#F2FCF2';
  if (comment.userId === 'guest') backgColor = '#FDFDFF';
  if (editOrNot === true) backgColor = '#FFF7E4';

  const onCommentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCommentEdit({ ...commentEdit, [e.target.id]: e.target.value });
  };

  const editTrigger = (comment: CommentObject) => {
    if (!stateUserId) stateUserId = 'guest';
    if (comment.userId === stateUserId) {
      setEditOrNot(!editOrNot);
    } else {
      console.log('You are not allowed to edit this comment');
    }
  };

  const editComment = async () => {
    //updating the passed-down comment object with the new updated comment
    comment.comment = commentEdit.newComment;
    const id = comment.id;
    const userId = comment.userId;
    const username = comment.username;
    const videoId = comment.videoId;
    const timeStamp = comment.timeStamp;
    await editCommentById(
      id,
      userId,
      username,
      videoId,
      comment.comment,
      timeStamp
    );
    setEditOrNot(!editOrNot);
  };

  return (
    <Paper
      className="comment-box"
      square={false}
      elevation={2}
      sx={{
        backgroundColor: backgColor,
        mb: 1.5,
        maxWidth: '650px',
        borderRadius: 6,
      }}
    >
      <Box className="flex-row">
        {editOrNot ? (
          <TextField
            multiline
            fullWidth
            id="newComment"
            label="Edit Comment"
            variant="outlined"
            sx={{
              width: '650px',
              '& fieldset': { border: 'none' },
            }}
            value={commentEdit.newComment}
            onChange={(e) => onCommentChange(e)}
          />
        ) : (
          <Typography className="comment-text">{comment.comment}</Typography>
        )}
        <Box className="flex-row">
          <EditIcon
            onClick={() => editTrigger(comment)}
            className="icon-margins"
          />
          {editOrNot ? (
            <PublishIcon onClick={editComment} className="icon-margins" />
          ) : (
            <DeleteForeverIcon
              onClick={() => deleteComment(comment)}
              className="icon-margins"
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default CommentBox;
