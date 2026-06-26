import React from 'react';
import { PlusCircle, MessageSquare, Trash2 } from 'lucide-react';
import { ChatSession } from '../../types';

interface ChatHistoryPanelProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (session: ChatSession) => void;
  onNewChat: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  loading?: boolean;
  onDeleteSession?: (sessionId: string) => void;
}

export const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({ 
  sessions, 
  activeSessionId, 
  onSelectSession, 
  onNewChat,
  isOpen,
  setIsOpen,
  loading = false,
  onDeleteSession
}) => {
  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (window.confirm("Delete this conversation? This cannot be undone.")) {
      onDeleteSession?.(sessionId);
    }
  };
  return (
    <>
      <div className={`
        fixed inset-y-0 left-0 z-40 md:relative md:z-0
        w-72 bg-[#050814] border-r border-gh-border/60 flex flex-col transition-transform duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.5)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gh-border/50 h-20 flex items-center bg-[#0a0f1c]/50 backdrop-blur-md">
          <button 
            onClick={onNewChat} 
            className="w-full bg-gradient-to-r from-gh-accent-purple/10 to-gh-accent-blue/10 hover:from-gh-accent-purple/20 hover:to-gh-accent-blue/20 text-gh-text border border-gh-accent-purple/30 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:border-gh-accent-purple/50"
          >
            <PlusCircle size={18} className="text-gh-accent-purple" /> New Strategy Session
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-gh-border">
          <div className="text-[11px] font-semibold text-gh-text-tertiary uppercase tracking-wider mb-3 px-2 mt-2">
            Recent Transcripts
          </div>
          
          <div className="space-y-1">
            {loading ? (
              // Skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-11 bg-gh-canvas/50 animate-pulse rounded-lg w-full mb-1" />
              ))
            ) : sessions.length === 0 ? (
              <div className="text-sm text-gh-text-tertiary px-2 py-6 text-center italic opacity-70">
                Awaiting your first query.
              </div>
            ) : (
              sessions.map(s => {
                const isActive = activeSessionId === s.id;
                return (
                  <div key={s.id} className="relative group">
                    <button
                      onClick={() => onSelectSession(s)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-sm transition-all duration-200
                        ${isActive 
                          ? 'bg-gh-accent-purple/10 border border-gh-accent-purple/30 shadow-[inset_0_0_15px_rgba(99,102,241,0.05)]' 
                          : 'border border-transparent hover:bg-[#1e293b]/50 text-gh-text-secondary hover:text-gh-text'}`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <MessageSquare size={16} className={isActive ? 'text-gh-accent-purple' : 'text-gh-text-tertiary'} />
                        <span className="truncate font-medium">{s.title}</span>
                      </div>
                    </button>
                    {onDeleteSession && (
                      <button 
                        onClick={(e) => handleDelete(e, s.id)}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all duration-200 
                          ${isActive ? 'opacity-100 text-gh-text-secondary hover:text-gh-accent-red hover:bg-red-900/20' : 'opacity-0 group-hover:opacity-100 text-gh-text-tertiary hover:text-gh-accent-red hover:bg-red-900/20'}
                        `}
                        title="Delete chat"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-30 md:hidden backdrop-blur-sm transition-opacity duration-300" 
          onClick={() => setIsOpen(false)} 
        />
      )}
    </>
  );
};
