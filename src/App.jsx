import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MissionSection from './components/MissionSection';
import GridPulseSection from './components/GridPulseSection';
import ProductLineupSection from './components/ProductLineupSection';
import SoftwareSection from './components/SoftwareSection';
import LabsSection from './components/LabsSection';
import PilotModal from './components/PilotModal';
import SpecsDrawer from './components/SpecsDrawer';
import Footer from './components/Footer';

export default function App() {
  // Modal states
  const [pilotModalOpen, setPilotModalOpen] = useState(false);
  const [pilotProduct, setPilotProduct] = useState('Unity Meter');

  const [specsDrawerOpen, setSpecsDrawerOpen] = useState(false);

  const handleOpenPilot = (productName = 'Unity Meter') => {
    setPilotProduct(productName);
    setPilotModalOpen(true);
  };

  const handleOpenSpecs = () => {
    setSpecsDrawerOpen(true);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Tesla-style Sticky Blur Navbar */}
      <Navbar
        onOpenPilotModal={handleOpenPilot}
        onOpenSpecs={handleOpenSpecs}
      />

      {/* Main Sections */}
      <main>
        {/* Fullscreen Hero Carousel */}
        <HeroSection
          onOpenSpecs={handleOpenSpecs}
        />

        {/* 1. Our Mission Section */}
        <MissionSection />

        {/* 2. GridPulse Autonomous AMI Platform */}
        <GridPulseSection
          onOpenPilotModal={handleOpenPilot}
        />

        {/* 3. Product Lineup (Unity Meter, Unity Mini, Unity Pro) */}
        <ProductLineupSection
          onOpenSpecs={handleOpenSpecs}
        />

        {/* 4. Software Suite: Base16 (School Management) & Base12 (Thesis Writing Engine for 4th Years) */}
        <SoftwareSection
          onOpenPilotModal={handleOpenPilot}
        />

        {/* 5. Chipinn Labs: Regional Solar (1 TW by 2032) & Biogas Monitoring (10 Nodes by 2028) */}
        <LabsSection
          onOpenPilotModal={handleOpenPilot}
        />
      </main>

      {/* Minimalist Footer */}
      <Footer
        onOpenSpecs={handleOpenSpecs}
        onOpenPilotModal={handleOpenPilot}
      />

      {/* Overlays */}
      <PilotModal
        isOpen={pilotModalOpen}
        onClose={() => setPilotModalOpen(false)}
        preselectedProduct={pilotProduct}
      />

      <SpecsDrawer
        isOpen={specsDrawerOpen}
        onClose={() => setSpecsDrawerOpen(false)}
        onOpenPilot={handleOpenPilot}
      />
    </div>
  );
}
