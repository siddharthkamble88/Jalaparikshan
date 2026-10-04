import { NodeInfo, AlertItem, SystemStatusInfo, ParameterThreshold, SensorReading } from '../types';
import { INITIAL_NODES, INITIAL_ALERTS, INITIAL_SYSTEM_STATUS, DEFAULT_THRESHOLDS, generateHistoryReadings } from '../data/mockData';

const BASE_URL = '/api';

export async function fetchNodes(): Promise<NodeInfo[]> {
  try {
    const res = await fetch(`${BASE_URL}/nodes`);
    if (!res.ok) throw new Error('API error');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Backend API unavailable, using local mock state:', err);
    return INITIAL_NODES;
  }
}

export async function fetchNodeById(id: string): Promise<NodeInfo | null> {
  try {
    const res = await fetch(`${BASE_URL}/nodes/${id}`);
    if (!res.ok) throw new Error('API error');
    const json = await res.json();
    return json.data;
  } catch (err) {
    return INITIAL_NODES.find(n => n.id === id) || null;
  }
}

export async function fetchThingSpeakFeed(channelId: string, apiKey?: string, results: number = 48): Promise<SensorReading[] | null> {
  try {
    const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?results=${results}${apiKey ? `&api_key=${apiKey}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.feeds || !Array.isArray(json.feeds)) return null;

    return json.feeds.map((f: any, idx: number) => {
      const temp = parseFloat(f.field1) || 24.8;
      const phVal = parseFloat(f.field2) || 7.3;
      const doVal = parseFloat(f.field3) || 7.8;
      const turbVal = parseFloat(f.field4) || 2.4;
      const tdsVal = parseFloat(f.field5) || 185;
      const condVal = parseFloat(f.field6) || 310;

      return {
        id: `ts-${channelId}-${idx}`,
        nodeId: channelId,
        timestamp: f.created_at || new Date().toISOString(),
        temperature: temp,
        ph: phVal,
        dissolvedOxygen: doVal,
        turbidity: turbVal,
        tds: tdsVal,
        conductivity: condVal,
        waterQualityIndex: Math.round((phVal >= 6.8 && phVal <= 8.5 && turbVal <= 5.0 && doVal >= 6.0) ? 88 : 65)
      };
    });
  } catch (err) {
    console.warn(`Could not fetch ThingSpeak feed for channel ${channelId}, using simulated data`, err);
    return null;
  }
}

export async function fetchHistoryReadings(nodeId: string, hours: number = 24): Promise<SensorReading[]> {
  try {
    const res = await fetch(`${BASE_URL}/readings/history?nodeId=${nodeId}&hours=${hours}`);
    if (!res.ok) throw new Error('API error');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Could not fetch database history:', err);
    return [];
  }
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/alerts`);
    if (!res.ok) throw new Error('API error');
    const json = await res.json();
    return json.data;
  } catch (err) {
    return INITIAL_ALERTS;
  }
}

export async function acknowledgeAlertApi(alertId: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/alerts/acknowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alertId }),
    });
    return res.ok;
  } catch (err) {
    return true;
  }
}

export async function triggerAnomalyApi(nodeId: string, type: 'turbidity_spike' | 'do_drop' | 'reset'): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/simulate/anomaly`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeId, type }),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchSystemStatus(): Promise<SystemStatusInfo> {
  try {
    const res = await fetch(`${BASE_URL}/system-status`);
    if (!res.ok) throw new Error('API error');
    const json = await res.json();
    return json.data;
  } catch (err) {
    return INITIAL_SYSTEM_STATUS;
  }
}

export async function fetchThresholds(): Promise<Record<string, ParameterThreshold>> {
  try {
    const res = await fetch(`${BASE_URL}/thresholds`);
    if (!res.ok) throw new Error('API error');
    const json = await res.json();
    return json.data;
  } catch (err) {
    return DEFAULT_THRESHOLDS;
  }
}

export async function updateThresholdApi(parameterKey: string, newThreshold: Partial<ParameterThreshold>): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/thresholds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parameterKey, newThreshold }),
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}
