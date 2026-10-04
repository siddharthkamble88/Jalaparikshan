import React from 'react';
import { AquaProvider, useAqua } from './context/AquaContext';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { HomePage } from './pages/HomePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { SensorsPage } from './pages/SensorsPage';
import { TechnologyPage } from './pages/TechnologyPage';
import { ImpactPage } from './pages/ImpactPage';
import { ContactPage } from './pages/ContactPage';
import { DashboardPage } from './pages/DashboardPage';
import { PresentationMode } from './pages/PresentationMode';
import { SimulatorModal } from './components/dashboard/SimulatorModal';
import { ConnectSensorModal } from './components/dashboard/ConnectSensorModal';
import { AuthorityLoginModal } from './components/auth/AuthorityLoginModal';

const AppContent: React.FC = () => {
  const {
    activeView,
    isPresentationMode,
    isConnectModalOpen,
    setIsConnectModalOpen
  } = useAqua();

  if (isPresentationMode) {
    return <PresentationMode />;
  }

  if (activeView === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-white">
        <DashboardPage />
        <SimulatorModal />
        <ConnectSensorModal isOpen={isConnectModalOpen} onClose={() => setIsConnectModalOpen(false)} />
        <AuthorityLoginModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col selection:bg-cyan-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {activeView === 'home' && <HomePage />}
        {activeView === 'how-it-works' && <HowItWorksPage />}
        {activeView === 'sensors' && <SensorsPage />}
        {activeView === 'technology' && <TechnologyPage />}
        {activeView === 'impact' && <ImpactPage />}
        {activeView === 'contact' && <ContactPage />}
      </main>

      <Footer />
      <SimulatorModal />
      <ConnectSensorModal isOpen={isConnectModalOpen} onClose={() => setIsConnectModalOpen(false)} />
      <AuthorityLoginModal />
    </div>
  );
};

export function App() {
  return (
    <AquaProvider>
      <AppContent />
    </AquaProvider>
  );
}

export default App;
