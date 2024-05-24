// components/PlayerControls.js
import { useState } from 'react';
import throttle from 'lodash.throttle';

const PlayerControls = ({ onPlay, onPause, onSpeedChange, currentTimestamp, onSeek, maxIndex }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (event) => {
    const newSpeed = parseFloat(event.target.value);
    setSpeed(newSpeed);
    onSpeedChange(newSpeed);
  };

  const handleSeek = throttle((event) => {
    const newIndex = parseInt(event.target.value);
    onSeek(newIndex);
  }, 200);

  return (
    <div>
      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <label>
        Speed:
        <select value={speed} onChange={handleSpeedChange}>
          <option value="0.25">0.25x</option>
          <option value="0.5">0.5x</option>
          <option value="1">1x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
          <option value="5">5x</option>
        </select>
      </label>
      <div>Current Timestamp: {new Date(currentTimestamp).toLocaleString()}</div>
      <input
        type="range"
        min="0"
        max={maxIndex}
        value={maxIndex ? maxIndex : 0}
        onChange={handleSeek}
      />
    </div>
  );
};

export default PlayerControls;
