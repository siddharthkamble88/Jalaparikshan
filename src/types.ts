export type ParameterType = 'pH' | 'turbidity' | 'temperature' | 'dissolvedOxygen' | 'tds' | 'conductivity';

export type NodeStatus = 'online' | 'offline' | 'warning' | 'critical';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface ParameterThreshold {
  parameter: ParameterType;
  displayName: string;
  unit: string;
  minOptimal: number;
  maxOptimal: number;
  minWarning: number;
  maxWarning: number;
  minCritical: number;
  maxCritical: number;
}

export interface SensorReading {
  id: string;
  nodeId: string;
  timestamp: string; // ISO string
  ph?: number | null;
  turbidity?: number | null; // NTU
  temperature: number; // °C
  dissolvedOxygen?: number | null; // mg/L
  tds?: number | null; // ppm
  conductivity?: number | null; // µS/cm
  waterQualityIndex: number; // 0 - 100
}

export interface SensorInfo {
  id: string;
  nodeId: string;
  name: string;
  type: ParameterType | 'gas_co' | 'water_level';
  unit: string;
  status: 'online' | 'calibration_needed' | 'error' | 'offline';
  healthPercent: number;
  lastReading: string;
  lastCalibration: string;
  errorCount: number;
  technicalNote?: string;
}

export interface NodeInfo {
  id: string;
  code: string;
  name: string;
  zone: string;
  locationName: string;
  lat: number;
  lng: number;
  status: NodeStatus;
  batteryLevel: number; // %
  signalStrength: number; // %
  lastSeen: string;
  uptimePercent: number;
  waterQualityIndex: number; // 0 - 100
  currentReadings: {
    ph?: number | null;
    turbidity?: number | null;
    temperature: number;
    dissolvedOxygen?: number | null;
    tds?: number | null;
    conductivity?: number | null;
  };
  sensors: SensorInfo[];
  channelId?: string;
  apiKey?: string;
}

export interface AlertItem {
  id: string;
  nodeId: string;
  nodeName: string;
  parameter: ParameterType | 'system' | 'battery';
  severity: AlertSeverity;
  title: string;
  message: string;
  value?: number;
  thresholdValue?: number;
  unit?: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
}

export interface SystemComponentStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  latencyMs: number;
  details: string;
}

export interface SystemStatusInfo {
  overall: 'operational' | 'degraded' | 'critical';
  uptimeSeconds: number;
  lastIngestion: string;
  components: SystemComponentStatus[];
}

export interface UserRole {
  id: string;
  name: string;
  role: 'admin' | 'researcher' | 'viewer';
  email: string;
}

export interface PublicAdvisory {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  issuedBy: string;
  issuedAt: string;
  affectedLocations: string[];
  active: boolean;
}

export type RegulatoryStandard = 'CPCB' | 'WHO' | 'CUSTOM';

export interface AuthoritySession {
  isAuthenticated: boolean;
  officerName: string;
  badgeNumber: string;
  department: string;
  loginTimestamp?: string;
}
