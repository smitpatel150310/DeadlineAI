import React from 'react';
import { Zap } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.04] py-16 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gh-accent-blue/10 border border-gh-accent-blue/20 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-gh-accent-blue" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Deadline<span className="text-gh-accent-blue">AI</span>
            </span>
          </div>
          <p className="text-sm text-white/30 max-w-xs text-center md:text-left">
            AI-powered productivity and deadline management for students, creators, and professionals.
          </p>
        </div>
        
        <div className="flex gap-10 text-sm text-white/30">
          <a href="#features" className="hover:text-white/60 transition-colors">Features</a>
          <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
          <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
          <a href="#" className="hover:text-white/60 transition-colors">Contact</a>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/[0.04]">
        <p className="text-xs text-white/20 text-center md:text-left">
          © 2026 DeadlineAI. Built for focused work.
        </p>
      </div>
    </footer>
  );
};
