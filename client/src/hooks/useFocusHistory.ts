import { useState, useEffect } from 'react';
import { SessionType } from './useFocusTimer';

export interface FocusSessionRecord {
  id: string;
  type: SessionType;
  startTime: number;
  endTime: number;
  durationMinutes: number;
  completed: boolean;
}

export interface FocusStats {
  todaysFocusMinutes: number;
  todaysCompletedSessions: number;
  weeklySessions: number;
  currentStreak: number;
  bestStreak: number;
  longestSession: number;
}

export function useFocusHistory() {
  const [history, setHistory] = useState<FocusSessionRecord[]>(() => {
    const saved = localStorage.getItem('deadlineai_focus_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [stats, setStats] = useState<FocusStats>(() => {
    const saved = localStorage.getItem('deadlineai_focus_stats');
    return saved ? JSON.parse(saved) : {
      todaysFocusMinutes: 0,
      todaysCompletedSessions: 0,
      weeklySessions: 0,
      currentStreak: 0,
      bestStreak: 0,
      longestSession: 0,
    };
  });

  const [lastActiveDate, setLastActiveDate] = useState<string>(() => {
    return localStorage.getItem('deadlineai_focus_last_date') || new Date().toDateString();
  });

  // Calculate daily resets
  useEffect(() => {
    const today = new Date().toDateString();
    if (today !== lastActiveDate) {
      setStats((prev) => {
        // If yesterday was missed, streak resets to 0 (simplified logic)
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newStreak = lastActiveDate === yesterday ? prev.currentStreak : 0;
        
        return {
          ...prev,
          todaysFocusMinutes: 0,
          todaysCompletedSessions: 0,
          currentStreak: newStreak,
        };
      });
      setLastActiveDate(today);
      localStorage.setItem('deadlineai_focus_last_date', today);
    }
  }, [lastActiveDate]);

  useEffect(() => {
    localStorage.setItem('deadlineai_focus_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('deadlineai_focus_stats', JSON.stringify(stats));
  }, [stats]);

  const addSession = (session: FocusSessionRecord) => {
    setHistory((prev) => {
      const updated = [session, ...prev];
      return updated.slice(0, 20); // Keep last 20
    });

    if (session.completed && session.type === 'focus') {
      setStats((prev) => {
        const newStreak = prev.currentStreak + 1;
        return {
          ...prev,
          todaysFocusMinutes: prev.todaysFocusMinutes + session.durationMinutes,
          todaysCompletedSessions: prev.todaysCompletedSessions + 1,
          weeklySessions: prev.weeklySessions + 1,
          currentStreak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
          longestSession: Math.max(prev.longestSession, session.durationMinutes),
        };
      });
    }
  };

  const calculateProductivityScore = (completedTasks: number) => {
    // 40% Completed focus sessions (max 10 for full score)
    const sessionScore = Math.min((stats.todaysCompletedSessions / 10) * 40, 40);
    // 30% Focused minutes (max 120 for full score)
    const minutesScore = Math.min((stats.todaysFocusMinutes / 120) * 30, 30);
    // 20% Completed tasks (max 5 for full score)
    const taskScore = Math.min((completedTasks / 5) * 20, 20);
    // 10% Current streak (max 5 for full score)
    const streakScore = Math.min((stats.currentStreak / 5) * 10, 10);

    return Math.min(100, Math.max(0, Math.round(sessionScore + minutesScore + taskScore + streakScore)));
  };

  return { history, stats, addSession, calculateProductivityScore };
}
