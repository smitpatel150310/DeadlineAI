import { useState, useEffect, useRef, useCallback } from 'react';
import { FocusSettings } from './useFocusSettings';

export type SessionType = 'focus' | 'shortBreak' | 'longBreak';

export interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  sessionType: SessionType;
  completedSessions: number;
}

export function useFocusTimer(settings: FocusSettings, onComplete: (type: SessionType, durationMinutes: number) => void) {
  const [sessionType, setSessionType] = useState<SessionType>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const endTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const expectedDurationRef = useRef<number>(settings.focusDuration * 60);

  // Sync initial timeLeft if settings change and timer is not running
  useEffect(() => {
    if (!isRunning && !isPaused) {
      const minutes = sessionType === 'focus' ? settings.focusDuration : sessionType === 'shortBreak' ? settings.shortBreakDuration : settings.longBreakDuration;
      setTimeLeft(minutes * 60);
      expectedDurationRef.current = minutes * 60;
    }
  }, [settings, sessionType, isRunning, isPaused]);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const completeSession = useCallback(() => {
    clearTimerInterval();
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(0);
    
    onComplete(sessionType, expectedDurationRef.current / 60);
  }, [clearTimerInterval, onComplete, sessionType]);

  const tick = useCallback(() => {
    if (!endTimeRef.current) return;
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
    
    if (Number.isNaN(remaining)) return;

    setTimeLeft(remaining);

    if (remaining <= 0) {
      completeSession();
    }
  }, [completeSession]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = window.setInterval(tick, 100);
    } else {
      clearTimerInterval();
    }
    return clearTimerInterval;
  }, [isRunning, isPaused, tick, clearTimerInterval]);

  const startSession = useCallback((type: SessionType) => {
    clearTimerInterval();
    const minutes = type === 'focus' ? settings.focusDuration : type === 'shortBreak' ? settings.shortBreakDuration : settings.longBreakDuration;
    const seconds = minutes * 60;
    
    setSessionType(type);
    setTimeLeft(seconds);
    expectedDurationRef.current = seconds;
    endTimeRef.current = Date.now() + seconds * 1000;
    
    setIsRunning(true);
    setIsPaused(false);
  }, [settings, clearTimerInterval]);

  const togglePause = useCallback(() => {
    if (!isRunning) return;
    if (isPaused) {
      // Resuming
      endTimeRef.current = Date.now() + timeLeft * 1000;
      setIsPaused(false);
    } else {
      // Pausing
      clearTimerInterval();
      setIsPaused(true);
    }
  }, [isRunning, isPaused, timeLeft, clearTimerInterval]);

  const resetTimer = useCallback(() => {
    clearTimerInterval();
    setIsRunning(false);
    setIsPaused(false);
    const minutes = sessionType === 'focus' ? settings.focusDuration : sessionType === 'shortBreak' ? settings.shortBreakDuration : settings.longBreakDuration;
    setTimeLeft(minutes * 60);
    expectedDurationRef.current = minutes * 60;
  }, [settings, sessionType, clearTimerInterval]);

  const incrementCompletedSessions = useCallback(() => {
    setCompletedSessions((prev) => prev + 1);
  }, []);

  return {
    timeLeft,
    isRunning,
    isPaused,
    sessionType,
    completedSessions,
    expectedDurationSeconds: expectedDurationRef.current,
    startSession,
    togglePause,
    resetTimer,
    setSessionType,
    incrementCompletedSessions,
  };
}
