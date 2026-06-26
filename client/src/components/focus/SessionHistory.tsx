import React from 'react';
import { FocusSessionRecord } from '../../hooks/useFocusHistory';
import { format } from 'date-fns';

interface SessionHistoryProps {
  history: FocusSessionRecord[];
}

export const SessionHistory: React.FC<SessionHistoryProps> = React.memo(({ history }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full mt-8 card bg-[#080b12]/80 backdrop-blur-2xl border-gh-border/50 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-gh-text-secondary mb-4 border-b border-gh-border/50 pb-2">Recent Sessions</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
        {history.map((record) => (
          <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.02] hover:bg-white/[0.04] transition-colors text-sm">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${record.type === 'focus' ? 'bg-gh-accent-blue shadow-[0_0_8px_rgba(0,229,255,0.8)]' : 'bg-gh-accent-purple shadow-[0_0_8px_rgba(168,85,247,0.8)]'}`} />
              <span className="text-white capitalize font-medium">{record.type.replace('Break', ' Break')}</span>
            </div>
            <div className="flex items-center gap-6 text-white/50 text-xs font-mono">
              <span>{format(record.startTime, 'HH:mm')} - {format(record.endTime, 'HH:mm')}</span>
              <span className="w-12 text-right">{record.durationMinutes} min</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

SessionHistory.displayName = 'SessionHistory';
