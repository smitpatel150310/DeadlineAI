import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  ListTodo,
  Bot,
  Timer,
  History as ClockIcon,
  User,
  LogOut,
  Zap,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Tasks', icon: ListTodo, path: '/tasks' },
  { label: 'Assistant', icon: Bot, path: '/assistant' },
  { label: 'Focus', icon: Timer, path: '/focus' },
  { label: 'History', icon: ClockIcon, path: '/history' },
];

export default function Sidebar() {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleLogoClick = () => {
    // Check global variables for unsaved state (set by Focus/TaskForm components)
    // We use window properties for a lightweight global state without over-engineering context
    const hasUnsavedChanges = (window as any).__hasUnsavedEdits || (window as any).__hasActiveSession;
    
    if (hasUnsavedChanges) {
      setShowConfirmDialog(true);
    } else {
      navigate('/');
    }
  };

  const confirmNavigation = () => {
    setShowConfirmDialog(false);
    navigate('/');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-[260px] h-screen bg-[#02040a]/90 backdrop-blur-2xl border-r border-white/[0.04] flex-shrink-0 relative z-20">
      {/* Ambient edge glow */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-gh-accent-blue/10 via-transparent to-gh-accent-purple/10" />

      {/* Logo */}
      <div 
        role="button"
        tabIndex={0}
        aria-label="Go to Landing Page"
        onClick={handleLogoClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleLogoClick();
          }
        }}
        className="flex items-center gap-3 px-7 h-[72px] border-b border-white/[0.04] cursor-pointer transition-all duration-200 ease-in-out hover:brightness-110 hover:scale-[1.02] active:scale-95 group focus:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent-blue/50"
      >
        <div className="w-8 h-8 rounded-lg bg-gh-accent-blue/10 border border-gh-accent-blue/20 flex items-center justify-center transition-colors duration-200 group-hover:bg-gh-accent-blue/20">
          <Zap className="w-4 h-4 text-gh-accent-blue" />
        </div>
        <span className="text-lg font-bold tracking-tight">
          Deadline<span className="text-transparent bg-clip-text bg-gradient-to-r from-gh-accent-blue to-gh-accent-purple">AI</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-4 py-8 overflow-y-auto">
        <div className="text-[10px] text-white/20 font-semibold tracking-[0.2em] uppercase mb-4 px-3">Workspace</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all duration-300 relative ${
                isActive
                  ? 'text-white bg-white/[0.06]'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gh-accent-blue shadow-[0_0_10px_rgba(0,229,255,0.5)]" />}
                <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-gh-accent-blue' : ''}`} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/[0.04] px-4 py-5 space-y-1">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all duration-300 relative ${
              isActive
                ? 'text-white bg-white/[0.06]'
                : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gh-accent-blue shadow-[0_0_10px_rgba(0,229,255,0.5)]" />}
              <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">{profile?.full_name || 'Profile'}</span>
            </>
          )}
        </NavLink>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium text-white/30 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-300 w-full text-left"
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          Logout
        </button>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirmDialog(false)} />
          <div className="relative card w-full max-w-sm p-6 animate-in zoom-in-95 border-gh-border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
            <h3 className="text-lg font-bold text-white mb-2">Unsaved Changes</h3>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              You have an active session or unsaved changes. Are you sure you want to leave this page?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirmDialog(false)} className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
                Stay
              </button>
              <button onClick={confirmNavigation} className="btn-primary py-2 px-4 text-sm">
                Go to Landing Page
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
