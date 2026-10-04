import React from 'react';
import { useAqua, DashboardTab } from '../../context/AquaContext';
import { LayoutDashboard, Radio, LineChart, MapPin, AlertTriangle, Activity, FileSpreadsheet, Home, ArrowLeft, ShieldAlert, Lock } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    dashboardTab,
    setDashboardTab,
    setActiveView,
    alerts,
    nodes,
    isAuthorityAuthenticated,
    setIsAuthorityLoginOpen
  } = useAqua();

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  const tabs: { id: DashboardTab; label: string; icon: React.ReactNode; badge?: number | string; badgeColor?: string; isPrivileged?: boolean }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'nodes', label: 'Sensor Nodes', icon: <Radio className="w-4 h-4" />, badge: `${nodes.length} Live` },
    { id: 'analytics', label: 'Historical Analytics', icon: <LineChart className="w-4 h-4" /> },
    { id: 'map', label: 'GIS Location Map', icon: <MapPin className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alert Center', icon: <AlertTriangle className="w-4 h-4" />, badge: unacknowledgedCount > 0 ? unacknowledgedCount : undefined },
    { id: 'reports', label: 'Reports & Export', icon: <FileSpreadsheet className="w-4 h-4" /> },
    {
      id: 'authority',
      label: 'Authority Control',
      icon: <ShieldAlert className={`w-4 h-4 ${isAuthorityAuthenticated ? 'text-amber-400' : 'text-slate-400'}`} />,
      badge: isAuthorityAuthenticated ? 'Active' : 'Locked',
      badgeColor: isAuthorityAuthenticated ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-[#102b34] text-[#9fbdc2]',
      isPrivileged: true
    },
  ];

  const handleTabClick = (tabId: DashboardTab) => {
    if (tabId === 'authority' && !isAuthorityAuthenticated) {
      setIsAuthorityLoginOpen(true);
      return;
    }
    setDashboardTab(tabId);
  };

  return (
    <aside className="w-full md:w-64 bg-[#0b1f26] border-r border-[#1e4652] p-4 flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        
        {/* Return to Web view */}
        <button
          onClick={() => setActiveView('home')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#9fbdc2] hover:text-[#5ad1c9] hover:bg-[#102b34] border border-transparent hover:border-[#1e4652] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to JalParikshan Web</span>
        </button>

        <div className="border-t border-[#1e4652] pt-3">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#9fbdc2]">
            Monitoring Console
          </div>
          
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const isActive = dashboardTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  id={`dashboard-tab-${tab.id}`}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? tab.id === 'authority'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500 font-bold'
                        : 'bg-[#123540] text-[#5ad1c9] border border-[#5ad1c9] font-semibold'
                      : 'text-[#9fbdc2] hover:text-[#e7f2f2] hover:bg-[#102b34]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? (tab.id === 'authority' ? 'text-amber-400' : 'text-[#5ad1c9]') : 'text-[#9fbdc2]'}>
                      {tab.icon}
                    </span>
                    <span className={tab.id === 'authority' && isAuthorityAuthenticated ? 'text-amber-200 font-bold' : ''}>
                      {tab.label}
                    </span>
                  </div>
                  {tab.badge !== undefined && (
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-mono font-bold border ${
                      tab.badgeColor
                        ? tab.badgeColor
                        : typeof tab.badge === 'number'
                        ? 'bg-[rgba(242,102,94,0.2)] text-[#f2665e] border-[#f2665e]'
                        : 'bg-[#102b34] text-[#9fbdc2] border-[#1e4652]'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      {/* System Status mini panel */}
      <div className="bg-[#102b34] border border-[#1e4652] p-3 rounded-2xl space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-[#9fbdc2]">ESP32 IoT Feed</span>
          <span className="text-[#3ecf8e] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e] animate-ping"></span>
            Connected
          </span>
        </div>
        <div className="w-full bg-[#0b1f26] h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#2fb3a3] h-full w-[99.2%]"></div>
        </div>
        <div className="flex justify-between text-[10px] text-[#9fbdc2] font-mono">
          <span>Uptime: 99.8%</span>
          <span>Mesh: {nodes.length} Points</span>
        </div>
      </div>
    </aside>
  );
};
