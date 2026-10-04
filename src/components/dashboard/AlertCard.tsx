import React from 'react';
import { AlertItem } from '../../types';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, Clock } from 'lucide-react';

interface AlertCardProps {
  alert: AlertItem;
  onAcknowledge: (id: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onAcknowledge }) => {
  const getSeverityBadge = () => {
    if (alert.severity === 'critical') {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold uppercase tracking-wider animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5" /> CRITICAL
        </span>
      );
    }
    if (alert.severity === 'warning') {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold uppercase tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5" /> WARNING
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold uppercase tracking-wider">
        <Info className="w-3.5 h-3.5" /> INFO
      </span>
    );
  };

  const formattedTime = new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      alert.severity === 'critical'
        ? 'bg-rose-950/20 border-rose-500/40'
        : alert.severity === 'warning'
        ? 'bg-amber-950/20 border-amber-500/40'
        : 'bg-slate-900/80 border-slate-800'
    }`}>
      
      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {getSeverityBadge()}
          <span className="text-xs font-mono font-semibold text-slate-300">{alert.nodeName}</span>
        </div>
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" /> {formattedTime}
        </span>
      </div>

      <h4 className="text-sm font-bold text-white mb-1">{alert.title}</h4>
      <p className="text-xs text-slate-300 leading-relaxed mb-3">{alert.message}</p>

      {alert.value !== undefined && alert.thresholdValue !== undefined && (
        <div className="mb-3 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-mono flex items-center justify-between text-slate-300">
          <span>Measured Value: <strong className="text-white">{alert.value} {alert.unit}</strong></span>
          <span>Configured Threshold: <strong className="text-slate-400">{alert.thresholdValue} {alert.unit}</strong></span>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <span className="text-[10px] font-mono text-slate-400 uppercase">Alert ID: {alert.id}</span>

        {alert.acknowledged ? (
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged
          </span>
        ) : (
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all"
          >
            Acknowledge Event
          </button>
        )}
      </div>

    </div>
  );
};
