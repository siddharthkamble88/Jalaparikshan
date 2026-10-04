import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { BarChart3, ScatterChart as ScatterIcon, Layers } from 'lucide-react';

export const MultiParameterChart: React.FC = () => {
  // Simulated node comparison bar data
  const nodeComparison = [
    { name: 'Node 01 (North)', WQI: 88, Turbidity: 2.4, DO: 7.8, pH: 7.3 },
    { name: 'Node 02 (East)', WQI: 68, Turbidity: 6.8, DO: 5.4, pH: 8.6 },
    { name: 'Node 03 (South)', WQI: 44, Turbidity: 22.4, DO: 3.8, pH: 6.1 },
    { name: 'Node 04 (West)', WQI: 91, Turbidity: 1.8, DO: 8.2, pH: 7.2 },
  ];

  // Correlation data (Turbidity vs Dissolved Oxygen)
  const correlationData = [
    { turbidity: 1.8, do: 8.2, node: 'Node 04' },
    { turbidity: 2.4, do: 7.8, node: 'Node 01' },
    { turbidity: 6.8, do: 5.4, node: 'Node 02' },
    { turbidity: 12.0, do: 4.8, node: 'Node 03 (History)' },
    { turbidity: 18.5, do: 4.1, node: 'Node 03 (History)' },
    { turbidity: 22.4, do: 3.8, node: 'Node 03 (Current)' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Bar Chart: Node WQI Comparison */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Cross-Node WQI Score Comparison</h4>
            <span className="text-xs text-slate-400 font-mono">Overall Water Quality Index by Monitoring Location</span>
          </div>
        </div>

        <div className="w-full h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={nodeComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
              <Bar dataKey="WQI" fill="#22d3ee" radius={[8, 8, 0, 0]} name="Water Quality Index" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scatter Plot: Turbidity vs Dissolved Oxygen Correlation */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <ScatterIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Parameter Correlation Analysis</h4>
            <span className="text-xs text-slate-400 font-mono">Turbidity (NTU) vs. Dissolved Oxygen (mg/L)</span>
          </div>
        </div>

        <div className="w-full h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="turbidity" name="Turbidity" unit=" NTU" stroke="#64748b" fontSize={11} />
              <YAxis dataKey="do" name="Dissolved Oxygen" unit=" mg/L" stroke="#64748b" fontSize={11} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
              <Scatter name="Sensor Observations" data={correlationData} fill="#34d399" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
