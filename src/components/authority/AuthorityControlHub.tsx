import React, { useState } from 'react';
import { useAqua } from '../../context/AquaContext';
import { AuthorityThresholdEditor } from './AuthorityThresholdEditor';
import { AuthorityStationManager } from './AuthorityStationManager';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Sliders,
  Radio,
  AlertTriangle,
  Zap,
  CheckCircle2,
  FileText,
  BadgeAlert,
  Server
} from 'lucide-react';

export const AuthorityControlHub: React.FC = () => {
  const {
    isAuthorityAuthenticated,
    setIsAuthorityLoginOpen,
    logoutAuthority,
    userRole,
    nodes,
    alerts,
    activeRegulatoryStandard,
    triggerAnomaly
  } = useAqua();

  const [activeSubTab, setActiveSubTab] = useState<'thresholds' | 'stations' | 'simulator'>('thresholds');

  if (!isAuthorityAuthenticated) {
    return (
      <div className="bg-[#102b34] border border-[#1e4652] rounded-3xl p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Authority Credentials Required</h2>
          <p className="text-xs text-[#9fbdc2] leading-relaxed max-w-md mx-auto">
            This administrative control panel is restricted to certified pollution control engineers and water quality authorities.
          </p>
        </div>

        <button
          onClick={() => setIsAuthorityLoginOpen(true)}
          className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-amber-500/20 transition-all inline-flex items-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Authenticate Departmental Passcode</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Authority Header & Session Bar */}
      <div className="bg-gradient-to-r from-[#102b34] via-[#123540] to-[#0b1f26] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Water Quality Authority Command Hub
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  Privileged Mode
                </span>
              </div>
              <p className="text-xs text-[#9fbdc2] font-mono mt-0.5">
                Central Pollution Control & Environmental Water Quality Directorate
              </p>
            </div>
          </div>

          {/* Session Lock Button */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right font-mono">
              <span className="text-[11px] text-[#e7f2f2] block font-bold">{userRole.name}</span>
              <span className="text-[10px] text-[#3ecf8e]">Session Active &middot; Verified</span>
            </div>

            <button
              onClick={logoutAuthority}
              className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
              title="Lock Authority Portal and revert to Citizen View"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock & Return to Citizen View</span>
            </button>
          </div>

        </div>

        {/* Quick System Diagnostics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#1e4652]/80 text-xs font-mono">
          <div className="bg-[#0b1f26]/80 p-2.5 rounded-xl border border-[#1e4652]">
            <span className="text-[10px] text-[#9fbdc2] block">Current Standard</span>
            <span className="text-amber-400 font-bold">{activeRegulatoryStandard} Regulatory Limits</span>
          </div>

          <div className="bg-[#0b1f26]/80 p-2.5 rounded-xl border border-[#1e4652]">
            <span className="text-[10px] text-[#9fbdc2] block">Active Stations</span>
            <span className="text-white font-bold">{nodes.length} Physical Points</span>
          </div>

          <div className="bg-[#0b1f26]/80 p-2.5 rounded-xl border border-[#1e4652]">
            <span className="text-[10px] text-[#9fbdc2] block">Pending Incidents</span>
            <span className="text-[#f2665e] font-bold">{alerts.filter(a => !a.acknowledged).length} Unacknowledged</span>
          </div>

          <div className="bg-[#0b1f26]/80 p-2.5 rounded-xl border border-[#1e4652]">
            <span className="text-[10px] text-[#9fbdc2] block">Telemetry Stream</span>
            <span className="text-[#3ecf8e] font-bold">120 msg/min Encrypted</span>
          </div>
        </div>

      </div>

      {/* Authority Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1e4652] pb-3">
        <button
          onClick={() => setActiveSubTab('thresholds')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'thresholds'
              ? 'bg-[#2fb3a3] text-[#0b1f26] shadow-lg shadow-[#2fb3a3]/20 font-extrabold'
              : 'text-[#9fbdc2] hover:text-white hover:bg-[#102b34]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Sensor Min/Max Threshold Calibration</span>
        </button>

        <button
          onClick={() => setActiveSubTab('stations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'stations'
              ? 'bg-[#2fb3a3] text-[#0b1f26] shadow-lg shadow-[#2fb3a3]/20 font-extrabold'
              : 'text-[#9fbdc2] hover:text-white hover:bg-[#102b34]'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Station Telemetry & Public Advisories</span>
        </button>

        <button
          onClick={() => setActiveSubTab('simulator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'simulator'
              ? 'bg-[#2fb3a3] text-[#0b1f26] shadow-lg shadow-[#2fb3a3]/20 font-extrabold'
              : 'text-[#9fbdc2] hover:text-white hover:bg-[#102b34]'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Stress Testing & Anomaly Drills</span>
        </button>
      </div>

      {/* Sub-Tab Contents */}
      {activeSubTab === 'thresholds' && <AuthorityThresholdEditor />}
      {activeSubTab === 'stations' && <AuthorityStationManager />}

      {activeSubTab === 'simulator' && (
        <div className="bg-[#102b34] border border-[#1e4652] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#1e4652]">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Emergency Simulation & Response Drills</h3>
              <p className="text-xs text-[#9fbdc2] font-mono">
                Inject controlled sensor telemetry spikes to evaluate automated warning dispatches
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <button
              onClick={() => triggerAnomaly('river', 'turbidity_spike')}
              className="p-4 rounded-2xl bg-[#0b1f26] hover:bg-rose-950/30 border border-[#1e4652] hover:border-rose-500 text-left space-y-2 transition-all"
            >
              <div className="text-rose-400 font-bold text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Sediment Runoff Surge (28.5 NTU)
              </div>
              <p className="text-[11px] text-[#9fbdc2]">
                Simulates industrial effluent or monsoon soil erosion in River Main Stream.
              </p>
            </button>

            <button
              onClick={() => triggerAnomaly('tank2', 'do_drop')}
              className="p-4 rounded-2xl bg-[#0b1f26] hover:bg-amber-950/30 border border-[#1e4652] hover:border-amber-500 text-left space-y-2 transition-all"
            >
              <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> DO Depletion Event (3.2 mg/L)
              </div>
              <p className="text-[11px] text-[#9fbdc2]">
                Simulates organic biological decay and oxygen hypoxia stress in Tank 2.
              </p>
            </button>

            <button
              onClick={() => triggerAnomaly('river', 'reset')}
              className="p-4 rounded-2xl bg-[#0b1f26] hover:bg-emerald-950/30 border border-[#1e4652] hover:border-emerald-500 text-left space-y-2 transition-all"
            >
              <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Reset Network to Normal
              </div>
              <p className="text-[11px] text-[#9fbdc2]">
                Clears manual simulation overrides and resets telemetry to baseline conditions.
              </p>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
