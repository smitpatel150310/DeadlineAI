import React, { useRef, useState } from 'react';
import { Check, Edit2, Zap, LayoutDashboard, Search, Bell } from 'lucide-react';

export const HeroDashboardPreview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25; // Division reduces rotation severity
    const y = -(e.clientY - top - height / 2) / 25;
    
    // Prevent tilt if prefers-reduced-motion is active
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      setTiltStyle({ transform: `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)` });
    }
  };

  const handleMouseLeave = () => {
    setTiltStyle({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...tiltStyle, transition: 'transform 0.1s ease-out' }}
      className="relative w-full max-w-2xl mx-auto lg:max-w-none lg:w-[120%] lg:-mr-[20%] rounded-2xl overflow-hidden border border-white/[0.06] bg-[#060a14]/90 backdrop-blur-2xl select-none animate-float glass-shimmer" 
    >
      {/* Window chrome */}
      <div className="h-10 bg-[#02040a]/80 border-b border-white/[0.04] flex items-center px-5 gap-2">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]/70" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/70" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]/70" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-[10px] text-white/20 font-medium">DeadlineAI — Mission Control</span>
        </div>
      </div>

      <div className="flex h-[420px]">
        {/* Mock Sidebar */}
        <div className="w-52 border-r border-white/[0.04] bg-[#02040a]/60 p-5 hidden sm:flex flex-col">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-7 h-7 rounded-lg bg-gh-accent-blue/10 border border-gh-accent-blue/20 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-gh-accent-blue" />
            </div>
            <span className="font-bold text-sm tracking-tight">DeadlineAI</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-white text-xs bg-white/[0.06] p-2.5 rounded-lg relative">
              <div className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r-full bg-gh-accent-blue" />
              <LayoutDashboard className="w-3.5 h-3.5 text-gh-accent-blue" /> Dashboard
            </div>
            <div className="flex items-center gap-3 text-white/30 text-xs p-2.5">
              <Check className="w-3.5 h-3.5" /> Tasks
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-7 overflow-hidden flex flex-col relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gh-accent-blue/[0.03] blur-[80px] pointer-events-none" />
          
          <div className="flex justify-between items-end mb-7 relative z-10">
            <div>
              <p className="text-[10px] text-white/20 tracking-[0.15em] uppercase font-semibold mb-1">Mission Control</p>
              <h2 className="text-xl font-bold tracking-tight">Good evening, Alex.</h2>
            </div>
            <div className="flex gap-2">
              <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/30"><Search className="w-3.5 h-3.5" /></div>
              <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/30 relative">
                <Bell className="w-3.5 h-3.5" />
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7 relative z-10">
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full border-2 border-white/[0.06] border-t-gh-accent-blue flex items-center justify-center mb-2">
                <span className="font-bold text-sm">72%</span>
              </div>
              <span className="text-[10px] text-white/30 tracking-[0.1em] uppercase font-semibold">Velocity</span>
            </div>
            <div className="col-span-2 bg-gradient-to-br from-gh-accent-purple/[0.06] to-transparent border border-gh-accent-purple/15 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-40 h-40 bg-gh-accent-purple/10 blur-[50px] pointer-events-none" />
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <Zap className="w-3.5 h-3.5 text-gh-accent-purple" />
                <span className="text-[10px] font-bold text-gh-accent-purple tracking-[0.15em] uppercase">AI Suggestion</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed mb-3 relative z-10">Start Physics outline today. Est: 45 min.</p>
              <button className="text-[10px] bg-gh-accent-purple/15 text-gh-accent-purple px-3 py-1.5 rounded-lg font-semibold border border-gh-accent-purple/20 relative z-10">Begin Focus</button>
            </div>
          </div>

          <div className="space-y-2.5 flex-1 overflow-hidden relative z-10">
            {[
              { t: 'Complete Physics project outline', p: 'bg-red-500', c: 'border-l-red-500/40', m: '45m' },
              { t: 'Review chapter 4 for Math midterms', p: 'bg-amber-500', c: 'border-l-amber-500/30', m: '1h 30m' },
              { t: 'Pay electricity bill', p: 'bg-white/30', c: 'border-l-white/10', m: '5m' }
            ].map((task, i) => (
              <div key={i} className={`bg-white/[0.02] border border-white/[0.04] border-l-[3px] ${task.c} rounded-lg p-3.5 flex justify-between items-center hover:bg-white/[0.04] transition-colors duration-300`}>
                <div className="flex items-center gap-3.5">
                  <div className={`w-2 h-2 rounded-full ${task.p}`} style={{ boxShadow: `0 0 8px currentColor` }} />
                  <span className="text-xs font-medium">{task.t}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-white/25">{task.m}</span>
                  <div className="flex gap-2">
                    <Check className="w-3.5 h-3.5 text-white/20 hover:text-gh-accent-green cursor-pointer transition-colors" />
                    <Edit2 className="w-3.5 h-3.5 text-white/20 hover:text-white cursor-pointer transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Copilot */}
          <div className="absolute bottom-5 right-5 w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform" style={{ background: 'linear-gradient(135deg, #00e5ff, #7c3aed)', boxShadow: '0 0 30px rgba(0,229,255,0.4)' }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
