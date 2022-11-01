import axios from 'axios';
import { awsCommentsAPI } from '../../constants/awsLinks';
import { CommentObject } from '../../components/nested/CommentBox';

//GET COMMENTS BY VIDEO ID
export const dynamoDBGetCommentsByVideoId = async (videoId: string) => {
  const config = {
    headers: {
      'content-type': 'application/json',
    },
  };
  try {
    const response = await axios.get(
      `https://${awsCommentsAPI}/comments/${videoId}`,
      config
    );
    return response;
  } catch (error) {
    throw new Error('Could not get comments by Video Id');
  }
};

export const postComment = async (
  id: string,
  userId: string,
  videoId: string,
  comment: string,
  timeStamp: string
) => {
  const config = {
    headers: {
      'content-type': 'application/json',
    },
  };
  const body = JSON.stringify({
    id,
    userId,
    videoId,
    comment,
    timeStamp,
  });
  try {
    const response = await axios.put(
      `https://${awsCommentsAPI}/comment`,
      body,
      config
    );
    return response;
  } catch (error) {
    throw new Error('Could not post comment');
  }
};

export const deleteCommentById = async (comment: CommentObject) => {
  try {
    await axios.delete(`https://${awsCommentsAPI}/comment/${comment.id}`);
  } catch (error) {
    throw new Error('Could not delete comment');
  }
};

// {
//   "id": "1234",
//   "userId": "87ab327e-0ad4-4f81-8363-98e50613ff3b",
//   "videoId": "1666045577261",
//   "comment": "3rd time New edited Test comment",
//   "timeStamp": "33333333"
// }

export const editCommentById = async (
  id: string,
  userId: string,
  videoId: string,
  comment: string,
  timeStamp: string
) => {
  try {
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    };
    const body = JSON.stringify({
      id,
      userId,
      videoId,
      comment,
      timeStamp,
    });

    const response = await axios.put(
      `https://${awsCommentsAPI}/comment/${id}`,
      body,
      config
    );
    console.log('resp: ', response);
  } catch (error) {
    throw new Error('Could not edit comment');
  }
};
