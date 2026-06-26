export type TaskStatus = 'active' | 'completed' | 'overdue' | 'archived';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskCategory = 'assignment' | 'exam' | 'meeting' | 'interview' | 'bill' | 'project' | 'personal' | 'other';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  estimated_minutes: number | null;
  completed_at: string | null;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  ai_priority_score: number | null;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  preferences: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}
