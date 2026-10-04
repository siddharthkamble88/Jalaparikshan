import React, { useState } from 'react';
import { useAqua, MainView } from '../../context/AquaContext';
import { Droplets, Activity, Cpu, ShieldAlert, BarChart2, Info, Mail, Menu, X, ArrowRight, LayoutDashboard, Radio } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    isAuthorityAuthenticated,
    setIsAuthorityLoginOpen,
    setDashboardTab
  } = useAqua();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: MainView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Droplets className="w-4 h-4" /> },
    { id: 'how-it-works', label: 'How It Works', icon: <Activity className="w-4 h-4" /> },
    { id: 'sensors', label: 'Sensors', icon: <Cpu className="w-4 h-4" /> },
    { id: 'technology', label: 'Technology', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveView('home')} 
            className="flex items-center gap-3 cursor-pointer group"
            id="aqua-brand-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-teal-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Droplets className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
                Jal<span className="text-cyan-400">Parikshan</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-widest text-cyan-400/80 ml-2 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50">
                IoT Live
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  id={`nav-link-${item.id}`}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs & Portal Switcher */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Authority Mode Indicator or Login Button */}
            {isAuthorityAuthenticated ? (
              <div className="flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-amber-300 font-bold">Authority Active</span>
                <button
                  onClick={() => {
                    setActiveView('dashboard');
                    setDashboardTab('authority');
                  }}
                  className="ml-1 text-[11px] underline text-amber-200 hover:text-white"
                >
                  Control Hub
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthorityLoginOpen(true)}
                id="navbar-authority-login-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#102b34] hover:bg-[#123540] text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all hover:border-amber-400"
                title="Enter departmental passcode for authority data editing privileges"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Authority Login</span>
              </button>
            )}

            <button
              onClick={() => setActiveView('dashboard')}
              id="open-dashboard-cta"
              className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-400 p-[1px] font-semibold text-sm text-slate-950 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300"
            >
              <div className="px-4 py-2 rounded-[11px] bg-cyan-500 group-hover:bg-cyan-400 text-slate-950 font-semibold flex items-center gap-2 transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                <span>Open Live Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-xs flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 ${
                activeView === item.id
                  ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-800/50'
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setActiveView('dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-center flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Open Live Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
