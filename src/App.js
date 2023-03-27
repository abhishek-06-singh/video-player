import React, { useState, useRef } from "react";
import "./App.css";
import "./controls.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBackward,
  faForward,
  faPlay,
  faPause,
  faVolumeUp,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(faBackward, faForward, faPlay, faPause, faVolumeUp, faExpand);

function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [speed, setSpeed] = useState(1);
  const videoRef = useRef(null);

  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragPosition(e.clientX);
  };

  const handleDrag = (e) => {
    if (!isDragging) return;

    const newDragPosition = e.clientX;
    const progressEl = e.target;
    const progressWidth = progressEl.offsetWidth;
    const progressOffsetLeft = progressEl.offsetLeft;

    const progressPercent =
      (newDragPosition - progressOffsetLeft) / progressWidth;
    const newCurrentTime = progressPercent * duration;

    setCurrentTime(newCurrentTime);
    setDragPosition(newDragPosition);
  };

  const handleDragStop = (e) => {
    setIsDragging(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleProgress = () => {
    const { buffered, duration } = videoRef.current;
    if (buffered.length > 0) {
      setLoaded((buffered.end(0) / duration) * 100);
    }
  };

  const handleSkip = (amount) => {
    videoRef.current.currentTime += amount;
  };

  const handleSpeedChange = (value) => {
    setSpeed(value);
    videoRef.current.playbackRate = value;
  };
  return (
    <div>
      <video
        ref={videoRef}
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onProgress={handleProgress}
        playbackRate={speed}
        className="video-player"
      />

      <div className="controls">
        <div className="above">
          <progress
            className="progress"
            value={currentTime}
            max={duration}
            onMouseDown={handleDragStart}
            onMouseMove={handleDrag}
            onMouseUp={handleDragStop}
            // ref={progressRef}
          />
          <span className="time">{currentTime.toFixed(2)}</span>
          <span className="duration">{duration.toFixed(2)}</span>
        </div>
        <div className="bottom">
          <button onClick={() => handleSkip(-10)}>
            <FontAwesomeIcon icon={faBackward} />
          </button>
          <button className="main" onClick={togglePlay}>
            {isPlaying ? (
              <FontAwesomeIcon icon={faPause} />
            ) : (
              <FontAwesomeIcon icon={faPlay} />
            )}
          </button>
          <button onClick={() => handleSkip(10)}>
            <FontAwesomeIcon icon={faForward} />
          </button>
          <span className="loaded">{loaded.toFixed(1)}% </span>
          <input
            className="speed"
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={speed}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
          />
          <button>
            <FontAwesomeIcon icon={faVolumeUp} />
          </button>
          <button>
            <FontAwesomeIcon icon={faExpand} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
