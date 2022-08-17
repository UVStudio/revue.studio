import axios from 'axios';
import { UploadFileObject } from '../../components/ProjectDetails';
import { awsVideosAPI } from '../../constants/awsLinks';

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

//GET PRESIGNEDURL
export const s3GetPresignedUrl = async (upload: UploadFileObject) => {
  const config = {
    headers: {
      'content-type': 'application/json',
    },
  };
  const body = {
    upload,
  };

  try {
    const data = await axios.post(
      `https://${awsVideosAPI}/videos/${upload.projectId}`,
      body,
      config
    );

    return data.data;
  } catch (error) {
    throw new Error('Could not obtain presignedUrl');
  }
};

//UPLOAD VIDEOS
export const s3UploadVideos = async (url: string, upload: UploadFileObject) => {
  const config = {
    headers: {
      'Content-Type': 'video/mp4',
      'x-amz-acl': 'public-read',
    },
  };
  const body = {
    upload,
  };
  console.log('body: ', body.upload.file);

  try {
    const data = await axios.put(url, body.upload.file, config);
    console.log('upload response data: ', data);
  } catch (error) {
    throw new Error('Could not upload videos');
  }
};
