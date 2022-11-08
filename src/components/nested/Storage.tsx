import { useState, useEffect, useCallback } from 'react';
import { UserState } from '../../features/user/userSlice';
import { Box, Card, Typography } from '@mui/material';
import { getS3AllVideosByUserId } from '../../features/videos/videosAPI';
import { VideoObject } from '../ProjectDetails';
import CustomCircularProgress from './CustomCircularProgress';
import { convertFileName } from '../../utils/filenameClean';

const Storage = ({ userState }: { userState: UserState }): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoObject[]>([]);

  const fetchDDBVideoData = useCallback(async () => {
    try {
      const response = await getS3AllVideosByUserId(userState.id);
      setVideoData(response.data.Items);
    } catch (error) {
      throw new Error('Cannot get video data');
    }
  }, [userState.id]);

  useEffect(() => {
    setLoading(true);
    fetchDDBVideoData();
    setLoading(false);
  }, [fetchDDBVideoData]);

  const totalStorage = () => {
    const sum = videoData.reduce(
      (prev, current) => prev + Number(current.fileSize),
      0
    );

    return (sum / 1000000).toFixed(2);
  };

  if (loading || videoData.length === 0) {
    return <CustomCircularProgress />;
  }

  return (
    <Box className="section" sx={{ minHeight: '650px' }}>
      <Card raised className="whiteCard">
        <Box sx={{ m: 4 }}>
          <Box sx={{ width: { xs: '30ch', sm: '45ch' } }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Your current uploaded videos
            </Typography>
            {videoData.length > 0
              ? videoData.map((video, index) => {
                  return (
                    <Box key={index} className="flex-row">
                      <Typography>{convertFileName(video.fileName)}</Typography>
                      <Typography>
                        {(Number(video.fileSize) / 1000000).toFixed(2)} MB
                      </Typography>
                    </Box>
                  );
                })
              : null}
            <Typography sx={{ mt: 3 }}>
              Your total storage usage is: {totalStorage()} MB
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default Storage;
