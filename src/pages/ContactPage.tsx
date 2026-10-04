import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MapPin, UserCheck, Building } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: 'IoT Hardware & Deployment Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
          <Mail className="w-3.5 h-3.5" />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Contact the Engineering Team
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Inquire about research collaborations, sensor node deployments, or platform integration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-slate-800">
          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Message Dispatched</h3>
              <p className="text-xs text-slate-300 font-mono">
                Thank you for reaching out. Our environmental IoT team will respond shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', organization: '', subject: 'IoT Hardware Inquiry', message: '' });
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-white font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="text-slate-300 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Alex Rivera"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-sans"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="a.rivera@research-inst.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="text-slate-300 block mb-1">Organization / Dept</label>
                  <input
                    type="text"
                    placeholder="Environmental Protection Board"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-sans"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-sans"
                  >
                    <option>IoT Hardware & Sensor Deployment</option>
                    <option>Research Collaboration & Data Access</option>
                    <option>Academic / Student Demonstration</option>
                    <option>General Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Message Details *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about your monitoring site, water body type, or research objectives..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" /> Send Inquiry Message
              </button>
            </form>
          )}
        </div>

        {/* Project Team Metadata */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" /> JalParikshan Project Team
            </h3>
            <div className="space-y-3 text-xs font-mono text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold block">Lead IoT Architect</span>
                <span className="text-white block">Dr. Siddharth Kamble</span>
                <span className="text-[10px] text-slate-400">siddharth11kamble@gmail.com</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-teal-400 font-bold block">Environmental Data Lab</span>
                <span className="text-white block">Water Quality Research Division</span>
                <span className="text-[10px] text-slate-400">Station 04 — Lake Catchment Reserve</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
