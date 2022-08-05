import axios from 'axios';
import * as AWS from 'aws-sdk/global';

export const awsProjectsAPI = '912ggori07.execute-api.us-east-1.amazonaws.com';

//DYNAMODB PROJECT CREATION
export const dynamoDBAddProjectName = async (
  projectId: string,
  userId: string,
  projectName: string,
  projectDescription: string
) => {
  const config = {
    headers: {
      'content-type': 'application/json',
    },
  };
  const body = JSON.stringify({
    projectId,
    userId,
    projectName,
    projectDescription,
  });
  console.log('body: ', body);
  try {
    const data = await axios.put(
      `https://${awsProjectsAPI}/projects/${userId}`,
      body,
      config
    );
    console.log('project data: ', data);
  } catch (error) {
    throw new Error('Could not create Project');
  }
};
