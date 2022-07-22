import React from 'react';
import ReactPlayer from 'react-player';

const Home = () => {
  return (
    <div>
      <ReactPlayer
        url="revue-hero.mp4"
        playing={true}
        loop={true}
        muted={true}
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default Home;
