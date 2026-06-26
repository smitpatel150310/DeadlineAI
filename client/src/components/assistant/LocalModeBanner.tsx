import React from 'react';
import { CloudOff } from 'lucide-react';

interface LocalModeBannerProps {
  isLocalMode: boolean;
}

export const LocalModeBanner: React.FC<LocalModeBannerProps> = ({ isLocalMode }) => {
  if (!isLocalMode) return null;

  return (
    <div className="bg-gh-accent-orange/10 border-b border-gh-accent-orange/20 px-4 py-2 flex items-center justify-center gap-3 animate-in slide-in-from-top-2 duration-300">
      <CloudOff size={14} className="text-gh-accent-orange" />
      <span className="text-xs font-medium text-gh-accent-orange">
        Local demo mode — connect Supabase to save chats across devices. 
        <span className="text-gh-accent-orange/70 ml-1 italic">(Cloud sync coming soon)</span>
      </span>
    </div>
  );
};
