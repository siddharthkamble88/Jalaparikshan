import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { NodeInfo, AlertItem, SensorReading, ParameterThreshold } from '../types.js';
import { INITIAL_NODES, INITIAL_ALERTS, DEFAULT_THRESHOLDS, calculateWQI, generateHistoryReadings } from '../data/mockData.js';

// Ensure data directory exists
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'aquasense.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance concurrency
db.pragma('journal_mode = WAL');

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS nodes (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    zone TEXT,
    location_name TEXT,
    lat REAL,
    lng REAL,
    status TEXT,
    battery_level INTEGER,
    signal_strength INTEGER,
    last_seen TEXT,
    uptime_percent REAL,
    water_quality_index INTEGER,
    ph REAL,
    turbidity REAL,
    temperature REAL,
    dissolved_oxygen REAL,
    tds REAL,
    conductivity REAL,
    channel_id TEXT,
    api_key TEXT,
    sensors_json TEXT,
    updated_at TEXT
  );

  CREATE TABLE IF NOT EXISTS sensor_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    node_id TEXT NOT NULL,
    ph REAL,
    turbidity REAL,
    temperature REAL,
    dissolved_oxygen REAL,
    tds REAL,
    conductivity REAL,
    water_quality_index INTEGER,
    recorded_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    node_id TEXT NOT NULL,
    node_name TEXT NOT NULL,
    parameter TEXT NOT NULL,
    severity TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    value REAL,
    threshold_value REAL,
    unit TEXT,
    timestamp TEXT NOT NULL,
    acknowledged INTEGER DEFAULT 0,
    acknowledged_at TEXT
  );
`);

// Row mapper from DB row to NodeInfo
function rowToNode(row: any): NodeInfo {
  let sensors = [];
  try {
    sensors = JSON.parse(row.sensors_json || '[]');
  } catch {
    sensors = [];
  }

  return {
    id: row.id,
    code: row.code,
    name: row.name,
    zone: row.zone || '',
    locationName: row.location_name || '',
    lat: row.lat,
    lng: row.lng,
    status: row.status as any,
    batteryLevel: row.battery_level,
    signalStrength: row.signal_strength,
    lastSeen: row.last_seen || 'Just now',
    uptimePercent: row.uptime_percent,
    waterQualityIndex: row.water_quality_index,
    currentReadings: {
      ph: row.ph,
      turbidity: row.turbidity,
      temperature: row.temperature,
      dissolvedOxygen: row.dissolved_oxygen,
      tds: row.tds,
      conductivity: row.conductivity,
    },
    sensors,
    channelId: row.channel_id || undefined,
    apiKey: row.api_key || undefined,
  };
}

// Seed database if empty
function seedDatabase() {
  const nodeCount = (db.prepare('SELECT COUNT(*) as count FROM nodes').get() as any).count;
  if (nodeCount === 0) {
    console.log('📦 Seeding SQLite database with default nodes...');
    const insertNode = db.prepare(`
      INSERT INTO nodes (
        id, code, name, zone, location_name, lat, lng, status,
        battery_level, signal_strength, last_seen, uptime_percent,
        water_quality_index, ph, turbidity, temperature,
        dissolved_oxygen, tds, conductivity, channel_id, api_key,
        sensors_json, updated_at
      ) VALUES (
        @id, @code, @name, @zone, @locationName, @lat, @lng, @status,
        @batteryLevel, @signalStrength, @lastSeen, @uptimePercent,
        @waterQualityIndex, @ph, @turbidity, @temperature,
        @dissolvedOxygen, @tds, @conductivity, @channelId, @apiKey,
        @sensorsJson, @updatedAt
      )
    `);

    const insertMany = db.transaction((nodes: NodeInfo[]) => {
      for (const node of nodes) {
        insertNode.run({
          id: node.id,
          code: node.code,
          name: node.name,
          zone: node.zone,
          locationName: node.locationName,
          lat: node.lat,
          lng: node.lng,
          status: node.status,
          batteryLevel: node.batteryLevel,
          signalStrength: node.signalStrength,
          lastSeen: node.lastSeen,
          uptimePercent: node.uptimePercent,
          waterQualityIndex: node.waterQualityIndex,
          ph: node.currentReadings.ph,
          turbidity: node.currentReadings.turbidity,
          temperature: node.currentReadings.temperature,
          dissolvedOxygen: node.currentReadings.dissolvedOxygen,
          tds: node.currentReadings.tds,
          conductivity: node.currentReadings.conductivity,
          channelId: node.channelId || null,
          apiKey: node.apiKey || null,
          sensorsJson: JSON.stringify(node.sensors),
          updatedAt: new Date().toISOString(),
        });

        // Seed initial history readings
        const history = generateHistoryReadings(node.id, 24);
        const insertHistory = db.prepare(`
          INSERT INTO sensor_readings (
            node_id, ph, turbidity, temperature, dissolved_oxygen,
            tds, conductivity, water_quality_index, recorded_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const h of history) {
          insertHistory.run(
            h.nodeId,
            h.ph,
            h.turbidity,
            h.temperature,
            h.dissolvedOxygen,
            h.tds,
            h.conductivity,
            h.waterQualityIndex,
            h.timestamp
          );
        }
      }
    });

    insertMany(INITIAL_NODES);
  }

  const alertCount = (db.prepare('SELECT COUNT(*) as count FROM alerts').get() as any).count;
  if (alertCount === 0) {
    const insertAlert = db.prepare(`
      INSERT INTO alerts (
        id, node_id, node_name, parameter, severity, title,
        message, value, threshold_value, unit, timestamp,
        acknowledged, acknowledged_at
      ) VALUES (
        @id, @nodeId, @nodeName, @parameter, @severity, @title,
        @message, @value, @thresholdValue, @unit, @timestamp,
        @acknowledged, @acknowledgedAt
      )
    `);

    const insertManyAlerts = db.transaction((alerts: AlertItem[]) => {
      for (const a of alerts) {
        insertAlert.run({
          id: a.id,
          nodeId: a.nodeId,
          nodeName: a.nodeName,
          parameter: a.parameter,
          severity: a.severity,
          title: a.title,
          message: a.message,
          value: a.value ?? null,
          thresholdValue: a.thresholdValue ?? null,
          unit: a.unit ?? null,
          timestamp: a.timestamp,
          acknowledged: a.acknowledged ? 1 : 0,
          acknowledgedAt: a.acknowledgedAt || null,
        });
      }
    });

    insertManyAlerts(INITIAL_ALERTS);
  }
}

