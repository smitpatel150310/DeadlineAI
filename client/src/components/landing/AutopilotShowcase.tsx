import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Puzzle, Calendar, Bot, ChevronRight, Play, X } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AutopilotModal } from '../AutopilotModal';

export const AutopilotShowcase = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [mockupStep, setMockupStep] = useState(0);

  // Intersection Observers for animations
  const { ref: headerRef, isIntersecting: headerVis } = useIntersectionObserver({ threshold: 0.2 });
  const { ref: splitRef, isIntersecting: splitVis } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: cardsRef, isIntersecting: cardsVis } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: comparisonRef, isIntersecting: compVis } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: statsRef, isIntersecting: statsVis } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: demoRef, isIntersecting: demoVis } = useIntersectionObserver({ threshold: 0.2 });

  // Auto-looping Mockup
  useEffect(() => {
    let interval: any;
    if (splitVis) {
      interval = setInterval(() => {
        setMockupStep(s => (s >= 5 ? 0 : s + 1));
      }, 2500); // Progress every 2.5s, total cycle ~15s
    }
    return () => clearInterval(interval);
  }, [splitVis]);

  // Statistics counters
  const [stats, setStats] = useState({ planning: 0, speed: 0 });
  useEffect(() => {
    if (statsVis) {
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        setStats({
          planning: Math.min(95, Math.floor((currentStep / steps) * 95)),
          speed: Math.min(10, Math.floor((currentStep / steps) * 10))
        });
        if (currentStep >= steps) clearInterval(timer);
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [statsVis]);

  return (
    <section className="relative py-32 overflow-hidden border-t border-white/[0.04]">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[#050810]" />
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(0,229,255,0.03)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(124,58,237,0.03)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* HEADER */}
        <div ref={headerRef} className={`text-center max-w-3xl mx-auto mb-20 ${headerVis ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-gh-accent-blue/10 to-gh-accent-purple/10 border border-gh-accent-blue/20 mb-6">
            <Bot size={14} className="text-gh-accent-blue" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white">Powered by Google Gemini AI</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">Meet AI Autopilot</h2>
          <p className="text-lg text-white/40 font-light leading-relaxed">
            Let DeadlineAI think, organize and optimize your entire workload in one click.
          </p>
        </div>

        {/* HOW IT WORKS STRIP */}
        <div className={`hidden md:flex items-center justify-center gap-4 mb-20 ${headerVis ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
          {['Tasks', 'Gemini AI', 'Conflict Detection', 'Schedule Builder', 'Your Approval'].map((step, i, arr) => (
            <React.Fragment key={i}>
              <div className="px-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05] text-sm text-white/60 font-medium">
                {step}
              </div>
              {i < arr.length - 1 && <ChevronRight size={16} className="text-white/20" />}
            </React.Fragment>
          ))}
        </div>

        {/* SPLIT LAYOUT */}
        <div ref={splitRef} className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32 ${splitVis ? 'animate-fade-in-up' : 'opacity-0'}`}>
          
          {/* Left: Glass Panel Timeline */}
          <div className="card p-8 sm:p-10 bg-white/[0.02] border-white/[0.05] relative overflow-hidden group hover:border-gh-accent-blue/20 transition-all duration-700">
            <div className="absolute inset-0 bg-gradient-to-br from-gh-accent-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 space-y-8">
              {[
                { icon: Sparkles, text: 'Scan all tasks' },
                { icon: AlertCircle, text: 'Detect deadline conflicts' },
                { icon: Puzzle, text: 'Break complex work into subtasks' },
                { icon: Calendar, text: 'Build the optimal daily schedule' },
                { icon: Bot, text: 'Ask for your approval' },
                { icon: CheckCircle2, text: 'Apply changes to your workspace' }
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="relative flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#0a0d14] border border-white/10 flex items-center justify-center z-10 group-hover:border-gh-accent-blue/40 group-hover:bg-gh-accent-blue/10 transition-colors duration-500 delay-[${i * 100}ms]">
                      <step.icon size={14} className="text-white/60 group-hover:text-gh-accent-blue transition-colors duration-500" />
                    </div>
                    {i < 5 && <div className="w-px h-8 bg-gradient-to-b from-white/10 to-transparent absolute top-8" />}
                  </div>
                  <div className="pt-1.5">
                    <span className="text-white/80 font-medium text-[15px]">{step.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Mockup */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-4 bg-gradient-to-br from-gh-accent-blue/20 to-gh-accent-purple/20 blur-3xl opacity-30 animate-pulse" />
            <div className="relative bg-[#080b12] rounded-2xl border border-gh-accent-blue/30 shadow-[0_0_40px_rgba(0,229,255,0.15)] overflow-hidden flex flex-col animate-[float_6s_ease-in-out_infinite]">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gh-accent-blue to-transparent opacity-70" />
              
              <div className="p-5 border-b border-white/[0.05] flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${mockupStep === 5 ? 'bg-gh-accent-green/20' : 'bg-gh-accent-blue/20'}`}>
                  {mockupStep === 5 ? <CheckCircle2 size={16} className="text-gh-accent-green" /> : <Sparkles size={16} className="text-gh-accent-blue animate-pulse" />}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">{mockupStep === 5 ? 'Autopilot Complete' : 'AI Autopilot Running...'}</h3>
                  <p className="text-[10px] text-gh-text-secondary uppercase tracking-widest mt-0.5">Autonomous Agent</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {[
                  'Scanning tasks',
                  'Detecting conflicts',
                  'Building schedule',
                  'AI analysis completed'
                ].map((text, i) => (
                  <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${mockupStep > i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    <CheckCircle2 size={14} className="text-gh-accent-green" />
                    <span className="text-sm text-white/70">{text}</span>
                  </div>
                ))}

                <div className={`pt-4 mt-2 border-t border-white/5 transition-all duration-500 delay-300 ${mockupStep === 5 ? 'opacity-100' : 'opacity-0'}`}>
                  <p className="text-xs text-gh-accent-blue mb-4">Today's workload optimized.</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 text-xs text-white/50 cursor-default">Cancel</button>
                    <button className="flex-1 bg-gh-accent-green text-black font-bold rounded-lg py-2 text-xs cursor-default">Apply Changes</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE CARDS */}
        <div ref={cardsRef} className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-32 ${cardsVis ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {[
            { title: 'Intelligent Planning', desc: 'AI analyzes every deadline before suggesting improvements.' },
            { title: 'Human Approval', desc: 'Nothing changes automatically. You remain in complete control.' },
            { title: 'Smart Scheduling', desc: 'Generates optimized schedules for today and tomorrow.' },
            { title: 'One Click Productivity', desc: 'One click replaces manual planning and prioritization.' }
          ].map((f, i) => (
            <div key={i} className="card p-6 bg-white/[0.01] border-white/[0.05] hover:bg-white/[0.03] hover:border-white/10 transition-colors">
              <h4 className="text-white font-bold text-[15px] mb-2">{f.title}</h4>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* COMPARISON */}
        <div ref={comparisonRef} className={`grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-32 ${compVis ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="card p-8 bg-gradient-to-br from-[#1a0505]/50 to-transparent border-gh-accent-red/20 hover:border-gh-accent-red/40 transition-colors group">
            <h3 className="text-xl font-bold text-white/80 mb-6">Without DeadlineAI</h3>
            <ul className="space-y-4">
              {['Missed deadlines', 'Manual planning', 'Stress', 'Task overload'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/50 group-hover:text-white/70 transition-colors">
                  <X size={16} className="text-gh-accent-red/50" /> {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="card p-8 bg-gradient-to-br from-gh-accent-green/5 to-transparent border-gh-accent-green/30 hover:border-gh-accent-green/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all group">
            <h3 className="text-xl font-bold text-white mb-6">With DeadlineAI</h3>
            <ul className="space-y-4">
              {['AI prioritization', 'Automatic conflict detection', 'Smart schedules', 'Organized workload'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/70 group-hover:text-white transition-colors">
                  <CheckCircle2 size={16} className="text-gh-accent-green" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* STATISTICS */}
        <div ref={statsRef} className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-32 border-y border-white/[0.04] py-16 ${statsVis ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-black text-white mb-2">{stats.planning}%</div>
            <div className="text-xs text-white/40 uppercase tracking-widest">Planning Time Saved</div>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-black text-white mb-2">{stats.speed}×</div>
            <div className="text-xs text-white/40 uppercase tracking-widest">Faster Task Org</div>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-black text-white mb-2">100%</div>
            <div className="text-xs text-white/40 uppercase tracking-widest">User Approval</div>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-black text-white mb-2">24/7</div>
            <div className="text-xs text-white/40 uppercase tracking-widest">Productivity AI</div>
          </div>
        </div>

        {/* DEMO BUTTON */}
        <div ref={demoRef} className={`text-center max-w-xl mx-auto ${demoVis ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h3 className="text-2xl font-bold mb-6">Experience it yourself</h3>
          <button 
            onClick={() => setIsDemoOpen(true)}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gh-accent-blue/10 border border-gh-accent-blue/40 text-gh-accent-blue font-bold tracking-wide hover:bg-gh-accent-blue hover:text-black hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all duration-300 group"
          >
            <Play size={18} className="group-hover:scale-110 transition-transform" />
            Watch AI Autopilot Demo
          </button>
          <p className="mt-4 text-xs text-white/30">Interactive demo • No sign up required</p>
        </div>

      </div>

      {/* RENDER DEMO MODAL */}
      <AutopilotModal 
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        isDemoMode={true}
        tasks={[]} // Tasks are mocked inside AutopilotModal when isDemoMode=true
        createTask={async () => {}}
        updateTask={async () => {}}
      />
    </section>
  );
};
