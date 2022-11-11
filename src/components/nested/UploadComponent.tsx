import React, { useState } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { UploadFileObject, VideoObject } from '../ProjectDetails';
import {
  // s3GetPresignedUrl,
  // s3UploadVideo,
  startMultiUpload,
  uploadMultipartFile,
  abortMultipartUpload,
} from '../../features/videos/videosAPI';

const UploadComponent = ({
  upload,
  projectId,
  setVideos,
  removeVideoFromListHandler,
  dynamoDBGetVideosByProjectId,
}: {
  upload: UploadFileObject;
  projectId: string;
  setVideos: React.Dispatch<React.SetStateAction<VideoObject[]>>;
  removeVideoFromListHandler: (id: string) => void;
  dynamoDBGetVideosByProjectId: (projectId: string) => any;
}) => {
  const [uploadDone, setUploadDone] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removeUploadComp, setRemoveUploadComp] = useState(false);
  const [, setProgressArray] = useState<number[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(-1);
  const [multiUploadId, setMultiUploadId] = useState('');
  const [abortUpload, setAbortUpload] = useState(false);

  const startUploadHandler = async () => {
    setUploading(true);
    const uploadId = await startMultiUpload(upload);
    setMultiUploadId(uploadId);
    await uploadMultipartFile(
      upload,
      uploadId,
      abortUpload,
      setProgressArray,
      setUploadProgress,
      setTimeRemaining
    );
    setTimeout(async () => {
      const response = await dynamoDBGetVideosByProjectId(projectId);
      setVideos(response.data.Items.reverse());
      setUploading(false);
      setUploadDone(true);
      setTimeout(() => {
        setRemoveUploadComp(true);
      }, 2000);
    }, 3000); //wait for DDB to be written
  };

  const abortUploadHandler = async (upload: UploadFileObject) => {
    const abortResult = await abortMultipartUpload(upload, multiUploadId);
    console.log('abort result F/E: ', abortResult);
    if (abortResult.status === 200) {
      setUploading(false);
      setUploadProgress(0);
      setAbortUpload(true);
      setTimeout(() => {
        setRemoveUploadComp(true);
      }, 2000);
      console.log(
        'abort is successful at AWS, now do something to stop the upload'
      );
    }
  };

  // console.log(
  //   'progressArray.length (number of chunks): ',
  //   progressArray.length
  // );

  const convertSecondsToHMS = (timeRemaining: number) => {
    //90000 (1.50 minutes) % 60000 => 30000 => 30 seconds
    const secondsPreFormat = ((timeRemaining % 60000) / 1000)
      .toFixed(0)
      .toString();
    //90000 / 60000 => 1.5 minutes => Math.floor = 1 minute
    //5,400,000 (1.5 hours) / 60000 => 90 % 60 => 30 minutes
    const minutesPreFormat =
      Math.floor(timeRemaining / 60000) < 60
        ? Math.floor(timeRemaining / 60000).toString()
        : (Math.floor(timeRemaining / 60000) % 60).toFixed(0).toString();
    //3,600,000 millis in one hour
    const hoursPreFormat = Math.floor(timeRemaining / 3600000).toString();

    const hours =
      hoursPreFormat.length < 2 ? '0' + hoursPreFormat : hoursPreFormat;
    const minutes =
      minutesPreFormat.length < 2 ? '0' + minutesPreFormat : minutesPreFormat;
    const seconds =
      secondsPreFormat.length < 2 ? '0' + secondsPreFormat : secondsPreFormat;

    const stringSMH = `${hours}:${minutes}:${seconds}`;

    return stringSMH;
  };

  const uploadTimer = (timeRemaining: number, uploadProgress: number) => {
    let timePrint =
      timeRemaining === -1
        ? 'Upload has not started'
        : timeRemaining !== -1 && uploadProgress < 1
        ? 'Upload started. Calculating...'
        : 'Time Remaining: ' + convertSecondsToHMS(timeRemaining);
    return timePrint;
  };

  const uploadingIndicator = () => {
    if (!uploading) {
      if (uploadDone) {
        return (
          <Box className="flex-row">
            <Typography sx={{ marginRight: '10px' }}>Done!</Typography>
            <CancelOutlinedIcon
              onClick={() => removeVideoFromListHandler(upload.id)}
            />
          </Box>
        );
      } else {
        return (
          <Box className="flex-row">
            <FileUploadIcon sx={{ mr: '10px' }} onClick={startUploadHandler} />
            <CancelOutlinedIcon
              onClick={() => removeVideoFromListHandler(upload.id)}
            />
          </Box>
        );
      }
    } else {
      return (
        <Box className="flex-row">
          <CircularProgress sx={{ marginRight: '10px' }} size={22} />
          <CancelOutlinedIcon onClick={() => abortUploadHandler(upload)} />
        </Box>
      );
    }
  };

  return (
    <Box sx={{ width: '60%' }}>
      {removeUploadComp ? null : (
        <Box className="add-video-container">
          <Box key={upload.fileUrl} className="add-video-row">
            <Typography>{upload.fileName}</Typography>
            <Typography>{uploadProgress}%</Typography>
            {uploadingIndicator()}
          </Box>
          <LinearProgress
            sx={{ mt: '10px', mb: '10px' }}
            variant="determinate"
            value={uploadProgress}
          />
          <Typography sx={{ alignSelf: 'center' }}>
            {uploadTimer(timeRemaining, uploadProgress)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default UploadComponent;

// const uploadVideoHandler = async () => {
//   setUploading(true);
//   const presignedUrl = await s3GetPresignedUrl(upload);
//   await s3UploadVideo(presignedUrl, upload);
//   setTimeout(async () => {
//     const response = await dynamoDBGetVideosByProjectId(projectId);
//     setVideos(response.data.Items.reverse());
//     setUploading(false);
//     setUploadDone(true);
//     setTimeout(() => {
//       setRemoveUploadComp(true);
//     }, 2000);
//   }, 3000); //wait for DDB to be written
// };
