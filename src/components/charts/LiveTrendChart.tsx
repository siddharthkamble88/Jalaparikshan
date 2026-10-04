import React, { useState, useEffect } from 'react';
import { ParameterType } from '../../types';
import { fetchHistoryReadings } from '../../services/api';
import { useAqua } from '../../context/AquaContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { LineChart, Clock, Filter, Layers, Activity } from 'lucide-react';

interface LiveTrendChartProps {
  initialNodeId?: string;
}

export const LiveTrendChart: React.FC<LiveTrendChartProps> = ({ initialNodeId }) => {
  const { nodes, selectedNodeId } = useAqua();
  const nodeId = initialNodeId || selectedNodeId;

  const [parameter, setParameter] = useState<ParameterType>('ph');
  const [hours, setHours] = useState<number>(24);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchHistoryReadings(nodeId, hours).then(readings => {
      if (!isMounted) return;

      const formatted = readings.map(r => ({
        timestamp: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullDate: new Date(r.timestamp).toLocaleString(),
        value: r[parameter === 'dissolvedOxygen' ? 'dissolvedOxygen' : parameter],
        ph: r.ph,
        turbidity: r.turbidity,
        temperature: r.temperature,
        dissolvedOxygen: r.dissolvedOxygen,
        tds: r.tds,
        conductivity: r.conductivity,
        wqi: r.waterQualityIndex,
      }));

      setData(formatted);
      setLoading(false);
    });

    return () => { isMounted = false; };
  }, [nodeId, parameter, hours]);

  // Compute Stats
  const values = data.map(d => d.value).filter(v => typeof v === 'number');
  const minVal = values.length ? Math.min(...values).toFixed(1) : '0';
  const maxVal = values.length ? Math.max(...values).toFixed(1) : '0';
  const avgVal = values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : '0';
  const latestVal = values.length ? values[values.length - 1].toFixed(1) : '0';

  const getParamInfo = () => {
    switch (parameter) {
      case 'ph':
        return { name: 'pH Level', unit: 'pH', color: '#22d3ee', stroke: '#06b6d4' };
      case 'turbidity':
        return { name: 'Turbidity', unit: 'NTU', color: '#f59e0b', stroke: '#d97706' };
      case 'temperature':
        return { name: 'Water Temperature', unit: '°C', color: '#38bdf8', stroke: '#0284c7' };
      case 'dissolvedOxygen':
        return { name: 'Dissolved Oxygen', unit: 'mg/L', color: '#34d399', stroke: '#10b981' };
      case 'tds':
        return { name: 'Total Dissolved Solids', unit: 'ppm', color: '#a78bfa', stroke: '#8b5cf6' };
      case 'conductivity':
        return { name: 'Electrical Conductivity', unit: 'µS/cm', color: '#f472b6', stroke: '#ec4899' };
      default:
        return { name: 'pH Level', unit: 'pH', color: '#22d3ee', stroke: '#06b6d4' };
    }
  };

  const info = getParamInfo();

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
      
      {/* Top Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <LineChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Real-Time Sensor Telemetry Graph</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Live trend dynamics for {info.name} across selected time range
            </p>
          </div>
        </div>

        {/* Time Filter & Parameter Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Parameter Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
            {(['ph', 'turbidity', 'temperature', 'dissolvedOxygen', 'tds'] as ParameterType[]).map((p) => (
              <button
                key={p}
                onClick={() => setParameter(p)}
                className={`px-2.5 py-1 rounded-lg uppercase transition-all ${
                  parameter === p
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p === 'dissolvedOxygen' ? 'D.O.' : p}
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
            {[1, 6, 24, 168].map((h) => (
              <button
                key={h}
                onClick={() => setHours(h)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  hours === h
                    ? 'bg-slate-800 text-cyan-300 font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {h === 1 ? '1H' : h === 6 ? '6H' : h === 24 ? '24H' : '7D'}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Current Latest</span>
          <span className="text-lg font-bold text-cyan-300">{latestVal} <span className="text-xs text-slate-400">{info.unit}</span></span>
        </div>
        <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Min Recorded</span>
          <span className="text-lg font-bold text-white">{minVal} <span className="text-xs text-slate-400">{info.unit}</span></span>
        </div>
        <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Max Recorded</span>
          <span className="text-lg font-bold text-white">{maxVal} <span className="text-xs text-slate-400">{info.unit}</span></span>
        </div>
        <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Period Average</span>
          <span className="text-lg font-bold text-teal-300">{avgVal} <span className="text-xs text-slate-400">{info.unit}</span></span>
        </div>
      </div>

      {/* Recharts Chart */}
      <div className="w-full h-72 pt-2">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-mono">
            Loading telemetry time series...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="paramGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={info.color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={info.color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={info.stroke}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#paramGradient)"
                name={`${info.name} (${info.unit})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
};
