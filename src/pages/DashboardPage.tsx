import React from 'react';
import { useAqua } from '../context/AquaContext';
import { NodeCard } from '../components/dashboard/NodeCard';
import { SensorTrendsGrid } from '../components/charts/SensorTrendsGrid';
import { WaterQualityGauge } from '../components/dashboard/WaterQualityGauge';
import { MetricCard } from '../components/dashboard/MetricCard';
import { AlertCard } from '../components/dashboard/AlertCard';
import { LiveTrendChart } from '../components/charts/LiveTrendChart';
import { MultiParameterChart } from '../components/charts/MultiParameterChart';
import { MonitoringMap } from '../components/map/MonitoringMap';
import { NodeDetailPage } from './NodeDetailPage';
import { ReportsPage } from './ReportsPage';
import { Sidebar } from '../components/navigation/Sidebar';
import { DashboardHeader } from '../components/navigation/DashboardHeader';
import { AuthorityControlHub } from '../components/authority/AuthorityControlHub';
import {
  Activity,
  Droplets,
  ShieldCheck,
  Radio,
  AlertTriangle,
  LineChart,
  Megaphone
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    dashboardTab,
    setDashboardTab,
    nodes,
    alerts,
    acknowledgeAlert,
    setSelectedNodeId,
    selectedNodeId,
    advisories,
    isAuthorityAuthenticated
  } = useAqua();

  const activeNodeId = selectedNodeId || nodes[0]?.id || 'river';
  const selectedNode = nodes.find(n => n.id === activeNodeId) || nodes[0];

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="min-h-screen bg-[#0b1f26] text-[#e7f2f2] flex flex-col">
      <DashboardHeader />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 space-y-8 overflow-x-hidden">
          
          {/* TAB 1: OVERVIEW (Main Water Quality Monitoring Dashboard) */}
          {dashboardTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Official Public Advisories Alert Banner */}
              {advisories.filter(a => a.active).length > 0 && (
                <div className="space-y-3">
                  {advisories.filter(a => a.active).map(adv => (
                    <div
                      key={adv.id}
                      className={`p-4 rounded-2xl border flex items-start justify-between gap-4 text-xs ${
                        adv.severity === 'critical'
                          ? 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                          : adv.severity === 'warning'
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                          : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-black/30 mt-0.5">
                          <Megaphone className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="uppercase text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-black/40">
                              Official Authority Advisory
                            </span>
                            <span className="font-bold text-sm text-white">{adv.title}</span>
                          </div>
                          <p className="text-xs text-[#e7f2f2]/90 leading-relaxed font-sans">
                            {adv.message}
                          </p>
                          <div className="text-[10px] text-[#9fbdc2] font-mono">
                            Issued by: {adv.issuedBy} &middot; {new Date(adv.issuedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Location Cards Section */}
              <div>
                <p className="text-[13px] uppercase tracking-[0.8px] text-[#9fbdc2] font-semibold mb-3">
                  Monitoring Points
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="cards">
                  {nodes.map(n => (
                    <NodeCard
                      key={n.id}
                      node={n}
                      isSelected={n.id === activeNodeId}
                      onSelect={(id) => setSelectedNodeId(id)}
                    />
                  ))}
                </div>
              </div>

              {/* Sensor Trends Grid Section */}
              <SensorTrendsGrid locationId={activeNodeId} />

              {/* Water Quality Index Gauge & Key Parameter Snapshot */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-[#1e4652]">
                <div className="lg:col-span-4">
                  <WaterQualityGauge score={selectedNode.waterQualityIndex} />
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <MetricCard
                    type="ph"
                    title="pH Balance"
                    value={selectedNode.currentReadings.ph}
                    unit="pH"
                    status="normal"
                    trend="stable"
                    trendValue="7.2 - 7.4"
                    optimalRange="6.5 - 8.5"
                    icon={<Activity className="w-4 h-4" />}
                  />

                  <MetricCard
                    type="turbidity"
                    title="Turbidity Clarity"
                    value={selectedNode.currentReadings.turbidity}
                    unit="NTU"
                    status={selectedNode.currentReadings.turbidity > 5 ? 'warning' : 'normal'}
                    trend="stable"
                    trendValue="2.0 - 4.5"
                    optimalRange="< 5.0 NTU"
                    icon={<Droplets className="w-4 h-4" />}
                  />

                  <MetricCard
                    type="temperature"
                    title="Water Temp"
                    value={selectedNode.currentReadings.temperature}
                    unit="°C"
                    status="normal"
                    trend="stable"
                    trendValue="22 - 27°C"
                    optimalRange="18 - 28 °C"
                    icon={<Activity className="w-4 h-4" />}
                  />

                  {selectedNode.currentReadings.dissolvedOxygen !== null && selectedNode.currentReadings.dissolvedOxygen !== undefined && (
                    <MetricCard
                      type="dissolvedOxygen"
                      title="Dissolved Oxygen"
                      value={selectedNode.currentReadings.dissolvedOxygen}
                      unit="mg/L"
                      status={selectedNode.currentReadings.dissolvedOxygen < 4.0 ? 'critical' : 'normal'}
                      trend="stable"
                      trendValue="6.5 - 8.5"
                      optimalRange="> 6.0 mg/L"
                      icon={<ShieldCheck className="w-4 h-4" />}
                    />
                  )}

                  <MetricCard
                    type="tds"
                    title="Dissolved Solids"
                    value={selectedNode.currentReadings.tds}
                    unit="ppm"
                    status="normal"
                    trend="stable"
                    trendValue="150 - 220"
                    optimalRange="< 300 ppm"
                    icon={<Activity className="w-4 h-4" />}
                  />

                  <MetricCard
                    type="conductivity"
                    title="Conductivity"
                    value={selectedNode.currentReadings.conductivity}
                    unit="µS/cm"
                    status="normal"
                    trend="stable"
                    trendValue="280 - 350"
                    optimalRange="< 500 µS/cm"
                    icon={<Activity className="w-4 h-4" />}
                  />
                </div>
              </div>

              {/* Active Alerts Snapshot */}
              {unacknowledgedAlerts.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-[#1e4652]">
                  <h3 className="text-lg font-bold text-[#e7f2f2] flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-[#f2665e]" /> Recent Active System Alerts
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {unacknowledgedAlerts.slice(0, 2).map(alert => (
                      <AlertCard key={alert.id} alert={alert} onAcknowledge={acknowledgeAlert} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: SENSOR NODES */}
          {dashboardTab === 'nodes' && (
            <div className="space-y-6">
              {selectedNodeId ? (
                <NodeDetailPage />
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#e7f2f2] flex items-center gap-2">
                      <Radio className="w-5 h-5 text-[#5ad1c9]" /> Monitoring Network Points
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {nodes.map(n => (
                      <NodeCard
                        key={n.id}
                        node={n}
                        isSelected={n.id === selectedNodeId}
                        onSelect={(id) => setSelectedNodeId(id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HISTORICAL ANALYTICS */}
          {dashboardTab === 'analytics' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#e7f2f2] flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-[#5ad1c9]" /> Multi-Parameter Historical Analytics
                  </h2>
                  <p className="text-xs text-[#9fbdc2] font-mono">
                    Cross-parameter correlation, parameter distribution, and node performance comparisons
                  </p>
                </div>
              </div>

              <LiveTrendChart />
              <MultiParameterChart />
            </div>
          )}

          {/* TAB 4: GIS MAP */}
          {dashboardTab === 'map' && (
            <div className="space-y-6">
              <MonitoringMap onSelectNode={(id) => {
                setSelectedNodeId(id);
                setDashboardTab('nodes');
              }} />
            </div>
          )}

          {/* TAB 5: ALERTS LOG */}
          {dashboardTab === 'alerts' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#e7f2f2] flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-[#f2665e]" /> Incident & Alert Log
                  </h2>
                  <p className="text-xs text-[#9fbdc2] font-mono">
                    Real-time threshold breach notifications and acknowledgement log
                  </p>
                </div>

                <div className="text-xs font-mono text-[#9fbdc2]">
                  Total Events Logged: <strong className="text-white">{alerts.length}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alerts.map(alert => (
                  <AlertCard key={alert.id} alert={alert} onAcknowledge={acknowledgeAlert} />
                ))}
              </div>
            </div>
          )}

          {/* REPORTS & EXPORT */}
          {dashboardTab === 'reports' && (
            <ReportsPage />
          )}

          {/* AUTHORITY CONTROL HUB (Privileged Environmental Authority Portal) */}
          {dashboardTab === 'authority' && (
            <AuthorityControlHub />
          )}

        </main>
      </div>
    </div>
  );
};
