import React, { useState, useEffect } from 'react';
import { useAqua } from '../../context/AquaContext';
import { fetchHistoryReadings } from '../../services/api';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface SensorTrendsGridProps {
  locationId?: string;
}

interface SensorConfig {
  field: 'temperature' | 'ph' | 'dissolvedOxygen' | 'turbidity' | 'tds';
  name: string;
  unit: string;
  color: string;
  safeMin: number;
  safeMax: number;
  warnMin: number;
  warnMax: number;
}

const SENSORS: SensorConfig[] = [
  {
    field: 'temperature',
    name: 'Temperature',
    unit: '°C',
    color: '#f2994a',
    safeMin: 15,
    safeMax: 28,
    warnMin: 10,
    warnMax: 32,
  },
  {
    field: 'ph',
    name: 'pH',
    unit: '',
    color: '#5ad1c9',
    safeMin: 6.5,
    safeMax: 8.5,
    warnMin: 6.0,
    warnMax: 9.0,
  },
  {
    field: 'dissolvedOxygen',
    name: 'Dissolved Oxygen',
    unit: 'mg/L',
    color: '#4f8ef7',
    safeMin: 6,
    safeMax: 14,
    warnMin: 4,
    warnMax: 16,
  },
  {
    field: 'turbidity',
    name: 'Turbidity',
    unit: 'NTU',
    color: '#c77dff',
    safeMin: 0,
    safeMax: 5,
    warnMin: 0,
    warnMax: 10,
  },
  {
    field: 'tds',
    name: 'Total Dissolved Solids (TDS)',
    unit: 'ppm',
    color: '#a78bfa',
    safeMin: 50,
    safeMax: 300,
    warnMin: 0,
    warnMax: 600,
  },
];

export const SensorTrendsGrid: React.FC<SensorTrendsGridProps> = ({ locationId }) => {
  const { nodes, selectedNodeId } = useAqua();
  const activeId = locationId || selectedNodeId;
  const targetNode = nodes.find(n => n.id === activeId) || nodes[0];

  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchHistoryReadings(targetNode.id, 24).then(readings => {
      if (!isMounted) return;
      const formatted = readings.map(r => ({
        timeLabel: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dateLabel: new Date(r.timestamp).toLocaleDateString([], { day: '2-digit', month: 'short' }),
        temperature: r.temperature,
        ph: r.ph,
        dissolvedOxygen: r.dissolvedOxygen,
        turbidity: r.turbidity,
        tds: r.tds,
        rawTimestamp: r.timestamp,
      }));
      setHistoryData(formatted);
      setLoading(false);
    });

    return () => { isMounted = false; };
  }, [targetNode.id]);

  const classify = (value: number | null, s: SensorConfig) => {
    if (value === null || value === undefined || isNaN(value)) return 'unknown';
    if (value >= s.safeMin && value <= s.safeMax) return 'safe';
    if (value >= s.warnMin && value <= s.warnMax) return 'warn';
    return 'danger';
  };

  return (
    <div className="space-y-4">
      <p className="text-[13px] uppercase tracking-[0.8px] text-[#9fbdc2] font-semibold" id="chartsLabel">
        Sensor trends — {targetNode.name}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="chartsGrid">
        {SENSORS.filter((s) => targetNode.currentReadings[s.field] !== null && targetNode.currentReadings[s.field] !== undefined).map((s) => {
          const latestValue = targetNode.currentReadings[s.field];
          const status = classify(latestValue, s);

          return (
            <div
              key={s.field}
              className="bg-[#102b34] border border-[#1e4652] rounded-[10px] p-5 pt-5 pb-3 transition-colors"
              style={{ borderTop: `3px solid ${s.color}` }}
            >
              {/* Panel Header */}
              <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                <div>
                  <h2 className="font-serif text-[18px] text-[#e7f2f2] font-normal flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: s.color }}></span>
                    {s.name}
                  </h2>
                  <div className="text-xs text-[#9fbdc2]">
                    Last {historyData.length} readings
                  </div>
                </div>
              </div>

              {/* Alert Banner */}
              {status === 'danger' && (
                <div className="bg-[rgba(242,102,94,0.15)] border border-[#f2665e] text-[#f2665e] text-[12.5px] font-semibold p-2 px-3 rounded-md mb-3">
                  ⚠ High alert: {s.name} is at {latestValue}{s.unit}, outside the safe range ({s.safeMin}–{s.safeMax}{s.unit}).
                </div>
              )}
              {status === 'warn' && (
                <div className="bg-[rgba(242,184,75,0.15)] border border-[#f2b84b] text-[#f2b84b] text-[12.5px] font-semibold p-2 px-3 rounded-md mb-3">
                  ⚠ Caution: {s.name} is at {latestValue}{s.unit}, nearing an unsafe level.
                </div>
              )}

              {/* Latest Line */}
              <div className="text-xs text-[#9fbdc2] mb-2 font-mono">
                Latest: <span className="text-[#e7f2f2] font-semibold">{latestValue}{s.unit}</span> &middot; {targetNode.lastSeen}
              </div>

              {/* Chart Canvas Box */}
              <div className="h-[220px] w-full relative">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#9fbdc2] font-mono">
                    Loading telemetry feed...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`grad-${s.field}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={s.color} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={s.color} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e4652" vertical={false} />
                      <XAxis dataKey="timeLabel" stroke="#9fbdc2" fontSize={11} tickLine={false} />
                      <YAxis stroke="#9fbdc2" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#123540',
                          borderColor: '#1e4652',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: '#e7f2f2',
                        }}
                        formatter={(val: any) => [`${val}${s.unit}`, s.name]}
                      />
                      <Area
                        type="monotone"
                        dataKey={s.field}
                        stroke={s.color}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill={`url(#grad-${s.field})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
