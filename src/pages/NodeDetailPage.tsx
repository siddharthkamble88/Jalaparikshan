import React from 'react';
import { useAqua } from '../context/AquaContext';
import { WaterQualityGauge } from '../components/dashboard/WaterQualityGauge';
import { MetricCard } from '../components/dashboard/MetricCard';
import { LiveTrendChart } from '../components/charts/LiveTrendChart';
import { Radio, BatteryCharging, Wifi, Clock, ArrowLeft, ShieldCheck, Activity, AlertTriangle, Settings, RefreshCcw, Droplets } from 'lucide-react';

export const NodeDetailPage: React.FC = () => {
  const { selectedNodeId, setSelectedNodeId, setDashboardTab, nodes } = useAqua();

  const node = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setDashboardTab('nodes')}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sensor Nodes List
        </button>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase ${
            node.status === 'online' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
          }`}>
            ● {node.status}
          </span>
        </div>
      </div>

      {/* Main Node Summary Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Radio className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-white">{node.name}</h2>
              <span className="text-xs font-mono text-slate-400">{node.locationName} ({node.zone})</span>
            </div>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block">Battery Charge</span>
            <span className="text-white font-bold flex items-center justify-center gap-1">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" /> {node.batteryLevel}%
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block">Signal Strength</span>
            <span className="text-white font-bold flex items-center justify-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-cyan-400" /> {node.signalStrength}%
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block">GPS Location</span>
            <span className="text-cyan-300 font-bold">{node.lat.toFixed(4)}, {node.lng.toFixed(4)}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block">System Uptime</span>
            <span className="text-emerald-400 font-bold">{node.uptimePercent}%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Gauge + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <WaterQualityGauge score={node.waterQualityIndex} lastUpdated={node.lastSeen} />
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetricCard
            type="pH"
            title="pH Level"
            value={node.currentReadings.ph}
            unit="pH"
            status={node.currentReadings.ph < 6.5 || node.currentReadings.ph > 8.5 ? 'warning' : 'normal'}
            trend="stable"
            trendValue="7.2 - 7.4"
            optimalRange="6.5 - 8.5"
            icon={<Activity className="w-4 h-4" />}
          />

          <MetricCard
            type="turbidity"
            title="Turbidity Clarity"
            value={node.currentReadings.turbidity}
            unit="NTU"
            status={node.currentReadings.turbidity > 15 ? 'critical' : node.currentReadings.turbidity > 5 ? 'warning' : 'normal'}
            trend={node.currentReadings.turbidity > 5 ? 'up' : 'stable'}
            trendValue="2.0 - 5.0"
            optimalRange="< 5.0 NTU"
            icon={<Droplets className="w-4 h-4" />}
          />

          <MetricCard
            type="temperature"
            title="Water Temperature"
            value={node.currentReadings.temperature}
            unit="°C"
            status="normal"
            trend="stable"
            trendValue="22 - 27°C"
            optimalRange="18 - 28 °C"
            icon={<Activity className="w-4 h-4" />}
          />

          {node.currentReadings.dissolvedOxygen !== null && node.currentReadings.dissolvedOxygen !== undefined && (
            <MetricCard
              type="dissolvedOxygen"
              title="Dissolved Oxygen"
              value={node.currentReadings.dissolvedOxygen}
              unit="mg/L"
              status={node.currentReadings.dissolvedOxygen < 4.0 ? 'critical' : node.currentReadings.dissolvedOxygen < 6.0 ? 'warning' : 'normal'}
              trend={node.currentReadings.dissolvedOxygen < 5.0 ? 'down' : 'stable'}
              trendValue="6.5 - 8.5"
              optimalRange="> 6.0 mg/L"
              icon={<ShieldCheck className="w-4 h-4" />}
            />
          )}

          <MetricCard
            type="tds"
            title="Total Dissolved Solids"
            value={node.currentReadings.tds}
            unit="ppm"
            status={node.currentReadings.tds > 600 ? 'critical' : node.currentReadings.tds > 300 ? 'warning' : 'normal'}
            trend="stable"
            trendValue="150 - 250"
            optimalRange="< 300 ppm"
            icon={<Activity className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Real-Time Historical Graph for this specific node */}
      <LiveTrendChart initialNodeId={node.id} />

      {/* Attached Sensors Table for Node */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" /> Integrated Hardware Sensor Inventory ({node.sensors.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Sensor Name</th>
                <th className="py-2.5 px-3">Parameter</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Health %</th>
                <th className="py-2.5 px-3">Latest Reading</th>
                <th className="py-2.5 px-3">Last Calibrated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {node.sensors.map((s) => (
                <tr key={s.id} className="hover:bg-slate-900/60 text-slate-300">
                  <td className="py-3 px-3 font-bold text-white">{s.name}</td>
                  <td className="py-3 px-3 uppercase text-cyan-400">{s.type}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      s.status === 'online' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold">{s.healthPercent}%</td>
                  <td className="py-3 px-3 text-white font-bold">{s.lastReading}</td>
                  <td className="py-3 px-3 text-slate-400">{s.lastCalibration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
