import React from 'react';
import ReactPlayer from 'react-player/lazy';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const Project = () => {
  const downloadHandler = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ): void => {
    e.preventDefault();
    window.location.href =
      'https://revue-video-testing.s3.amazonaws.com/squirrel1.mp4'; // it will open download of filepath
    console.log('download');
  };

  return (
    <div className="App">
      <div className="section">
        <div className="video-container">
          <div className="video-info-container">
            <Typography>Video Name</Typography>
            <FileDownloadOutlinedIcon onClick={(e) => downloadHandler(e)} />
          </div>
          <div className="video-player-container">
            <div className="video-player">
              <ReactPlayer
                controls={true}
                onStart={() => console.log('playing')}
                onDuration={(dur) => console.log(dur)}
                onBufferEnd={() => console.log('buffer ends')}
                onPause={() => {
                  console.log('I have been paused');
                }}
                light={true}
                url="https://revue-video-testing.s3.amazonaws.com/squirrel1.mp4"
              />
            </div>
          </div>
        </div>

        <div className="video-container">
          <div className="video-info-container">
            <Typography>Video Name</Typography>
            <Link
              to="https://revue-video-testing.s3.amazonaws.com/squirrel2.mp4"
              target="_blank"
              download
            >
              <FileDownloadOutlinedIcon />
            </Link>
          </div>
          <div className="video-player-container">
            <div className="video-player">
              <ReactPlayer
                controls={true}
                light={true}
                url="https://revue-video-testing.s3.amazonaws.com/squirrel2.mp4"
              />
            </div>
          </div>
        </div>
        <div className="video-container">
          <div className="video-info-container">
            <Typography>Video Name</Typography>
            <FileDownloadOutlinedIcon onClick={downloadHandler} />
          </div>
          <div className="video-player-container">
            <div className="video-player">
              <ReactPlayer
                controls={true}
                light={true}
                url="https://revue-video-testing.s3.amazonaws.com/squirrel3.mp4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
