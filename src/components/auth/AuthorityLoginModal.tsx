import React, { useState } from 'react';
import { useAqua, DEFAULT_AUTHORITY_PASSWORD } from '../../context/AquaContext';
import { ShieldAlert, ShieldCheck, Lock, KeyRound, Eye, EyeOff, X, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const AuthorityLoginModal: React.FC = () => {
  const { isAuthorityLoginOpen, setIsAuthorityLoginOpen, loginAuthority, setDashboardTab } = useAqua();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthorityLoginOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const res = loginAuthority(password);
      setIsSubmitting(false);
      if (res.success) {
        setPassword('');
        setDashboardTab('authority');
      } else {
        setErrorMessage(res.error || 'Access denied.');
      }
    }, 250);
  };

  const handleFillDemoPasscode = () => {
    setPassword(DEFAULT_AUTHORITY_PASSWORD);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-md bg-[#0b1f26] border border-[#1e4652] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 text-[#e7f2f2] overflow-hidden">
        
        {/* Glow ambient background graphics */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1e4652]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Authority Access Portal</h3>
              <p className="text-xs text-[#9fbdc2] font-mono">Central Pollution Control & Water Board</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsAuthorityLoginOpen(false);
              setErrorMessage(null);
            }}
            className="p-1.5 rounded-lg text-[#9fbdc2] hover:text-white hover:bg-[#102b34] transition-colors"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Description */}
        <div className="my-5 space-y-2">
          <p className="text-xs text-[#9fbdc2] leading-relaxed">
            Elevated administrative privileges allow officers to modify sensor threshold limits, calibrate telemetry, and broadcast official water advisories.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#e7f2f2] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" /> Departmental Security Passcode
              </span>
              <span className="text-[11px] text-[#9fbdc2] font-mono">Restricted</span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                placeholder="Enter authority passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#102b34] border border-[#1e4652] focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 font-mono tracking-wider outline-none transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-[#9fbdc2] hover:text-white"
                title={showPassword ? 'Hide passcode' : 'Show passcode'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Helper Chip */}
          <div className="bg-[#102b34]/80 border border-[#1e4652] rounded-xl p-3 flex items-center justify-between gap-2">
            <div className="text-[11px] text-[#9fbdc2] flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo Passcode:</span>
              <code className="text-amber-300 font-mono font-bold bg-[#0b1f26] px-1.5 py-0.5 rounded border border-[#1e4652]">
                {DEFAULT_AUTHORITY_PASSWORD}
              </code>
            </div>
            <button
              type="button"
              onClick={handleFillDemoPasscode}
              className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Auto-fill
            </button>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsAuthorityLoginOpen(false);
                setErrorMessage(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#102b34] hover:bg-[#123540] text-xs font-semibold text-[#9fbdc2] transition-colors"
            >
              Continue as Citizen
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Unlock Authority Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
