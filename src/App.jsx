import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MasterPlanSection from './components/MasterPlanSection';
import UnityMeterSection from './components/UnityMeterSection';
import OrderModal from './components/OrderModal';
import Footer from './components/Footer';

export default function App() {
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const handleOpenOrderModal = () => {
    setOrderModalOpen(true);
  };

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
      <Footer onOpenOrderModal={handleOpenOrderModal} />

      {/* Direct Order / Reservation Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
      />
    </div>
  );
}
