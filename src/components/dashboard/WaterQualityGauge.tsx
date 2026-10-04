import React from 'react';
import { getWQILabel } from '../../data/mockData';
import { ShieldCheck, Info } from 'lucide-react';

interface WaterQualityGaugeProps {
  score: number; // 0 - 100
  lastUpdated?: string;
}

export const WaterQualityGauge: React.FC<WaterQualityGaugeProps> = ({ score, lastUpdated = 'Just now' }) => {
  const { label, color, badgeBg } = getWQILabel(score);

  // Calculate SVG stroke offset for gauge meter
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col items-center text-center relative overflow-hidden group">
      
      {/* Background glow circle */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-500"></div>

      <div className="w-full flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
        <span className="flex items-center gap-1.5 text-cyan-400 font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          Overall Water Quality Index (WQI)
        </span>
        <span>{lastUpdated}</span>
      </div>

      {/* SVG Circular Gauge */}
      <div className="relative my-4 flex items-center justify-center">
        <svg className="w-44 h-44 transform -rotate-90">
          <circle
            cx="88"
            cy="88"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="88"
            cy="88"
            r={radius}
            className="transition-all duration-1000 ease-out"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            style={{
              color: score >= 75 ? '#22d3ee' : score >= 60 ? '#f59e0b' : '#f43f5e'
            }}
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold font-mono tracking-tight text-white">
            {score}
          </span>
          <span className="text-[10px] text-slate-400 font-mono uppercase">out of 100</span>
        </div>
      </div>

      {/* Status Badge */}
      <div className={`px-4 py-1.5 rounded-full border text-xs font-bold tracking-wider uppercase font-mono ${badgeBg}`}>
        {label}
      </div>

      <p className="text-xs text-slate-400 mt-3 max-w-xs leading-relaxed">
        Composite score evaluated from pH balance, Dissolved Oxygen, Turbidity clarity, and Total Dissolved Solids.
      </p>

    </div>
  );
};
