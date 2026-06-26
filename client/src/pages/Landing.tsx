import React from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  BrainCircuit,
  ListOrdered,
  Calendar,
  BellRing,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  Clock,
  Target,
  Zap,
  ArrowRight,
  Timer,
  Bot
} from 'lucide-react';

import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroDashboardPreview } from '../components/landing/HeroDashboardPreview';
import { FeatureCard } from '../components/landing/FeatureCard';
import { CopilotPreview } from '../components/landing/CopilotPreview';
import { LandingFooter } from '../components/landing/LandingFooter';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#02040a] text-white font-sans overflow-x-hidden selection:bg-gh-accent-blue/30">
      <LandingNavbar />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center">
        {/* Layered atmospheric background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Primary orbital glow */}
          <div className="absolute top-[20%] left-[15%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.08)_0%,transparent_70%)] blur-[20px] animate-[pulse_8s_ease-in-out_infinite]" />
          {/* Secondary violet glow */}
          <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.06)_0%,transparent_70%)] blur-[20px] animate-[pulse_12s_ease-in-out_infinite_2s]" />
          {/* Horizon line */}
          <div className="absolute bottom-[30%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
          {/* Grid lines faint */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-32 lg:py-20 w-full">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-8 items-center min-h-[calc(100vh-80px)]">
            {/* Left - Editorial copy */}
            <div className="max-w-[640px]">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-10">
                <span className="w-2 h-2 rounded-full bg-gh-accent-blue shadow-[0_0_6px_rgba(0,229,255,0.4)] animate-pulse" />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/60">AI Productivity OS</span>
              </div>

              <h1 className="text-[3rem] sm:text-[4rem] lg:text-[4rem] xl:text-[5rem] font-extrabold tracking-[-0.04em] leading-[0.9] mb-8">
                Command<br />your time.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] via-[#7c3aed] to-[#ec4899]">Finish what<br />matters.</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/50 leading-relaxed mb-12 max-w-[480px] font-light">
                DeadlineAI turns ambitious goals into intelligent action plans. An autonomous Copilot that thinks ahead so you can focus now.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="btn-primary text-center inline-flex items-center justify-center gap-2">
                  Start Planning <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="btn-secondary inline-flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" /> Explore Dashboard
                </Link>
              </div>

              {/* Compact capability strip */}
              <div className="mt-16 flex items-center gap-8 text-[11px] tracking-[0.15em] uppercase text-white/30 font-medium">
                <span className="flex items-center gap-2"><Bot className="w-3.5 h-3.5 text-gh-accent-blue/60" /> AI Copilot</span>
                <span className="flex items-center gap-2"><Timer className="w-3.5 h-3.5 text-gh-accent-blue/60" /> Focus Mode</span>
                <span className="flex items-center gap-2"><Target className="w-3.5 h-3.5 text-gh-accent-blue/60" /> Smart Plans</span>
              </div>
            </div>

            {/* Right - Dashboard preview with depth */}
            <div className="relative">
              <div className="absolute -inset-20 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.06)_0%,transparent_60%)]" />
              <div className="relative z-10">
                <HeroDashboardPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SIGNAL STRIP ═══ */}
      <section className="relative border-y border-white/[0.04] py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#02040a] via-[#060a14] to-[#02040a]" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'Plan smarter', desc: 'AI-driven scheduling', icon: Target },
              { label: 'Reduce stress', desc: 'Automated prioritization', icon: CheckCircle2 },
              { label: 'Focus daily', desc: 'Distraction-free timer', icon: Clock },
              { label: 'Finish on time', desc: 'Deadline intelligence', icon: TrendingUp }
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5 group-hover:bg-white/[0.06] group-hover:border-white/10 transition-all duration-700">
                  <s.icon className="w-7 h-7 text-gh-accent-blue/70 group-hover:text-gh-accent-blue transition-colors duration-700" />
                </div>
                <span className="text-sm font-semibold text-white mb-1">{s.label}</span>
                <span className="text-xs text-white/30">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="relative py-32 px-6 sm:px-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(0,229,255,0.04)_0%,transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[11px] tracking-[0.3em] uppercase text-gh-accent-blue/70 font-semibold mb-6">Capabilities</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6">Everything you need to<br />beat the deadline.</h2>
            <p className="text-lg text-white/40 font-light">A complete toolkit designed to keep you focused and moving forward.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard title="AI Task Breakdown" description="Turns large, intimidating work into manageable, bite-sized steps automatically." icon={ListOrdered} delay={0} />
            <FeatureCard title="Smart Prioritization" description="Identifies exactly what needs your attention first based on deadlines and effort." icon={BrainCircuit} delay={100} />
            <FeatureCard title="Daily Focus Plan" description="Creates a realistic, customized schedule for today to maximize your productivity." icon={Calendar} delay={200} />
            <FeatureCard title="Deadline Risk Alerts" description="Warns you proactively before work becomes urgent or unmanageable." icon={BellRing} delay={300} />
            <FeatureCard title="AI Deadline Copilot" description="Your personal chat-based planning assistant available 24/7." icon={MessageSquare} delay={400} />
            <FeatureCard title="Progress Insights" description="Visual tracking for your productivity patterns and focus habits over time." icon={TrendingUp} delay={500} />
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="relative py-32 border-y border-white/[0.04] overflow-hidden">
        <div className="absolute inset-0 bg-[#050810]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.03)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <p className="text-[11px] tracking-[0.3em] uppercase text-gh-accent-blue/70 font-semibold mb-6">Process</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">How it works</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-16 relative">
            <div className="hidden md:block absolute top-20 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            {[
              { num: '01', title: 'Add your deadline', desc: 'Input your project, assignment, or goal and when it needs to be done.' },
              { num: '02', title: 'AI creates your plan', desc: 'DeadlineAI breaks it down and schedules it based on your availability.' },
              { num: '03', title: 'Focus and finish', desc: 'Use the built-in focus timer and check off steps until you cross the finish line.' }
            ].map((step, i) => (
              <div key={i} className="flex-1 flex flex-col items-center text-center relative z-10 group">
                <div className="w-28 h-28 rounded-full bg-[#060a14] border border-white/[0.06] flex items-center justify-center mb-10 shadow-[inset_0_2px_15px_rgba(255,255,255,0.03)] group-hover:border-gh-accent-blue/20 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.05),inset_0_2px_15px_rgba(255,255,255,0.03)] transition-all duration-700">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white/80 to-white/20">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">{step.title}</h3>
                <p className="text-white/40 text-[15px] max-w-[280px] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AI COPILOT SHOWCASE ═══ */}
      <section id="copilot" className="relative py-32 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-gh-accent-blue/70 font-semibold mb-6">AI Copilot</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] mb-8">Your personal<br />deadline strategist.</h2>
              <p className="text-lg text-white/40 mb-10 font-light leading-relaxed max-w-[480px]">
                When you're overwhelmed, the DeadlineAI Copilot analyzes your active tasks and builds a strategy. It decides exactly what to do next.
              </p>

              <ul className="space-y-5 mb-10">
                {['Break down difficult work into small steps', 'Build realistic schedules that fit your day', 'Recover quickly when plans change'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-white/70">
                    <div className="w-6 h-6 rounded-full bg-gh-accent-blue/10 border border-gh-accent-blue/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gh-accent-blue" />
                    </div>
                    <span className="text-[15px]">{item}</span>
                  </li>
                ))}
              </ul>

              <Link to="/signup" className="btn-secondary inline-flex items-center gap-3 group">
                Meet your Copilot
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -inset-16 bg-[radial-gradient(circle,rgba(0,229,255,0.06)_0%,transparent_60%)]" />
              <div className="relative z-10">
                <CopilotPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOCUS MODE ═══ */}
      <section className="relative py-32 border-y border-white/[0.04] overflow-hidden">
        <div className="absolute inset-0 bg-[#050810]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(0,229,255,0.04)_0%,transparent_50%)] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <p className="text-[11px] tracking-[0.3em] uppercase text-gh-accent-blue/70 font-semibold mb-6">Deep Work</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">One task. One timer.<br />Real progress.</h2>
          <p className="text-white/40 mb-12 max-w-xl mx-auto text-[15px] leading-relaxed">Our distraction-free focus mode helps you execute your plan without getting overwhelmed.</p>

          <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 mx-auto relative flex items-center justify-center mb-12">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="50%" cy="50%" r="45%" className="fill-transparent stroke-[3px]" stroke="rgba(255,255,255,0.04)" />
              <circle cx="50%" cy="50%" r="45%" className="fill-transparent stroke-[5px] stroke-gh-accent-blue" strokeDasharray="283" strokeDashoffset="70" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px rgba(0,229,255,0.2))' }} />
            </svg>
            <div className="text-center">
              <div className="text-5xl sm:text-6xl md:text-7xl font-mono font-extralight tracking-tight mb-1 text-white/90">24:32</div>
              <div className="text-[10px] text-white/30 uppercase tracking-[0.25em] font-semibold">Focus Session</div>
            </div>
          </div>

          <div className="inline-flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] px-6 py-3 rounded-full text-sm text-white/50">
            <div className="w-2 h-2 rounded-full bg-gh-accent-blue animate-pulse shadow-[0_0_4px_rgba(0,229,255,0.3)]" />
            Currently focusing on: <strong className="text-white/80">Complete Physics project outline</strong>
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF ═══ */}
      <section className="py-32 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/30 font-semibold mb-6">Testimonials</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Trusted by those who deliver</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "I used to pull all-nighters for every essay. DeadlineAI breaks them down so I'm actually done two days early now.", author: "M.K.", role: "Student" },
              { quote: "Juggling multiple client projects was a nightmare until I started using the AI prioritization. It perfectly balances my workload.", author: "A.R.", role: "Freelance Designer" },
              { quote: "The focus mode combined with the daily plan has completely changed how our team ships features. We hit deadlines without burnout.", author: "S.L.", role: "Startup Team Lead" }
            ].map((t, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 flex flex-col justify-between hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-500">
                <p className="text-white/50 text-[15px] leading-relaxed mb-8">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gh-accent-blue/30 to-gh-accent-purple/30 border border-white/10 flex items-center justify-center text-xs font-bold text-white/70">{t.author.charAt(0)}</div>
                  <div>
                    <div className="text-sm font-semibold text-white/80">{t.author}</div>
                    <div className="text-xs text-white/30">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="relative py-32 px-6 sm:px-8 border-t border-white/[0.04]">
        <div className="absolute inset-0 bg-[#050810]" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] tracking-[0.3em] uppercase text-gh-accent-blue/70 font-semibold mb-6">Pricing</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Simple, transparent pricing</h2>
            <p className="text-white/40">Start for free, upgrade when you need more power.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-10 hover:border-white/10 transition-all duration-500">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="text-5xl font-extrabold tracking-tight mb-6">$0<span className="text-lg text-white/30 font-normal ml-1">/mo</span></div>
              <p className="text-sm text-white/40 mb-8">Basic planning and task tracking for everyday use.</p>
              <ul className="space-y-4 mb-10 text-sm">
                <li className="flex items-center gap-3 text-white/60"><CheckCircle2 className="w-4 h-4 text-gh-accent-green flex-shrink-0" /> Unlimited tasks</li>
                <li className="flex items-center gap-3 text-white/60"><CheckCircle2 className="w-4 h-4 text-gh-accent-green flex-shrink-0" /> Focus timer</li>
                <li className="flex items-center gap-3 text-white/60"><CheckCircle2 className="w-4 h-4 text-gh-accent-green flex-shrink-0" /> Dashboard insights</li>
              </ul>
              <Link to="/signup" className="btn-secondary w-full block text-center">Get Started</Link>
            </div>

            <div className="relative bg-white/[0.02] border border-gh-accent-purple/30 rounded-2xl p-10 overflow-hidden hover:border-gh-accent-purple/50 transition-all duration-500">
              <div className="absolute top-0 right-0 bg-gh-accent-purple text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-xl">Popular</div>
              <div className="absolute inset-0 bg-gradient-to-br from-gh-accent-purple/[0.04] to-transparent pointer-events-none" />
              <h3 className="text-xl font-bold mb-2 relative z-10">Pro</h3>
              <div className="text-5xl font-extrabold tracking-tight mb-6 relative z-10">$8<span className="text-lg text-white/30 font-normal ml-1">/mo</span></div>
              <p className="text-sm text-white/40 mb-8 relative z-10">Advanced AI planning and Copilot assistance.</p>
              <ul className="space-y-4 mb-10 text-sm relative z-10">
                <li className="flex items-center gap-3 text-white/60"><CheckCircle2 className="w-4 h-4 text-gh-accent-purple flex-shrink-0" /> Everything in Free</li>
                <li className="flex items-center gap-3 text-white/60"><CheckCircle2 className="w-4 h-4 text-gh-accent-purple flex-shrink-0" /> AI Task Breakdown</li>
                <li className="flex items-center gap-3 text-white/60"><CheckCircle2 className="w-4 h-4 text-gh-accent-purple flex-shrink-0" /> AI Deadline Copilot</li>
                <li className="flex items-center gap-3 text-white/60"><CheckCircle2 className="w-4 h-4 text-gh-accent-purple flex-shrink-0" /> Smart Prioritization</li>
              </ul>
              <button className="btn-primary w-full bg-gh-accent-purple hover:bg-purple-600 relative z-10">Coming Soon</button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-32 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-[1.05]">
            Your next deadline<br />does not have to feel<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-gh-accent-blue to-gh-accent-purple">impossible.</span>
          </h2>
          <p className="text-lg text-white/40 mb-12 max-w-xl mx-auto font-light">Start planning with clarity today.</p>
          <Link to="/signup" className="btn-primary text-sm px-10 py-4 inline-flex items-center gap-3">
            Create your free plan <Zap className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
