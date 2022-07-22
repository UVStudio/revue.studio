import React from 'react';
import ReactPlayer from 'react-player';

const Project = () => {
  return (
    <div className="App">
      <div className="section">
        <div className="video-player-container">
          <div className="video-player">
            <ReactPlayer
              controls={true}
              width="100%"
              url="https://revue-video-testing.s3.amazonaws.com/squirrel1.mp4"
            />
          </div>
        </div>
        <div className="video-player-container">
          <div className="video-player">
            <ReactPlayer
              controls={true}
              width="100%"
              url="https://revue-video-testing.s3.amazonaws.com/squirrel2.mp4"
            />
          </div>
        </div>
        <div className="video-player-container">
          <div className="video-player">
            <ReactPlayer
              controls={true}
              width="100%"
              url="https://revue-video-testing.s3.amazonaws.com/squirrel3.mp4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
