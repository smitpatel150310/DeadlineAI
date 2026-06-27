-- Supabase Migration: AI Email Reminder System (Production Optimized)
-- Run this in your Supabase SQL Editor

-- 1. Update profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS reminder_prefs JSONB DEFAULT '{"advance_hours": [24, 6, 1], "escalation_days": [1, 3, 7]}'::jsonb;

-- 2. Update tasks table
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS reminders_enabled BOOLEAN DEFAULT TRUE;

-- 3. Create sent_reminders table
CREATE TABLE IF NOT EXISTS sent_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'retrying', 'cancelled'
  error_message TEXT,
  attempts INT DEFAULT 0,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(task_id, reminder_type)
);

-- 4. Enable RLS on sent_reminders (Security)
ALTER TABLE sent_reminders ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view only their own reminders
CREATE POLICY "Users can view their own reminders"
  ON sent_reminders 
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Explicitly allow the service_role full access (though it often bypasses RLS by default, this ensures it in restricted environments)
CREATE POLICY "Service role can manage all reminders"
  ON sent_reminders 
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 5. Performance Indexes for Cron Jobs and Queries
CREATE INDEX IF NOT EXISTS idx_sent_reminders_task ON sent_reminders(task_id);
CREATE INDEX IF NOT EXISTS idx_sent_reminders_user ON sent_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);
