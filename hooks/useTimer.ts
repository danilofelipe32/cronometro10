import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialSeconds: number = 0) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const isFinished = totalSeconds <= 0 && isActive;

  // Fix: Replaced `NodeJS.Timeout` with `ReturnType<typeof setInterval>` for browser compatibility.
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds(prev => prev - 1);
      }, 1000);
    } else if (totalSeconds <= 0) {
      setIsActive(false);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, totalSeconds]);
  
  useEffect(() => {
     if (isFinished && intervalRef.current) {
         clearInterval(intervalRef.current);
     }
  }, [isFinished]);

  const start = () => {
    if (totalSeconds > 0) {
      setIsActive(true);
    }
  };

  const pause = () => {
    setIsActive(false);
  };

  const reset = (newSeconds: number) => {
    setIsActive(false);
    setTotalSeconds(newSeconds);
  };

  return { totalSeconds, isActive, isFinished, start, pause, reset };
};
