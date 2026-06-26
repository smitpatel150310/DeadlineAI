import React from 'react';
import { Bot, User } from 'lucide-react';

export const CopilotPreview: React.FC = () => {
  return (
    <div className="bg-[#060a14]/90 border border-white/[0.06] rounded-2xl overflow-hidden" style={{ boxShadow: '0 30px 60px -15px rgba(0,0,0,0.7)' }}>
      <div className="p-4 border-b border-white/[0.04] flex items-center gap-3">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gh-accent-blue/15 flex items-center justify-center border border-gh-accent-blue/20">
            <Bot className="w-4 h-4 text-gh-accent-blue" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#060a14]" />
        </div>
        <div>
          <h4 className="text-sm font-semibold">DeadlineAI Copilot</h4>
          <p className="text-[10px] text-white/30">Always active</p>
        </div>
      </div>
      
      <div className="p-5 space-y-5">
        <div className="flex gap-3 justify-end">
          <div className="bg-gh-accent-blue/[0.08] border border-gh-accent-blue/15 text-white/80 text-sm p-3.5 rounded-2xl rounded-tr-md max-w-[85%]">
            I have a math assignment due Friday and an exam next week.
          </div>
          <div className="w-8 h-8 rounded-full bg-white/[0.04] flex-shrink-0 flex items-center justify-center border border-white/[0.06]">
            <User className="w-3.5 h-3.5 text-white/40" />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gh-accent-blue/15 flex-shrink-0 flex items-center justify-center border border-gh-accent-blue/20">
            <Bot className="w-3.5 h-3.5 text-gh-accent-blue" />
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] text-white/70 text-sm p-3.5 rounded-2xl rounded-tl-md max-w-[85%] leading-relaxed">
            I've created a 4-day plan. Start with <strong className="text-white/90">30 minutes of revision today</strong>, then complete question sets tomorrow. Shall I add this to your schedule?
          </div>
        </div>
        
        <div className="flex gap-2 pl-11">
          <div className="text-[11px] bg-white/[0.04] border border-white/[0.06] px-3.5 py-2 rounded-full text-white/40 cursor-pointer hover:text-white/70 hover:border-white/10 transition-all duration-300">Yes, add it</div>
          <div className="text-[11px] bg-white/[0.04] border border-white/[0.06] px-3.5 py-2 rounded-full text-white/40 cursor-pointer hover:text-white/70 hover:border-white/10 transition-all duration-300">Modify plan</div>
        </div>
      </div>
    </div>
  );
};