seedDatabase();

// Sanitize river node so only real sensors exist (no fake DO or conductivity)
try {
  db.prepare(`
    UPDATE nodes SET
      dissolved_oxygen = NULL,
      conductivity = NULL
    WHERE id = 'river'
  `).run();

  const currentRiver = db.prepare(`SELECT sensors_json FROM nodes WHERE id = 'river'`).get() as any;
  if (currentRiver && currentRiver.sensors_json) {
    let sList = JSON.parse(currentRiver.sensors_json);
    sList = sList.filter((s: any) => s.type !== 'dissolvedOxygen' && s.type !== 'conductivity');
    if (!sList.some((s: any) => s.type === 'tds')) {
      sList.push({
        id: 's1-tds',
        nodeId: 'river',
        name: 'Analog TDS Sensor Probe',
        type: 'tds',
        unit: 'ppm',
        status: 'online',
        healthPercent: 98,
        lastReading: '--',
        lastCalibration: 'Factory Calibrated',
        errorCount: 0,
      });
    }
    db.prepare(`UPDATE nodes SET sensors_json = ? WHERE id = 'river'`).run(JSON.stringify(sList));
  }
} catch (err) {
  console.warn('Sanitizing river failed:', err);
}

// --- EXPORTED DATABASE OPERATIONS ---

export function getAllNodes(): NodeInfo[] {
  const rows = db.prepare('SELECT * FROM nodes ORDER BY id ASC').all();
  return rows.map(rowToNode);
}

export function getNodeById(id: string): NodeInfo | null {
  const row = db.prepare('SELECT * FROM nodes WHERE id = ? OR code = ?').get(id, id);
  return row ? rowToNode(row) : null;
}

export interface IngestPayload {
  nodeId: string;
  temperature?: number;
  ph?: number;
  turbidity?: number;
  dissolvedOxygen?: number;
  tds?: number;
  conductivity?: number;
  timestamp?: string;
}

