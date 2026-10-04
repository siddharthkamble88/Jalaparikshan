import React from 'react';
import { useAqua } from '../context/AquaContext';
import { Globe, ShieldCheck, HeartPulse, TreePine, ArrowRight, Activity } from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const { setActiveView } = useAqua();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
          <Globe className="w-3.5 h-3.5" />
          <span>Environmental Stewardship</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Data → Insight → Action → Impact
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          How continuous real-time water quality monitoring empowers communities, protects aquatic ecosystems, and improves regulatory compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Ecological Protection</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Early detection of Dissolved Oxygen depletion prevents mass fish kill events in freshwater lakes and rivers.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Public Health Safeguard</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Continuous pH and turbidity monitoring at municipal intake points protects drinking water filtration infrastructure.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <TreePine className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Regulatory Accountability</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Immutable time-stamped telemetry logs deter unauthorized chemical or industrial effluent discharges.
          </p>
        </div>

      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => setActiveView('dashboard')}
          className="px-8 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-sm inline-flex items-center gap-2"
        >
          Explore Live Dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
