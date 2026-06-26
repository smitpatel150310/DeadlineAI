import React from 'react';
import { Play, Pause, RotateCcw, SkipForward, Settings } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
  onOpenSettings: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = React.memo(({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
  onOpenSettings
}) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex gap-4 items-center justify-center">
        {!isRunning ? (
          <button 
            onClick={onStart} 
            className="btn-primary w-40 h-14 text-base rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all flex items-center justify-center gap-2"
            aria-label="Start session"
          >
            <Play size={20} fill="currentColor" /> Start
          </button>
        ) : (
          <>
            <button 
              onClick={isPaused ? onResume : onPause} 
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${isPaused ? 'bg-gh-accent-blue text-black shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-105' : 'bg-white/[0.05] text-gh-text border border-white/10 hover:bg-white/10'}`}
              aria-label={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? <Play size={28} fill="currentColor" className="ml-1" /> : <Pause size={28} fill="currentColor" />}
            </button>
            <button 
              onClick={onReset} 
              className="w-14 h-14 rounded-full bg-white/[0.03] text-gh-text border border-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              title="Reset (R)"
              aria-label="Reset timer"
            >
              <RotateCcw size={22} />
            </button>
            <button 
              onClick={onSkip} 
              className="w-14 h-14 rounded-full bg-white/[0.03] text-gh-text border border-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              title="Skip Session (N)"
              aria-label="Skip session"
            >
              <SkipForward size={22} />
            </button>
          </>
        )}
      </div>
      <button 
        onClick={onOpenSettings} 
        className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gh-text-secondary hover:text-white transition-colors flex items-center gap-2 mt-4 px-4 py-2 rounded-full hover:bg-white/[0.03]"
      >
        <Settings size={12} /> Customize Timer
      </button>
    </div>
  );
});

TimerControls.displayName = 'TimerControls';
