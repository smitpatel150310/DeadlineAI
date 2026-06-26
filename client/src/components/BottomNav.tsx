import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  Bot,
  Timer,
  History as ClockIcon,
} from 'lucide-react';

const navItems = [
  { label: 'Home', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Tasks', icon: ListTodo, path: '/tasks' },
  { label: 'AI', icon: Bot, path: '/assistant' },
  { label: 'Focus', icon: Timer, path: '/focus' },
  { label: 'History', icon: ClockIcon, path: '/history' },
];

export default function BottomNav() {
  const location = useLocation();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-5 pt-2 pointer-events-none">
      <div className="flex items-center justify-around h-[60px] px-2 bg-[#02040a]/90 backdrop-blur-2xl border border-white/[0.06] rounded-2xl pointer-events-auto relative" style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.6)' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 min-w-[50px] relative ${
                isActive
                  ? 'text-gh-accent-blue'
                  : 'text-white/25 hover:text-white/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-gh-accent-blue shadow-[0_0_8px_rgba(0,229,255,0.6)]" />}
                <item.icon className="w-5 h-5" />
                <span className="text-[9px] font-semibold tracking-wide">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
