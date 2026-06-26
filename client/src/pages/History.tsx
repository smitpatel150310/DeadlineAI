import React, { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Archive, CheckCircle2, MessageSquare, Activity, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { supabase } from '../lib/supabase';
import { ChatSession, ActivityLog } from '../types';

type Tab = 'completed' | 'archived' | 'plans' | 'activity';

export default function History() {
  const { user } = useAuth();
  const { tasks, updateTask, loading: tasksLoading } = useTasks();
  
  const [activeTab, setActiveTab] = useState<Tab>('completed');
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loadingExtras, setLoadingExtras] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchExtras = async () => {
      setLoadingExtras(true);
      try {
        const [sessionsRes, logsRes] = await Promise.all([
          supabase.from('chat_sessions').select('*').eq('user_id', user.id).order('updated_at', { ascending: false }),
          supabase.from('activity_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(100)
        ]);
        
        if (sessionsRes.data) setSessions(sessionsRes.data);
        if (logsRes.data) setActivityLogs(logsRes.data);
      } catch (err) {
        toast.error('Failed to load history');
      } finally {
        setLoadingExtras(false);
      }
    };
    
    fetchExtras();
  }, [user]);

  const completedTasks = tasks.filter(t => t.status === 'completed').sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  const archivedTasks = tasks.filter(t => t.status === 'archived').sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  const handleUnarchive = async (id: string) => {
    try {
      await updateTask(id, { status: 'active' });
      toast.success('Task unarchived');
    } catch (e) {
      toast.error('Failed to unarchive');
    }
  };

  const getActivityIcon = (action: string) => {
    if (action.includes('create')) return <PlusIcon className="text-gh-accent-blue" />;
    if (action.includes('complet')) return <CheckCircle2 className="text-gh-accent-green" />;
    if (action.includes('archiv')) return <Archive className="text-gh-accent-orange" />;
    if (action.includes('delet')) return <div className="text-gh-accent-red">×</div>;
    return <Activity className="text-gh-text-secondary" />;
  };

  const PlusIcon = (props: any) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

  if (tasksLoading || loadingExtras) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gh-accent-blue"></div></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-gh-text mb-6">History</h1>

      <div className="flex gap-2 overflow-x-auto border-b border-gh-border/50 mb-8 hide-scrollbar">
        {[
          { id: 'completed', label: 'Completed Tasks', icon: <CheckCircle2 size={16} /> },
          { id: 'archived', label: 'Archived Tasks', icon: <Archive size={16} /> },
          { id: 'plans', label: 'AI Plans', icon: <MessageSquare size={16} /> },
          { id: 'activity', label: 'Activity Log', icon: <Activity size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-gh-accent-blue text-gh-text font-bold tracking-widest uppercase text-[11px] bg-gh-accent-blue/10 rounded-t-xl shadow-[inset_0_-20px_40px_rgba(0,229,255,0.05)]' : 'border-transparent text-gh-text-secondary hover:text-gh-text hover:bg-[#0a0f1c]/50 rounded-t-xl tracking-widest uppercase text-[11px] font-semibold'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-gh-bg">
        {activeTab === 'completed' && (
          <div className="space-y-3">
            {completedTasks.length > 0 ? completedTasks.map(task => (
              <div key={task.id} className="card flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity">
                <div>
                  <h3 className="font-medium text-gh-text line-through">{task.title}</h3>
                  <div className="flex gap-2 text-xs text-gh-text-secondary mt-1">
                    <span className="px-2 rounded-full bg-gh-bg border border-gh-border">{task.category}</span>
                    <span>Completed {formatDistanceToNow(new Date(task.updated_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            )) : <p className="text-center p-8 text-gh-text-secondary">No completed tasks yet.</p>}
          </div>
        )}

        {activeTab === 'archived' && (
          <div className="space-y-3">
            {archivedTasks.length > 0 ? archivedTasks.map(task => (
              <div key={task.id} className="card flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gh-text">{task.title}</h3>
                  <div className="flex gap-2 text-xs text-gh-text-secondary mt-1">
                    <span className="px-2 rounded-full bg-gh-bg border border-gh-border">{task.category}</span>
                    <span>Archived {formatDistanceToNow(new Date(task.updated_at), { addSuffix: true })}</span>
                  </div>
                </div>
                <button onClick={() => handleUnarchive(task.id)} className="btn-secondary py-1 px-3 text-xs flex items-center gap-1">
                  <RotateCcw size={14} /> Unarchive
                </button>
              </div>
            )) : <p className="text-center p-8 text-gh-text-secondary">No archived tasks.</p>}
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-3">
            {sessions.length > 0 ? sessions.map(session => (
              <div key={session.id} className="card">
                <h3 className="font-medium text-gh-text mb-1">{session.title}</h3>
                <p className="text-xs text-gh-text-secondary">
                  Updated {formatDistanceToNow(new Date(session.updated_at), { addSuffix: true })}
                </p>
              </div>
            )) : <p className="text-center p-8 text-gh-text-secondary">No AI chat sessions found.</p>}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="relative pl-4 ml-4 border-l border-gh-border space-y-6 py-4">
            {activityLogs.length > 0 ? activityLogs.map((log, i) => (
              <div key={log.id} className="relative">
                <div className="absolute -left-[30px] top-1 bg-gh-bg p-0.5 rounded-full border border-gh-border shadow-sm">
                  <div className="w-6 h-6 flex items-center justify-center">
                    {getActivityIcon(log.action.toLowerCase())}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gh-text">
                    <span className="font-medium capitalize">{log.action.replace(/_/g, ' ')}</span>
                    {log.metadata && (log.metadata as any).title && ` - "${(log.metadata as any).title}"`}
                  </p>
                  <p className="text-xs text-gh-text-tertiary mt-0.5">
                    {format(new Date(log.created_at), 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>
            )) : <p className="text-center p-8 text-gh-text-secondary">No activity recorded yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
