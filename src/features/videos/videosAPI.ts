import axios from 'axios';

export const awsVideosAPI = 'clnpdnyoxf.execute-api.us-east-1.amazonaws.com';

//GET VIDEOS BY PROJECTID
export const dynamoDBGetVideosByProjectId = async (projectId: string) => {
  const config = {
    headers: {
      'content-type': 'application/json',
    },
  };
  try {
    const data = await axios.get(
      `https://${awsVideosAPI}/videos/${projectId}`,
      config
    );
    return data;
  } catch (error) {
    throw new Error('Could not get videos by Project Id');
  }
};
