import React from 'react';
import { useAqua } from '../context/AquaContext';
import { WaterQualityGauge } from '../components/dashboard/WaterQualityGauge';
import { LiveTrendChart } from '../components/charts/LiveTrendChart';
import { MonitoringMap } from '../components/map/MonitoringMap';
import { Radio, Minimize2, Activity, ShieldCheck, Zap } from 'lucide-react';

export const PresentationMode: React.FC = () => {
  const { setIsPresentationMode, nodes, alerts, lastUpdatedTime } = useAqua();

  const primaryNode = nodes[0] || { waterQualityIndex: 86 };
  const onlineCount = nodes.filter(n => n.status === 'online').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Radio className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              <span>JalParikshan — Exhibition Presentation Mode</span>
            </h1>
            <span className="text-xs text-slate-400 font-mono">
              Live Real-Time IoT Water Quality Control Stream | Last Sync: {lastUpdatedTime}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {onlineCount}/{nodes.length} Sensor Nodes Live
          </span>

          <button
            onClick={() => setIsPresentationMode(false)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Minimize2 className="w-4 h-4" /> Exit Presentation View
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Big Gauge + Map */}
        <div className="lg:col-span-5 space-y-6">
          <WaterQualityGauge score={primaryNode.waterQualityIndex} />
          <MonitoringMap />
        </div>

        {/* Right Column: 4 Node Telemetry Snapshot + Real-Time Graph */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 4 Node Cards Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            {nodes.map((node) => (
              <div key={node.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-white">{node.code}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    node.status === 'online' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {node.status}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] text-slate-400 uppercase">WQI Score</span>
                  <span className="text-xl font-extrabold text-cyan-300">{node.waterQualityIndex}</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] pt-1 text-slate-300">
                  <span>pH: {node.currentReadings.ph}</span>
                  <span>Turb: {node.currentReadings.turbidity} NTU</span>
                  <span>DO: {node.currentReadings.dissolvedOxygen} mg/L</span>
                  <span>Temp: {node.currentReadings.temperature}°C</span>
                </div>
              </div>
            ))}
          </div>

          <LiveTrendChart />

        </div>

      </div>

    </div>
  );
};
