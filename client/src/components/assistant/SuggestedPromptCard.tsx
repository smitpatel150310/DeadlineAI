import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface SuggestedPromptCardProps {
  icon: typeof LucideIcon;
  title: string;
  description: string;
  prompt: string;
  onClick: (prompt: string) => void;
}

export const SuggestedPromptCard: React.FC<SuggestedPromptCardProps> = ({ icon: Icon, title, description, prompt, onClick }) => {
  return (
    <button 
      onClick={() => onClick(prompt)}
      className="group relative flex flex-col text-left bg-gh-canvas border border-gh-border/50 rounded-xl p-4 transition-all duration-300 hover:border-gh-accent-blue/50 hover:shadow-[0_0_20px_rgba(88,166,255,0.1)] hover:-translate-y-0.5 overflow-hidden w-full"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gh-accent-blue/5 rounded-full blur-[30px] group-hover:bg-gh-accent-blue/10 transition-colors duration-500 pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-2 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-[#0d1117] border border-gh-border flex items-center justify-center group-hover:border-gh-accent-blue/30 transition-colors duration-300">
          <Icon className="w-4 h-4 text-gh-text-secondary group-hover:text-gh-accent-blue transition-colors duration-300" />
        </div>
        <span className="font-semibold text-sm text-gh-text group-hover:text-gh-accent-blue transition-colors duration-300">{title}</span>
      </div>
      
      <p className="text-xs text-gh-text-secondary leading-relaxed relative z-10 line-clamp-2">
        {description}
      </p>
    </button>
  );
};
