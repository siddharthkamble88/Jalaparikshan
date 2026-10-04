import React from 'react';
import { useAqua } from '../context/AquaContext';
import { Activity, Droplets, Cpu, Radio, Database, BarChart2, ShieldAlert, ArrowRight } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { setActiveView } = useAqua();

  const steps = [
    {
      num: '01',
      title: 'Sense — Physical Water Probes',
      desc: 'Submersible glass electrode pH, optical turbidity, DS18B20 temp, and galvanic Dissolved Oxygen probes continuously measure chemical and physical water metrics.',
      icon: <Droplets className="w-5 h-5 text-cyan-400" />
    },
    {
      num: '02',
      title: 'Process — ESP32 Microcontroller',
      desc: 'An energy-efficient ESP32 microcontroller performs analog-to-digital conversion, applies calibration curve offsets, and formats JSON sensor telemetry payloads.',
      icon: <Cpu className="w-5 h-5 text-teal-400" />
    },
    {
      num: '03',
      title: 'Transmit — Wireless IoT Network',
      desc: 'Telemetry packets are dispatched wirelessly every 3 seconds over cellular LTE-M or LoRaWAN mesh gateways directly to our secure cloud endpoint.',
      icon: <Radio className="w-5 h-5 text-sky-400" />
    },
    {
      num: '04',
      title: 'Store — Time-Series Database',
      desc: 'Measurements are indexed chronologically with node ID, location coordinates, parameter value, and timestamp in high-throughput Timescale storage.',
      icon: <Database className="w-5 h-5 text-indigo-400" />
    },
    {
      num: '05',
      title: 'Analyze — WQI Algorithm',
      desc: 'The analytics engine evaluates parameter readings against configurable safety thresholds and computes a normalized 0-100 Water Quality Index score.',
      icon: <BarChart2 className="w-5 h-5 text-amber-400" />
    },
    {
      num: '06',
      title: 'Visualize — Live Dashboard',
      desc: 'Data is rendered on interactive gauges, Recharts trend graphs, and GIS spatial lake map markers for immediate intuitive interpretation.',
      icon: <Activity className="w-5 h-5 text-cyan-300" />
    },
    {
      num: '07',
      title: 'Alert — Automated Incident Dispatch',
      desc: 'If pH, turbidity, or DO breaches critical warning bounds, automated alerts are broadcasted to environmental officers and dashboard logs instantly.',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
          <Activity className="w-3.5 h-3.5" />
          <span>7-Step Pipeline</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How JalParikshan Works
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          From physical immersion in water bodies to real-time cloud visualizations and automated alert logs.
        </p>
      </div>

      {/* Step Timeline Grid */}
      <div className="space-y-6">
        {steps.map((s, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:border-cyan-500/50 transition-colors">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-extrabold font-mono text-cyan-400/60 group-hover:text-cyan-400 transition-colors">{s.num}</span>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                {s.icon}
              </div>
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="text-lg font-bold text-white">{s.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => setActiveView('dashboard')}
          className="px-8 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-extrabold text-sm inline-flex items-center gap-2"
        >
          View Live Dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
