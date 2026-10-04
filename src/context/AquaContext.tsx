import React, { createContext, useContext, useState, useEffect } from 'react';
import { NodeInfo, AlertItem, ParameterThreshold, SystemStatusInfo, UserRole, PublicAdvisory, RegulatoryStandard } from '../types';
import {
  INITIAL_NODES,
  INITIAL_ALERTS,
  DEFAULT_THRESHOLDS,
  CPCB_THRESHOLDS,
  WHO_THRESHOLDS,
  INITIAL_SYSTEM_STATUS,
  INITIAL_ADVISORIES,
  calculateWQI
} from '../data/mockData';
import { acknowledgeAlertApi, triggerAnomalyApi, updateThresholdApi, fetchNodes, fetchAlerts } from '../services/api';

export type MainView = 'home' | 'dashboard' | 'how-it-works' | 'sensors' | 'technology' | 'impact' | 'contact';
export type DashboardTab = 'overview' | 'nodes' | 'analytics' | 'map' | 'alerts' | 'reports' | 'authority';

export const DEFAULT_AUTHORITY_PASSWORD = 'jaladmin2026';

interface AquaContextType {
  activeView: MainView;
  setActiveView: (view: MainView) => void;
  dashboardTab: DashboardTab;
  setDashboardTab: (tab: DashboardTab) => void;
  selectedNodeId: string;
  setSelectedNodeId: (id: string) => void;
  nodes: NodeInfo[];
  alerts: AlertItem[];
  thresholds: Record<string, ParameterThreshold>;
  systemStatus: SystemStatusInfo;
  isPresentationMode: boolean;
  setIsPresentationMode: (val: boolean) => void;
  isSimulatorOpen: boolean;
  setIsSimulatorOpen: (val: boolean) => void;
  isThresholdsOpen: boolean;
  setIsThresholdsOpen: (val: boolean) => void;
  isConnectModalOpen: boolean;
  setIsConnectModalOpen: (val: boolean) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isLiveSimulationActive: boolean;
  setIsLiveSimulationActive: (val: boolean) => void;
  acknowledgeAlert: (alertId: string) => void;
  updateThresholds: (parameterKey: string, newThreshold: Partial<ParameterThreshold>) => void;
  applyRegulatoryPreset: (standard: 'CPCB' | 'WHO') => void;
  activeRegulatoryStandard: RegulatoryStandard;
  updateNodeChannel: (nodeId: string, channelId: string, apiKey?: string) => void;
  updateNodeDetails: (nodeId: string, updates: Partial<NodeInfo>) => void;
  triggerAnomaly: (nodeId: string, type: 'turbidity_spike' | 'do_drop' | 'reset') => void;
  lastUpdatedTime: string;
  totalMeasurementsCount: number;

  // Authority & Role Management
  isAuthorityAuthenticated: boolean;
  isAuthorityLoginOpen: boolean;
  setIsAuthorityLoginOpen: (val: boolean) => void;
  loginAuthority: (password: string) => { success: boolean; error?: string };
  logoutAuthority: () => void;

  // Public Advisories
  advisories: PublicAdvisory[];
  publishAdvisory: (newAdvisory: Omit<PublicAdvisory, 'id' | 'issuedAt' | 'active'>) => void;
  dismissAdvisory: (id: string) => void;
}

const AquaContext = createContext<AquaContextType | undefined>(undefined);

