import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Check, Edit2, Archive, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onComplete: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  assignment: 'bg-blue-900 text-blue-200',
  exam: 'bg-red-900 text-red-200',
  meeting: 'bg-purple-900 text-purple-200',
  interview: 'bg-yellow-900 text-yellow-200',
  bill: 'bg-green-900 text-green-200',
  project: 'bg-indigo-900 text-indigo-200',
  personal: 'bg-pink-900 text-pink-200',
  other: 'bg-gray-800 text-gray-200'
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500'
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onComplete, onArchive, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const isOverdue = task.status === 'active' && task.due_date && new Date(task.due_date) < new Date();
  const isCompleted = task.status === 'completed';

  const progressColor = task.progress > 70 ? 'bg-gh-accent-green' : task.progress > 30 ? 'bg-gh-accent-orange' : 'bg-gh-accent-red';

  return (
    <div className={`card mb-4 relative overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl group ${isOverdue ? 'border-l-[4px] border-l-gh-accent-red bg-gh-accent-red/5' : ''} ${isCompleted ? 'border-l-[4px] border-l-gh-accent-green bg-gh-accent-green/5 opacity-70' : 'hover:border-gh-border hover:bg-[#0a0f1c]/90'}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-gh-accent-blue/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex justify-between items-start relative z-10">
        <div className="flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-3 mb-1.5">
            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${priorityColors[task.priority]}`} title={`Priority: ${task.priority}`} />
            <h3 className={`font-bold tracking-wide text-lg ${isCompleted ? 'line-through text-gh-text-tertiary' : 'text-gh-text group-hover:text-white transition-colors'}`}>{task.title}</h3>
            {task.ai_priority_score !== null && (
              <span className="text-xs bg-gh-btn-bg text-gh-text-tertiary px-1.5 py-0.5 rounded border border-gh-border" title="AI Priority Score">★ {task.ai_priority_score}</span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 text-xs items-center text-gh-text-secondary mt-2">
            <span className={`px-2 py-0.5 rounded-full ${categoryColors[task.category] || categoryColors.other}`}>
              {task.category}
            </span>
            <span className={`px-2 py-0.5 rounded-full border ${isCompleted ? 'border-gh-accent-green text-gh-accent-green' : isOverdue ? 'border-gh-accent-red text-gh-accent-red' : 'border-gh-border text-gh-text-secondary'}`}>
              {task.status}
            </span>
            {task.due_date && (
              <span className={`${isOverdue ? 'text-gh-accent-red font-medium' : ''}`}>
                Due {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
              </span>
            )}
            {task.estimated_minutes && (
              <span>• {task.estimated_minutes} min</span>
            )}
          </div>
        </div>

        <div className="flex gap-1 ml-4">
          {task.status !== 'completed' && (
            <button onClick={(e) => { e.stopPropagation(); onComplete(task.id); }} className="p-1.5 text-gh-text-secondary hover:text-gh-accent-green hover:bg-gh-btn-hover rounded" title="Complete">
              <Check size={18} />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="p-1.5 text-gh-text-secondary hover:text-gh-accent-blue hover:bg-gh-btn-hover rounded" title="Edit">
            <Edit2 size={18} />
          </button>
          {task.status !== 'archived' && (
            <button onClick={(e) => { e.stopPropagation(); onArchive(task.id); }} className="p-1.5 text-gh-text-secondary hover:text-gh-accent-orange hover:bg-gh-btn-hover rounded" title="Archive">
              <Archive size={18} />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className="p-1.5 text-gh-text-secondary hover:text-gh-accent-red hover:bg-gh-btn-hover rounded" title="Delete">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {expanded && task.description && (
        <div className="mt-3 pt-3 border-t border-gh-border text-sm text-gh-text-secondary whitespace-pre-wrap">
          {task.description}
        </div>
      )}

      {expanded && task.progress > 0 && task.progress < 100 && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gh-text-secondary mb-1">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <div className="w-full bg-gh-bg rounded-full h-1.5">
            <div className={`h-1.5 rounded-full ${progressColor}`} style={{ width: `${task.progress}%` }}></div>
          </div>
        </div>
      )}
      
      {!expanded && task.description && (
         <div className="absolute bottom-1 right-2 text-gh-text-tertiary">
            <ChevronDown size={14} />
         </div>
      )}
      {expanded && (
         <div className="absolute bottom-1 right-2 text-gh-text-tertiary cursor-pointer" onClick={() => setExpanded(false)}>
            <ChevronUp size={14} />
         </div>
      )}
    </div>
  );
};
