import axios from 'axios';
import { awsProjectsAPI } from '../../constants/awsLinks';

//DYNAMODB PROJECT CREATION
export const dynamoDBAddProject = async (
  projectId: string,
  userId: string,
  projectName: string,
  projectDescription: string,
  timeStamp: string
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
    timeStamp,
  });
  console.log('body: ', body);
  try {
    const data = await axios.post(
      `https://${awsProjectsAPI}/projects`,
      body,
      config
    );
    console.log('project data: ', data);
  } catch (error) {
    throw new Error('Could not create Project');
  }
};

//GET PROJECTS BY USERID
export const dynamoDBGetProjectsByUserId = async (userId: string) => {
  const config = {
    headers: {
      'content-type': 'application/json',
    },
  };
  try {
    const data = await axios.get(
      `https://${awsProjectsAPI}/projects/${userId}`,
      config
    );
    console.log('projects: ', data);
    return data;
  } catch (error) {
    throw new Error('Could not get projects by User Id');
  }
};
