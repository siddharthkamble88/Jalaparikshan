import React from 'react';
import { useAqua } from '../context/AquaContext';
import { Cpu, Server, Database, Radio, Globe, Shield, Code, ArrowRight } from 'lucide-react';

export const TechnologyPage: React.FC = () => {
  const { setActiveView } = useAqua();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
          <Code className="w-3.5 h-3.5" />
          <span>Full-Stack Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Technology & System Stack
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Robust IoT hardware integration paired with modern cloud data infrastructure.
        </p>
      </div>

      {/* Tech Layer Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="p-3 w-fit rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Hardware Layer</h3>
          <ul className="space-y-2 text-xs font-mono text-slate-300">
            <li>• ESP32 32-bit Dual-Core MCU</li>
            <li>• Solar Charge Controller + 18650 Li-Ion</li>
            <li>• ADS1115 16-Bit Precision ADC</li>
            <li>• Waterproof IP68 Float Enclosure</li>
            <li>• Analog Signal Conditioning Modules</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="p-3 w-fit rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Radio className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">IoT Gateway & Comms</h3>
          <ul className="space-y-2 text-xs font-mono text-slate-300">
            <li>• SIM7600 LTE-M / NB-IoT Cellular</li>
            <li>• SX1276 LoRaWAN Long-Range Mesh</li>
            <li>• MQTT Protocol over TLS 1.3</li>
            <li>• JSON Payload Serialization</li>
            <li>• Keep-Alive Heartbeat Telemetry</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="p-3 w-fit rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Server className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Cloud Backend & Frontend</h3>
          <ul className="space-y-2 text-xs font-mono text-slate-300">
            <li>• Express.js REST & SSE API</li>
            <li>• React 19 + TypeScript + Vite</li>
            <li>• Recharts Data Visualization</li>
            <li>• Leaflet Spatial GIS Mapping</li>
            <li>• TimescaleDB Time-Series DB</li>
          </ul>
        </div>

      </div>

      {/* Database Schema Summary */}
      <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 font-mono">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" /> Relational Database Entity Model
        </h3>
        <p className="text-xs text-slate-400">
          Normalized tables designed for high-frequency telemetry ingestion and instant time-range aggregations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-2">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block">Nodes Table</span>
            <span className="text-[11px] text-slate-400 block">id, code, name, zone, lat, lng, battery, status</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-teal-400 font-bold block">Sensors Table</span>
            <span className="text-[11px] text-slate-400 block">id, node_id, name, type, unit, health, status</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-amber-400 font-bold block">Readings Table</span>
            <span className="text-[11px] text-slate-400 block">id, node_id, ph, turbidity, temp, do, tds, timestamp</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-rose-400 font-bold block">Alerts Table</span>
            <span className="text-[11px] text-slate-400 block">id, node_id, parameter, severity, message, acknowledged</span>
          </div>
        </div>
      </div>

    </div>
  );
};
