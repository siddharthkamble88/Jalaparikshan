import React from 'react';
import { ParameterType } from '../../types';
import { Activity, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

interface MetricCardProps {
  type: ParameterType;
  title: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  optimalRange: string;
  minVal?: number;
  maxVal?: number;
  icon: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  status,
  trend,
  trendValue,
  optimalRange,
  icon,
}) => {
  const getStatusBadge = () => {
    if (status === 'normal') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle className="w-3 h-3" /> Normal
        </span>
      );
    }
    if (status === 'warning') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-3 h-3" /> Warning
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse">
        <ShieldAlert className="w-3 h-3" /> Critical
      </span>
    );
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />;
    if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-amber-400" />;
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className={`glass-panel p-5 rounded-2xl border transition-all duration-300 hover:border-slate-700 ${
      status === 'critical'
        ? 'border-rose-500/50 bg-rose-950/20 shadow-lg shadow-rose-950/20'
        : status === 'warning'
        ? 'border-amber-500/40 bg-amber-950/10'
        : 'border-slate-800'
    }`}>
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
            {icon}
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-300">{title}</h4>
            <span className="text-[10px] text-slate-400 font-mono">Target: {optimalRange}</span>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline justify-between my-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {value}
          </span>
          <span className="text-sm font-mono text-slate-400">{unit}</span>
        </div>

        <div className="flex items-center gap-1 text-xs font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
          {getTrendIcon()}
          <span>{trendValue}</span>
        </div>
      </div>

      {/* Progress Bar Range Indicator */}
      <div className="mt-3 space-y-1">
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800/60">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              status === 'normal'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-400'
                : status === 'warning'
                ? 'bg-amber-400'
                : 'bg-rose-500'
            }`}
            style={{
              width: `${Math.min(100, Math.max(10, (value / 30) * 100))}%`
            }}
          ></div>
        </div>
      </div>

    </div>
  );
};
