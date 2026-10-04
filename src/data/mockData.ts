import { NodeInfo, ParameterThreshold, AlertItem, SystemStatusInfo, SensorReading } from '../types';

export const DEFAULT_THRESHOLDS: Record<string, ParameterThreshold> = {
  ph: {
    parameter: 'pH',
    displayName: 'pH Level',
    unit: 'pH',
    minOptimal: 6.8,
    maxOptimal: 8.2,
    minWarning: 6.0,
    maxWarning: 8.8,
    minCritical: 5.0,
    maxCritical: 9.5,
  },
  turbidity: {
    parameter: 'turbidity',
    displayName: 'Turbidity',
    unit: 'NTU',
    minOptimal: 0,
    maxOptimal: 5.0,
    minWarning: 5.0,
    maxWarning: 15.0,
    minCritical: 15.0,
    maxCritical: 50.0,
  },
  temperature: {
    parameter: 'temperature',
    displayName: 'Water Temperature',
    unit: '°C',
    minOptimal: 18.0,
    maxOptimal: 28.0,
    minWarning: 15.0,
    maxWarning: 32.0,
    minCritical: 10.0,
    maxCritical: 36.0,
  },
  dissolvedOxygen: {
    parameter: 'dissolvedOxygen',
    displayName: 'Dissolved Oxygen (DO)',
    unit: 'mg/L',
    minOptimal: 6.5,
    maxOptimal: 12.0,
    minWarning: 4.0,
    maxWarning: 6.5,
    minCritical: 0,
    maxCritical: 4.0,
  },
  tds: {
    parameter: 'tds',
    displayName: 'Total Dissolved Solids',
    unit: 'ppm',
    minOptimal: 50,
    maxOptimal: 300,
    minWarning: 300,
    maxWarning: 600,
    minCritical: 600,
    maxCritical: 1200,
  },
  conductivity: {
    parameter: 'conductivity',
    displayName: 'Electrical Conductivity',
    unit: 'µS/cm',
    minOptimal: 100,
    maxOptimal: 500,
    minWarning: 500,
    maxWarning: 1000,
    minCritical: 1000,
    maxCritical: 2000,
  },
};

export const CPCB_THRESHOLDS: Record<string, ParameterThreshold> = {
  ph: {
    parameter: 'pH',
    displayName: 'pH Level',
    unit: 'pH',
    minOptimal: 6.5,
    maxOptimal: 8.5,
    minWarning: 6.0,
    maxWarning: 9.0,
    minCritical: 5.0,
    maxCritical: 10.0,
  },
  turbidity: {
    parameter: 'turbidity',
    displayName: 'Turbidity',
    unit: 'NTU',
    minOptimal: 0,
    maxOptimal: 5.0,
    minWarning: 5.0,
    maxWarning: 10.0,
    minCritical: 10.0,
    maxCritical: 25.0,
  },
  temperature: {
    parameter: 'temperature',
    displayName: 'Water Temperature',
    unit: '°C',
    minOptimal: 20.0,
    maxOptimal: 30.0,
    minWarning: 15.0,
    maxWarning: 34.0,
    minCritical: 10.0,
    maxCritical: 38.0,
  },
  dissolvedOxygen: {
    parameter: 'dissolvedOxygen',
    displayName: 'Dissolved Oxygen (DO)',
    unit: 'mg/L',
    minOptimal: 6.0,
    maxOptimal: 12.0,
    minWarning: 4.0,
    maxWarning: 6.0,
    minCritical: 0,
    maxCritical: 4.0,
  },
  tds: {
    parameter: 'tds',
    displayName: 'Total Dissolved Solids',
    unit: 'ppm',
    minOptimal: 50,
    maxOptimal: 500,
    minWarning: 500,
    maxWarning: 1000,
    minCritical: 1000,
    maxCritical: 2000,
  },
  conductivity: {
    parameter: 'conductivity',
    displayName: 'Electrical Conductivity',
    unit: 'µS/cm',
    minOptimal: 100,
    maxOptimal: 750,
    minWarning: 750,
    maxWarning: 1500,
    minCritical: 1500,
    maxCritical: 2500,
  },
};

