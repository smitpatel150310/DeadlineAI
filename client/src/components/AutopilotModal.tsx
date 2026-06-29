import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Puzzle, Calendar, Check, X, ArrowRight, Save, Clock, Loader2, RotateCcw } from 'lucide-react';
import { Task } from '../types';
import ReactMarkdown from 'react-markdown';

interface AutopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks?: Task[];
  createTask: (task: Partial<Task>) => Promise<Task | void | any>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task | void | any>;
  isDemoMode?: boolean;
}

const STEPS = [
  { id: 1, text: 'Scanning your tasks and deadlines...', icon: Sparkles, color: 'text-gh-accent-blue' },
  { id: 2, text: 'Detecting conflicts and priority issues...', icon: AlertCircle, color: 'text-gh-accent-red' },
  { id: 3, text: 'Breaking down complex work...', icon: Puzzle, color: 'text-gh-accent-purple' },
  { id: 4, text: 'Building the optimal schedule...', icon: Calendar, color: 'text-gh-accent-orange' },
  { id: 5, text: 'Preparing recommendations...', icon: CheckCircle2, color: 'text-gh-accent-green' }
];

const CACHE_KEY = 'deadlineai_autopilot_cache';
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

type ModalState = 'animating' | 'contacting_api' | 'review' | 'applying' | 'success' | 'error' | 'rate_limit';

