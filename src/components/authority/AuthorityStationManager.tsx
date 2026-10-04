import React, { useState } from 'react';
import { useAqua } from '../../context/AquaContext';
import { NodeInfo, NodeStatus } from '../../types';
import {
  Radio,
  MapPin,
  Settings2,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  Plus,
  Trash2,
  Send,
  Battery,
  Wifi,
  Save,
  Activity,
  Droplets,
  Layers,
  Thermometer,
  ShieldAlert
} from 'lucide-react';

export const AuthorityStationManager: React.FC = () => {
  const { nodes, updateNodeDetails, advisories, publishAdvisory, dismissAdvisory } = useAqua();
  
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0]?.id || 'river');
  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Editable local state for selected station
  const [stationName, setStationName] = useState(activeNode.name);
  const [locationName, setLocationName] = useState(activeNode.locationName);
  const [zone, setZone] = useState(activeNode.zone);
  const [status, setStatus] = useState<NodeStatus>(activeNode.status);
  const [channelId, setChannelId] = useState(activeNode.channelId || '');
  const [apiKey, setApiKey] = useState(activeNode.apiKey || '');
  const [lat, setLat] = useState(activeNode.lat.toString());
  const [lng, setLng] = useState(activeNode.lng.toString());
  const [batteryLevel, setBatteryLevel] = useState(activeNode.batteryLevel.toString());

  // Manual reading override
  const [overridePh, setOverridePh] = useState(activeNode.currentReadings.ph.toString());
  const [overrideTurb, setOverrideTurb] = useState(activeNode.currentReadings.turbidity.toString());
  const [overrideDo, setOverrideDo] = useState(activeNode.currentReadings.dissolvedOxygen.toString());
  const [overrideTemp, setOverrideTemp] = useState(activeNode.currentReadings.temperature.toString());

  const [stationSaved, setStationSaved] = useState(false);

  // New Advisory Form state
  const [advTitle, setAdvTitle] = useState('');
  const [advMessage, setAdvMessage] = useState('');
  const [advSeverity, setAdvSeverity] = useState<'info' | 'warning' | 'critical'>('warning');
  const [advSuccess, setAdvSuccess] = useState(false);

  const handleNodeSelect = (node: NodeInfo) => {
    setSelectedNodeId(node.id);
    setStationName(node.name);
    setLocationName(node.locationName);
    setZone(node.zone);
    setStatus(node.status);
    setChannelId(node.channelId || '');
    setApiKey(node.apiKey || '');
    setLat(node.lat.toString());
    setLng(node.lng.toString());
    setBatteryLevel(node.batteryLevel.toString());
    setOverridePh(node.currentReadings.ph.toString());
    setOverrideTurb(node.currentReadings.turbidity.toString());
    setOverrideDo(node.currentReadings.dissolvedOxygen.toString());
    setOverrideTemp(node.currentReadings.temperature.toString());
    setStationSaved(false);
  };

  const handleSaveStation = (e: React.FormEvent) => {
    e.preventDefault();
    updateNodeDetails(selectedNodeId, {
      name: stationName,
      locationName,
      zone,
      status,
      channelId,
      apiKey,
      lat: parseFloat(lat) || activeNode.lat,
      lng: parseFloat(lng) || activeNode.lng,
      batteryLevel: parseInt(batteryLevel, 10) || activeNode.batteryLevel,
      currentReadings: {
        ...activeNode.currentReadings,
        ph: parseFloat(overridePh) || activeNode.currentReadings.ph,
        turbidity: parseFloat(overrideTurb) || activeNode.currentReadings.turbidity,
        dissolvedOxygen: parseFloat(overrideDo) || activeNode.currentReadings.dissolvedOxygen,
        temperature: parseFloat(overrideTemp) || activeNode.currentReadings.temperature,
      }
    });

    setStationSaved(true);
    setTimeout(() => setStationSaved(false), 3500);
  };

  const handleBroadcastAdvisory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advTitle.trim() || !advMessage.trim()) return;

    publishAdvisory({
      title: advTitle.trim(),
      message: advMessage.trim(),
      severity: advSeverity,
      issuedBy: 'Official Environmental Authority Notice',
      affectedLocations: [activeNode.code],
    });

    setAdvTitle('');
    setAdvMessage('');
    setAdvSuccess(true);
    setTimeout(() => setAdvSuccess(false), 3500);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Station Management Section */}
      <div className="bg-[#102b34] border border-[#1e4652] rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1e4652]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Station Telemetry & Node Configuration</h3>
              <p className="text-xs text-[#9fbdc2] font-mono">
                Update operational status, sensor telemetry offsets, coordinates, and IoT channel mappings
              </p>
            </div>
          </div>

          {/* Station Selector Pills */}
          <div className="flex items-center gap-1.5 bg-[#0b1f26] p-1.5 rounded-2xl border border-[#1e4652]">
            {nodes.map(n => (
              <button
                key={n.id}
                onClick={() => handleNodeSelect(n)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                  n.id === selectedNodeId
                    ? 'bg-[#2fb3a3] text-[#0b1f26] font-bold shadow-md'
                    : 'text-[#9fbdc2] hover:text-white hover:bg-[#123540]'
                }`}
              >
                {n.name}
              </button>
            ))}
          </div>
        </div>

        {/* Station Form */}
        <form onSubmit={handleSaveStation} className="space-y-6">
          
          {stationSaved && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">
                Station updates saved successfully! Live readings and GIS markers have been synchronized.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            
            {/* Station Name */}
            <div>
              <label className="text-[#9fbdc2] block mb-1.5">Station Display Name</label>
              <input
                type="text"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                className="w-full bg-[#0b1f26] border border-[#1e4652] focus:border-[#5ad1c9] rounded-xl px-3 py-2 text-white font-sans outline-none"
              />
            </div>

            {/* Location Description */}
            <div>
              <label className="text-[#9fbdc2] block mb-1.5">Location Identifier</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full bg-[#0b1f26] border border-[#1e4652] focus:border-[#5ad1c9] rounded-xl px-3 py-2 text-white font-sans outline-none"
              />
            </div>

            {/* Zone */}
            <div>
              <label className="text-[#9fbdc2] block mb-1.5">Catchment Zone Sector</label>
              <input
                type="text"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full bg-[#0b1f26] border border-[#1e4652] focus:border-[#5ad1c9] rounded-xl px-3 py-2 text-white font-sans outline-none"
              />
            </div>

            {/* Operational Status */}
            <div>
              <label className="text-[#9fbdc2] block mb-1.5">Deployment Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as NodeStatus)}
                className="w-full bg-[#0b1f26] border border-[#1e4652] focus:border-[#5ad1c9] rounded-xl px-3 py-2 text-white font-mono outline-none"
              >
                <option value="online">Online (Active Streaming)</option>
                <option value="warning">Warning (Maintenance Alert)</option>
                <option value="critical">Critical (Fault Breach)</option>
                <option value="offline">Offline (Decommissioned)</option>
              </select>
            </div>

            {/* Latitude */}
            <div>
              <label className="text-[#9fbdc2] block mb-1.5">GPS Latitude</label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full bg-[#0b1f26] border border-[#1e4652] focus:border-[#5ad1c9] rounded-xl px-3 py-2 text-white font-mono outline-none"
              />
            </div>

            {/* Longitude */}
            <div>
              <label className="text-[#9fbdc2] block mb-1.5">GPS Longitude</label>
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full bg-[#0b1f26] border border-[#1e4652] focus:border-[#5ad1c9] rounded-xl px-3 py-2 text-white font-mono outline-none"
              />
            </div>

            {/* ThingSpeak Channel */}
            <div>
              <label className="text-[#9fbdc2] block mb-1.5">ThingSpeak Channel ID</label>
              <input
                type="text"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                placeholder="e.g. 3430859"
                className="w-full bg-[#0b1f26] border border-[#1e4652] focus:border-[#5ad1c9] rounded-xl px-3 py-2 text-white font-mono outline-none"
              />
            </div>

            {/* Battery Level */}
            <div>
              <label className="text-[#9fbdc2] block mb-1.5">Battery Capacity (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={batteryLevel}
                onChange={(e) => setBatteryLevel(e.target.value)}
                className="w-full bg-[#0b1f26] border border-[#1e4652] focus:border-[#5ad1c9] rounded-xl px-3 py-2 text-white font-mono outline-none"
              />
            </div>

          </div>

          {/* Telemetry Value Calibration / Override */}
          <div className="p-4 rounded-2xl bg-[#0b1f26] border border-[#1e4652] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Settings2 className="w-4 h-4 text-cyan-400" /> Sensor Calibration & Telemetry Overrides
              </span>
              <span className="text-[10px] text-[#9fbdc2] font-mono">
                Directly updates current station reading & recalculates WQI score
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <label className="text-[10px] text-[#9fbdc2] block mb-1">pH Reading</label>
                <input
                  type="number"
                  step="0.01"
                  value={overridePh}
                  onChange={(e) => setOverridePh(e.target.value)}
                  className="w-full bg-[#102b34] border border-[#1e4652] rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#9fbdc2] block mb-1">Turbidity (NTU)</label>
                <input
                  type="number"
                  step="0.1"
                  value={overrideTurb}
                  onChange={(e) => setOverrideTurb(e.target.value)}
                  className="w-full bg-[#102b34] border border-[#1e4652] rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#9fbdc2] block mb-1">DO (mg/L)</label>
                <input
                  type="number"
                  step="0.01"
                  value={overrideDo}
                  onChange={(e) => setOverrideDo(e.target.value)}
                  className="w-full bg-[#102b34] border border-[#1e4652] rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#9fbdc2] block mb-1">Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={overrideTemp}
                  onChange={(e) => setOverrideTemp(e.target.value)}
                  className="w-full bg-[#102b34] border border-[#1e4652] rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#2fb3a3] hover:bg-[#5ad1c9] text-[#0b1f26] font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#2fb3a3]/20 transition-all"
            >
              <Save className="w-4 h-4" /> Save Station Configuration
            </button>
          </div>

        </form>

      </div>

      {/* 2. Public Advisory Broadcaster */}
      <div className="bg-[#102b34] border border-[#1e4652] rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#1e4652]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Official Public Health Advisory Broadcaster</h3>
              <p className="text-xs text-[#9fbdc2] font-mono">
                Broadcast water safety notices visible to citizens, community managers, and researchers
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
            {advisories.length} Active Advisories
          </span>
        </div>

        {advSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Advisory notice dispatched and published to public citizen portals!</span>
          </div>
        )}

        <form onSubmit={handleBroadcastAdvisory} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="sm:col-span-2">
              <label className="text-[#9fbdc2] block mb-1">Advisory Title / Headline</label>
              <input
                type="text"
                placeholder="e.g. Elevated Turbidity Warning — Filtration Plant 2"
                value={advTitle}
                onChange={(e) => setAdvTitle(e.target.value)}
                className="w-full bg-[#0b1f26] border border-[#1e4652] focus:border-amber-400 rounded-xl px-3 py-2 text-white font-sans outline-none"
              />
            </div>

            <div>
              <label className="text-[#9fbdc2] block mb-1">Severity Category</label>
              <select
                value={advSeverity}
                onChange={(e) => setAdvSeverity(e.target.value as any)}
                className="w-full bg-[#0b1f26] border border-[#1e4652] focus:border-amber-400 rounded-xl px-3 py-2 text-white font-mono outline-none"
              >
                <option value="warning">Warning (Elevated Caution)</option>
                <option value="critical">Critical (Health Danger / Boil Notice)</option>
                <option value="info">Informational (Maintenance Notice)</option>
              </select>
            </div>
          </div>

          <div className="text-xs font-mono">
            <label className="text-[#9fbdc2] block mb-1">Detailed Public Safety Instructions</label>
            <textarea
              rows={3}
              placeholder="State clear recommendations for municipal operators, recreational users, and public drinking water filtration..."
              value={advMessage}
              onChange={(e) => setAdvMessage(e.target.value)}
              className="w-full bg-[#0b1f26] border border-[#1e4652] focus:border-amber-400 rounded-xl px-3 py-2 text-white font-sans outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!advTitle.trim() || !advMessage.trim()}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Send className="w-4 h-4" /> Dispatch Official Advisory
            </button>
          </div>
        </form>

        {/* Active Advisories List */}
        {advisories.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-[#1e4652]">
            <h4 className="text-xs font-bold text-[#e7f2f2] uppercase tracking-wider font-mono">
              Live Broadcasted Advisories
            </h4>
            <div className="space-y-2.5">
              {advisories.map((adv) => (
                <div
                  key={adv.id}
                  className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 text-xs ${
                    adv.severity === 'critical'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                      : adv.severity === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold flex items-center gap-2">
                      <span className="uppercase text-[10px] px-1.5 py-0.5 rounded font-mono bg-black/40">
                        {adv.severity}
                      </span>
                      <span>{adv.title}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#e7f2f2]/90 font-sans">
                      {adv.message}
                    </p>
                    <div className="text-[10px] text-[#9fbdc2] font-mono">
                      Issued: {new Date(adv.issuedAt).toLocaleString()} &middot; By: {adv.issuedBy}
                    </div>
                  </div>

                  <button
                    onClick={() => dismissAdvisory(adv.id)}
                    className="p-1.5 rounded-lg bg-black/30 hover:bg-rose-500/30 text-[#9fbdc2] hover:text-white transition-colors"
                    title="Retract / Dismiss Advisory"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
