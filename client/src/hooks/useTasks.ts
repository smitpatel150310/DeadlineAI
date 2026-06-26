import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Task } from '../types';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const logActivity = useCallback(
    async (action: string, entityType: string, entityId: string, details?: Record<string, unknown>) => {
      if (!user) return;
      try {
        await supabase.from('activity_logs').insert({
          user_id: user.id,
          action,
          entity_type: entityType,
          entity_id: entityId,
          metadata: details || {},
        });
      } catch (err) {
        console.warn('Failed to log activity (table may not exist):', err);
      }
    },
    [user]
  );

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setTasks((data as Task[]) || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createTask = useCallback(
    async (task: Partial<Task>): Promise<Task> => {
      if (!user) throw new Error('Not authenticated');

      const newTask = {
        ...task,
        user_id: user.id,
        status: task.status || 'active',
        priority: task.priority || 'medium',
        category: task.category || 'other',
        progress: task.progress ?? 0,
      };

      const { data, error: createError } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single();

      if (createError) throw createError;

      const created = data as Task;
      setTasks((prev) => [created, ...prev]);
      await logActivity('task_created', 'task', created.id, { title: created.title });
      return created;
    },
    [user, logActivity]
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>): Promise<Task> => {
      if (!user) throw new Error('Not authenticated');

      const { data, error: updateError } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      const updated = data as Task;
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    },
    [user]
  );

  const deleteTask = useCallback(
    async (id: string): Promise<void> => {
      if (!user) throw new Error('Not authenticated');

      const task = tasks.find((t) => t.id === id);
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setTasks((prev) => prev.filter((t) => t.id !== id));
      await logActivity('task_deleted', 'task', id, { title: task?.title });
    },
    [user, tasks, logActivity]
  );

  const completeTask = useCallback(
    async (id: string): Promise<void> => {
      if (!user) throw new Error('Not authenticated');

      const { data, error: completeError } = await supabase
        .from('tasks')
        .update({ status: 'completed', progress: 100, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (completeError) throw completeError;

      const completed = data as Task;
      setTasks((prev) => prev.map((t) => (t.id === id ? completed : t)));
      await logActivity('task_completed', 'task', id, { title: completed.title });
    },
    [user, logActivity]
  );

  const archiveTask = useCallback(
    async (id: string): Promise<void> => {
      if (!user) throw new Error('Not authenticated');

      const { data, error: archiveError } = await supabase
        .from('tasks')
        .update({ status: 'archived', updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (archiveError) throw archiveError;

      const archived = data as Task;
      setTasks((prev) => prev.map((t) => (t.id === id ? archived : t)));
      await logActivity('task_archived', 'task', id, { title: archived.title });
    },
    [user, logActivity]
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    archiveTask,
  };
}
