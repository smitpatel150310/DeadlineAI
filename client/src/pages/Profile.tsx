import React, { useState } from 'react';
import { format } from 'date-fns';
import { Save, LogOut, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { supabase } from '../lib/supabase';
import { TaskCategory, TaskPriority } from '../types';

export default function Profile() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { tasks } = useTasks();
  
  const [displayName, setDisplayName] = useState(profile?.full_name || '');
  const prefs = (profile?.preferences as any) || {};
  const [defaultCategory, setDefaultCategory] = useState<TaskCategory>(prefs.default_category || 'other');
  const [defaultPriority, setDefaultPriority] = useState<TaskPriority>(prefs.default_priority || 'medium');
  const [focusDuration, setFocusDuration] = useState(prefs.focus_duration?.toString() || '25');
  
  const [emailNotifications, setEmailNotifications] = useState(profile?.email_notifications ?? true);
  const [timezone, setTimezone] = useState(profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);

  const [isSaving, setIsSaving] = useState(false);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      const updates = {
        full_name: displayName,
        email_notifications: emailNotifications,
        timezone: timezone,
        preferences: {
          default_category: defaultCategory,
          default_priority: defaultPriority,
          focus_duration: parseInt(focusDuration, 10) || 25
        },
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await refreshProfile();
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error('Failed to update profile: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-gh-text mb-6">Profile Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-[#080b12]/80 backdrop-blur-2xl border-gh-border/50 text-center py-8 relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.7)] transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-gh-accent-blue/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="text-4xl font-extrabold tracking-tighter text-gh-text relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{totalTasks}</div>
          <div className="text-[11px] uppercase tracking-widest font-semibold text-gh-text-secondary mt-2 relative z-10">Total Tasks</div>
        </div>
        <div className="card bg-[#080b12]/80 backdrop-blur-2xl border-gh-border/50 text-center py-8 relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.7)] transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-gh-accent-green/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="text-4xl font-extrabold tracking-tighter text-gh-accent-green relative z-10 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">{completedTasks}</div>
          <div className="text-[11px] uppercase tracking-widest font-semibold text-gh-text-secondary mt-2 relative z-10">Completed</div>
        </div>
        <div className="card bg-[#080b12]/80 backdrop-blur-2xl border-gh-border/50 text-center py-8 relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.7)] transition-all">
          <div className="absolute inset-0 bg-gh-accent-blue/10 transform translate-y-[calc(100%-var(--rate))] transition-transform duration-1000" style={{'--rate': `${completionRate}%`} as any} />
          <div className="absolute inset-0 bg-gradient-to-br from-gh-accent-blue/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="text-4xl font-extrabold tracking-tighter text-gh-text relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{completionRate}%</div>
          <div className="text-[11px] uppercase tracking-widest font-semibold text-gh-text-secondary mt-2 relative z-10">Completion Rate</div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden mb-6">
        <div className="p-4 md:p-6 border-b border-gh-border bg-gh-btn-bg/30">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gh-btn-bg border-2 border-gh-border flex items-center justify-center text-gh-text-tertiary">
              <UserIcon size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gh-text">{profile?.full_name || 'User'}</h2>
              <p className="text-sm text-gh-text-secondary">{user?.email}</p>
              <p className="text-xs text-gh-text-tertiary mt-1">
                Member since {user?.created_at ? format(new Date(user.created_at), 'MMM yyyy') : 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-4 md:p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gh-text uppercase tracking-wider mb-4 border-b border-gh-border pb-2">Account Info</h3>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gh-text-secondary mb-1">Display Name</label>
              <input
                type="text"
                className="input-field"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How should we call you?"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gh-text uppercase tracking-wider mb-4 border-b border-gh-border pb-2">App Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gh-text-secondary mb-1">Default Task Category</label>
                <select className="input-field" value={defaultCategory} onChange={(e) => setDefaultCategory(e.target.value as any)}>
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
                <label className="block text-sm font-medium text-gh-text-secondary mb-1">Default Task Priority</label>
                <select className="input-field" value={defaultPriority} onChange={(e) => setDefaultPriority(e.target.value as any)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gh-text-secondary mb-1">Focus Session Duration (min)</label>
                <input
                  type="number"
                  min="5" max="120" step="5"
                  className="input-field"
                  value={focusDuration}
                  onChange={(e) => setFocusDuration(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gh-text uppercase tracking-wider mb-4 border-b border-gh-border pb-2">Email Reminders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={emailNotifications} 
                      onChange={(e) => setEmailNotifications(e.target.checked)} 
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${emailNotifications ? 'bg-gh-accent-blue' : 'bg-white/10'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${emailNotifications ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="text-sm font-medium text-gh-text">Enable AI Email Reminders</span>
                </label>
                <p className="text-xs text-gh-text-secondary mt-2">Receive automated digests and overdue alerts.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gh-text-secondary mb-1">Timezone</label>
                <select className="input-field" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                  {[
                    'UTC',
                    'America/New_York',
                    'America/Chicago',
                    'America/Denver',
                    'America/Los_Angeles',
                    'Europe/London',
                    'Europe/Paris',
                    'Asia/Tokyo',
                    'Asia/Kolkata',
                    'Australia/Sydney'
                  ].map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                  {/* If the auto-detected timezone isn't in the list, add it */}
                  {timezone && !['UTC','America/New_York','America/Chicago','America/Denver','America/Los_Angeles','Europe/London','Europe/Paris','Asia/Tokyo','Asia/Kolkata','Australia/Sydney'].includes(timezone) && (
                    <option key={timezone} value={timezone}>{timezone}</option>
                  )}
                </select>
                <p className="text-xs text-gh-text-secondary mt-1">Used for Daily Brief scheduling.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button type="submit" disabled={isSaving} className="btn-primary inline-flex items-center gap-2">
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => signOut()} className="btn-danger inline-flex items-center gap-2">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
