import React from 'react';
import { FocusStats } from '../../hooks/useFocusHistory';
import { Clock, CheckCircle2, TrendingUp, Trophy, Activity, Target } from 'lucide-react';

interface StatisticsBoardProps {
  stats: FocusStats;
  productivityScore: number;
}

export const StatisticsBoard: React.FC<StatisticsBoardProps> = React.memo(({ stats, productivityScore }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-gh-accent-purple drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]';
    if (score >= 80) return 'text-gh-accent-blue drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]';
    if (score >= 60) return 'text-gh-accent-green';
    if (score >= 40) return 'text-gh-accent-orange';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Great';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Focus';
  };

  return (
    <div className="w-full mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Productivity Score */}
      <div className="col-span-2 md:col-span-3 lg:col-span-2 card bg-[#080b12]/80 backdrop-blur-2xl border-gh-border/50 p-6 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.4)] group">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-gh-text-secondary flex items-center gap-2 mb-2"><Activity size={12}/> Prod Score</span>
          <div className="text-xl font-medium text-gh-text-secondary">{getScoreLabel(productivityScore)}</div>
        </div>
        <div className={`text-5xl font-bold tracking-tighter ${getScoreColor(productivityScore)} transition-colors duration-500`}>
          {productivityScore}
        </div>
      </div>

      <div className="card bg-[#080b12]/80 backdrop-blur-2xl border-gh-border/50 p-6 flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:border-gh-border transition-all">
        <span className="text-3xl font-extrabold text-gh-text drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{stats.todaysFocusMinutes}</span>
        <span className="text-[10px] uppercase tracking-widest font-semibold text-gh-text-secondary mt-2 flex items-center gap-1.5"><Clock size={12} className="text-gh-accent-blue"/> Mins Today</span>
      </div>

      <div className="card bg-[#080b12]/80 backdrop-blur-2xl border-gh-border/50 p-6 flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:border-gh-border transition-all">
        <span className="text-3xl font-extrabold text-gh-text drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{stats.todaysCompletedSessions}</span>
        <span className="text-[10px] uppercase tracking-widest font-semibold text-gh-text-secondary mt-2 flex items-center gap-1.5"><CheckCircle2 size={12} className="text-gh-accent-green"/> Sessions</span>
      </div>

      <div className="card bg-[#080b12]/80 backdrop-blur-2xl border-gh-border/50 p-6 flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:border-gh-border transition-all">
        <span className="text-3xl font-extrabold text-gh-text drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{stats.currentStreak} <span className="text-sm font-normal text-gh-text-secondary">days</span></span>
        <span className="text-[10px] uppercase tracking-widest font-semibold text-gh-text-secondary mt-2 flex items-center gap-1.5"><TrendingUp size={12} className="text-gh-accent-orange"/> Streak</span>
      </div>

      <div className="card bg-[#080b12]/80 backdrop-blur-2xl border-gh-border/50 p-6 flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:border-gh-border transition-all">
        <span className="text-3xl font-extrabold text-gh-text drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{stats.weeklySessions}</span>
        <span className="text-[10px] uppercase tracking-widest font-semibold text-gh-text-secondary mt-2 flex items-center gap-1.5"><Target size={12} className="text-gh-accent-purple"/> Wkly Sessions</span>
      </div>

      <div className="card bg-[#080b12]/80 backdrop-blur-2xl border-gh-border/50 p-6 flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:border-gh-border transition-all">
        <span className="text-3xl font-extrabold text-gh-text drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{stats.bestStreak} <span className="text-sm font-normal text-gh-text-secondary">days</span></span>
        <span className="text-[10px] uppercase tracking-widest font-semibold text-gh-text-secondary mt-2 flex items-center gap-1.5"><Trophy size={12} className="text-gh-accent-orange"/> Best Streak</span>
      </div>

    </div>
  );
});

StatisticsBoard.displayName = 'StatisticsBoard';
