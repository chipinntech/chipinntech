import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MasterPlanSection from './components/MasterPlanSection';
import UnityMeterSection from './components/UnityMeterSection';
import OrderModal from './components/OrderModal';
import Footer from './components/Footer';
import OpsDashboard from './components/OpsDashboard';

export default function App() {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [isOpsRoute, setIsOpsRoute] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname === '/ops' || window.location.hash === '#/ops';
  });

  useEffect(() => {
    const handlePopState = () => {
      setIsOpsRoute(window.location.pathname === '/ops' || window.location.hash === '#/ops');
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleOpenOps = () => {
    window.history.pushState({}, '', '/ops');
    setIsOpsRoute(true);
  };

  const handleExitOps = () => {
    window.history.pushState({}, '', '/');
    setIsOpsRoute(false);
  };

  const handleOpenOrderModal = () => {
    setOrderModalOpen(true);
  };

  if (isOpsRoute) {
    return <OpsDashboard onExit={handleExitOps} />;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#04070d' }}>
      {/* SpaceX Style Minimalist Sticky Navbar */}
      <Navbar onOpenOrderModal={handleOpenOrderModal} />

      {/* Main Experience */}
      <main>
        {/* 1. Clean SpaceX-Style Hero: African Dawn Earth, High Contrast, Direct Manifesto */}
        <HeroSection onOpenOrderModal={handleOpenOrderModal} />

        {/* 2. The 4-Stage Master Plan: Step-by-Step, Clean Images, Connected with Arrows */}
        <MasterPlanSection onOpenOrderModal={handleOpenOrderModal} />

        {/* 3. Milestone 1 Flagship Showcase: 50/50 Side-by-Side (Unity Meter Image + Value & Order) */}
        <UnityMeterSection onOpenOrderModal={handleOpenOrderModal} />
      </main>

      {/* Footer */}
      <Footer onOpenOrderModal={handleOpenOrderModal} onOpenOps={handleOpenOps} />

      {/* Direct Order / Reservation Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
      />
    </div>
  );
}