export const AquaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<MainView>('home');
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('overview');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('river');
  const [nodes, setNodes] = useState<NodeInfo[]>(INITIAL_NODES);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [thresholds, setThresholds] = useState<Record<string, ParameterThreshold>>(DEFAULT_THRESHOLDS);
  const [activeRegulatoryStandard, setActiveRegulatoryStandard] = useState<RegulatoryStandard>('CPCB');
  const [systemStatus] = useState<SystemStatusInfo>(INITIAL_SYSTEM_STATUS);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isThresholdsOpen, setIsThresholdsOpen] = useState<boolean>(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [isLiveSimulationActive, setIsLiveSimulationActive] = useState<boolean>(true);
  const [totalMeasurementsCount, setTotalMeasurementsCount] = useState<number>(12480);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Just now');

  // Authority authentication state
  const [isAuthorityAuthenticated, setIsAuthorityAuthenticated] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' && sessionStorage.getItem('jal_authority_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAuthorityLoginOpen, setIsAuthorityLoginOpen] = useState<boolean>(false);

  // User profile
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const isAuth = typeof window !== 'undefined' && sessionStorage.getItem('jal_authority_auth') === 'true';
      if (isAuth) {
        return {
          id: 'auth-01',
          name: 'Authorized Water Quality Officer',
          role: 'admin',
          email: 'officer@pollutioncontrol.gov.in',
        };
      }
    } catch {
      // fallback
    }
    return {
      id: 'usr-guest',
      name: 'Citizen / Public Viewer',
      role: 'viewer',
      email: 'citizen@jalparikshan-env.org',
    };
  });

  // Public Advisories state
  const [advisories, setAdvisories] = useState<PublicAdvisory[]>(INITIAL_ADVISORIES);

  // Authority login action
  const loginAuthority = (password: string): { success: boolean; error?: string } => {
    if (password.trim() === DEFAULT_AUTHORITY_PASSWORD) {
      setIsAuthorityAuthenticated(true);
      try {
        sessionStorage.setItem('jal_authority_auth', 'true');
      } catch {
        // ignore
      }
      setUserRole({
        id: 'auth-01',
        name: 'Authorized Water Quality Officer',
        role: 'admin',
        email: 'officer@pollutioncontrol.gov.in',
      });
      setIsAuthorityLoginOpen(false);
      return { success: true };
    }
    return {
      success: false,
      error: 'Invalid authority passcode. Access restricted to accredited environmental officers.',
    };
  };

  // Authority logout action
  const logoutAuthority = () => {
    setIsAuthorityAuthenticated(false);
    try {
      sessionStorage.removeItem('jal_authority_auth');
    } catch {
      // ignore
    }
    setUserRole({
      id: 'usr-guest',
      name: 'Citizen / Public Viewer',
      role: 'viewer',
      email: 'citizen@jalparikshan-env.org',
    });
    if (dashboardTab === 'authority') {
      setDashboardTab('overview');
    }
  };

  // Synchronize live data from SQLite backend (every 3 seconds)
  useEffect(() => {
    let isMounted = true;

    const syncWithBackend = async () => {
      try {
        const [liveNodes, liveAlerts] = await Promise.all([
          fetchNodes(),
          fetchAlerts(),
        ]);
        if (!isMounted) return;

        if (liveNodes && Array.isArray(liveNodes) && liveNodes.length > 0) {
          setNodes(liveNodes);
        }
        if (liveAlerts && Array.isArray(liveAlerts)) {
          setAlerts(liveAlerts);
        }
        setTotalMeasurementsCount(prev => prev + 1);
        setLastUpdatedTime(new Date().toLocaleTimeString());
      } catch (err) {
        console.warn('Backend sync failed, falling back to local state:', err);
      }
    };

    syncWithBackend();
    const interval = setInterval(syncWithBackend, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => (a.id === alertId ? { ...a, acknowledged: true, acknowledgedAt: new Date().toISOString() } : a)));
    acknowledgeAlertApi(alertId);
  };

  const updateThresholds = (parameterKey: string, newThreshold: Partial<ParameterThreshold>) => {
    setThresholds(prev => ({
      ...prev,
      [parameterKey]: { ...prev[parameterKey], ...newThreshold },
    }));
    setActiveRegulatoryStandard('CUSTOM');
    updateThresholdApi(parameterKey, newThreshold);
  };

  const applyRegulatoryPreset = (standard: 'CPCB' | 'WHO') => {
    if (standard === 'CPCB') {
      setThresholds(JSON.parse(JSON.stringify(CPCB_THRESHOLDS)));
      setActiveRegulatoryStandard('CPCB');
    } else if (standard === 'WHO') {
      setThresholds(JSON.parse(JSON.stringify(WHO_THRESHOLDS)));
      setActiveRegulatoryStandard('WHO');
    }
  };

  const updateNodeChannel = (nodeId: string, channelId: string, apiKey?: string) => {
    setNodes(prev => prev.map(n => (n.id === nodeId ? { ...n, channelId, apiKey: apiKey || '' } : n)));
  };

  const updateNodeDetails = (nodeId: string, updates: Partial<NodeInfo>) => {
    setNodes(prev =>
      prev.map(n => {
        if (n.id === nodeId) {
          const updated = { ...n, ...updates };
          if (updates.currentReadings) {
            updated.waterQualityIndex = calculateWQI(updates.currentReadings);
          }
          return updated;
        }
        return n;
      })
    );
  };

  const publishAdvisory = (newAdvisory: Omit<PublicAdvisory, 'id' | 'issuedAt' | 'active'>) => {
    const fullAdvisory: PublicAdvisory = {
      ...newAdvisory,
      id: `ADV-${Date.now().toString().slice(-4)}`,
      issuedAt: new Date().toISOString(),
      active: true,
    };
    setAdvisories(prev => [fullAdvisory, ...prev]);
  };

  const dismissAdvisory = (id: string) => {
    setAdvisories(prev => prev.filter(a => a.id !== id));
  };

  const triggerAnomaly = (nodeId: string, type: 'turbidity_spike' | 'do_drop' | 'reset') => {
    triggerAnomalyApi(nodeId, type);

    if (type === 'reset') {
      setNodes(JSON.parse(JSON.stringify(INITIAL_NODES)));
      setAlerts(JSON.parse(JSON.stringify(INITIAL_ALERTS)));
      return;
    }

    setNodes(prev =>
      prev.map(n => {
        if (n.id === nodeId) {
          if (type === 'turbidity_spike') {
            const updated = { ...n.currentReadings, turbidity: 28.5 };
            return {
              ...n,
              status: 'critical',
              currentReadings: updated,
              waterQualityIndex: calculateWQI(updated),
            };
          }
          if (type === 'do_drop') {
            const updated = { ...n.currentReadings, dissolvedOxygen: 3.2 };
            return {
              ...n,
              status: 'critical',
              currentReadings: updated,
              waterQualityIndex: calculateWQI(updated),
            };
          }
        }
        return n;
      })
    );

    const targetNode = nodes.find(n => n.id === nodeId) || nodes[2];
    const newAlert: AlertItem = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      nodeId: targetNode.id,
      nodeName: targetNode.name,
      parameter: type === 'turbidity_spike' ? 'turbidity' : 'dissolvedOxygen',
      severity: 'critical',
      title: type === 'turbidity_spike' ? 'Simulated Sediment Surge' : 'Simulated Depletion Event',
      message:
        type === 'turbidity_spike'
          ? 'Turbidity level spike to 28.5 NTU triggered in demonstration mode.'
          : 'DO dropped to 3.2 mg/L triggered in demonstration mode.',
      value: type === 'turbidity_spike' ? 28.5 : 3.2,
      thresholdValue: type === 'turbidity_spike' ? 15.0 : 4.0,
      unit: type === 'turbidity_spike' ? 'NTU' : 'mg/L',
      timestamp: new Date().toISOString(),
      acknowledged: false,
    };

    setAlerts(prev => [newAlert, ...prev]);
  };

  return (
    <AquaContext.Provider
      value={{
        activeView,
        setActiveView,
        dashboardTab,
        setDashboardTab,
        selectedNodeId,
        setSelectedNodeId,
        nodes,
        alerts,
        thresholds,
        systemStatus,
        isPresentationMode,
        setIsPresentationMode,
        isSimulatorOpen,
        setIsSimulatorOpen,
        isThresholdsOpen,
        setIsThresholdsOpen,
        isConnectModalOpen,
        setIsConnectModalOpen,
        userRole,
        setUserRole,
        isLiveSimulationActive,
        setIsLiveSimulationActive,
        acknowledgeAlert,
        updateThresholds,
        applyRegulatoryPreset,
        activeRegulatoryStandard,
        updateNodeChannel,
        updateNodeDetails,
        triggerAnomaly,
        lastUpdatedTime,
        totalMeasurementsCount,

        // Authority state & actions
        isAuthorityAuthenticated,
        isAuthorityLoginOpen,
        setIsAuthorityLoginOpen,
        loginAuthority,
        logoutAuthority,

        // Public Advisories
        advisories,
        publishAdvisory,
        dismissAdvisory,
      }}
    >
      {children}
    </AquaContext.Provider>
  );
};

export const useAqua = () => {
  const context = useContext(AquaContext);
  if (!context) {
    throw new Error('useAqua must be used within an AquaProvider');
  }
  return context;
};
