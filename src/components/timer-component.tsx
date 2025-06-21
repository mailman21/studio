'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

type TimerProps = {
  time: number;
  setTime: (time: number | ((prevTime: number) => number)) => void;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
};

export function TimerComponent({ time, setTime, isRunning, setIsRunning }: TimerProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, setTime]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="text-4xl font-mono font-bold text-foreground">
          {formatTime(time)}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleStartPause} size="icon" variant="outline" aria-label={isRunning ? 'Pause timer' : 'Start timer'}>
            {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button onClick={handleReset} size="icon" variant="outline" aria-label="Reset timer">
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