export const WHO_THRESHOLDS: Record<string, ParameterThreshold> = {
  ph: {
    parameter: 'pH',
    displayName: 'pH Level',
    unit: 'pH',
    minOptimal: 6.5,
    maxOptimal: 8.5,
    minWarning: 6.2,
    maxWarning: 8.8,
    minCritical: 5.5,
    maxCritical: 9.5,
  },
  turbidity: {
    parameter: 'turbidity',
    displayName: 'Turbidity',
    unit: 'NTU',
    minOptimal: 0,
    maxOptimal: 1.0,
    minWarning: 1.0,
    maxWarning: 5.0,
    minCritical: 5.0,
    maxCritical: 15.0,
  },
  temperature: {
    parameter: 'temperature',
    displayName: 'Water Temperature',
    unit: '°C',
    minOptimal: 15.0,
    maxOptimal: 25.0,
    minWarning: 12.0,
    maxWarning: 28.0,
    minCritical: 8.0,
    maxCritical: 32.0,
  },
  dissolvedOxygen: {
    parameter: 'dissolvedOxygen',
    displayName: 'Dissolved Oxygen (DO)',
    unit: 'mg/L',
    minOptimal: 7.0,
    maxOptimal: 14.0,
    minWarning: 5.0,
    maxWarning: 7.0,
    minCritical: 0,
    maxCritical: 5.0,
  },
  tds: {
    parameter: 'tds',
    displayName: 'Total Dissolved Solids',
    unit: 'ppm',
    minOptimal: 50,
    maxOptimal: 300,
    minWarning: 300,
    maxWarning: 600,
    minCritical: 600,
    maxCritical: 1000,
  },
  conductivity: {
    parameter: 'conductivity',
    displayName: 'Electrical Conductivity',
    unit: 'µS/cm',
    minOptimal: 50,
    maxOptimal: 400,
    minWarning: 400,
    maxWarning: 800,
    minCritical: 800,
    maxCritical: 1500,
  },
};

export const INITIAL_ADVISORIES = [
  {
    id: 'ADV-2026-01',
    title: 'Seasonal Runoff & Elevated Turbidity Notice',
    message: 'State Pollution Control Directorate advises local treatment facilities and reservoir operators to monitor incoming intake turbidity levels during high-flow conditions.',
    severity: 'warning' as const,
    issuedBy: 'Central Water Quality Commission & Pollution Control Board',
    issuedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    affectedLocations: ['LOC-02', 'LOC-03'],
    active: true,
  }
];

export function calculateWQI(readings: {
  ph?: number | null;
  turbidity?: number | null;
  temperature: number;
  dissolvedOxygen?: number | null;
  tds?: number | null;
  conductivity?: number | null;
}): number {
  let totalScore = 0;
  let totalWeight = 0;

  if (readings.ph !== null && readings.ph !== undefined) {
    let phScore = readings.ph < 7.0
      ? Math.max(0, 100 - Math.abs(7.0 - readings.ph) * 35)
      : Math.max(0, 100 - Math.abs(readings.ph - 7.0) * 30);
    totalScore += phScore * 0.25;
    totalWeight += 0.25;
  }

  if (readings.turbidity !== null && readings.turbidity !== undefined) {
    let turbScore = Math.max(0, 100 - readings.turbidity * 4);
    totalScore += turbScore * 0.25;
    totalWeight += 0.25;
  }

  if (readings.dissolvedOxygen !== null && readings.dissolvedOxygen !== undefined) {
    let doScore = Math.min(100, (readings.dissolvedOxygen / 8.5) * 100);
    totalScore += doScore * 0.25;
    totalWeight += 0.25;
  }

  if (readings.temperature !== null && readings.temperature !== undefined) {
    let tempScore = Math.max(0, 100 - Math.abs(readings.temperature - 22) * 4);
    totalScore += tempScore * 0.25;
    totalWeight += 0.25;
  }

  if (readings.tds !== null && readings.tds !== undefined) {
    let tdsScore = Math.max(0, 100 - (readings.tds / 500) * 50);
    totalScore += tdsScore * 0.10;
    totalWeight += 0.10;
  }

  if (totalWeight === 0) return 85;
  return Math.round(Math.min(100, Math.max(0, totalScore / totalWeight)));
}

