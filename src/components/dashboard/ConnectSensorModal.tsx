import React, { useState } from 'react';
import { X, Radio, Check, RefreshCw, Key, HelpCircle } from 'lucide-react';
import { useAqua } from '../../context/AquaContext';

interface ConnectSensorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectSensorModal: React.FC<ConnectSensorModalProps> = ({ isOpen, onClose }) => {
  const { nodes, updateNodeChannel } = useAqua();
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0]?.id || 'river');
  const [channelIdInput, setChannelIdInput] = useState<string>('');
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const handleNodeChange = (id: string) => {
    setSelectedNodeId(id);
    const n = nodes.find(node => node.id === id);
    setChannelIdInput(n?.channelId || '');
    setApiKeyInput(n?.apiKey || '');
    setIsSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateNodeChannel) {
      updateNodeChannel(selectedNodeId, channelIdInput.trim(), apiKeyInput.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#102b34] border border-[#1e4652] rounded-2xl shadow-2xl p-6 text-[#e7f2f2] space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1e4652] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#123540] border border-[#5ad1c9] text-[#5ad1c9]">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-normal text-[#e7f2f2]">
                Connect Real Sensor Readings
              </h3>
              <p className="text-xs text-[#9fbdc2]">
                Configure ThingSpeak Channel or Custom API Endpoint
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9fbdc2] hover:text-[#e7f2f2] hover:bg-[#123540] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Node selector */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider font-mono text-[#9fbdc2]">
            Select Monitoring Location
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {nodes.map(n => (
              <button
                key={n.id}
                type="button"
                onClick={() => handleNodeChange(n.id)}
                className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                  selectedNodeId === n.id
                    ? 'bg-[#123540] border-[#5ad1c9] text-[#5ad1c9]'
                    : 'bg-[#0b1f26] border-[#1e4652] text-[#9fbdc2] hover:border-[#2fb3a3]'
                }`}
              >
                <div className="font-semibold truncate">{n.name}</div>
                <div className="text-[10px] opacity-75 font-mono">{n.channelId ? `Ch: ${n.channelId}` : 'Not linked'}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 pt-2 border-t border-[#1e4652]">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-[#9fbdc2] mb-1">
                ThingSpeak Channel ID
              </label>
              <input
                type="text"
                placeholder="e.g. 3430859"
                value={channelIdInput}
                onChange={(e) => setChannelIdInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0b1f26] border border-[#1e4652] rounded-lg text-xs font-mono text-[#e7f2f2] focus:outline-none focus:border-[#5ad1c9]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#9fbdc2] mb-1">
                Read API Key (Optional for public channels)
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="e.g. V1YFKPYP3LSDUPUE"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0b1f26] border border-[#1e4652] rounded-lg text-xs font-mono text-[#e7f2f2] focus:outline-none focus:border-[#5ad1c9]"
                />
                <Key className="w-4 h-4 text-[#9fbdc2] absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="bg-[#0b1f26] border border-[#1e4652] rounded-xl p-3 text-xs text-[#9fbdc2] space-y-1.5">
            <div className="font-semibold text-[#e7f2f2] flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#5ad1c9]" /> ThingSpeak Field Mapping:
            </div>
            <p className="font-mono text-[11px] leading-relaxed">
              Field 1 = Temp (°C) &middot; Field 2 = pH &middot; Field 3 = DO (mg/L) &middot; Field 4 = Turbidity (NTU) &middot; Field 5 = TDS (ppm)
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {isSaved && (
              <span className="text-xs text-[#3ecf8e] font-medium flex items-center gap-1">
                <Check className="w-4 h-4" /> Connection details saved!
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#2fb3a3] hover:bg-[#5ad1c9] text-[#0b1f26] font-bold text-xs transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Sync Channel Data
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
