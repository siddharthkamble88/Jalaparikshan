import React from 'react';
import { useAqua } from '../context/AquaContext';
import { WaterQualityGauge } from '../components/dashboard/WaterQualityGauge';
import {
  Droplets,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Radio,
  Cpu,
  Zap,
  BarChart2,
  Lock,
  Globe,
  AlertTriangle,
  Play
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setActiveView, setDashboardTab, nodes, totalMeasurementsCount } = useAqua();

  // Find Node 1
  const primaryNode = nodes[0] || {
    currentReadings: { ph: 7.2, turbidity: 2.8, temperature: 26.4, dissolvedOxygen: 7.4, tds: 185, conductivity: 310 },
    waterQualityIndex: 86
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-800/80">
        
        {/* Glow ambient background graphics */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>Distributed IoT Sensor Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                Know Your Water. <br />
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 bg-clip-text text-transparent">
                  In Real Time.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                JalParikshan continuously monitors water quality using intelligent IoT sensor networks, transforming raw environmental measurements into actionable intelligence to protect water bodies.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActiveView('dashboard')}
                  id="hero-dashboard-btn"
                  className="px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm flex items-center gap-2.5 shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.02]"
                >
                  <Activity className="w-4 h-4" />
                  <span>View Live Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveView('how-it-works')}
                  id="hero-how-it-works-btn"
                  className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-sm flex items-center gap-2 transition-all"
                >
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Explore How It Works</span>
                </button>
              </div>

              {/* Key Features Quick List */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Continuous Telemetry
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-Node Mesh
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automatic Alert Engine
                </span>
              </div>

            </div>

            {/* Right Hero Live Status Card Widget */}
            <div className="lg:col-span-5">
              <div className="relative glass-panel p-6 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-5">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Crystal Lake — Live Station
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                    4 Nodes Online
                  </span>
                </div>

                <div className="flex justify-center">
                  <WaterQualityGauge score={primaryNode.waterQualityIndex} />
                </div>

                {/* Live Parameters Snapshot */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">pH Level</span>
                    <span className="text-white font-bold">{primaryNode.currentReadings.ph} pH</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">Turbidity</span>
                    <span className="text-cyan-300 font-bold">{primaryNode.currentReadings.turbidity} NTU</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">Temp</span>
                    <span className="text-white font-bold">{primaryNode.currentReadings.temperature} °C</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">D.O.</span>
                    <span className="text-teal-300 font-bold">{primaryNode.currentReadings.dissolvedOxygen} mg/L</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRUST / STATISTICS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-3xl bg-slate-950 border border-slate-800 text-center">
          <div className="p-4 space-y-1 border-r border-slate-800/80 last:border-none">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-400">4</span>
            <span className="text-xs text-slate-400 font-medium block">Active Sensor Nodes</span>
          </div>
          <div className="p-4 space-y-1 border-r border-slate-800/80 last:border-none">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
              {totalMeasurementsCount.toLocaleString()}+
            </span>
            <span className="text-xs text-slate-400 font-medium block">Telemetry Measurements</span>
          </div>
          <div className="p-4 space-y-1 border-r border-slate-800/80 last:border-none">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400">99.2%</span>
            <span className="text-xs text-slate-400 font-medium block">System Uptime</span>
          </div>
          <div className="p-4 space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-teal-300">24/7</span>
            <span className="text-xs text-slate-400 font-medium block">Continuous Safeguard</span>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM VS SOLUTION COMPARISON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Water Quality Can Change Before We Notice.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Manual grab sampling is slow, periodic, and misses sudden industrial discharge or agricultural runoff spikes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Traditional Manual Approach */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-rose-500/30 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5" />
              <span>Traditional Manual Testing</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 font-mono">
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✕</span> Manual physical grab samples collected weekly or monthly.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✕</span> Days delayed waiting for laboratory chemical analysis.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✕</span> Zero visibility into night-time effluent discharges or rainfall surges.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✕</span> High labor costs and limited spatial coverage.
              </li>
            </ul>
          </div>

          {/* JalParikshan Modern Approach */}
          <div className="p-6 rounded-3xl bg-cyan-950/20 border border-cyan-500/50 space-y-4 shadow-xl shadow-cyan-500/10">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm uppercase tracking-wider">
              <ShieldCheck className="w-5 h-5" />
              <span>JalParikshan Continuous Intelligence</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 font-mono">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span> Automated real-time sampling every 3 seconds per node.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span> Instant automated alerts on threshold breaches via SMS/Web.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span> Multi-node spatial mapping across entire lake reservoirs.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span> Historical analytics, time-series graphs, and exportable reports.
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 4. SOLUTION SYSTEM ARCHITECTURE FLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            From Raw Sensor Data to Environmental Action
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Full-stack IoT pipeline connecting physical water probes to cloud intelligence
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          {[
            { step: '01', title: 'Sensors', desc: 'pH, Turbidity, DO, Temp probes immersed', icon: <Droplets className="w-5 h-5 text-cyan-400" /> },
            { step: '02', title: 'ESP32 Node', desc: 'ADC conversion & signal processing', icon: <Cpu className="w-5 h-5 text-teal-400" /> },
            { step: '03', title: 'Wireless', desc: 'Cellular / LoRaWAN telemetry payload', icon: <Radio className="w-5 h-5 text-sky-400" /> },
            { step: '04', title: 'Cloud API', desc: 'Timescale ingestion & validation', icon: <Globe className="w-5 h-5 text-cyan-300" /> },
            { step: '05', title: 'WQI Engine', desc: 'Composite index calculation', icon: <BarChart2 className="w-5 h-5 text-amber-400" /> },
            { step: '06', title: 'Alerts', desc: 'Instant dispatch to authorities', icon: <ShieldCheck className="w-5 h-5 text-emerald-400" /> },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative group hover:border-cyan-500/50 transition-colors">
              <div className="w-8 h-8 mx-auto rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 block uppercase">Step {item.step}</span>
              <h4 className="text-xs font-bold text-white">{item.title}</h4>
              <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. STRATEGIC CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-cyan-500/40 text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              See What's Happening Beneath the Surface.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore live multi-node telemetry, historical analytics, spatial location maps, and alert thresholds in our interactive monitoring console.
            </p>

            <div className="pt-4 flex justify-center gap-4">
              <button
                onClick={() => setActiveView('dashboard')}
                className="px-8 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center gap-2"
              >
                <Activity className="w-4 h-4" />
                <span>Open Live Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