export function ingestSensorReading(payload: IngestPayload): {
  success: boolean;
  node: NodeInfo;
  newAlert?: AlertItem;
} {
  // Connect incoming sensor directly to the River 1 node
  let targetId = payload.nodeId || 'river';
  if (targetId === 'ESP32-001' || targetId.toLowerCase().includes('esp') || targetId.toLowerCase().includes('river')) {
    targetId = 'river';
  }

  let node = getNodeById(targetId) || getNodeById('river');

  if (!node) {
    const newNode: NodeInfo = {
      id: targetId,
      code: 'LOC-01',
      name: 'River 1',
      zone: 'Live Stream Ingestion',
      locationName: 'Active Field Node',
      lat: 37.7749 + (Math.random() - 0.5) * 0.02,
      lng: -122.4194 + (Math.random() - 0.5) * 0.02,
      status: 'online',
      batteryLevel: 100,
      signalStrength: 95,
      lastSeen: 'Just now',
      uptimePercent: 100,
      waterQualityIndex: 85,
      currentReadings: {
        ph: payload.ph ?? 7.2,
        turbidity: payload.turbidity ?? 2.5,
        temperature: payload.temperature ?? 24.5,
        dissolvedOxygen: payload.dissolvedOxygen ?? 7.5,
        tds: payload.tds ?? 190,
        conductivity: payload.conductivity ?? 320,
      },
      sensors: [
        {
          id: `s-${targetId}-temp`,
          nodeId: targetId,
          name: 'DS18B20 Digital Temperature Sensor',
          type: 'temperature',
          unit: '°C',
          status: 'online',
          healthPercent: 100,
          lastReading: `${payload.temperature ?? 24.5} °C`,
          lastCalibration: 'Active',
          errorCount: 0,
        }
      ],
    };

    db.prepare(`
      INSERT INTO nodes (
        id, code, name, zone, location_name, lat, lng, status,
        battery_level, signal_strength, last_seen, uptime_percent,
        water_quality_index, ph, turbidity, temperature,
        dissolved_oxygen, tds, conductivity, sensors_json, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?
      )
    `).run(
      newNode.id,
      newNode.code,
      newNode.name,
      newNode.zone,
      newNode.locationName,
      newNode.lat,
      newNode.lng,
      newNode.status,
      newNode.batteryLevel,
      newNode.signalStrength,
      newNode.lastSeen,
      newNode.uptimePercent,
      newNode.waterQualityIndex,
      newNode.currentReadings.ph,
      newNode.currentReadings.turbidity,
      newNode.currentReadings.temperature,
      newNode.currentReadings.dissolvedOxygen,
      newNode.currentReadings.tds,
      newNode.currentReadings.conductivity,
      JSON.stringify(newNode.sensors),
      new Date().toISOString()
    );

    node = newNode;
  }

  // Merge readings - for river, do NOT show fake DO or conductivity
  const isRiver = node.id === 'river';
  const updatedReadings = {
    ph: payload.ph !== undefined ? Number(payload.ph) : node.currentReadings.ph,
    turbidity: payload.turbidity !== undefined ? Number(payload.turbidity) : node.currentReadings.turbidity,
    temperature: payload.temperature !== undefined ? Number(payload.temperature) : node.currentReadings.temperature,
    dissolvedOxygen: isRiver ? null : (payload.dissolvedOxygen !== undefined ? Number(payload.dissolvedOxygen) : node.currentReadings.dissolvedOxygen),
    tds: payload.tds !== undefined ? Number(payload.tds) : node.currentReadings.tds,
    conductivity: isRiver ? null : (payload.conductivity !== undefined ? Number(payload.conductivity) : node.currentReadings.conductivity),
  };

  const newWqi = calculateWQI(updatedReadings);
  const nowIso = new Date().toISOString();

  // Update sensor items lastReading - exclude DO/conductivity for river
  let foundTds = false;
  const baseSensors = isRiver
    ? (node.sensors || []).filter(s => s.type !== 'dissolvedOxygen' && s.type !== 'conductivity')
    : (node.sensors || []);

  const updatedSensors = baseSensors.map(s => {
    if (s.type === 'temperature' && payload.temperature !== undefined) {
      return { ...s, lastReading: `${payload.temperature.toFixed(1)} °C`, status: 'online' as const };
    }
    if ((s.type === 'pH' || s.type === 'ph') && payload.ph !== undefined) {
      return { ...s, lastReading: `${payload.ph.toFixed(2)}`, status: 'online' as const };
    }
    if (s.type === 'turbidity' && payload.turbidity !== undefined) {
      return { ...s, lastReading: `${payload.turbidity.toFixed(1)} NTU`, status: 'online' as const };
    }
    if (s.type === 'tds') {
      foundTds = true;
      if (payload.tds !== undefined) {
        return { ...s, lastReading: `${payload.tds.toFixed(0)} ppm`, status: 'online' as const };
      }
    }
    return s;
  });

  if (!foundTds && payload.tds !== undefined) {
    updatedSensors.push({
      id: `${node.id}-s-tds`,
      nodeId: node.id,
      name: 'Analog TDS Sensor Probe',
      type: 'tds',
      unit: 'ppm',
      status: 'online',
      healthPercent: 98,
      lastReading: `${payload.tds.toFixed(0)} ppm`,
      lastCalibration: 'Factory Calibrated',
      errorCount: 0,
    });
  }

  // Database updates
  const updateStmt = db.prepare(`
    UPDATE nodes SET
      ph = ?,
      turbidity = ?,
      temperature = ?,
      dissolved_oxygen = ?,
      tds = ?,
      conductivity = ?,
      water_quality_index = ?,
      status = 'online',
      last_seen = 'Just now',
      sensors_json = ?,
      updated_at = ?
    WHERE id = ?
  `);

  const insertReadingStmt = db.prepare(`
    INSERT INTO sensor_readings (
      node_id, ph, turbidity, temperature, dissolved_oxygen,
      tds, conductivity, water_quality_index, recorded_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  db.transaction(() => {
    updateStmt.run(
      updatedReadings.ph,
      updatedReadings.turbidity,
      updatedReadings.temperature,
      updatedReadings.dissolvedOxygen,
      updatedReadings.tds,
      updatedReadings.conductivity,
      newWqi,
      JSON.stringify(updatedSensors),
      nowIso,
      node!.id
    );

    insertReadingStmt.run(
      node!.id,
      updatedReadings.ph,
      updatedReadings.turbidity,
      updatedReadings.temperature,
      updatedReadings.dissolvedOxygen,
      updatedReadings.tds,
      updatedReadings.conductivity,
      newWqi,
      nowIso
    );
  })();

  // Threshold alert check for Temperature
  let newAlert: AlertItem | undefined = undefined;
  if (payload.temperature !== undefined) {
    const tempThresh = DEFAULT_THRESHOLDS.temperature;
    if (payload.temperature >= tempThresh.maxCritical || payload.temperature <= tempThresh.minCritical) {
      newAlert = {
        id: `ALT-TEMP-${Date.now().toString().slice(-4)}`,
        nodeId: node.id,
        nodeName: node.name,
        parameter: 'temperature',
        severity: 'critical',
        title: 'Critical Temperature Alert',
        message: `ESP32 sensor detected abnormal temperature: ${payload.temperature.toFixed(1)} °C`,
        value: payload.temperature,
        thresholdValue: tempThresh.maxCritical,
        unit: '°C',
        timestamp: nowIso,
        acknowledged: false,
      };
    } else if (payload.temperature >= tempThresh.maxWarning || payload.temperature <= tempThresh.minWarning) {
      newAlert = {
        id: `ALT-TEMP-${Date.now().toString().slice(-4)}`,
        nodeId: node.id,
        nodeName: node.name,
        parameter: 'temperature',
        severity: 'warning',
        title: 'Temperature Warning',
        message: `ESP32 sensor registered elevated water temperature: ${payload.temperature.toFixed(1)} °C`,
        value: payload.temperature,
        thresholdValue: tempThresh.maxWarning,
        unit: '°C',
        timestamp: nowIso,
        acknowledged: false,
      };
    }

    if (newAlert) {
      db.prepare(`
        INSERT INTO alerts (
          id, node_id, node_name, parameter, severity, title,
          message, value, threshold_value, unit, timestamp,
          acknowledged
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `).run(
        newAlert.id,
        newAlert.nodeId,
        newAlert.nodeName,
        newAlert.parameter,
        newAlert.severity,
        newAlert.title,
        newAlert.message,
        newAlert.value,
        newAlert.thresholdValue,
        newAlert.unit,
        newAlert.timestamp
      );
    }
  }

  const updatedNode = getNodeById(node.id)!;
  return { success: true, node: updatedNode, newAlert };
}

export function getNodeHistory(nodeId: string, hours: number = 24): SensorReading[] {
  const rows = db.prepare(`
    SELECT * FROM sensor_readings
    WHERE node_id = ?
    ORDER BY recorded_at DESC
    LIMIT ?
  `).all(nodeId, hours * 4) as any[];

  return rows.reverse().map((r, idx) => ({
    id: `db-rd-${r.id}`,
    nodeId: r.node_id,
    timestamp: r.recorded_at,
    ph: r.ph,
    turbidity: r.turbidity,
    temperature: r.temperature,
    dissolvedOxygen: r.dissolved_oxygen,
    tds: r.tds,
    conductivity: r.conductivity,
    waterQualityIndex: r.water_quality_index,
  }));
}

export function getAllAlerts(): AlertItem[] {
  const rows = db.prepare('SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 50').all() as any[];
  return rows.map(r => ({
    id: r.id,
    nodeId: r.node_id,
    nodeName: r.node_name,
    parameter: r.parameter,
    severity: r.severity,
    title: r.title,
    message: r.message,
    value: r.value,
    thresholdValue: r.threshold_value,
    unit: r.unit,
    timestamp: r.timestamp,
    acknowledged: Boolean(r.acknowledged),
    acknowledgedAt: r.acknowledged_at || undefined,
  }));
}

export function acknowledgeAlertInDb(alertId: string): boolean {
  const result = db.prepare(`
    UPDATE alerts SET acknowledged = 1, acknowledged_at = ? WHERE id = ?
  `).run(new Date().toISOString(), alertId);
  return result.changes > 0;
}

export function resetDbToDefault(): void {
  db.exec(`
    DELETE FROM nodes;
    DELETE FROM sensor_readings;
    DELETE FROM alerts;
  `);
  seedDatabase();
}
