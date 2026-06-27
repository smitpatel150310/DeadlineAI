import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Sparkles, Plus, CheckCircle2, AlertCircle, Clock, LayoutDashboard } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { api } from '../lib/api';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { Task } from '../types';

export default function Dashboard() {
  const { profile } = useAuth();
  const { tasks, loading, createTask, updateTask, completeTask, archiveTask, deleteTask } = useTasks();
  
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [aiNextAction, setAiNextAction] = useState<string | null>(null);
  const [aiPlan, setAiPlan] = useState<string | null>(null);
  const [isGeneratingNext, setIsGeneratingNext] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const activeTasks = useMemo(() => tasks.filter(t => t.status === 'active'), [tasks]);
  const overdueTasks = useMemo(() => activeTasks.filter(t => t.due_date && new Date(t.due_date) < new Date()), [activeTasks]);
  const completedTasks = useMemo(() => tasks.filter(t => t.status === 'completed'), [tasks]);
  
  // Tasks due within 48h
  const urgentTasks = useMemo(() => activeTasks.filter(t => {
    if (!t.due_date) return false;
    const timeDiff = new Date(t.due_date).getTime() - new Date().getTime();
    return timeDiff < 48 * 60 * 60 * 1000;
  }).sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()), [activeTasks]);

  const upcomingDeadlines = useMemo(() => [...activeTasks].sort((a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  }).slice(0, 5), [activeTasks]);

  if (loading) {
    return <div className="p-8 flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gh-accent-blue"></div></div>;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleNextAction = async () => {
    if (activeTasks.length === 0) return toast('No active tasks to prioritize!', { icon: '✨' });
    setIsGeneratingNext(true);
    try {
      const { response } = await api.nextAction(activeTasks);
      setAiNextAction(response);
    } catch (err) {
      toast.error('Failed to get suggestion');
    } finally {
      setIsGeneratingNext(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (activeTasks.length === 0) return toast('No active tasks to plan!', { icon: '✨' });
    setIsGeneratingPlan(true);
    try {
      const { response } = await api.plan(activeTasks);
      setAiPlan(response);
    } catch (err) {
      toast.error('Failed to generate plan');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gh-text flex items-center gap-2">
            {getGreeting()}, {profile?.full_name || 'there'}!
          </h1>
          <p className="text-gh-text-secondary">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
        </div>
        <button onClick={() => { setEditingTask(undefined); setIsTaskFormOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Task
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        
        {/* Active Card */}
        <div className="card bg-[#080b12]/80 backdrop-blur-2xl border-gh-border/50 flex flex-col justify-center items-center py-8 relative overflow-hidden group shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(0,229,255,0.15)] hover:border-gh-accent-blue/40 transition-all duration-300 cursor-pointer active:scale-[0.98] active:brightness-110">
          <div className="absolute inset-0 bg-gradient-to-br from-gh-accent-blue/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(0,229,255,0.15)] relative z-10 tracking-tighter group-hover:text-white transition-colors">{activeTasks.length}</span>
          <span className="text-[11px] uppercase tracking-widest font-semibold text-gh-text-secondary mt-3 flex items-center gap-2 relative z-10 group-hover:text-gh-text transition-colors">
            <LayoutDashboard size={14} className="text-gh-accent-blue group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] transition-all"/> Active
          </span>
        </div>

        {/* Overdue Card */}
        <div className={`card flex flex-col justify-center items-center py-8 relative overflow-hidden group shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(239,68,68,0.15)] transition-all duration-300 cursor-pointer active:scale-[0.98] active:brightness-110 ${overdueTasks.length > 0 ? 'bg-gradient-to-br from-[#1a0505]/90 to-[#080b12]/90 border-gh-accent-red/30 hover:border-gh-accent-red/60' : 'bg-[#080b12]/80 border-gh-border/50 hover:border-gh-accent-red/40'} backdrop-blur-2xl`}>
          <div className={`absolute inset-0 bg-gradient-to-br from-gh-accent-red/20 to-transparent pointer-events-none transition-opacity duration-300 ${overdueTasks.length > 0 ? 'opacity-40 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
          <span className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(239,68,68,0.3)] relative z-10 tracking-tighter group-hover:text-white transition-colors">{overdueTasks.length}</span>
          <span className="text-[11px] uppercase tracking-widest font-semibold text-gh-text-secondary mt-3 flex items-center gap-2 relative z-10 group-hover:text-gh-text transition-colors">
            <AlertCircle size={14} className="text-gh-accent-red group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-all"/> Overdue
          </span>
        </div>

        {/* Urgent Card */}
        <div className="card bg-[#080b12]/80 backdrop-blur-2xl border-gh-border/50 flex flex-col justify-center items-center py-8 relative overflow-hidden group shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(249,115,22,0.15)] hover:border-gh-accent-orange/40 transition-all duration-300 cursor-pointer active:scale-[0.98] active:brightness-110">
          <div className="absolute inset-0 bg-gradient-to-br from-gh-accent-orange/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(249,115,22,0.15)] relative z-10 tracking-tighter group-hover:text-white transition-colors">{urgentTasks.length}</span>
          <span className="text-[11px] uppercase tracking-widest font-semibold text-gh-text-secondary mt-3 flex items-center gap-2 relative z-10 group-hover:text-gh-text transition-colors">
            <Clock size={14} className="text-gh-accent-orange group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] transition-all"/> Urgent
          </span>
        </div>

        {/* Completed Card */}
        <div className="card bg-[#080b12]/80 backdrop-blur-2xl border-gh-border/50 flex flex-col justify-center items-center py-8 relative overflow-hidden group shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(16,185,129,0.15)] hover:border-gh-accent-green/40 transition-all duration-300 cursor-pointer active:scale-[0.98] active:brightness-110">
          <div className="absolute inset-0 bg-gradient-to-br from-gh-accent-green/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(16,185,129,0.15)] relative z-10 tracking-tighter group-hover:text-white transition-colors">{completedTasks.length}</span>
          <span className="text-[11px] uppercase tracking-widest font-semibold text-gh-text-secondary mt-3 flex items-center gap-2 relative z-10 group-hover:text-gh-text transition-colors">
            <CheckCircle2 size={14} className="text-gh-accent-green group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all"/> Completed
          </span>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2"><Sparkles className="text-gh-accent-purple" size={20}/> Next Best Action</h2>
              <button onClick={handleNextAction} disabled={isGeneratingNext} className="btn-secondary text-sm py-1 px-3">
                {isGeneratingNext ? 'Thinking...' : 'Ask AI'}
              </button>
            </div>
            {aiNextAction ? (
              <div className="card border-gh-accent-purple/40 bg-gradient-to-br from-gh-accent-purple/10 to-transparent p-6 prose prose-invert max-w-none shadow-[0_0_20px_rgba(99,102,241,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gh-accent-purple/20 blur-[50px] pointer-events-none" />
                <div className="relative z-10"><ReactMarkdown>{aiNextAction}</ReactMarkdown></div>
              </div>
            ) : (
              <div className="card p-10 text-center text-gh-text-secondary border-dashed border-gh-border/60 bg-gh-canvas/20">
                {activeTasks.length > 0 ? (
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-full bg-gh-accent-purple/10 flex items-center justify-center mb-4">
                      <Sparkles className="text-gh-accent-purple w-6 h-6" />
                    </div>
                    <p className="mb-6 text-sm">Not sure what to do next? Let the Copilot analyze your deadlines and priorities.</p>
                    <button onClick={handleNextAction} className="btn-primary inline-flex items-center gap-2"><Sparkles size={16}/> Suggest Action</button>
                  </div>
                ) : (
                  <p>You have no active tasks. Take a break or add a new task!</p>
                )}
              </div>
            )}
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2"><Clock className="text-gh-accent-orange" size={20}/> Urgent Tasks</h2>
              <Link to="/tasks" className="text-sm text-gh-accent-blue hover:underline">View all</Link>
            </div>
            <div className="space-y-4">
              {urgentTasks.length > 0 ? (
                urgentTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onEdit={(t) => { setEditingTask(t); setIsTaskFormOpen(true); }}
                    onComplete={completeTask}
                    onArchive={archiveTask}
                    onDelete={deleteTask}
                  />
                ))
              ) : (
                <div className="card p-6 text-center text-gh-text-secondary">
                  No urgent tasks in the next 48 hours.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Today's Plan</h2>
              <button onClick={handleGeneratePlan} disabled={isGeneratingPlan} className="text-gh-accent-purple hover:text-gh-text transition-colors p-1" title="Generate AI Plan">
                <Sparkles size={18} />
              </button>
            </div>
            {aiPlan ? (
              <div className="card bg-gh-canvas/60 border-gh-accent-blue/30 p-6 prose prose-invert prose-sm max-w-none shadow-[0_0_15px_rgba(6,182,212,0.1)] overflow-y-auto overflow-x-hidden max-h-[500px] break-words">
                <ReactMarkdown>{aiPlan}</ReactMarkdown>
              </div>
            ) : (
              <div className="card p-8 text-center text-gh-text-secondary text-sm border-dashed border-gh-border/60 bg-gh-canvas/20">
                <p className="mb-4">Generate an optimal schedule based on your current tasks.</p>
                <button onClick={handleGeneratePlan} className="btn-secondary w-full text-sm">Generate Schedule</button>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Upcoming</h2>
            <div className="card p-0 overflow-hidden">
              {upcomingDeadlines.length > 0 ? (
                <div className="divide-y divide-gh-border">
                  {upcomingDeadlines.map(task => (
                    <div key={task.id} className="p-3 flex justify-between items-center hover:bg-gh-btn-bg transition-colors cursor-pointer" onClick={() => { setEditingTask(task); setIsTaskFormOpen(true); }}>
                      <div className="truncate pr-4">
                        <p className="font-medium text-sm text-gh-text truncate">{task.title}</p>
                        <p className="text-xs text-gh-text-tertiary mt-0.5">{task.due_date ? format(new Date(task.due_date), 'MMM d, h:mm a') : 'No deadline'}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.priority === 'critical' ? 'bg-red-500' : task.priority === 'high' ? 'bg-orange-500' : task.priority === 'medium' ? 'bg-blue-500' : 'bg-gray-500'}`} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gh-text-secondary text-sm">No upcoming deadlines.</div>
              )}
            </div>
          </section>
        </div>
      </div>

      {isTaskFormOpen && (
        <TaskForm 
          task={editingTask}
          onClose={() => { setIsTaskFormOpen(false); setEditingTask(undefined); }}
          onSave={async (data) => {
            if (editingTask) {
              await updateTask(editingTask.id, data);
            } else {
              await createTask(data);
            }
            setIsTaskFormOpen(false);
            setEditingTask(undefined);
          }}
        />
      )}
    </div>
  );
}