export function getWQILabel(score: number): { label: string; color: string; badgeBg: string } {
  if (score >= 90) return { label: 'EXCELLENT', color: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
  if (score >= 75) return { label: 'GOOD / HEALTHY', color: 'text-cyan-400', badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
  if (score >= 60) return { label: 'MODERATE', color: 'text-amber-400', badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
  if (score >= 40) return { label: 'POOR', color: 'text-orange-400', badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30' };
  return { label: 'CRITICAL', color: 'text-rose-400', badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
}

export const INITIAL_NODES: NodeInfo[] = [
  {
    id: 'river',
    code: 'LOC-01',
    name: 'River',
    zone: 'River Main Stream',
    locationName: 'River Monitoring Point 01',
    channelId: '3430859',
    apiKey: 'V1YFKPYP3LSDUPUE',
    lat: 37.7749,
    lng: -122.4194,
    status: 'online',
    batteryLevel: 95,
    signalStrength: 98,
    lastSeen: '5 sec ago',
    uptimePercent: 99.8,
    waterQualityIndex: 88,
    currentReadings: {
      ph: 7.2,
      turbidity: 2.0,
      temperature: 24.5,
      dissolvedOxygen: null,
      tds: 180,
      conductivity: null,
    },
    sensors: [
      { id: 's1-1', nodeId: 'river', name: 'High-Precision DS18B20 Temp Sensor', type: 'temperature', unit: '°C', status: 'online', healthPercent: 100, lastReading: '24.5 °C', lastCalibration: '14 days ago', errorCount: 0 },
      { id: 's1-2', nodeId: 'river', name: 'Industrial Glass Electrode pH Sensor', type: 'pH', unit: '', status: 'online', healthPercent: 98, lastReading: '7.2', lastCalibration: '3 days ago', errorCount: 0 },
      { id: 's1-3', nodeId: 'river', name: 'Optical Turbidity Sensor TS-300B', type: 'turbidity', unit: 'NTU', status: 'online', healthPercent: 96, lastReading: '2.0 NTU', lastCalibration: '7 days ago', errorCount: 0 },
      { id: 's1-4', nodeId: 'river', name: 'Analog TDS Sensor Probe', type: 'tds', unit: 'ppm', status: 'online', healthPercent: 97, lastReading: '180 ppm', lastCalibration: '8 days ago', errorCount: 0 },
    ]
  },
  {
    id: 'tank1',
    code: 'LOC-02',
    name: 'Tank 1',
    zone: 'Reservoir Tank 1',
    locationName: 'Storage Tank 01 Intake',
    channelId: '',
    apiKey: '',
    lat: 37.7812,
    lng: -122.4081,
    status: 'online',
    batteryLevel: 88,
    signalStrength: 92,
    lastSeen: '12 sec ago',
    uptimePercent: 99.2,
    waterQualityIndex: 82,
    currentReadings: {
      ph: 7.1,
      turbidity: 3.2,
      temperature: 23.5,
      dissolvedOxygen: 8.1,
      tds: 210,
      conductivity: 350,
    },
    sensors: [
      { id: 's2-1', nodeId: 'tank1', name: 'DS18B20 Temp Sensor', type: 'temperature', unit: '°C', status: 'online', healthPercent: 99, lastReading: '23.5 °C', lastCalibration: '10 days ago', errorCount: 0 },
      { id: 's2-2', nodeId: 'tank1', name: 'pH Sensor Probe', type: 'pH', unit: '', status: 'online', healthPercent: 96, lastReading: '7.1', lastCalibration: '7 days ago', errorCount: 0 },
      { id: 's2-3', nodeId: 'tank1', name: 'Dissolved Oxygen Sensor', type: 'dissolvedOxygen', unit: 'mg/L', status: 'online', healthPercent: 92, lastReading: '8.1 mg/L', lastCalibration: '12 days ago', errorCount: 0 },
      { id: 's2-4', nodeId: 'tank1', name: 'Turbidity Sensor', type: 'turbidity', unit: 'NTU', status: 'online', healthPercent: 94, lastReading: '3.2 NTU', lastCalibration: '7 days ago', errorCount: 0 },
      { id: 's2-5', nodeId: 'tank1', name: 'Analog TDS Sensor Probe', type: 'tds', unit: 'ppm', status: 'online', healthPercent: 99, lastReading: '210 ppm', lastCalibration: '11 days ago', errorCount: 0 },
    ]
  },
  {
    id: 'tank2',
    code: 'LOC-03',
    name: 'Tank 2',
    zone: 'Secondary Reservoir',
    locationName: 'Storage Tank 02 Outlet',
    channelId: '',
    apiKey: '',
    lat: 37.7685,
    lng: -122.4285,
    status: 'warning',
    batteryLevel: 76,
    signalStrength: 85,
    lastSeen: '18 sec ago',
    uptimePercent: 97.5,
    waterQualityIndex: 68,
    currentReadings: {
      ph: 8.6,
      turbidity: 6.8,
      temperature: 27.8,
      dissolvedOxygen: 5.2,
      tds: 340,
      conductivity: 580,
    },
    sensors: [
      { id: 's3-1', nodeId: 'tank2', name: 'DS18B20 Temp Sensor', type: 'temperature', unit: '°C', status: 'online', healthPercent: 98, lastReading: '27.8 °C', lastCalibration: '14 days ago', errorCount: 0 },
      { id: 's3-2', nodeId: 'tank2', name: 'pH Sensor Probe', type: 'pH', unit: '', status: 'calibration_needed', healthPercent: 82, lastReading: '8.6', lastCalibration: '28 days ago', errorCount: 2 },
      { id: 's3-3', nodeId: 'tank2', name: 'Dissolved Oxygen Sensor', type: 'dissolvedOxygen', unit: 'mg/L', status: 'online', healthPercent: 88, lastReading: '5.2 mg/L', lastCalibration: '9 days ago', errorCount: 0 },
      { id: 's3-4', nodeId: 'tank2', name: 'Turbidity Sensor', type: 'turbidity', unit: 'NTU', status: 'online', healthPercent: 90, lastReading: '6.8 NTU', lastCalibration: '7 days ago', errorCount: 0 },
      { id: 's3-5', nodeId: 'tank2', name: 'Analog TDS Sensor Probe', type: 'tds', unit: 'ppm', status: 'online', healthPercent: 95, lastReading: '340 ppm', lastCalibration: '15 days ago', errorCount: 0 },
    ]
  },
  {
    id: 'tank3',
    code: 'LOC-04',
    name: 'Tank 3',
    zone: 'Reserve Water Basin',
    locationName: 'Storage Tank 03 Deep Sector',
    channelId: '',
    apiKey: '',
    lat: 37.7620,
    lng: -122.4010,
    status: 'online',
    batteryLevel: 91,
    signalStrength: 94,
    lastSeen: '8 sec ago',
    uptimePercent: 99.9,
    waterQualityIndex: 92,
    currentReadings: {
      ph: 7.2,
      turbidity: 1.8,
      temperature: 22.4,
      dissolvedOxygen: 8.5,
      tds: 140,
      conductivity: 250,
    },
    sensors: [
      { id: 's4-1', nodeId: 'tank3', name: 'DS18B20 Temp Sensor', type: 'temperature', unit: '°C', status: 'online', healthPercent: 100, lastReading: '22.4 °C', lastCalibration: '10 days ago', errorCount: 0 },
      { id: 's4-2', nodeId: 'tank3', name: 'pH Sensor Probe', type: 'pH', unit: '', status: 'online', healthPercent: 99, lastReading: '7.2', lastCalibration: '2 days ago', errorCount: 0 },
      { id: 's4-3', nodeId: 'tank3', name: 'Dissolved Oxygen Sensor', type: 'dissolvedOxygen', unit: 'mg/L', status: 'online', healthPercent: 96, lastReading: '8.5 mg/L', lastCalibration: '4 days ago', errorCount: 0 },
      { id: 's4-4', nodeId: 'tank3', name: 'Turbidity Sensor', type: 'turbidity', unit: 'NTU', status: 'online', healthPercent: 98, lastReading: '1.8 NTU', lastCalibration: '5 days ago', errorCount: 0 },
      { id: 's4-5', nodeId: 'tank3', name: 'Analog TDS Sensor Probe', type: 'tds', unit: 'ppm', status: 'online', healthPercent: 100, lastReading: '140 ppm', lastCalibration: '6 days ago', errorCount: 0 },
    ]
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'ALT-1001',
    nodeId: 'NODE-003',
    nodeName: 'Node 03 — South Zone',
    parameter: 'turbidity',
    severity: 'critical',
    title: 'High Turbidity Sediment Surge',
    message: 'Turbidity level exceeded critical limit of 15.0 NTU (Measured: 22.4 NTU). Sediment runoff detected.',
    value: 22.4,
    thresholdValue: 15.0,
    unit: 'NTU',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: 'ALT-1002',
    nodeId: 'NODE-003',
    nodeName: 'Node 03 — South Zone',
    parameter: 'dissolvedOxygen',
    severity: 'critical',
    title: 'Critical Low Dissolved Oxygen',
    message: 'DO level dropped below critical threshold of 4.0 mg/L (Measured: 3.8 mg/L). Aquatic life stress warning.',
    value: 3.8,
    thresholdValue: 4.0,
    unit: 'mg/L',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: 'ALT-1003',
    nodeId: 'NODE-002',
    nodeName: 'Node 02 — East Zone',
    parameter: 'pH',
    severity: 'warning',
    title: 'Elevated pH Level Warning',
    message: 'pH level reached 8.6 pH approaching upper threshold of 8.8 pH near East discharge outlet.',
    value: 8.6,
    thresholdValue: 8.8,
    unit: 'pH',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    acknowledged: true,
    acknowledgedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  {
    id: 'ALT-1004',
    nodeId: 'NODE-001',
    nodeName: 'Node 01 — North Zone',
    parameter: 'system',
    severity: 'info',
    title: 'ESP32 Node Reconnected',
    message: 'Node 01 telemetry stream resynchronized successfully over cellular IoT gateway.',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    acknowledged: true,
    acknowledgedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  }
];

export const INITIAL_SYSTEM_STATUS: SystemStatusInfo = {
  overall: 'operational',
  uptimeSeconds: 864000, // 10 days
  lastIngestion: 'Just now (ESP32 MQTT Gateway)',
  components: [
    { name: 'ESP32 IoT Mesh Gateway', status: 'operational', latencyMs: 42, details: '4/4 nodes connected via LTE-M / LoRaWAN' },
    { name: 'Telemetry Ingestion API', status: 'operational', latencyMs: 18, details: 'Processing 120 messages/min' },
    { name: 'WQI Analytics Engine', status: 'operational', latencyMs: 25, details: 'Real-time threshold evaluation active' },
    { name: 'Timescale DB Storage', status: 'operational', latencyMs: 12, details: '12,480+ records indexed' },
    { name: 'Web Dashboard Stream', status: 'operational', latencyMs: 8, details: 'Server-Sent Events / SSE active' },
  ]
};

// Generate realistic history readings for chart visualizations
export function generateHistoryReadings(nodeId: string, hoursCount: number = 24): SensorReading[] {
  const readings: SensorReading[] = [];
  const now = Date.now();
  const stepMs = (hoursCount * 3600 * 1000) / 30; // 30 data points

  const baseNode = INITIAL_NODES.find(n => n.id === nodeId) || INITIAL_NODES[0];

  for (let i = 30; i >= 0; i--) {
    const time = new Date(now - i * stepMs).toISOString();
    // Sine wave variance for diurnal temperature and pH cycles
    const hourOfDay = new Date(now - i * stepMs).getHours();
    const tempSin = Math.sin((hourOfDay - 6) * (Math.PI / 12)) * 1.8;
    const phSin = Math.sin((hourOfDay - 10) * (Math.PI / 12)) * 0.3;

    let ph = Number((baseNode.currentReadings.ph + phSin + (Math.random() - 0.5) * 0.2).toFixed(2));
    let turbidity = Number(Math.max(0.5, baseNode.currentReadings.turbidity + (Math.random() - 0.5) * 0.8).toFixed(1));
    let temperature = Number((baseNode.currentReadings.temperature + tempSin + (Math.random() - 0.5) * 0.4).toFixed(1));
    let dissolvedOxygen = Number(Math.max(1.5, baseNode.currentReadings.dissolvedOxygen - (tempSin * 0.2) + (Math.random() - 0.5) * 0.3).toFixed(2));
    let tds = Math.round(baseNode.currentReadings.tds + (Math.random() - 0.5) * 15);
    let conductivity = Math.round(tds * 1.65);

    const wqi = calculateWQI({ ph, turbidity, temperature, dissolvedOxygen, tds, conductivity });

    readings.push({
      id: `rd-${nodeId}-${i}`,
      nodeId,
      timestamp: time,
      ph,
      turbidity,
      temperature,
      dissolvedOxygen,
      tds,
      conductivity,
      waterQualityIndex: wqi,
    });
  }

  return readings;
}
