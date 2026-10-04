import React, { useState } from 'react';
import { useAqua } from '../../context/AquaContext';
import { NodeInfo } from '../../types';
import { MapPin, Navigation, Radio, Battery, Wifi, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';

interface MonitoringMapProps {
  onSelectNode?: (id: string) => void;
}

export const MonitoringMap: React.FC<MonitoringMapProps> = ({ onSelectNode }) => {
  const { nodes, setSelectedNodeId, setDashboardTab } = useAqua();
  const [activeHoverNode, setActiveHoverNode] = useState<NodeInfo | null>(nodes[0]);

  const handleNodeClick = (node: NodeInfo) => {
    setSelectedNodeId(node.id);
    setActiveHoverNode(node);
    if (onSelectNode) onSelectNode(node.id);
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">GIS Spatial Monitoring Network</h3>
            <span className="text-xs text-slate-400 font-mono">Crystal Lake Reservoir & Inlet Catchment Network</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Healthy (2)
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Warning (1)
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span> Critical (1)
          </span>
        </div>
      </div>

      {/* Map Canvas / Stylized Topographical Lake Diagram */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-4">
        
        {/* Lake Outline Contour Graphic */}
        <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 800 500" fill="none">
          <defs>
            <linearGradient id="lakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0891b2" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.5" />
            </linearGradient>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.3" />
            </pattern>
          </defs>

          {/* Grid lines */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Lake water body shape */}
          <path
            d="M 120 180 C 180 80, 420 60, 580 120 C 720 180, 750 320, 640 420 C 520 500, 280 460, 160 380 C 80 320, 80 240, 120 180 Z"
            fill="url(#lakeGradient)"
            stroke="#22d3ee"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Depth contours */}
          <path
            d="M 220 200 C 280 140, 450 130, 540 180 C 620 220, 620 320, 520 370 C 420 410, 280 380, 220 310 C 180 260, 180 220, 220 200 Z"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
        </svg>

        {/* Dynamic Nodes Markers positioned on the lake canvas */}
        <div className="absolute inset-0 p-8 flex items-center justify-center">
          <div className="relative w-full h-full">
            
            {nodes.map((node, index) => {
              // Custom layout coordinates for the 4 nodes
              const positions = [
                { top: '25%', left: '35%' }, // North
                { top: '35%', left: '72%' }, // East
                { top: '70%', left: '48%' }, // South
                { top: '65%', left: '22%' }, // West
              ];
              const pos = positions[index] || { top: '50%', left: '50%' };
              const isSelected = activeHoverNode?.id === node.id;

              return (
                <div
                  key={node.id}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    onClick={() => handleNodeClick(node)}
                    className="relative group flex flex-col items-center focus:outline-none"
                  >
                    {/* Ping Effect */}
                    <span className={`absolute inline-flex h-8 w-8 rounded-full opacity-75 animate-ping ${
                      node.status === 'online' ? 'bg-cyan-400' : node.status === 'warning' ? 'bg-amber-400' : 'bg-rose-500'
                    }`}></span>

                    {/* Node Marker Pin */}
                    <div className={`relative p-2.5 rounded-2xl border-2 shadow-xl transition-all duration-300 ${
                      isSelected
                        ? 'scale-125 border-white bg-slate-900 shadow-cyan-500/50 z-30'
                        : 'hover:scale-110 bg-slate-950/90'
                    } ${
                      node.status === 'online'
                        ? 'border-cyan-400 text-cyan-400'
                        : node.status === 'warning'
                        ? 'border-amber-400 text-amber-400'
                        : 'border-rose-500 text-rose-400'
                    }`}>
                      <Radio className="w-4 h-4" />
                    </div>

                    {/* Label Badge */}
                    <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-950/90 border border-slate-800 text-[10px] font-mono font-bold text-white whitespace-nowrap shadow-md">
                      {node.code} ({node.waterQualityIndex})
                    </span>
                  </button>
                </div>
              );
            })}

          </div>
        </div>

        {/* Selected Node Inspector Overlay Card */}
        {activeHoverNode && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 bg-slate-950/90 border border-slate-800 p-4 rounded-2xl shadow-2xl backdrop-blur-md z-30 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                {activeHoverNode.name}
              </span>
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                activeHoverNode.status === 'online' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {activeHoverNode.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono py-1">
              <div>
                <span className="text-[10px] text-slate-400 block">WQI Score</span>
                <span className="text-white font-extrabold text-sm">{activeHoverNode.waterQualityIndex} / 100</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Turbidity</span>
                <span className="text-cyan-300 font-bold">{activeHoverNode.currentReadings.turbidity} NTU</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">pH Level</span>
                <span className="text-slate-200 font-bold">{activeHoverNode.currentReadings.ph} pH</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Dissolved Oxygen</span>
                <span className="text-teal-300 font-bold">{activeHoverNode.currentReadings.dissolvedOxygen} mg/L</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedNodeId(activeHoverNode.id);
                setDashboardTab('nodes');
              }}
              className="w-full mt-2 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
            >
              Inspect Full Telemetry <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
