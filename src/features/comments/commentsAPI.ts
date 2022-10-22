import axios from 'axios';
import { awsCommentsAPI } from '../../constants/awsLinks';

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
