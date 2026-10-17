import React, { useState } from 'react';
import { Sun, Flame, ArrowRight, Sparkles, Lock, X, AlertCircle } from 'lucide-react';

export default function LabsSection({ onOpenPilotModal }) {
  const [selectedNode, setSelectedNode] = useState(4);
  const [restrictedPaper, setRestrictedPaper] = useState(null);

  const nodes = [
    { id: 1, name: 'Node 01 · Northern Agro Digester', status: 'Active Online', ch4: '68.4%', pressure: '1.82 bar', temp: '38.2°C' },
    { id: 2, name: 'Node 02 · Metro Bioenergy Plant', status: 'Active Online', ch4: '65.9%', pressure: '1.76 bar', temp: '37.8°C' },
    { id: 3, name: 'Node 03 · Valley Waste-to-Energy', status: 'Active Online', ch4: '69.1%', pressure: '1.91 bar', temp: '39.0°C' },
    { id: 4, name: 'Node 04 · Central Research Digester', status: 'Active Online', ch4: '67.2%', pressure: '1.84 bar', temp: '38.5°C' },
    { id: 5, name: 'Node 05 · Western Biomass Facility', status: 'Deploying Q1 2027', ch4: 'Pending', pressure: 'Pending', temp: 'Pending' },
    { id: 6, name: 'Node 06 · Southern Farm Cluster', status: 'Deploying Q2 2027', ch4: 'Pending', pressure: 'Pending', temp: 'Pending' },
    { id: 7, name: 'Node 07 · Eco-District Digester', status: 'Deploying Q4 2027', ch4: 'Pending', pressure: 'Pending', temp: 'Pending' },
    { id: 8, name: 'Node 08 · Industrial Effluent Hub', status: 'Deploying Q1 2028', ch4: 'Pending', pressure: 'Pending', temp: 'Pending' },
    { id: 9, name: 'Node 09 · Municipal Sludge Unit', status: 'Deploying Q2 2028', ch4: 'Pending', pressure: 'Pending', temp: 'Pending' },
    { id: 10, name: 'Node 10 · Regional Grid Fed Hub', status: 'Deploying Q4 2028', ch4: 'Pending', pressure: 'Pending', temp: 'Pending' },
  ];

  const currentNodeData = nodes.find((n) => n.id === selectedNode) || nodes[3];

  return (
    <section
      id="labs"
      style={{
        padding: '100px 24px 90px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f1f2f4',
      }}
    >
      <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 60px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '20px',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              color: '#10b981',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              marginBottom: '12px',
            }}
          >
            <Sparkles size={14} /> CHIPINN FRONTIER LABS
          </div>

          <h2
            style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 600,
              color: '#171a20',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '16px',
            }}
          >
            Applied R&D for Regional Energy Sovereignty
          </h2>

          <p style={{ fontSize: '17px', color: '#5c5e62', lineHeight: 1.6 }}>
            Our laboratory scientists and hardware engineers are tackling the region’s toughest energy physics challenges: maximizing tropical solar harvest and automating decentralised bioenergy monitoring.
          </p>
        </div>

        {/* Labs Project 1: 1 Terawatt by 2032 Regional Solar Mission */}
        <div
          id="solar-lab"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '48px',
            alignItems: 'center',
            backgroundColor: '#0a0d14',
            borderRadius: '24px',
            padding: '44px',
            color: '#ffffff',
            marginBottom: '48px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Left content */}
          <div style={{ zIndex: 2 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(250, 204, 21, 0.2)',
                color: '#fde047',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '16px',
              }}
            >
              <Sun size={13} color="#fde047" /> Regional Solar Mission
            </div>

            <h3
              style={{
                fontSize: 'clamp(30px, 3.5vw, 44px)',
                fontWeight: 600,
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                marginBottom: '14px',
              }}
            >
              1 Terawatt of Solar Power by 2032
            </h3>

            <p style={{ fontSize: '16px', color: '#9ca3af', lineHeight: 1.6, marginBottom: '28px' }}>
              Standard commercial solar modules suffer severe 20–30% performance drops under our region’s extreme 42°C+ ambient heat and heavy dust particulate soiling. Chipinn Labs is engineering high-efficiency photovoltaic materials, passive cooling substrate heat pipes, and anti-soiling hydrophobic nanocoatings optimized for regional irradiance to catalyze <strong>1 Terawatt (1,000,000 MW)</strong> of installed regional solar capacity by 2032.
            </p>

            {/* Target Metric Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#facc15' }}>1 TW</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>Target Regional Capacity</div>
              </div>

              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#00d2ff' }}>28.5%</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>Tandem Cell Efficiency</div>
              </div>

              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>2032</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>Target Milestone Year</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onOpenPilotModal('Solar 1TW Lab Collaboration')}
                className="btn btn-primary"
                style={{ height: '44px', padding: '0 24px', borderRadius: '8px' }}
              >
                Join Research Consortium <ArrowRight size={15} />
              </button>

              <button
                onClick={() =>
                  setRestrictedPaper({
                    title: 'Regional Photovoltaic Degradation & Bifacial Perovskite Integration (1 TW by 2032)',
                    project: 'Solar Frontier Lab',
                  })
                }
                className="btn btn-glass"
                style={{ height: '44px', borderRadius: '8px', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.12)' }}
              >
                Read Research Paper
              </button>
            </div>
          </div>

          {/* Right image */}
          <div
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <img
              src="/assets/solar-labs-1tw.jpg"
              alt="1 Terawatt by 2032 Solar Lab"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>

        {/* Labs Project 2: Biogas Monitoring Layer (10 Active Nodes by 2028) */}
        <div
          id="biogas-lab"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '48px',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '44px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          }}
        >
          {/* Left image & active node status */}
          <div>
            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e5e7eb',
                marginBottom: '20px',
              }}
            >
              <img
                src="/assets/biogas-nodes.jpg"
                alt="Biogas Monitoring IoT Nodes"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Active Telemetry Box */}
            <div
              style={{
                padding: '16px 20px',
                borderRadius: '12px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Selected Node Telemetry
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#171a20' }}>
                  {currentNodeData.name}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>CH4 Methane:</span>
                  <strong style={{ display: 'block', color: '#10b981', fontSize: '14px' }}>{currentNodeData.ch4}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Gas Pressure:</span>
                  <strong style={{ display: 'block', color: '#1b5aff', fontSize: '14px' }}>{currentNodeData.pressure}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right description & interactive node roadmap */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '14px',
              }}
            >
              <Flame size={13} color="#10b981" /> Bioenergy Telemetry Layer
            </div>

            <h3
              style={{
                fontSize: 'clamp(28px, 3.2vw, 40px)',
                fontWeight: 600,
                color: '#171a20',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                marginBottom: '14px',
              }}
            >
              Biogas Monitoring Layer<br />
              <span style={{ color: '#10b981' }}>Deploying 10 Active Nodes by 2028</span>
            </h3>

            <p style={{ fontSize: '16px', color: '#5c5e62', lineHeight: 1.6, marginBottom: '24px' }}>
              Anaerobic digestion facilities often suffer from explosive pressure buildup, erratic methane composition, or unmonitored flaring. The Chipinn Biogas Monitoring Layer is an industrial IoT sensor mesh providing sub-second methane percentage (CH4), gas pressure (bar), slurry temperature, and automatic safety shutoffs.
            </p>

            {/* 10 Nodes Interactive Grid */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '10px' }}>
                Select Node Telemetry (Target: 10 Active Nodes by 2028):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {nodes.map((node) => {
                  const isSelected = selectedNode === node.id;
                  const isOnline = node.status.includes('Active');
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: isSelected ? '#10b981' : isOnline ? '#e6fbf2' : '#f3f4f6',
                        color: isSelected ? '#ffffff' : isOnline ? '#065f46' : '#6b7280',
                        border: isSelected ? '1px solid #10b981' : '1px solid #e5e7eb',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      Node 0{node.id} {isOnline ? '●' : '○'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onOpenPilotModal('Biogas Node Pilot Deployment')}
                className="btn"
                style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  height: '44px',
                  padding: '0 24px',
                  borderRadius: '8px',
                  fontWeight: 600,
                }}
              >
                Deploy Digester Node <ArrowRight size={15} />
              </button>

              <button
                onClick={() =>
                  setRestrictedPaper({
                    title: 'Autonomous Mesh IoT Biogas Digester Telemetry & Real-Time Methane Yield Modeling',
                    project: 'Biogas Monitoring Nodes',
                  })
                }
                className="btn btn-glass"
                style={{ height: '44px', border: '1px solid #d1d5db', borderRadius: '8px', color: '#171a20' }}
              >
                Read Research Paper
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Research Paper Restricted Access Modal */}
      {restrictedPaper && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            padding: '20px',
          }}
          onClick={() => setRestrictedPaper(null)}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '560px',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '36px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e5e7eb',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setRestrictedPaper(null)}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#f3f4f6',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#6b7280',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
            >
              <X size={18} />
            </button>

            {/* Lock Icon & Status Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Lock size={22} />
              </div>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  Restricted Publication
                </span>
                <div style={{ fontSize: '12.5px', color: '#6b7280', marginTop: '2px' }}>
                  {restrictedPaper.project} · Proprietary Lab Research
                </div>
              </div>
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: '19px',
                fontWeight: 600,
                color: '#111827',
                lineHeight: 1.35,
                marginBottom: '14px',
              }}
            >
              {restrictedPaper.title}
            </h3>

            {/* Notice Message */}
            <div
              style={{
                padding: '16px 18px',
                borderRadius: '12px',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
                color: '#4b5563',
                lineHeight: 1.6,
                marginBottom: '24px',
              }}
            >
              <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={16} color="#d97706" />
                Not Yet Available for Public Access
              </div>
              The full laboratory paper, cell efficiency datasets, and firmware telemetry are currently undergoing institutional peer review and regional patent filings.
              <br /><br />
              Academic partners, national utilities, and verified institutional researchers may request embargoed access directly through our research desk.
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                onClick={() => setRestrictedPaper(null)}
                style={{
                  height: '42px',
                  padding: '0 20px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>

              <button
                onClick={() => {
                  const title = restrictedPaper.title;
                  setRestrictedPaper(null);
                  onOpenPilotModal(`Research Access Request: ${title}`);
                }}
                className="btn btn-primary"
                style={{
                  height: '42px',
                  padding: '0 22px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Request Institutional Access
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
