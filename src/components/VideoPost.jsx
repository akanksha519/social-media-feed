import React, { useRef, useEffect } from "react";

const VideoPost = ({ src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const handlePlayPause = () => {
      const rect = videoRef.current.getBoundingClientRect();
      const fullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

      if (fullyVisible) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    };

    window.addEventListener("scroll", handlePlayPause);
    return () => window.removeEventListener("scroll", handlePlayPause);
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      controls
      muted
      className="w-full rounded"
    ></video>
  );
};

export default VideoPost;
