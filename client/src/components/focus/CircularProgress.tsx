import React, { useMemo } from 'react';
import { SessionType } from '../../hooks/useFocusTimer';

interface CircularProgressProps {
  timeLeft: number;
  totalSeconds: number;
  sessionType: SessionType;
  isRunning: boolean;
  isPaused: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = React.memo(({
  timeLeft,
  totalSeconds,
  sessionType,
  isRunning,
  isPaused
}) => {
  const strokeDasharray = 283; // 2 * pi * r (r=45)
  const strokeDashoffset = useMemo(() => {
    return strokeDasharray - (timeLeft / totalSeconds) * strokeDasharray;
  }, [timeLeft, totalSeconds]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isFocus = sessionType === 'focus';
  const strokeColor = isFocus ? 'stroke-gh-accent-blue' : 'stroke-gh-accent-purple';
  const dropShadow = isRunning && !isPaused 
    ? (isFocus ? 'drop-shadow-[0_0_20px_rgba(0,229,255,0.4)]' : 'drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]') 
    : '';

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center group">
      <svg className={`absolute inset-0 w-full h-full transform -rotate-90 ${dropShadow} transition-all duration-1000`}>
        <circle cx="50%" cy="50%" r="45%" className="stroke-[#0a0f1c] fill-transparent stroke-[4px]" />
        <circle 
          cx="50%" cy="50%" r="45%" 
          className={`fill-transparent stroke-[6px] transition-all duration-300 ease-linear ${strokeColor}`}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          pathLength={strokeDasharray}
        />
      </svg>
      <div className="z-10 text-center flex flex-col items-center">
        <div className="text-6xl md:text-7xl font-mono font-light tracking-tight text-gh-text drop-shadow-md">
          {formatTime(timeLeft)}
        </div>
        <div className="h-6 mt-2 flex items-center justify-center">
          {!isRunning && timeLeft !== totalSeconds && (
            <span className="text-gh-accent-orange text-[10px] uppercase tracking-widest font-bold animate-pulse">Paused</span>
          )}
          {isRunning && !isPaused && (
            <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
              {Math.round((1 - timeLeft / totalSeconds) * 100)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

CircularProgress.displayName = 'CircularProgress';
