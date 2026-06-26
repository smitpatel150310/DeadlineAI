import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: typeof LucideIcon;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon: Icon, delay = 0 }) => {
  return (
    <div 
      className="group relative bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 transition-all duration-700 hover:bg-white/[0.04] hover:border-white/[0.1] overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-gh-accent-blue/[0.03] rounded-full blur-[50px] group-hover:bg-gh-accent-blue/[0.06] transition-colors duration-700 pointer-events-none" />
      
      <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-7 relative z-10 group-hover:border-gh-accent-blue/20 transition-colors duration-500">
        <Icon className="w-5 h-5 text-white/40 group-hover:text-gh-accent-blue transition-colors duration-500" />
      </div>
      
      <h3 className="text-[17px] font-semibold text-white/90 mb-3 relative z-10 tracking-tight">{title}</h3>
      <p className="text-[14px] text-white/35 leading-relaxed relative z-10">{description}</p>
    </div>
  );
};
