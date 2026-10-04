import React from 'react';
import { useAqua, MainView } from '../../context/AquaContext';
import { Droplets, Radio, ShieldCheck, ArrowUpRight, Github, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setDashboardTab } = useAqua();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Jal<span className="text-cyan-400">Parikshan</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Real-Time Intelligence for Cleaner Water." Continuous environmental monitoring through distributed IoT sensor networks.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Mesh Gateway Operational</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Platform Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setActiveView('home')} className="hover:text-cyan-400 transition-colors">Home Overview</button></li>
              <li><button onClick={() => setActiveView('dashboard')} className="hover:text-cyan-400 transition-colors">Live Dashboard</button></li>
              <li><button onClick={() => setActiveView('how-it-works')} className="hover:text-cyan-400 transition-colors">How It Works Process</button></li>
              <li><button onClick={() => setActiveView('sensors')} className="hover:text-cyan-400 transition-colors">Sensors & Probes</button></li>
              <li><button onClick={() => setActiveView('technology')} className="hover:text-cyan-400 transition-colors">Hardware & Tech Architecture</button></li>
            </ul>
          </div>

          {/* Live Monitoring */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Dashboard Views</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => { setActiveView('dashboard'); setDashboardTab('overview'); }} className="hover:text-cyan-400 transition-colors">Water Quality Index Score</button></li>
              <li><button onClick={() => { setActiveView('dashboard'); setDashboardTab('nodes'); }} className="hover:text-cyan-400 transition-colors">Sensor Nodes Telemetry</button></li>
              <li><button onClick={() => { setActiveView('dashboard'); setDashboardTab('analytics'); }} className="hover:text-cyan-400 transition-colors">Historical Trend Analytics</button></li>
              <li><button onClick={() => { setActiveView('dashboard'); setDashboardTab('map'); }} className="hover:text-cyan-400 transition-colors">GIS Spatial Location Map</button></li>
              <li><button onClick={() => { setActiveView('dashboard'); setDashboardTab('alerts'); }} className="hover:text-cyan-400 transition-colors">Critical Alert Engine</button></li>
              <li><button onClick={() => { setActiveView('dashboard'); setDashboardTab('reports'); }} className="hover:text-cyan-400 transition-colors">Export CSV & Data Reports</button></li>
            </ul>
          </div>

          {/* Contact & Disclaimer */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Environmental Intelligence</h4>
            <p className="text-xs text-slate-400 mb-3">
              Designed for environmental researchers, water management authorities, and IoT deployment teams.
            </p>
            <button
              onClick={() => setActiveView('contact')}
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Contact Engineering Team <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

        </div>

        {/* Technical Disclaimer & Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="max-w-2xl">
            <span className="font-semibold text-slate-400">Technical Disclaimer:</span> Water quality indicators shown are calculated based on configured IoT sensor inputs and calibrated mathematical algorithms. Interpret parameters in accordance with localized environmental standards.
          </p>
          <div className="flex items-center gap-4">
            <span>© 2026 JalParikshan IoT Platform</span>
            <span className="text-slate-400">|</span>
            <span className="text-cyan-400 font-mono text-[11px]">v2.4.0 (ESP32-Ready)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
