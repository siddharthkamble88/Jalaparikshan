import React from 'react';
import { NodeInfo } from '../../types';
import { getWQILabel } from '../../data/mockData';
import { Radio, BatteryCharging, Wifi, ArrowRight } from 'lucide-react';

interface NodeCardProps {
  node: NodeInfo;
  isSelected?: boolean;
  onSelect: (nodeId: string) => void;
}

export const NodeCard: React.FC<NodeCardProps> = ({ node, isSelected, onSelect }) => {
  // Determine overall status label: Safe, Caution, Alert, No data
  const getBadgeClassAndText = () => {
    if (node.status === 'offline') return { badgeClass: 'badge-unknown', text: 'No data' };
    if (node.status === 'critical') return { badgeClass: 'badge-danger', text: 'Alert' };
    if (node.status === 'warning') return { badgeClass: 'badge-warn', text: 'Caution' };
    return { badgeClass: 'badge-safe', text: 'Safe' };
  };

  const { badgeClass, text: statusText } = getBadgeClassAndText();

  return (
    <div
      onClick={() => onSelect(node.id)}
      className={`p-4 rounded-[10px] border transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-[#123540] border-[#5ad1c9] shadow-[0_0_0_1px_#5ad1c9]'
          : 'bg-[#102b34] border-[#1e4652] hover:border-[#2fb3a3] hover:-translate-y-0.5'
      }`}
      id={`loccard-${node.id}`}
    >
      {/* Top Header */}
      <div className="flex justify-between items-center mb-2.5">
        <span className="font-semibold text-base text-[#e7f2f2]">{node.name}</span>
        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${badgeClass}`}>
          {statusText}
        </span>
      </div>

      {/* Mini Readings Grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-[#9fbdc2] mb-3">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: '#f2994a' }}></span>
            Temperature
          </span>
          <b className="font-mono text-[#e7f2f2] text-[13px] ml-1">
            {node.currentReadings.temperature !== undefined && node.currentReadings.temperature !== null ? `${node.currentReadings.temperature}°C` : '--'}
          </b>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: '#5ad1c9' }}></span>
            pH
          </span>
          <b className="font-mono text-[#e7f2f2] text-[13px] ml-1">
            {node.currentReadings.ph !== undefined && node.currentReadings.ph !== null ? `${node.currentReadings.ph}` : '--'}
          </b>
        </div>

        {node.currentReadings.dissolvedOxygen !== undefined && node.currentReadings.dissolvedOxygen !== null && (
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: '#4f8ef7' }}></span>
              D. Oxygen
            </span>
            <b className="font-mono text-[#e7f2f2] text-[13px] ml-1">
              {`${node.currentReadings.dissolvedOxygen}mg/L`}
            </b>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: '#c77dff' }}></span>
            Turbidity
          </span>
          <b className="font-mono text-[#e7f2f2] text-[13px] ml-1">
            {node.currentReadings.turbidity !== undefined && node.currentReadings.turbidity !== null ? `${node.currentReadings.turbidity}NTU` : '--'}
          </b>
        </div>

        <div className="flex justify-between items-center col-span-2 sm:col-span-1">
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: '#a78bfa' }}></span>
            TDS Solids
          </span>
          <b className="font-mono text-[#e7f2f2] text-[13px] ml-1">
            {node.currentReadings.tds !== undefined && node.currentReadings.tds !== null ? `${node.currentReadings.tds}ppm` : '--'}
          </b>
        </div>
      </div>

      {/* Footer Updated Bar */}
      <div className="flex items-center justify-between text-[11px] text-[#9fbdc2] border-t border-[#1e4652] pt-2">
        <span>Updated {node.lastSeen}</span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <BatteryCharging className="w-3 h-3 text-[#3ecf8e]" /> {node.batteryLevel}%
          </span>
          <span className="flex items-center gap-1">
            <Wifi className="w-3 h-3 text-[#5ad1c9]" /> {node.signalStrength}%
          </span>
        </div>
      </div>
    </div>
  );
};

