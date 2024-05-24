// pages/index.js
'use client'

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import PlayerControls from './components/PlayerControls';
import * as XLSX from "xlsx";

const DynamicMap = dynamic(() => import('./components/Map'), { ssr: false });

const HomePage = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTimestamp, setCurrentTimestamp] = useState(null);
  const [data, setData] = useState([]); 
  const intervalRef = useRef(null);
  const workerRef = useRef(null);

  var name = "../../public/data.xlsx"

  const reader = new FileReader();
  // reader.readAsBinaryString(e.target.files[0])
  reader.onload = (e) => {
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const parsedData = XLSX.utils.sheet_to_json(sheet);
    setData(parsedData)
  }

  useEffect(() => {
    // const inputData = [
    //   { lat: 37.7749, lng: -122.4194, timestamp: 1622548800000 },
    //   { lat: 37.7750, lng: -122.4184, timestamp: 1622548860000 },
    //   { lat: 37.7751, lng: -122.4174, timestamp: 1622548920000 },
    // ];

    {data.length > 0 && (
      inputData = [
        { lat: 37.7749, lng: -122.4194, timestamp: 1622548800000 },
      ]
    )}

    if (window.Worker) {
      workerRef.current = new Worker(new URL('../../public/worker', import.meta.url));
      workerRef.current.onmessage = (e) => {
        if (e.inputData.type === 'processedGPSData') {
          setCoordinates(e.inputData.inputData);
          setCurrentTimestamp(e.inputData.inputData[0].timestamp);
        }
      };
      workerRef.current.postMessage({ type: 'processGPSData', inputData });
    } else {
      setCoordinates(inputData);
      setCurrentTimestamp(inputData[0].timestamp);
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const play = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => {
        if (prevIndex < coordinates.length - 1) {
          setCurrentTimestamp(coordinates[prevIndex + 1].timestamp);
          return prevIndex + 1;
        } else {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return prevIndex;
        }
      });
    }, 1000 / playbackSpeed);
  };

  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (intervalRef.current) {
      pause();
      play();
    }
  };

  const seek = (index) => {
    setCurrentIndex(index);
    setCurrentTimestamp(coordinates[index].timestamp);
    if (intervalRef.current) {
      pause();
      play();
    }
  };

  return (
    <div>
      <h1>GPS Player</h1>
      {coordinates.length > 0 && (
        <>
          <DynamicMap coordinates={coordinates.slice(0, currentIndex + 1)} />
          <PlayerControls
            onPlay={play}
            onPause={pause}
            onSpeedChange={changeSpeed}
            currentTimestamp={currentTimestamp}
            onSeek={seek}
            maxIndex={coordinates.length - 1}
          />
        </>
      )}
    </div>
  );
};

export default HomePage;
