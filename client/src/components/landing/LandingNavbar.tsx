import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const LandingNavbar: React.FC = () => {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#02040a]/80 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent backdrop-blur-none border-b border-transparent'}`}>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className={`flex justify-between items-center transition-all duration-500 ${scrolled ? 'h-[64px]' : 'h-[80px]'}`}>
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gh-accent-blue/10 border border-gh-accent-blue/20 flex items-center justify-center transition-colors group-hover:bg-gh-accent-blue/20 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              <Zap className="w-4 h-4 text-gh-accent-blue" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Deadline<span className="text-gh-accent-blue">AI</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10 text-[13px] font-medium text-white/40">
            <a href="#features" className="hover:text-white/80 transition-colors duration-300">Features</a>
            <a href="#how-it-works" className="hover:text-white/80 transition-colors duration-300">How It Works</a>
            <a href="#copilot" className="hover:text-white/80 transition-colors duration-300">AI Copilot</a>
            <a href="#pricing" className="hover:text-white/80 transition-colors duration-300">Pricing</a>
          </div>

          <div className="flex items-center gap-5">
            {user ? (
              <Link to="/dashboard" className="btn-primary text-[11px] py-2.5 px-5">
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-[13px] font-medium text-white/40 hover:text-white transition-colors hidden sm:block">
                  Sign in
                </Link>
                <Link to="/signup" className="btn-primary text-[11px] py-2.5 px-5">
                  Start for free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
