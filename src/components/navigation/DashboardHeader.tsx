import React from 'react';
import { useAqua } from '../../context/AquaContext';
import { Activity, Maximize2, Minimize2, Radio, Zap, Shield, User, RefreshCw, AlertTriangle, Lock } from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  const {
    lastUpdatedTime,
    setIsSimulatorOpen,
    setIsConnectModalOpen,
    isPresentationMode,
    setIsPresentationMode,
    userRole,
    alerts,
    nodes,
    isAuthorityAuthenticated,
    setIsAuthorityLoginOpen,
    logoutAuthority
  } = useAqua();

  const unacknowledgedCritical = alerts.filter(a => !a.acknowledged && a.severity === 'critical').length;
  const onlineCount = nodes.filter(n => n.status === 'online').length;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#1e4652] bg-[#0b1f26]/95 backdrop-blur-md px-4 sm:px-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Left: Main Dashboard Title & Live ThingSpeak Status */}
        <div>
          <h1 className="text-xl sm:text-2xl font-normal text-[#e7f2f2] tracking-tight font-serif">
            Lake / River Water Quality Monitor
          </h1>
          <p className="text-xs text-[#9fbdc2] mt-0.5">
            Live readings from {nodes.length} monitoring points
          </p>
        </div>

        {/* Center: Live Status Indicator */}
        <div className="flex items-center gap-2 bg-[#102b34] border border-[#1e4652] px-3.5 py-1.5 rounded-full text-xs font-mono">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3ecf8e] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3ecf8e]"></span>
          </span>
          <span id="statusText" className="text-[#e7f2f2] font-medium">
            Live ESP32 Stream &middot; Updated {lastUpdatedTime}
          </span>
        </div>

        {/* Right: Action Buttons & Role Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Connect Real Sensor Button */}
          <button
            onClick={() => setIsConnectModalOpen(true)}
            id="open-connect-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(90,209,201,0.15)] hover:bg-[rgba(90,209,201,0.25)] text-[#5ad1c9] border border-[#5ad1c9]/40 text-xs font-semibold transition-all"
            title="Connect your ThingSpeak Channel or custom IoT sensor feed"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Connect Sensor</span>
          </button>

          {/* Demo Control Room Button */}
          <button
            onClick={() => setIsSimulatorOpen(true)}
            id="open-simulator-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(242,184,75,0.15)] hover:bg-[rgba(242,184,75,0.25)] text-[#f2b84b] border border-[rgba(242,184,75,0.3)] text-xs font-semibold transition-all"
            title="Open Demo Simulator to trigger anomalies or test alert flows"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulator</span>
          </button>

          {/* Presentation Mode */}
          <button
            onClick={() => setIsPresentationMode(!isPresentationMode)}
            id="toggle-presentation-btn"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isPresentationMode
                ? 'bg-[#2fb3a3] text-[#0b1f26] border-[#5ad1c9] font-bold'
                : 'bg-[#102b34] hover:bg-[#123540] text-[#e7f2f2] border-[#1e4652]'
            }`}
          >
            {isPresentationMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isPresentationMode ? 'Exit Demo' : 'Presentation Mode'}</span>
          </button>

          {/* Authority Portal Toggle / Status */}
          {isAuthorityAuthenticated ? (
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/15 to-amber-600/10 border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <div className="font-mono text-xs">
                <span className="text-amber-300 font-bold hidden sm:inline">Authority Mode: </span>
                <span className="text-white font-medium">Control Active</span>
              </div>
              <button
                onClick={logoutAuthority}
                className="ml-1 px-2 py-0.5 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white text-[10px] font-mono flex items-center gap-1 transition-colors"
                title="Lock Authority Portal and revert to Citizen View"
              >
                <Lock className="w-3 h-3" /> Lock
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#102b34] text-[#9fbdc2] text-xs font-mono border border-[#1e4652]">
                <User className="w-3 h-3 text-cyan-400" /> Public Citizen View
              </span>

              <button
                onClick={() => setIsAuthorityLoginOpen(true)}
                id="header-authority-login-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 hover:border-amber-400 text-xs font-semibold transition-all shadow-sm"
                title="Accredited Environmental Officers: Enter password to edit sensor thresholds"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Authority Login</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
