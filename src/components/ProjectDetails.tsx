import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectUser } from '../features/user/userSlice';
import { Project } from '../features/projects/projectsSlice';
import { dynamoDBGetVideosByProjectId } from '../features/videos/videosAPI';
import { timeStampConverter } from '../utils/timeConversion';
import ReactPlayer from 'react-player/lazy';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';

export interface UploadFileObject {
  id: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  s3Url: string;
}

export interface UploadProjectObject {
  userId: string;
  projectId: string;
  projectName: string;
  projectDescription: string;
  timeStamp: string;
  uploads: UploadFileObject[];
}

export interface VideoObject {
  userId: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  s3Url: string;
  timeStamp: string;
}

const ProjectDetails = () => {
  //PARAMS FROM NAVIGATE
  const projectState = useLocation().state as Project;

  //GLOBAL STATE
  const userState = useAppSelector(selectUser);

  //COMPONENT STATE HOOKS
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploads, setUploads] = useState<UploadFileObject[]>([]);
  const [videos, setVideos] = useState<VideoObject[]>([]);

  const awsS3Url = 'https://revue-studio-users.s3.amazonaws.com';

  const fileSelectHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slicePathToName = (str: string): string => {
      for (let i = str.length; i > 0; i--) {
        if (str[i] === '\\') {
          return str.slice(i + 1, str.length);
        }
      }
      return str;
    };

    setUploads([
      ...uploads,
      {
        id: Date.now().toString(),
        projectId: projectState.id,
        fileName: slicePathToName(e.target.value),
        fileUrl: e.target.value,
        s3Url: `${awsS3Url}/${userState.id}/${
          projectState.id
        }/${Date.now().toString()}-${slicePathToName(e.target.value)}`,
      },
    ]);
    setFileUrl(e.target.value);
  };

  useEffect(() => {
    for (let i = fileUrl.length; i > 0; i--) {
      if (fileUrl[i] === '\\') {
        return setFileName(fileUrl.slice(i + 1, fileUrl.length));
      }
    }
  }, [fileUrl, fileName]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await dynamoDBGetVideosByProjectId(projectState.id);
      console.log('videos: ', response.data.Items);
      setVideos(response.data.Items.reverse());
    };
    fetchData();
  }, [projectState.id]);

  const uploadVideosHandler = () => {
    console.log('uploads obj: ', uploads);
  };

  const removeVideoHandler = (fileName: string) => {
    setUploads(uploads.filter((upload) => upload.fileName !== fileName));
  };

  const downloadHandler = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ): void => {
    e.preventDefault();
  };

  return (
    <Box>
      <Box className="section">
        <Typography variant="h6">ProjectDetails</Typography>
        <Typography>Project Name: {projectState.projectName}</Typography>
        <Typography>Project ID: {projectState.id}</Typography>
        <Typography>
          Project Description: {projectState.projectDescription}
        </Typography>
      </Box>
      <Box className="section">
        <Box marginTop={'20px'}>
          <input
            id="contained-button-file"
            type="file"
            style={{ display: 'none' }}
            onChange={fileSelectHandler}
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" component="span">
              Select Video
            </Button>
          </label>
        </Box>
        <Box>
          {uploads.map((upload) => {
            return (
              <Box key={upload.fileUrl} className="add-project-row">
                <Typography className="add-project-row-text">
                  {upload.fileName}
                </Typography>
                <RemoveCircleOutlineOutlinedIcon
                  onClick={() => removeVideoHandler(upload.fileName)}
                />
              </Box>
            );
          })}
        </Box>
        <Box marginTop={'20px'}>
          <Button variant="contained" onClick={uploadVideosHandler}>
            Upload Videos to Project
          </Button>
        </Box>
      </Box>
      <Box className="section">
        {videos.map((video) => {
          return (
            <Box key={video.timeStamp}>
              <Box className="video-container">
                <Box className="video-info-container">
                  <Typography>{video.fileName}</Typography>
                  <Typography>
                    Uploaded: {timeStampConverter(Number(video.timeStamp))}
                  </Typography>
                  <Link
                    to={`${awsS3Url}/${video.s3Url}`}
                    target="_blank"
                    download
                  >
                    <FileDownloadOutlinedIcon onClick={downloadHandler} />
                  </Link>
                </Box>
                <Box className="video-player-container">
                  <Box className="video-player">
                    <ReactPlayer
                      controls={true}
                      light={false}
                      url={`${awsS3Url}/${video.s3Url}`}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ProjectDetails;
