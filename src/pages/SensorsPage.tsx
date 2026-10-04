import React from 'react';
import { useAqua } from '../context/AquaContext';
import { Cpu, Droplets, AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

export const SensorsPage: React.FC = () => {
  const { setActiveView } = useAqua();

  const sensorsList = [
    {
      name: 'Industrial Glass Electrode pH Sensor',
      type: 'pH Level',
      unit: 'pH',
      optimal: '6.5 - 8.5 pH',
      description: 'Measures hydrogen-ion activity. Essential for detecting acidic chemical dumping or alkaline runoff.',
      calibration: 'Buffer solution calibration (pH 4.01, 7.00, 10.01)',
      importance: 'Critical for aquatic organism survival and water potability.'
    },
    {
      name: 'Optical Turbidity Sensor (TS-300B)',
      type: 'Turbidity / Clarity',
      unit: 'NTU',
      optimal: '< 5.0 NTU',
      description: 'Uses infrared light scattering to detect suspended particles, silt, soil erosion, and algae blooms.',
      calibration: 'Formazin turbidity standard calibration',
      importance: 'High turbidity blocks sunlight and indicates severe soil erosion or sewage inflow.'
    },
    {
      name: 'Galvanic Dissolved Oxygen (DO) Probe',
      type: 'Dissolved Oxygen',
      unit: 'mg/L',
      optimal: '> 6.0 mg/L',
      description: 'Measures concentration of free, non-compound oxygen molecules dissolved in water.',
      calibration: 'Zero-oxygen sodium sulfite solution + Air saturation calibration',
      importance: 'Crucial metric for fish and aquatic ecosystem respiration. DO < 4.0 mg/L causes hypoxia.'
    },
    {
      name: 'High-Precision DS18B20 Temp Sensor',
      type: 'Water Temperature',
      unit: '°C',
      optimal: '18.0 - 28.0 °C',
      description: 'Waterproof digital thermal probe with 12-bit precision. Monitors thermal pollution.',
      calibration: 'Factory calibrated digital thermal sensor',
      importance: 'Water temperature directly controls oxygen solubility and chemical reaction rates.'
    },
    {
      name: 'Analog TDS Sensor Probe',
      type: 'Total Dissolved Solids',
      unit: 'ppm',
      optimal: '< 300 ppm',
      description: 'Measures dissolved inorganic salts (sodium, calcium, magnesium) in water.',
      calibration: 'Standard 1382 ppm TDS solution calibration',
      importance: 'Elevated TDS indicates industrial waste, mineral leaching, or agricultural fertilizer runoff.'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
          <Cpu className="w-3.5 h-3.5" />
          <span>Hardware Instrumentation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Sensors & Measurement Probes
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          High-precision submersible probes engineered for harsh aquatic environments and continuous field deployments.
        </p>
      </div>

      {/* Sensor Catalog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sensorsList.map((sensor, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{sensor.name}</h3>
                <span className="text-xs font-mono text-cyan-400">{sensor.type} ({sensor.unit})</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                Target: {sensor.optimal}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{sensor.description}</p>

            <div className="space-y-2 text-xs font-mono pt-2 border-t border-slate-900">
              <div className="flex items-center gap-2 text-slate-400">
                <strong className="text-slate-300">Calibration:</strong> {sensor.calibration}
              </div>
              <div className="flex items-center gap-2 text-teal-300">
                <strong className="text-slate-300">Importance:</strong> {sensor.importance}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Technical Honesty Note regarding MQ Gas Sensors */}
      <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/40 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <AlertTriangle className="w-5 h-5" />
          <span>Technical Specification Clarification — Gas Sensors vs. Water Probes</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-mono">
          <strong>Note on MQ-Series Sensors:</strong> Metal-oxide gas sensors (e.g., MQ-135, MQ-7) detect atmospheric gases in surrounding air. In JalParikshan nodes, MQ sensors measure ambient air quality inside the floating waterproof enclosure. Dissolved water parameters (pH, DO, Turbidity) are measured exclusively by specialized submersible probes.
        </p>
      </div>

    </div>
  );
};
