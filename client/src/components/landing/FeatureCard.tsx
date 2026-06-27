import React, { useRef, useState } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: typeof LucideIcon;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon: Icon, delay = 0 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  
  // Only apply tilt listener to the top row of cards (delay < 300) to preserve global performance
  const enableTilt = delay < 300;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 30;
    const y = -(e.clientY - top - height / 2) / 30;
    
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTilt({ x, y });
    }
  };

  const handleMouseLeave = () => {
    if (enableTilt) setTilt({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-white/[0.04] hover:border-gh-accent-blue/30 hover:shadow-[0_8px_30px_rgba(0,229,255,0.05)] overflow-hidden ${delay ? `delay-${delay}` : ''}`}
      style={{ 
        transform: enableTilt ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translate3d(0, ${tilt.x !== 0 ? '-4px' : '0px'}, 0)` : 'translate3d(0, 0, 0)',
      }}
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
