import React, { useState, useMemo } from 'react';
import { Plus, Search, Sparkles, Filter, ArrowUpDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

import { useTasks } from '../hooks/useTasks';
import { api } from '../lib/api';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { Task, TaskStatus } from '../types';

export default function Tasks() {
  const { tasks, loading, createTask, updateTask, completeTask, archiveTask, deleteTask } = useTasks();
  
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'created' | 'title'>('deadline');
  
  const [aiPriorities, setAiPriorities] = useState<string | null>(null);
  const [isPrioritizing, setIsPrioritizing] = useState(false);

  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks;

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'deadline') {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      if (sortBy === 'priority') {
        const pValues = { critical: 4, high: 3, medium: 2, low: 1 };
        return pValues[b.priority] - pValues[a.priority];
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      // default 'created'
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return result;
  }, [tasks, statusFilter, searchQuery, sortBy]);

  const handlePrioritize = async () => {
    const activeTasks = tasks.filter(t => t.status === 'active');
    if (activeTasks.length === 0) return toast('No active tasks to prioritize!');
    
    setIsPrioritizing(true);
    try {
      const { response } = await api.prioritize(activeTasks);
      setAiPriorities(response);
      toast.success('Tasks prioritized by AI');
    } catch (err) {
      toast.error('Failed to prioritize tasks');
    } finally {
      setIsPrioritizing(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gh-text flex items-center gap-2">Tasks</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={handlePrioritize} disabled={isPrioritizing} className="btn-secondary flex-1 md:flex-none flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-gh-accent-purple" />
            {isPrioritizing ? 'Thinking...' : 'AI Prioritize'}
          </button>
          <button onClick={() => { setEditingTask(undefined); setIsTaskFormOpen(true); }} className="btn-primary flex-1 md:flex-none flex items-center justify-center gap-2">
            <Plus size={18} /> Add Task
          </button>
        </div>
      </div>

      {aiPriorities && (
        <div className="card mb-8 border border-gh-accent-purple/30 bg-[#080b12]/80 backdrop-blur-xl relative shadow-[0_10px_30px_rgba(124,58,237,0.15)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gh-accent-purple/10 to-transparent pointer-events-none" />
          <button onClick={() => setAiPriorities(null)} className="absolute top-4 right-4 text-gh-text-tertiary hover:text-gh-text p-1 z-10 transition-colors">×</button>
          <h3 className="font-bold mb-3 flex items-center gap-2 text-gh-accent-purple relative z-10 tracking-wide uppercase text-sm"><Sparkles size={16}/> Strategic Prioritization</h3>
          <div className="prose prose-invert prose-sm max-w-none relative z-10 text-gh-text/90">
            <ReactMarkdown>{aiPriorities}</ReactMarkdown>
          </div>
        </div>
      )}

      <div className="card mb-8 p-3 flex flex-col md:flex-row gap-3 bg-[#080b12]/80 backdrop-blur-2xl border-gh-border/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gh-accent-blue/5 to-transparent pointer-events-none" />
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gh-text-tertiary" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="input-field pl-9 py-1.5"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <Filter size={16} className="text-gh-text-tertiary" />
            <select className="input-field py-1.5 text-sm w-32" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown size={16} className="text-gh-text-tertiary" />
            <select className="input-field py-1.5 text-sm w-36" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
              <option value="deadline">Sort: Deadline</option>
              <option value="priority">Sort: Priority</option>
              <option value="created">Sort: Created</option>
              <option value="title">Sort: Title</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        {loading ? (
          <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gh-accent-blue"></div></div>
        ) : filteredAndSortedTasks.length > 0 ? (
          <div className="space-y-3">
            {filteredAndSortedTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={(t) => { setEditingTask(t); setIsTaskFormOpen(true); }}
                onComplete={completeTask}
                onArchive={archiveTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center text-gh-text-secondary border-dashed flex flex-col items-center">
            <div className="bg-gh-bg p-4 rounded-full mb-4">
              <Plus size={32} className="text-gh-border" />
            </div>
            <h3 className="text-lg font-medium text-gh-text mb-1">No tasks found</h3>
            <p className="max-w-xs mx-auto">
              {searchQuery ? "No tasks match your search query." : "You're all caught up! Create a new task to get started."}
            </p>
          </div>
        )}
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
