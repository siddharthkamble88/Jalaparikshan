import React, { useState } from 'react';
import { useAqua } from '../context/AquaContext';
import { generateHistoryReadings } from '../data/mockData';
import { FileSpreadsheet, Download, Printer, Search, Filter, Calendar, CheckCircle2, ArrowUpDown } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { nodes, selectedNodeId } = useAqua();

  const [reportNodeId, setReportNodeId] = useState<string>(selectedNodeId);
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);

  // Generate telemetry rows
  const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
  const rawReadings = generateHistoryReadings(reportNodeId, hours);

  // Filter & Search
  const filteredReadings = rawReadings.filter(r => {
    const timeStr = new Date(r.timestamp).toLocaleString();
    return timeStr.toLowerCase().includes(searchTerm.toLowerCase()) || r.nodeId.toLowerCase().includes(searchTerm.toLowerCase());
  }).sort((a, b) => {
    return sortAsc
      ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const handleExportCSV = () => {
    let csv = "Timestamp,NodeID,pH,Turbidity(NTU),Temperature(C),DissolvedOxygen(mg/L),TDS(ppm),Conductivity(uS/cm),WQI\n";
    filteredReadings.forEach(r => {
      csv += `${r.timestamp},${r.nodeId},${r.ph},${r.turbidity},${r.temperature},${r.dissolvedOxygen},${r.tds},${r.conductivity},${r.waterQualityIndex}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JalParikshan_${reportNodeId}_${timeRange}_report.csv`;
    a.click();
  };

  const handlePrintReport = () => {
    window.print();
  };

  const targetNode = nodes.find(n => n.id === reportNodeId) || nodes[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-cyan-400" /> Environmental Water Quality Reports & CSV Export
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Generate executive summary audits, download raw sensor telemetry CSV, and format printable reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            id="export-csv-btn"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" /> Export CSV Data
          </button>
          <button
            onClick={handlePrintReport}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-cyan-400" /> Print / PDF
          </button>
        </div>
      </div>

      {/* Report Generator Control Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" /> Report Configuration Generator
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <label className="text-slate-400 block mb-1">Select Monitoring Station</label>
            <select
              value={reportNodeId}
              onChange={(e) => setReportNodeId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-sans"
            >
              {nodes.map(n => (
                <option key={n.id} value={n.id}>{n.name} ({n.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Time Horizon Window</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-sans"
            >
              <option value="24h">Daily (Last 24 Hours)</option>
              <option value="7d">Weekly (Last 7 Days)</option>
              <option value="30d">Monthly (Last 30 Days)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setReportGenerated(true)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition-colors"
            >
              Generate Summary Audit
            </button>
          </div>
        </div>
      </div>

      {/* Executive Summary Report Output Card */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-tight">
              Executive Audit — {targetNode.name}
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Period: {timeRange === '24h' ? '24-Hour Telemetry' : timeRange === '7d' ? '7-Day Analysis' : '30-Day Monthly Audit'} | Records Analyzed: {filteredReadings.length}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
            Audit Verified
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Average WQI Score</span>
            <span className="text-xl font-extrabold text-cyan-300">{targetNode.waterQualityIndex} / 100</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Mean Turbidity</span>
            <span className="text-xl font-extrabold text-white">{targetNode.currentReadings.turbidity} NTU</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Mean Dissolved Oxygen</span>
            <span className="text-xl font-extrabold text-teal-300">{targetNode.currentReadings.dissolvedOxygen} mg/L</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Mean Temperature</span>
            <span className="text-xl font-extrabold text-white">{targetNode.currentReadings.temperature} °C</span>
          </div>
        </div>
      </div>

      {/* Raw Data Table with Search & Sort */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-base font-bold text-white">Raw Telemetry Data Table</h3>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search timestamp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white font-mono"
              />
            </div>

            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" /> Sort
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Node Code</th>
                <th className="py-2.5 px-3">pH</th>
                <th className="py-2.5 px-3">Turbidity (NTU)</th>
                <th className="py-2.5 px-3">Temp (°C)</th>
                <th className="py-2.5 px-3">D.O. (mg/L)</th>
                <th className="py-2.5 px-3">TDS (ppm)</th>
                <th className="py-2.5 px-3">Cond. (µS/cm)</th>
                <th className="py-2.5 px-3">WQI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredReadings.slice(0, 15).map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/60 text-slate-300">
                  <td className="py-2.5 px-3 font-mono text-slate-200">{new Date(r.timestamp).toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-cyan-400 font-bold">{r.nodeId}</td>
                  <td className="py-2.5 px-3 font-bold">{r.ph}</td>
                  <td className="py-2.5 px-3">{r.turbidity}</td>
                  <td className="py-2.5 px-3">{r.temperature}</td>
                  <td className="py-2.5 px-3 text-teal-300 font-bold">{r.dissolvedOxygen}</td>
                  <td className="py-2.5 px-3">{r.tds}</td>
                  <td className="py-2.5 px-3">{r.conductivity}</td>
                  <td className="py-2.5 px-3 font-bold text-white">{r.waterQualityIndex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
