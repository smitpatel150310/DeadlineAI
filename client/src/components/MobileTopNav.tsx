import { Link } from 'react-router-dom';
import { User, Zap, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function MobileTopNav() {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <div className="md:hidden flex items-center justify-between px-4 h-16 bg-[#02040a]/90 backdrop-blur-2xl border-b border-white/[0.04] sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent-blue/50 rounded-lg">
        <div className="w-7 h-7 rounded-lg bg-gh-accent-blue/10 border border-gh-accent-blue/20 flex items-center justify-center transition-colors duration-300 group-hover:bg-gh-accent-blue/20 group-active:scale-95">
          <Zap className="w-3.5 h-3.5 text-gh-accent-blue" />
        </div>
        <span className="text-base font-bold tracking-tight">
          Deadline<span className="text-transparent bg-clip-text bg-gradient-to-r from-gh-accent-blue to-gh-accent-purple">AI</span>
        </span>
      </Link>
      
      <div className="flex items-center gap-3">
        <Link 
          to="/profile"
          className="w-11 h-11 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center transition-all duration-300 active:scale-90 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent-blue/50"
          aria-label="User Profile"
        >
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-white/70" />
          )}
        </Link>
        <button 
          onClick={handleSignOut}
          className="w-11 h-11 rounded-full flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