export const AutopilotModal: React.FC<AutopilotModalProps> = ({ isOpen, onClose, tasks = [], createTask, updateTask, isDemoMode }) => {
  const [modalState, setModalState] = useState<ModalState>('animating');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Rate limit
  const [countdown, setCountdown] = useState<number>(0);

  // Results
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [usedCache, setUsedCache] = useState(false);

  // Abort controller for cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  const activeTasks = tasks.filter(t => t.status === 'active');

  useEffect(() => {
    if (!isOpen) {
      resetState();
      return;
    }
    if (isDemoMode) {
      startDemoFlow();
    } else {
      startFlow();
    }

    return () => {
      stopAutopilot(false); // Cleanup on unmount
    };
  }, [isOpen]);

  const resetState = () => {
    setModalState('animating');
    setCurrentStep(0);
    setErrorMsg(null);
    setCountdown(0);
    setAiResult(null);
    setUsedCache(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const startFlow = async () => {
    resetState();
    
    // Check Cache First
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          // Valid cache
          await runAnimations(); // Still play the nice animations
          setUsedCache(true);
          setAiResult(parsed.data);
          setModalState('review');
          return;
        } else {
          sessionStorage.removeItem(CACHE_KEY);
        }
      } catch (e) {
        sessionStorage.removeItem(CACHE_KEY);
      }
    }

    // No valid cache, run normally
    const completedAnimations = await runAnimations();
    if (!completedAnimations) return; // User stopped it

    callGeminiApi();
  };

  const startDemoFlow = async () => {
    resetState();
    
    const completedAnimations = await runAnimations();
    if (!completedAnimations) return;

    setModalState('contacting_api');
    await new Promise(r => setTimeout(r, 1500)); // Fake API delay
    if (modalState === 'error' || modalState === 'rate_limit') return;
    if (!document.getElementById('autopilot-modal-root')) return;

    const fakeResult = {
      summary: "I've detected a conflict between your Physics Project and Math assignment. I've broken down the work into 3 manageable subtasks and optimized your schedule for tonight and tomorrow.",
      conflicts: ["Physics Project overlaps with Math revision"],
      subtasks: [
        { parentTaskTitle: "Physics Project", title: "Research formulas and gather references", estimatedMinutes: 45 },
        { parentTaskTitle: "Physics Project", title: "Draft introduction and calculations", estimatedMinutes: 60 },
        { parentTaskTitle: "English Essay", title: "Write thesis and first draft", estimatedMinutes: 60 }
      ],
      schedule: [
        "**Tonight 6:00 PM** - English Essay Draft (60m)",
        "**Tonight 7:30 PM** - Physics Project Research (45m)",
        "**Tomorrow 9:00 AM** - Math Revision (90m)",
        "**Tomorrow 1:00 PM** - Physics Project Calculations (60m)"
      ]
    };

    setAiResult(fakeResult);
    setModalState('review');
  };

  const runAnimations = async (): Promise<boolean> => {
    // Artificial delays for each step
    const delays = [1200, 1500, 1500, 1500, 1200];
    for (let i = 0; i < STEPS.length; i++) {
      if (modalState === 'error' || modalState === 'rate_limit') return false; 
      // If modal closed or stopped
      if (!document.getElementById('autopilot-modal-root')) return false; 
      
      setCurrentStep(STEPS[i].id);
      await new Promise(r => setTimeout(r, delays[i]));
    }
    return true; // All steps completed
  };

  const callGeminiApi = async () => {
    setModalState('contacting_api');
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/gemini/autopilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: activeTasks }),
        signal: abortControllerRef.current.signal
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429 || response.status === 503 || data?.error?.includes('EXHAUSTED')) {
          setModalState('rate_limit');
          setCountdown(35); // Initial countdown
          return;
        }
        throw new Error(data.message || data.error || 'Failed to contact Gemini.');
      }

      // Parse JSON
      let parsedResult;
      try {
        parsedResult = JSON.parse(data.response);
      } catch (e) {
        const cleaned = data.response.replace(/```json/gi, '').replace(/```/g, '').trim();
        parsedResult = JSON.parse(cleaned);
      }

      // Save to cache
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: parsedResult
      }));

      setAiResult(parsedResult);
      setModalState('review');

    } catch (err: any) {
      if (err.name === 'AbortError') return; // Expected cancellation
      setErrorMsg(err.message || 'A network error occurred.');
      setModalState('error');
    }
  };

  // Timer effect for rate limit
  useEffect(() => {
    let timer: any;
    if (modalState === 'rate_limit' && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [modalState, countdown]);

  const applyChanges = async () => {
    setModalState('applying');
    
    if (isDemoMode) {
      // Fake application delay
      await new Promise(r => setTimeout(r, 1500));
      setModalState('success');
      return;
    }

    try {
      // 1. Create subtasks
      if (aiResult?.subtasks && Array.isArray(aiResult.subtasks)) {
        for (const sub of aiResult.subtasks) {
          const parent = tasks.find(t => t.title === sub.parentTaskTitle);
          await createTask({
            title: `${sub.title} (Part of: ${sub.parentTaskTitle || 'Project'})`,
            estimated_minutes: sub.estimatedMinutes || 30,
            category: parent?.category || 'other',
            priority: parent?.priority || 'medium',
            progress: 0,
          });
        }
      }

      // 2. Bump conflicts priority
      if (aiResult?.conflicts && Array.isArray(aiResult.conflicts) && aiResult.conflicts.length > 0) {
        for (const conflictName of aiResult.conflicts) {
          const matchedTask = tasks.find(t => typeof conflictName === 'string' && t.title && t.title.toLowerCase().includes(conflictName.toLowerCase()));
          if (matchedTask && matchedTask.priority !== 'critical') {
            await updateTask(matchedTask.id, { priority: 'critical' });
          }
        }
      }

      setModalState('success');
    } catch (err: any) {
      setErrorMsg('Failed to apply changes: ' + err.message);
      setModalState('error');
    }
  };

  const stopAutopilot = (shouldClose: boolean = true) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (shouldClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div id="autopilot-modal-root" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#02040a]/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <div className={`bg-[#080b12] border border-gh-accent-blue/30 rounded-2xl shadow-[0_0_50px_rgba(0,229,255,0.1)] w-full ${modalState === 'review' || modalState === 'applying' || modalState === 'success' ? 'max-w-4xl' : 'max-w-lg'} relative overflow-hidden flex flex-col transition-all duration-500 max-h-[90vh]`}>
        
        {/* Glow Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gh-accent-blue to-transparent opacity-50" />
        
        {/* Header */}
        <div className="p-6 border-b border-gh-border/50 flex justify-between items-center relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${
              modalState === 'success' ? 'bg-gh-accent-green/20 text-gh-accent-green' : 
              modalState === 'error' || modalState === 'rate_limit' ? 'bg-gh-accent-red/20 text-gh-accent-red' :
              'bg-gh-accent-blue/20 text-gh-accent-blue'
            }`}>
              {modalState === 'success' ? <Check size={20} /> :
               modalState === 'error' || modalState === 'rate_limit' ? <AlertCircle size={20} /> :
               <Sparkles size={20} className="animate-pulse" />}
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                {modalState === 'animating' || modalState === 'contacting_api' ? 'AI Autopilot Running...' :
                 modalState === 'review' ? 'Autopilot Recommendations' :
                 modalState === 'applying' ? 'Applying Changes...' :
                 modalState === 'success' ? (isDemoMode ? 'Demo Complete' : 'Workspace Updated Successfully') : 'Autopilot Interrupted'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gh-text-secondary uppercase tracking-widest">Autonomous Agent {isDemoMode ? '(Demo)' : ''}</span>
                {usedCache && (modalState === 'review' || modalState === 'success') && (
                  <span className="text-[10px] bg-gh-accent-purple/20 text-gh-accent-purple px-2 py-0.5 rounded-full border border-gh-accent-purple/30">
                    Using recent AI analysis
                  </span>
                )}
              </div>
            </div>
          </div>
          {(modalState === 'success' || modalState === 'review' || modalState === 'error' || modalState === 'rate_limit') && (
            <button onClick={() => stopAutopilot(true)} className="text-gh-text-tertiary hover:text-white transition-colors">
              <X size={20} />
            </button>
          )}
        </div>
        
        {/* Body content based on state */}
        <div className="p-8 relative z-10 flex-1 overflow-y-auto min-h-[300px] flex flex-col">
          
          {/* STATE: Animations */}
          {(modalState === 'animating' || modalState === 'contacting_api') && (
            <div className="space-y-6 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
              {STEPS.map((step) => {
                const isPast = currentStep > step.id || modalState === 'contacting_api';
                const isCurrent = currentStep === step.id && modalState === 'animating';
                
                const Icon = isPast ? CheckCircle2 : step.icon;
                
                return (
                  <div key={step.id} className={`flex items-center gap-4 transition-all duration-500 ${isPast || isCurrent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                    <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border ${isPast ? 'border-gh-accent-green/30 bg-gh-accent-green/10 text-gh-accent-green' : isCurrent ? `border-current ${step.color} bg-current/10` : 'border-gh-border/50 text-gh-text-tertiary'} transition-colors`}>
                      <Icon size={16} className={isCurrent ? 'animate-pulse' : ''} />
                    </div>
                    <span className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-gh-text-secondary'}`}>
                      {step.text}
                    </span>
                  </div>
                );
              })}

              {/* API Loading Indicator */}
              <div className={`flex flex-col pt-6 border-t border-gh-border/50 transition-all duration-500 ${modalState === 'contacting_api' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="flex items-center gap-3 text-gh-accent-blue mb-3">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm font-semibold">Contacting Gemini...</span>
                </div>
                {/* Visual purely aesthetic progress bar */}
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gh-accent-blue w-1/2 animate-[shimmer_1.5s_infinite]" />
                </div>
              </div>

              {/* STOP BUTTON */}
              <div className="pt-8 text-center mt-auto">
                <button onClick={() => stopAutopilot(true)} className="px-6 py-2 rounded-xl bg-gh-accent-red/10 text-gh-accent-red border border-gh-accent-red/30 hover:bg-gh-accent-red/20 text-sm font-bold tracking-widest uppercase transition-colors">
                  Stop Autopilot
                </button>
              </div>
            </div>
          )}

          {/* STATE: Rate Limit */}
          {modalState === 'rate_limit' && (
            <div className="text-center flex-1 flex flex-col justify-center items-center max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-gh-accent-orange/10 flex items-center justify-center mb-6 border border-gh-accent-orange/20">
                <AlertCircle className="text-gh-accent-orange w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">⚠ AI is temporarily busy</h3>
              <p className="text-gh-text-secondary text-sm mb-6 leading-relaxed">
                Google Gemini free tier has reached its request limit.<br/>Please wait before trying again.
              </p>
              
              <div className="w-full bg-gh-canvas/50 border border-gh-border/50 rounded-xl p-6 mb-6">
                <p className="text-xs text-gh-text-tertiary uppercase tracking-widest font-semibold mb-2">Retry available in</p>
                <div className="text-4xl font-extrabold font-mono text-gh-accent-orange">{countdown}</div>
              </div>

              <button 
                onClick={isDemoMode ? startDemoFlow : startFlow} 
                disabled={countdown > 0} 
                className={`w-full py-3 rounded-xl font-semibold flex justify-center items-center gap-2 transition-colors ${countdown > 0 ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-gh-accent-blue text-black hover:bg-[#00e5ff] hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]'}`}
              >
                <RotateCcw size={18} /> Retry Now
              </button>
            </div>
          )}

          {/* STATE: Generic Error */}
          {modalState === 'error' && (
            <div className="text-center flex-1 flex flex-col justify-center items-center max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-gh-accent-red/10 flex items-center justify-center mb-6 border border-gh-accent-red/20">
                <AlertCircle className="text-gh-accent-red w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Autopilot Failed</h3>
              <p className="text-gh-text-secondary text-sm mb-8 leading-relaxed">
                {errorMsg}
              </p>
              <div className="flex gap-4 w-full">
                <button onClick={() => stopAutopilot(true)} className="flex-1 btn-secondary py-2">Close</button>
                <button onClick={isDemoMode ? startDemoFlow : startFlow} className="flex-1 btn-primary py-2 flex justify-center items-center gap-2">
                  <RotateCcw size={16} /> Retry
                </button>
              </div>
            </div>
          )}

          {/* STATE: Review Screen */}
          {modalState === 'review' && aiResult && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Summary Card Full Width */}
              <div className="mb-6 card border-gh-accent-blue/30 bg-gh-accent-blue/5 p-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="text-gh-accent-blue shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">💡 AI Summary</h4>
                    <p className="text-sm text-gh-text-secondary leading-relaxed">{aiResult.summary}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 flex-1">
                {/* Conflicts Card */}
                <div className="card p-5 bg-[#0a0d14] border-gh-border/50">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 pb-2 border-b border-gh-border/50">
                    <AlertCircle className="text-gh-accent-red" size={16} /> ⚠ Conflicts
                  </h4>
                  {aiResult.conflicts && aiResult.conflicts.length > 0 ? (
                    <ul className="space-y-3">
                      {aiResult.conflicts.map((c: string, i: number) => (
                        <li key={i} className="text-sm text-gh-text-secondary flex items-start gap-2">
                          <span className="text-gh-accent-red mt-1 text-xs">●</span> {c}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gh-text-tertiary">No critical conflicts detected.</p>
                  )}
                </div>

                {/* Subtasks Card */}
                <div className="card p-5 bg-[#0a0d14] border-gh-border/50">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 pb-2 border-b border-gh-border/50">
                    <Puzzle className="text-gh-accent-purple" size={16} /> 🧩 Suggested Subtasks
                  </h4>
                  {aiResult.subtasks && aiResult.subtasks.length > 0 ? (
                    <ul className="space-y-3">
                      {aiResult.subtasks.map((s: any, i: number) => (
                        <li key={i} className="text-sm text-gh-text-secondary">
                          <span className="font-semibold text-gh-text">{s.title}</span><br/>
                          <span className="text-xs text-gh-text-tertiary">Part of: {s.parentTaskTitle} ({s.estimatedMinutes}m)</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gh-text-tertiary">No task breakdown required.</p>
                  )}
                </div>

                {/* Schedule Card */}
                <div className="card p-5 bg-[#0a0d14] border-gh-border/50">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 pb-2 border-b border-gh-border/50">
                    <Calendar className="text-gh-accent-orange" size={16} /> 📅 Optimized Schedule
                  </h4>
                  {aiResult.schedule && aiResult.schedule.length > 0 ? (
                    <ul className="space-y-2">
                      {aiResult.schedule.map((s: string, i: number) => (
                        <li key={i} className="text-sm text-gh-text-secondary">
                          <ReactMarkdown components={{ p: ({node, ...props}) => <span {...props} /> }}>{s}</ReactMarkdown>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gh-text-tertiary">No schedule provided.</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-6 border-t border-gh-border/50">
                <button onClick={() => stopAutopilot(true)} className="btn-secondary py-3 flex-1 text-sm">
                  ❌ Cancel
                </button>
                <button onClick={isDemoMode ? startDemoFlow : startFlow} className="btn-secondary py-3 px-6 text-sm flex items-center justify-center gap-2 group">
                  <RotateCcw size={16} className="group-hover:-rotate-90 transition-transform" /> Run Again
                </button>
                <button onClick={applyChanges} className="bg-gh-accent-green hover:bg-[#10b981] text-black font-bold py-3 px-8 rounded-xl flex-1 text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
                  ✅ Apply Changes {isDemoMode ? '(Demo)' : ''}
                </button>
              </div>
            </div>
          )}

          {/* STATE: Applying */}
          {modalState === 'applying' && (
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <Loader2 className="w-12 h-12 text-gh-accent-green animate-spin mb-6" />
              <h3 className="text-lg font-bold text-white mb-2">Updating Workspace...</h3>
              <p className="text-gh-text-secondary">Saving subtasks and updating priorities.</p>
            </div>
          )}

          {/* STATE: Success */}
          {modalState === 'success' && (
            <div className="flex-1 flex flex-col justify-center items-center text-center animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-gh-accent-green/20 rounded-full flex items-center justify-center border border-gh-accent-green/40 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <Check className="w-10 h-10 text-gh-accent-green" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{isDemoMode ? 'Demo Complete' : 'Workspace Updated'}</h3>
              
              {isDemoMode ? (
                <p className="text-gh-text-secondary mb-8 max-w-md mx-auto">
                  This is how DeadlineAI optimizes your work using Google Gemini AI.<br/><br/>
                  <span className="text-white">Sign in to use AI Autopilot on your own tasks.</span>
                </p>
              ) : (
                <p className="text-gh-text-secondary mb-8 max-w-md mx-auto">
                  Autopilot has successfully injected the subtasks and updated task priorities based on your approval.
                </p>
              )}

              <button onClick={() => stopAutopilot(true)} className="btn-primary py-3 px-10 flex items-center gap-2">
                {isDemoMode ? 'Close Demo' : 'Return to Dashboard'} <ArrowRight size={16} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
