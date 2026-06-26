import React from 'react';
import { Bot, BookOpen, Layers, CheckSquare, CalendarDays } from 'lucide-react';
import { SuggestedPromptCard } from './SuggestedPromptCard';

interface AssistantWelcomeProps {
  onSelectPrompt: (prompt: string) => void;
}

export const AssistantWelcome: React.FC<AssistantWelcomeProps> = ({ onSelectPrompt }) => {
  const prompts = [
    {
      title: "Create a study plan",
      description: "Based on my exams and time",
      prompt: "Create a realistic study plan for my upcoming exams based on my available time.",
      icon: BookOpen
    },
    {
      title: "Break down a project",
      description: "Small, prioritized steps",
      prompt: "Break down a large project into small, prioritized steps with estimated time for each.",
      icon: Layers
    },
    {
      title: "What should I do next?",
      description: "Review tasks and priorities",
      prompt: "Review my current tasks and tell me what I should work on next.",
      icon: CheckSquare
    },
    {
      title: "Plan my deadline",
      description: "Milestones and daily actions",
      prompt: "Help me create a deadline plan with milestones, priorities, and daily actions.",
      icon: CalendarDays
    }
  ];

  return (
    <div className="min-h-full flex flex-col items-center justify-start pt-12 pb-32 w-full max-w-4xl mx-auto px-4 sm:px-6 animate-in fade-in duration-700 relative">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[600px] bg-gh-accent-blue/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col items-center text-center space-y-6 relative z-10 mb-10 mt-8">
        <div className="relative">
          <div className="w-20 h-20 bg-[#0d1117] rounded-2xl flex items-center justify-center border border-gh-border/80 shadow-[0_0_40px_rgba(88,166,255,0.15)] relative z-10">
            <Bot size={40} className="text-gh-accent-blue drop-shadow-[0_0_15px_rgba(88,166,255,0.8)]" />
          </div>
          <div className="absolute inset-0 bg-gh-accent-blue/20 blur-[20px] rounded-2xl animate-pulse" />
        </div>
        
        <div className="space-y-3 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gh-accent-blue/10 border border-gh-accent-blue/20 text-gh-accent-blue text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gh-accent-blue animate-pulse" />
            AI Deadline Copilot
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gh-text">
            What can I help you plan?
          </h2>
          <p className="text-gh-text-secondary text-base leading-relaxed">
            Ask DeadlineAI to organize tasks, break down projects, build a study plan, or plan your next deadline.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl relative z-10">
        {prompts.map((p, i) => (
          <SuggestedPromptCard
            key={i}
            title={p.title}
            description={p.description}
            prompt={p.prompt}
            icon={p.icon}
            onClick={onSelectPrompt}
          />
        ))}
      </div>
    </div>
  );
};
