import React, { useState, useEffect } from 'react';
import Video from './nested/Video';
import { dynamoDBGetVideosByProjectId } from '../features/videos/videosAPI';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';

export interface VideoObject {
  userId: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  file: File;
  s3Url: string;
  timeStamp: string;
}

const Project = () => {
  const [videos, setVideos] = useState<VideoObject[]>([]);

  const params = useParams();
  const projectId = params.projectId as string;

  useEffect(() => {
    const fetchData = async () => {
      const response = await dynamoDBGetVideosByProjectId(projectId);
      console.log('UE fetched from DDB Project');
      setVideos(response.data.Items.reverse());
    };
    fetchData();
  }, [projectId]);

  return (
    <Box className="App">
      <Box className="section">
        {videos.map((video) => {
          return (
            <Box key={video.timeStamp}>
              <Video video={video} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Project;
