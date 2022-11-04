import React, { useState } from 'react';
import {
  Box,
  Button,
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
  const [progressArray, setProgressArray] = useState<number[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
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
      setUploadProgress
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

  console.log(
    'progressArray.length (number of chunks): ',
    progressArray.length
  );

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
            <Button onClick={startUploadHandler}>
              <FileUploadIcon />
            </Button>
            <CancelOutlinedIcon
              onClick={() => removeVideoFromListHandler(upload.id)}
            />
          </Box>
        );
      }
    } else {
      return (
        <Box className="flex-row">
          <CircularProgress sx={{ marginRight: '10px' }} size={20} />
          <CancelOutlinedIcon onClick={() => abortUploadHandler(upload)} />
        </Box>
      );
    }
  };

  return (
    <Box>
      {removeUploadComp ? null : (
        <Box className="add-video-container">
          <Box key={upload.fileUrl} className="add-video-row">
            <Typography>{upload.fileName}</Typography>
            {uploadingIndicator()}
          </Box>
          <LinearProgress
            sx={{ mt: '10px', mb: '10px' }}
            variant="determinate"
            value={uploadProgress}
          />
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
