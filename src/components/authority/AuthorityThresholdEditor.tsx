import React, { useState } from 'react';
import { useAqua } from '../../context/AquaContext';
import { ParameterThreshold, ParameterType } from '../../types';
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Shield,
  Activity,
  Droplets,
  Thermometer,
  ShieldCheck,
  Layers,
  Save,
  Info
} from 'lucide-react';

export const AuthorityThresholdEditor: React.FC = () => {
  const { thresholds, updateThresholds, applyRegulatoryPreset, activeRegulatoryStandard } = useAqua();
  const [localThresholds, setLocalThresholds] = useState<Record<string, ParameterThreshold>>(() =>
    JSON.parse(JSON.stringify(thresholds))
  );
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [activeParamTab, setActiveParamTab] = useState<string>('all');

  const paramIcons: Record<string, React.ReactNode> = {
    ph: <Activity className="w-4 h-4 text-cyan-400" />,
    turbidity: <Droplets className="w-4 h-4 text-purple-400" />,
    temperature: <Thermometer className="w-4 h-4 text-amber-400" />,
    dissolvedOxygen: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
    tds: <Layers className="w-4 h-4 text-indigo-400" />,
    conductivity: <Activity className="w-4 h-4 text-pink-400" />,
  };

  const handleChange = (paramKey: string, field: keyof ParameterThreshold, val: number) => {
    setLocalThresholds(prev => ({
      ...prev,
      [paramKey]: {
        ...prev[paramKey],
        [field]: Number.isNaN(val) ? 0 : val,
      },
    }));
    setSaveSuccess(false);
  };

  const handleSaveAll = () => {
    Object.keys(localThresholds).forEach(key => {
      updateThresholds(key, localThresholds[key]);
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleApplyPreset = (preset: 'CPCB' | 'WHO') => {
    applyRegulatoryPreset(preset);
    setTimeout(() => {
      // resync local
      setLocalThresholds(JSON.parse(JSON.stringify(thresholds)));
    }, 50);
  };

  const filteredKeys = activeParamTab === 'all'
    ? Object.keys(localThresholds)
    : Object.keys(localThresholds).filter(k => k.toLowerCase() === activeParamTab.toLowerCase());

  return (
    <div className="space-y-6">
      
      {/* Top Controller Bar */}
      <div className="bg-[#102b34] border border-[#1e4652] rounded-3xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Sensor Threshold Calibration & Bounds
              </h2>
              <p className="text-xs text-[#9fbdc2] font-mono">
                Define acceptable minimum and maximum operational bounds for each environmental metric
              </p>
            </div>
          </div>
        </div>

        {/* Regulatory Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-xs font-mono text-[#9fbdc2] mr-1 hidden sm:block">
            Standard:
          </div>

          <button
            onClick={() => handleApplyPreset('CPCB')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border ${
              activeRegulatoryStandard === 'CPCB'
                ? 'bg-[#2fb3a3] text-[#0b1f26] border-[#5ad1c9] shadow-md shadow-[#2fb3a3]/20 font-bold'
                : 'bg-[#0b1f26] hover:bg-[#123540] text-[#9fbdc2] border-[#1e4652]'
            }`}
            title="Central Pollution Control Board of India water quality benchmarks"
          >
            🇮🇳 CPCB India Standard
          </button>

          <button
            onClick={() => handleApplyPreset('WHO')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border ${
              activeRegulatoryStandard === 'WHO'
                ? 'bg-[#2fb3a3] text-[#0b1f26] border-[#5ad1c9] shadow-md shadow-[#2fb3a3]/20 font-bold'
                : 'bg-[#0b1f26] hover:bg-[#123540] text-[#9fbdc2] border-[#1e4652]'
            }`}
            title="World Health Organization international potable water limits"
          >
            🌐 WHO Guideline
          </button>

          <button
            onClick={handleSaveAll}
            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all ml-2"
          >
            <Save className="w-4 h-4" /> Save & Deploy Limits
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">
            Threshold adjustments deployed successfully! Real-time alerts and WQI scoring algorithms have updated.
          </span>
        </div>
      )}

      {/* Parameter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredKeys.map(key => {
          const t = localThresholds[key];
          if (!t) return null;

          return (
            <div key={key} className="bg-[#102b34] border border-[#1e4652] rounded-3xl p-5 space-y-4 hover:border-[#5ad1c9]/40 transition-colors">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1e4652]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#0b1f26] border border-[#1e4652]">
                    {paramIcons[key] || <Activity className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{t.displayName}</h3>
                    <span className="text-[11px] font-mono text-[#9fbdc2]">
                      Target Unit: <strong className="text-cyan-300">{t.unit || 'Score'}</strong>
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0b1f26] text-[#9fbdc2] border border-[#1e4652]">
                  {key}
                </span>
              </div>

              {/* Threshold Fields Grid */}
              <div className="space-y-3 text-xs">
                
                {/* 1. Optimal Green Zone */}
                <div className="p-3 rounded-2xl bg-[#0b1f26]/80 border border-emerald-500/20 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Optimal Healthy Range
                    </span>
                    <span className="font-mono text-[10px] text-[#9fbdc2]">Score: 90 - 100 WQI</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[10px] text-[#9fbdc2] block mb-1 font-mono">Min Optimal</label>
                      <input
                        type="number"
                        step="0.1"
                        value={t.minOptimal}
                        onChange={(e) => handleChange(key, 'minOptimal', parseFloat(e.target.value))}
                        className="w-full bg-[#123540] border border-[#1e4652] focus:border-emerald-400 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#9fbdc2] block mb-1 font-mono">Max Optimal</label>
                      <input
                        type="number"
                        step="0.1"
                        value={t.maxOptimal}
                        onChange={(e) => handleChange(key, 'maxOptimal', parseFloat(e.target.value))}
                        className="w-full bg-[#123540] border border-[#1e4652] focus:border-emerald-400 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Warning Yellow Zone */}
                <div className="p-3 rounded-2xl bg-[#0b1f26]/80 border border-amber-500/20 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-amber-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span> Advisory Warning Limits
                    </span>
                    <span className="font-mono text-[10px] text-[#9fbdc2]">Caution Tier</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[10px] text-[#9fbdc2] block mb-1 font-mono">Min Warning</label>
                      <input
                        type="number"
                        step="0.1"
                        value={t.minWarning}
                        onChange={(e) => handleChange(key, 'minWarning', parseFloat(e.target.value))}
                        className="w-full bg-[#123540] border border-[#1e4652] focus:border-amber-400 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#9fbdc2] block mb-1 font-mono">Max Warning</label>
                      <input
                        type="number"
                        step="0.1"
                        value={t.maxWarning}
                        onChange={(e) => handleChange(key, 'maxWarning', parseFloat(e.target.value))}
                        className="w-full bg-[#123540] border border-[#1e4652] focus:border-amber-400 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Critical Red Zone */}
                <div className="p-3 rounded-2xl bg-[#0b1f26]/80 border border-rose-500/20 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-rose-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400"></span> Critical Breach Limit
                    </span>
                    <span className="font-mono text-[10px] text-[#9fbdc2]">Immediate Action</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[10px] text-[#9fbdc2] block mb-1 font-mono">Min Critical</label>
                      <input
                        type="number"
                        step="0.1"
                        value={t.minCritical}
                        onChange={(e) => handleChange(key, 'minCritical', parseFloat(e.target.value))}
                        className="w-full bg-[#123540] border border-[#1e4652] focus:border-rose-400 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#9fbdc2] block mb-1 font-mono">Max Critical</label>
                      <input
                        type="number"
                        step="0.1"
                        value={t.maxCritical}
                        onChange={(e) => handleChange(key, 'maxCritical', parseFloat(e.target.value))}
                        className="w-full bg-[#123540] border border-[#1e4652] focus:border-rose-400 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
