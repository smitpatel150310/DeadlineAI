import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';
import { useAuth } from '../hooks/useAuth';

import { useFocusSettings } from '../hooks/useFocusSettings';
import { useFocusTimer, SessionType } from '../hooks/useFocusTimer';
import { useFocusHistory } from '../hooks/useFocusHistory';

import { CircularProgress } from '../components/focus/CircularProgress';
import { TimerControls } from '../components/focus/TimerControls';
import { FocusSettingsModal } from '../components/focus/FocusSettingsModal';
import { StatisticsBoard } from '../components/focus/StatisticsBoard';
import { SessionHistory } from '../components/focus/SessionHistory';
import { CheckCircle2, Coffee } from 'lucide-react';

export default function Focus() {
  const { profile } = useAuth();
  const { tasks, loading, updateTask, completeTask } = useTasks();
  const activeTasks = tasks.filter((t) => t.status === 'active');
  const completedTasksCount = tasks.filter((t) => t.status === 'completed' && new Date(t.updated_at!).toDateString() === new Date().toDateString()).length;

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [progressInput, setProgressInput] = useState<string>('0');
  const [showCompletionOpts, setShowCompletionOpts] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { settings, effectiveSettings, updateSettings } = useFocusSettings();
  const { history, stats, addSession, calculateProductivityScore } = useFocusHistory();

  const [taskFocusDuration, setTaskFocusDuration] = useState<number | null>(null);

  // When a new task is selected, default to its estimated duration if available
  useEffect(() => {
    if (selectedTask?.estimated_minutes) {
      setTaskFocusDuration(selectedTask.estimated_minutes);
    } else {
      setTaskFocusDuration(null);
    }
  }, [selectedTask]);

  const currentSettings = {
    ...effectiveSettings,
    focusDuration: taskFocusDuration ?? effectiveSettings.focusDuration
  };

  const playAudioNotification = useCallback(() => {
    if (!effectiveSettings.soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 1);
    } catch (e) {
      // Audio fallback
    }

    if (Notification.permission === 'granted') {
      new Notification('Timer Complete!', {
        body: 'Your session has finished!',
      });
    }
  }, [effectiveSettings.soundEnabled]);

  const {
    timeLeft,
    isRunning,
    isPaused,
    sessionType,
    completedSessions,
    expectedDurationSeconds,
    startSession,
    togglePause,
    resetTimer,
    setSessionType,
    incrementCompletedSessions,
  } = useFocusTimer(currentSettings, (completedType: SessionType, durationMinutes: number) => {
    playAudioNotification();

    addSession({
      id: Date.now().toString(),
      type: completedType,
      startTime: Date.now() - durationMinutes * 60000,
      endTime: Date.now(),
      durationMinutes,
      completed: true,
    });

    if (completedType === 'focus') {
      incrementCompletedSessions();
      setShowCompletionOpts(true);
    } else {
      const nextType = 'focus';
      if (effectiveSettings.autoStartNext) {
        startSession(nextType);
      } else {
        setSessionType(nextType);
      }
    }
  });

  const getNextBreakType = useCallback((): SessionType => {
    return (completedSessions + 1) % currentSettings.sessionsUntilLongBreak === 0
      ? 'longBreak'
      : 'shortBreak';
  }, [completedSessions, currentSettings.sessionsUntilLongBreak]);

  const handleSkip = useCallback(() => {
    if (sessionType === 'focus') {
      const nextBreak = getNextBreakType();
      if (currentSettings.autoStartNext) {
        startSession(nextBreak);
      } else {
        resetTimer();
        setSessionType(nextBreak);
      }
    } else {
      if (currentSettings.autoStartNext) {
        startSession('focus');
      } else {
        resetTimer();
        setSessionType('focus');
      }
    }
  }, [sessionType, getNextBreakType, currentSettings.autoStartNext, startSession, resetTimer, setSessionType]);

  const handleStart = () => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    startSession(sessionType);
  };

  // Track active session globally for Sidebar logo navigation protection
  useEffect(() => {
    (window as any).__hasActiveSession = isRunning && !isPaused;
    return () => {
      (window as any).__hasActiveSession = false;
    };
  }, [isRunning, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Escape' && isSettingsOpen) {
        setIsSettingsOpen(false);
        return;
      }

      if (isSettingsOpen || showCompletionOpts || !selectedTask) return;

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          if (!isRunning) handleStart();
          else togglePause();
          break;
        case 'r':
          resetTimer();
          break;
        case 'n':
          handleSkip();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, isSettingsOpen, showCompletionOpts, selectedTask, handleStart, togglePause, resetTimer, handleSkip]);

  const handleUpdateProgress = async () => {
    if (!selectedTask) return;
    const p = parseInt(progressInput, 10);
    if (!isNaN(p)) {
      await updateTask(selectedTask.id, { progress: p });
      toast.success(`Progress updated to ${p}%`);
      setSelectedTask({ ...selectedTask, progress: p });
    }
  };

  const handleCompleteTask = async () => {
    if (!selectedTask) return;
    await completeTask(selectedTask.id);
    toast.success('Task completed!');
    setSelectedTask(null);
    setShowCompletionOpts(false);
    resetTimer();
    setSessionType(getNextBreakType());
  };

  const proceedToBreak = () => {
    setShowCompletionOpts(false);
    const breakType = getNextBreakType();
    if (currentSettings.autoStartNext) {
      startSession(breakType);
    } else {
      resetTimer();
      setSessionType(breakType);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gh-accent-blue"></div></div>;

  if (!selectedTask) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto flex flex-col h-full animate-in fade-in">
        <h1 className="text-3xl font-extrabold tracking-tight text-gh-text mb-2">Focus Session</h1>
        <p className="text-gh-text-secondary mb-8 text-sm">Select a task to begin deep work.</p>
        
        <div className="card p-6 flex-1">
          {activeTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {activeTasks.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => { setSelectedTask(task); setProgressInput(task.progress.toString()); }}
                  className="p-5 border border-gh-border/50 rounded-xl hover:border-gh-accent-blue/50 cursor-pointer transition-all bg-[#0a0f1c]/50 hover:bg-[#0f172a]/80 group shadow-sm hover:shadow-[0_0_20px_rgba(0,229,255,0.1)]"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') { setSelectedTask(task); setProgressInput(task.progress.toString()); } }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gh-text group-hover:text-gh-accent-blue transition-colors leading-tight">{task.title}</h3>
                    <div className={`w-2.5 h-2.5 mt-1 rounded-full flex-shrink-0 ${task.priority === 'critical' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : task.priority === 'high' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : task.priority === 'medium' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-gray-500'}`} />
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-3">
                    <div className="bg-white/20 h-full rounded-full" style={{ width: `${task.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 flex flex-col items-center">
              <CheckCircle2 size={48} className="text-gh-accent-green/50 mb-4" />
              <p className="text-gh-text-secondary text-lg">No active tasks available. Great job!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const sessionLabel = sessionType === 'focus' ? 'Focus' : sessionType === 'shortBreak' ? 'Short Break' : 'Long Break';

  return (
    <div className={`p-4 md:p-8 flex flex-col h-full pb-24 md:pb-8 transition-colors duration-1000 ${isRunning && !isPaused ? 'bg-[#030509] relative overflow-hidden' : 'bg-transparent relative overflow-hidden'}`}>
      
      {/* Cinematic background glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] pointer-events-none transition-all duration-1000 ${isRunning && !isPaused ? (sessionType === 'focus' ? 'bg-gh-accent-blue/10 scale-110' : 'bg-gh-accent-purple/10 scale-110') : 'bg-transparent scale-100'}`} />

      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col items-center justify-center relative z-10">
        
        {/* Header */}
        <div className="absolute top-0 left-0 w-full flex justify-between items-center">
          <button 
            onClick={() => { resetTimer(); setSelectedTask(null); }}
            className="text-gh-text-secondary hover:text-white transition-colors text-sm font-medium flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            ← Change Task
          </button>
          <div className="flex flex-col items-end">
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-gh-text-tertiary">
              {sessionLabel} Session
            </span>
            <span className="text-[10px] text-white/30 tracking-widest mt-0.5">
              Cycle {completedSessions % currentSettings.sessionsUntilLongBreak + 1}/{currentSettings.sessionsUntilLongBreak}
            </span>
          </div>
        </div>

        {/* Selected Task Info */}
        <div className="text-center mb-10 mt-16 w-full max-w-2xl px-4 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight drop-shadow-sm">{selectedTask.title}</h2>
          {selectedTask.description && (
            <p className="text-white/50 line-clamp-2 text-sm leading-relaxed mb-4">{selectedTask.description}</p>
          )}
          
          {!isRunning && sessionType === 'focus' && (
            <div className="flex items-center justify-center gap-3 mt-4 animate-in fade-in zoom-in duration-300">
              <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Custom Timer</span>
              <input
                type="number"
                min="1"
                max="180"
                value={taskFocusDuration ?? effectiveSettings.focusDuration}
                onChange={(e) => setTaskFocusDuration(parseInt(e.target.value) || 25)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white text-sm w-20 text-center focus:outline-none focus:border-gh-accent-blue/50 transition-colors"
                title="Custom duration for this task"
              />
              <span className="text-xs text-white/30">min</span>
            </div>
          )}
        </div>

        {/* Circular Timer & Controls */}
        <div className="flex flex-col items-center w-full animate-in zoom-in-95 duration-500">
          <div className="mb-10">
            <CircularProgress 
              timeLeft={timeLeft} 
              totalSeconds={expectedDurationSeconds} 
              sessionType={sessionType} 
              isRunning={isRunning} 
              isPaused={isPaused} 
            />
          </div>

          <TimerControls 
            isRunning={isRunning}
            isPaused={isPaused}
            onStart={handleStart}
            onPause={togglePause}
            onResume={togglePause}
            onReset={resetTimer}
            onSkip={handleSkip}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </div>

        {/* Statistics Board */}
        {!isRunning && (
          <div className="w-full">
            <StatisticsBoard stats={stats} productivityScore={calculateProductivityScore(completedTasksCount)} />
            <SessionHistory history={history} />
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <FocusSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={updateSettings}
      />

      {/* Post-Session Modal */}
      {showCompletionOpts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#02040a]/80 backdrop-blur-md" onClick={proceedToBreak} />
          <div className="card w-full max-w-sm flex flex-col p-8 animate-in zoom-in-95 border-gh-border shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative z-10">
            <div className="w-16 h-16 bg-gh-accent-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gh-accent-blue/20">
              <CheckCircle2 size={32} className="text-gh-accent-blue" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-center text-white">Focus Complete!</h3>
            <p className="text-white/50 text-center mb-8 text-sm">Great deep work. How much progress did you make?</p>
            
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-white/70 font-medium">Progress</span>
                <span className="font-mono text-gh-accent-blue font-bold">{progressInput}%</span>
              </div>
              <input
                type="range" min="0" max="100" step="5"
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gh-accent-blue"
                value={progressInput}
                onChange={(e) => setProgressInput(e.target.value)}
              />
              <button onClick={handleUpdateProgress} className="btn-secondary w-full mt-4 py-2.5 text-xs">
                Save Progress
              </button>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              <button onClick={handleCompleteTask} className="w-full py-3 rounded-xl bg-gh-accent-blue text-black hover:bg-white flex justify-center items-center gap-2 font-bold tracking-widest text-[11px] uppercase transition-colors shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                <CheckCircle2 size={16} /> Mark Completed
              </button>
              <button onClick={proceedToBreak} className="w-full py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white flex justify-center items-center gap-2 font-bold tracking-widest text-[11px] uppercase transition-colors">
                <Coffee size={16} /> Continue to Break
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
