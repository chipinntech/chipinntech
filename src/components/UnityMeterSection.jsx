import React, { useState } from 'react';
import { Check, ShieldCheck, Zap, Smartphone, ArrowRight, Plus } from 'lucide-react';

export default function UnityMeterSection({ onOpenOrderModal }) {
  // Interactive Simulation
  const [channels, setChannels] = useState([
    { id: 1, name: 'Tenant A (Room 1)', balance: 42.5, relay: true },
    { id: 2, name: 'Tenant B (Room 2)', balance: 68.0, relay: true },
    { id: 3, name: 'Tenant C (Room 3)', balance: 18.2, relay: true },
  ]);

  const [topUpFeedback, setTopUpFeedback] = useState('');

  const handleTopUp = (id) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, balance: +(c.balance + 35.0).toFixed(1), relay: true } : c))
    );
    const tenantName = channels.find((c) => c.id === id)?.name || 'Tenant';
    setTopUpFeedback(`✓ GH₵50 (35.0 kWh) credited via MoMo to ${tenantName}!`);
    setTimeout(() => setTopUpFeedback(''), 4000);
  };

  return (
    <section
      id="unity-meter"
      style={{
        padding: '120px 24px',
        backgroundColor: '#060911',
        color: '#ffffff',
        borderTop: '1px solid #141c2c',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 70px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#38bdf8',
              marginBottom: '12px',
            }}
          >
            Milestone 01 · Immediate Consumer Hardware
          </div>

          <h2
            style={{
              fontSize: 'clamp(32px, 4.4vw, 52px)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            One Meter. Three Tenants. <br />
            <span style={{ color: '#38bdf8' }}>Zero Fights.</span>
          </h2>

          <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6 }}>
            Instead of buying 3 separate meters and paying high installation fees, the 3-in-1 Unity Meter gives every tenant independent sub-metering, balances, and top-ups from one sleek device.
          </p>
        </div>

        {/* 50/50 Side-by-Side: Image on one side, Content on the other */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '56px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Unity Meter Clean Hardware Image */}
          <div
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              backgroundColor: '#0a0e18',
              border: '1px solid #1a2538',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div style={{ position: 'relative', height: '520px', width: '100%' }}>
              <img
                src="/assets/unity-meter-widescreen.jpg"
                alt="Chipinn Unity Meter"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
                onError={(e) => {
                  e.currentTarget.src = '/assets/unity-hero.jpg';
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(6, 9, 17, 0.1) 0%, rgba(6, 9, 17, 0.8) 100%)',
                }}
              />

              {/* Floating Spec Badges */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  right: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(11, 16, 27, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '14px 20px',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Design</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>3-in-1 Compact DIN Rail</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Compatibility</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#38bdf8' }}>STS Token & Mobile Money</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Value Prop & Order Actions */}
          <div>
            {/* The Price Strikethrough Comparison Box */}
            <div
              style={{
                backgroundColor: '#0c121e',
                border: '1px solid #1e2c44',
                borderRadius: '20px',
                padding: '28px 30px',
                marginBottom: '32px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                  Buying 3 Separate Meters:
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#ef4444',
                    textDecoration: 'line-through',
                    marginTop: '2px',
                  }}
                >
                  GH₵6,000
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Unity Meter (3-in-1):
                </div>
                <div style={{ fontSize: '38px', fontWeight: 800, color: '#34d399', lineHeight: 1 }}>
                  GH₵1,250
                </div>
                <div style={{ fontSize: '12px', color: '#a7f3d0', marginTop: '4px' }}>
                  Save GH₵4,750 on day one
                </div>
              </div>
            </div>

            {/* Feature List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Check size={18} color="#38bdf8" />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', marginBottom: '2px' }}>
                    Independent Tenant Relays (60A)
                  </h4>
                  <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.5 }}>
                    When Room 1 runs out of credit, only Room 1 disconnects. Tenants 2 and 3 remain powered with zero disruption.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Smartphone size={18} color="#38bdf8" />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', marginBottom: '2px' }}>
                    MTN MoMo & STS Token Recharge
                  </h4>
                  <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.5 }}>
                    Tenants buy and load their own units directly on their phones. Landlords no longer have to collect money or calculate bills.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={18} color="#38bdf8" />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', marginBottom: '2px' }}>
                    Anti-Tamper & Physical Bypass Lock
                  </h4>
                  <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.5 }}>
                    Integrated magnetic and physical tamper sensing immediately trips and reports line tapping.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Channels Mini Demo */}
            <div
              style={{
                backgroundColor: '#0a0e17',
                border: '1px solid #1b263b',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '32px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                  Live 3-in-1 Channels
                </span>
                {topUpFeedback && (
                  <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 600 }}>
                    {topUpFeedback}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {channels.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#101624',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  >
                    <div>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>{c.name}</span>
                      <span style={{ color: '#38bdf8', marginLeft: '10px', fontWeight: 700 }}>{c.balance} kWh</span>
                    </div>
                    <button
                      onClick={() => handleTopUp(c.id)}
                      style={{
                        backgroundColor: 'rgba(56, 189, 248, 0.15)',
                        color: '#38bdf8',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      + Top Up
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Big SpaceX-Style Order Button */}
            <button
              onClick={onOpenOrderModal}
              style={{
                width: '100%',
                backgroundColor: '#1b5aff',
                color: '#ffffff',
                padding: '18px 32px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '15px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                transition: 'background-color 0.2s',
                boxShadow: '0 8px 30px rgba(27, 90, 255, 0.45)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1246d6')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1b5aff')}
            >
              <span>Order Unity Meter Now — GH₵1,250</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
