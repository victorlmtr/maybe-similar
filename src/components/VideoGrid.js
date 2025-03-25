import React from "react";
import YouTube from "react-youtube";

const VideoGrid = ({ video1, video2 }) => {
  const getPlayerOptions = (video) => ({
    playerVars: {
      start: video.start,
      end: video.end,
      autoplay: 0,
    },
  });

  return (
    <div className="container mt-4">
      <div className="row">
        {/* First Video */}
        <div className="col-md-6">
          <YouTube videoId={video1.id} opts={getPlayerOptions(video1)} />
        </div>
        {/* Second Video */}
        <div className="col-md-6">
          <YouTube videoId={video2.id} opts={getPlayerOptions(video2)} />
        </div>
      </div>
    </div>
  );
};

export default VideoGrid;
