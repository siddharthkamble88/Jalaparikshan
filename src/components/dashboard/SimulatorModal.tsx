import React from 'react';
import { useAqua } from '../../context/AquaContext';
import { Zap, X, AlertTriangle, RefreshCw, Radio, ShieldCheck, Play, Pause } from 'lucide-react';

export const SimulatorModal: React.FC = () => {
  const {
    isSimulatorOpen,
    setIsSimulatorOpen,
    triggerAnomaly,
    isLiveSimulationActive,
    setIsLiveSimulationActive,
    nodes
  } = useAqua();

  if (!isSimulatorOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel rounded-3xl border border-amber-500/30 p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400">
            <Zap className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">Demo Control Room</h3>
          </div>
          <button
            onClick={() => setIsSimulatorOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 my-4 leading-relaxed">
          Inject real-time simulated IoT anomalies to test alert processing, WQI gauge recalculations, and historical graph spikes live in the application.
        </p>

        {/* Live Simulation Stream Toggle */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${isLiveSimulationActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <div>
              <span className="text-xs font-bold text-white block">Automatic 3s Telemetry Tick</span>
              <span className="text-[10px] text-slate-400 font-mono">Simulates active ESP32 sensor payload streaming</span>
            </div>
          </div>
          <button
            onClick={() => setIsLiveSimulationActive(!isLiveSimulationActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
              isLiveSimulationActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {isLiveSimulationActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isLiveSimulationActive ? 'Streaming' : 'Paused'}
          </button>
        </div>

        {/* Anomaly Triggers */}
        <div className="space-y-2.5 my-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Simulate Sensor Anomalies</h4>

          <button
            onClick={() => {
              triggerAnomaly('NODE-003', 'turbidity_spike');
              setIsSimulatorOpen(false);
            }}
            className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
              <div>
                <span className="text-xs font-bold text-white block">Turbidity Sediment Spike (28.5 NTU)</span>
                <span className="text-[10px] text-slate-400 font-mono">Node 03 — Agricultural Runoff Canal</span>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-400 font-mono px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">
              Trigger
            </span>
          </button>

          <button
            onClick={() => {
              triggerAnomaly('NODE-003', 'do_drop');
              setIsSimulatorOpen(false);
            }}
            className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <div>
                <span className="text-xs font-bold text-white block">Dissolved Oxygen Depletion (3.2 mg/L)</span>
                <span className="text-[10px] text-slate-400 font-mono">Node 03 — Aquatic Biological Stress</span>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
              Trigger
            </span>
          </button>

          <button
            onClick={() => {
              triggerAnomaly('NODE-003', 'reset');
              setIsSimulatorOpen(false);
            }}
            className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-xs font-bold text-white block">Reset All Sensor Nodes</span>
                <span className="text-[10px] text-slate-400 font-mono">Restore healthy baseline water telemetry</span>
              </div>
            </div>
            <span className="text-xs font-bold text-cyan-400 font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
              Reset
            </span>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setIsSimulatorOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
          >
            Close Control Room
          </button>
        </div>

      </div>
    </div>
  );
};
