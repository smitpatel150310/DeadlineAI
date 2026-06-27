import React, { useState, useEffect } from 'react';
import { Task, TaskCategory, TaskPriority } from '../types';

interface TaskFormProps {
  task?: Task;
  onSave: (data: Partial<Task>) => void;
  onClose: () => void;
  loading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onClose, loading }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  
  // Format deadline for datetime-local input
  const getInitialDeadline = () => {
    if (task?.due_date) {
      const d = new Date(task.due_date);
      // Adjust for local timezone offset for input value
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().slice(0, 16);
    }
    return '';
  };
  
  const [deadline, setDeadline] = useState(getInitialDeadline());
  const [estimatedDuration, setEstimatedDuration] = useState(task?.estimated_minutes?.toString() || '');
  const [category, setCategory] = useState<TaskCategory>(task?.category || 'other');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [progress, setProgress] = useState(task?.progress?.toString() || '0');
  const [remindersEnabled, setRemindersEnabled] = useState(task?.reminders_enabled ?? true);

  // Track unsaved edits globally for Sidebar logo navigation protection
  useEffect(() => {
    const isDirty = 
      title !== (task?.title || '') ||
      description !== (task?.description || '') ||
      deadline !== getInitialDeadline() ||
      estimatedDuration !== (task?.estimated_minutes?.toString() || '') ||
      category !== (task?.category || 'other') ||
      priority !== (task?.priority || 'medium') ||
      progress !== (task?.progress?.toString() || '0') ||
      remindersEnabled !== (task?.reminders_enabled ?? true);

    (window as any).__hasUnsavedEdits = isDirty;
    
    return () => {
      (window as any).__hasUnsavedEdits = false;
    };
  }, [title, description, deadline, estimatedDuration, category, priority, progress, remindersEnabled, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim() || null,
      due_date: deadline ? new Date(deadline).toISOString() : null,
      estimated_minutes: estimatedDuration ? parseInt(estimatedDuration, 10) : null,
      category,
      priority,
      progress: parseInt(progress, 10) || 0,
      reminders_enabled: remindersEnabled
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030509]/80 backdrop-blur-md">
      <div className="bg-[#080b12] border border-gh-border/50 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] w-full max-w-md max-h-[90vh] flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gh-accent-blue/5 to-transparent pointer-events-none" />
        <div className="p-5 border-b border-gh-border/50 relative z-10">
          <h2 className="text-xl font-bold tracking-tight text-gh-text">{task ? 'Edit Task' : 'New Task'}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gh-text-secondary mb-1">Title *</label>
            <input
              type="text"
              required
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gh-text-secondary mb-1">Description</label>
            <textarea
              className="input-field h-24 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gh-text-secondary mb-1">Deadline</label>
              <input
                type="datetime-local"
                className="input-field text-sm"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gh-text-secondary mb-1">Est. Duration (min)</label>
              <input
                type="number"
                min="0"
                className="input-field"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                placeholder="e.g. 60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gh-text-secondary mb-1">Category</label>
              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
              >
                <option value="assignment">Assignment</option>
                <option value="exam">Exam</option>
                <option value="meeting">Meeting</option>
                <option value="interview">Interview</option>
                <option value="bill">Bill</option>
                <option value="project">Project</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gh-text-secondary mb-1">Priority</label>
              <select
                className="input-field"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          
          {task && (
            <div>
              <label className="block text-sm font-medium text-gh-text-secondary mb-1 flex justify-between">
                <span>Progress</span>
                <span>{progress}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                className="w-full accent-gh-accent-blue"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
              />
            </div>
          )}

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={remindersEnabled} 
                  onChange={(e) => setRemindersEnabled(e.target.checked)} 
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${remindersEnabled ? 'bg-gh-accent-blue' : 'bg-white/10'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${remindersEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
              <span className="text-sm font-medium text-gh-text">Email Reminders for this task</span>
            </label>
          </div>
        </form>

        <div className="p-4 border-t border-gh-border flex justify-end gap-2 bg-gh-bg/50 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={loading || !title.trim()}
          >
            {loading ? 'Saving...' : 'Save Task'}
          </button>
        </div>
      </div>
    </div>
  );
};
