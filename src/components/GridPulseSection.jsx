import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, ShieldAlert, CheckCircle2, RefreshCw, KeyRound } from 'lucide-react';

export default function GridPulseSection({ onOpenPilotModal }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('telemetry'); // 'telemetry' | 'tamper' | 'sts'
  
  // Real-time telemetry simulation state
  const [voltage, setVoltage] = useState(230.2);
  const [current, setCurrent] = useState(14.8);
  const [power, setPower] = useState(3.41);
  const [frequency, setFrequency] = useState(50.01);
  const [isTampered, setIsTampered] = useState(false);
  const [isRelayConnected, setIsRelayConnected] = useState(true);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenSuccess, setTokenSuccess] = useState('');
  const [unitsBalance, setUnitsBalance] = useState(142.5);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setVoltage((229.8 + Math.random() * 0.9).toFixed(1));
      setCurrent((14.2 + Math.random() * 1.2).toFixed(1));
      setPower(((voltage * current) / 1000).toFixed(2));
      setFrequency((49.98 + Math.random() * 0.05).toFixed(3));
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying, voltage, current]);

  const handleSimulateTamper = () => {
    setIsTampered(true);
    setIsRelayConnected(false);
  };

  const handleResetTamper = () => {
    setIsTampered(false);
    setIsRelayConnected(true);
  };

  const handleApplyToken = () => {
    if (!tokenInput || tokenInput.length < 8) {
      setTokenSuccess('Invalid STS Token length (must be 20 digits)');
      return;
    }
    setUnitsBalance((prev) => +(prev + 50).toFixed(1));
    setTokenSuccess('✓ Success! 50.00 kWh credited via STS 20-digit token.');
    setTimeout(() => setTokenSuccess(''), 4000);
    setTokenInput('');
  };

  return (
    <section
      id="gridpulse"
      style={{
        padding: '100px 24px 80px',
        backgroundColor: '#ffffff',
        maxWidth: '1360px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '48px',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Adapted from Tesla Screenshot 3 */}
        <div style={{ maxWidth: '520px' }}>
          <div
            style={{
              display: 'inline-block',
              color: '#1b5aff',
              fontWeight: 600,
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '10px',
            }}
          >
            Autonomous AMI Intelligence
          </div>

          <h2
            style={{
              fontSize: 'clamp(32px, 4.2vw, 50px)',
              fontWeight: 600,
              lineHeight: 1.15,
              color: '#171a20',
              marginBottom: '14px',
              letterSpacing: '-0.02em',
            }}
          >
            GridPulse™<br />
            <span style={{ color: '#1b5aff' }}>Autonomous AMI Platform</span>
          </h2>

          <p
            style={{
              fontSize: '17px',
              color: '#5c5e62',
              lineHeight: 1.5,
              marginBottom: '36px',
            }}
          >
            Makes utility revenue assurance and loss prevention completely effortless. 
            Automated sub-second theft isolation, predictive load forecasting, and autonomous over-the-air firmware management.
          </p>

          {/* Key Metric Numbers (Adapting Tesla's 7x Fewer Collisions & 15B Miles Driven) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px',
              marginBottom: '40px',
              borderTop: '1px solid #e5e7eb',
              paddingTop: '24px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 'clamp(32px, 3.5vw, 42px)',
                  fontWeight: 700,
                  color: '#171a20',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                99.98%
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: '#5c5e62',
                  marginTop: '6px',
                }}
              >
                Revenue Billing Accuracy
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 'clamp(28px, 3.2vw, 38px)',
                  fontWeight: 700,
                  color: '#171a20',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                14,896,011,303
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: '#5c5e62',
                  marginTop: '6px',
                }}
              >
                kWh Telemetry Secured
              </div>
            </div>
          </div>

          {/* Action Buttons (Tesla Dark & Light style) */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onOpenPilotModal('Live Utility Demo')}
              className="btn btn-dark"
              style={{ height: '42px', padding: '0 26px', fontSize: '14px' }}
            >
              Schedule Live Demo
            </button>

            <button
              onClick={() => onOpenPilotModal('GridPulse AMI Architecture Whitepaper')}
              className="btn"
              style={{
                height: '42px',
                padding: '0 24px',
                fontSize: '14px',
                backgroundColor: '#f4f5f6',
                color: '#171a20',
              }}
            >
              Explore AMI Architecture
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Video & Telemetry Simulator Player (Adapting Tesla player) */}
        <div
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: '#0f1218',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.16)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
          }}
        >
          {/* Top Player Bar */}
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: '#161a22',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isTampered ? '#ef4444' : '#10b981',
                  boxShadow: isTampered ? '0 0 8px #ef4444' : '0 0 8px #10b981',
                }}
              />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                Unity Meter Stream #SG-09142
              </span>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(27, 90, 255, 0.2)',
                  color: '#60a5fa',
                  fontWeight: 500,
                }}
              >
                LIVE 4G LTE
              </span>
            </div>

            {/* Interactive Mode Tabs */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { id: 'telemetry', label: 'Telemetry' },
                { id: 'tamper', label: 'Anti-Tamper' },
                { id: 'sts', label: 'STS Token' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: activeTab === tab.id ? '#ffffff' : '#9ca3af',
                    backgroundColor: activeTab === tab.id ? '#1b5aff' : 'transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Player Main Screen Area */}
          <div style={{ position: 'relative', minHeight: '320px', backgroundColor: '#090b0e' }}>
            {activeTab === 'telemetry' && (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <img
                  src="/assets/gridpulse-telemetry.jpg"
                  alt="Telemetry Interface"
                  style={{
                    width: '100%',
                    height: '320px',
                    objectFit: 'cover',
                    display: 'block',
                    opacity: 0.85,
                  }}
                />
                {/* Floating Live Telemetry Overlay Box */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    backgroundColor: 'rgba(10, 14, 20, 0.85)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    minWidth: '160px',
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>
                    Real-Time Busbar
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#d1d5db' }}>Voltage:</span>
                    <strong style={{ color: '#00d2ff' }}>{voltage} V</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#d1d5db' }}>Current:</span>
                    <strong style={{ color: '#00d2ff' }}>{current} A</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#d1d5db' }}>Active Power:</span>
                    <strong style={{ color: '#10b981' }}>{power} kW</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#d1d5db' }}>Grid Freq:</span>
                    <strong>{frequency} Hz</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#d1d5db' }}>Relay State:</span>
                    <strong style={{ color: isRelayConnected ? '#10b981' : '#ef4444' }}>
                      {isRelayConnected ? 'CLOSED' : 'TRIPPED'}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tamper' && (
              <div style={{ padding: '28px', color: '#ffffff', minHeight: '320px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <ShieldAlert size={24} color={isTampered ? '#ef4444' : '#10b981'} />
                  <h3 style={{ fontSize: '18px', color: '#ffffff' }}>
                    Hardware Anti-Tamper & Relay Isolation Chamber
                  </h3>
                </div>

                <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '20px' }}>
                  Unity Meters feature dual 3-axis Hall effect sensors, optical enclosure break pins, and reverse energy fraud detection.
                </p>

                {isTampered ? (
                  <div
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      marginBottom: '20px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 600 }}>
                      <ShieldAlert size={18} />
                      CRITICAL TAMPER DETECTED: 450mT Magnetic Injection Attempt
                    </div>
                    <p style={{ fontSize: '13px', color: '#fca5a5', marginTop: '6px' }}>
                      Status: Hardware Relay TRIP in &lt;11ms. Encrypted alert packet dispatched to Head-End System.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      marginBottom: '20px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 600 }}>
                      <CheckCircle2 size={18} />
                      Shield Status: NORMAL — Enclosure Sealed & Calibrated
                    </div>
                    <p style={{ fontSize: '13px', color: '#a7f3d0', marginTop: '6px' }}>
                      Terminal cover closed, current direction balanced, no abnormal magnetic field.
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                  {!isTampered ? (
                    <button
                      onClick={handleSimulateTamper}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '6px',
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      Simulate Magnetic Injection
                    </button>
                  ) : (
                    <button
                      onClick={handleResetTamper}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '6px',
                        backgroundColor: '#1b5aff',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <RefreshCw size={14} /> Clear Alert & Reclose Relay
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'sts' && (
              <div style={{ padding: '28px', color: '#ffffff', minHeight: '320px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <KeyRound size={22} color="#00d2ff" />
                  <h3 style={{ fontSize: '18px', color: '#ffffff' }}>
                    STS 20-Digit Standard Token Recharge Test
                  </h3>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    backgroundColor: '#161b24',
                    borderRadius: '8px',
                    marginBottom: '18px',
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#9ca3af' }}>Current Prepaid Balance:</span>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: '#10b981' }}>
                    {unitsBalance} kWh
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="Enter 20-Digit STS Token (e.g. 5821 9923 1042 8841 0293)"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '6px',
                      backgroundColor: '#12161f',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      fontSize: '13px',
                    }}
                  />
                  <button
                    onClick={handleApplyToken}
                    className="btn btn-primary"
                    style={{ height: '40px', padding: '0 16px', fontSize: '13px' }}
                  >
                    Accept Token
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Quick Test Token:</span>
                  <button
                    onClick={() => setTokenInput('5821-9923-1042-8841-0293')}
                    style={{
                      fontSize: '12px',
                      color: '#60a5fa',
                      textDecoration: 'underline',
                      background: 'none',
                    }}
                  >
                    Fill Valid Sample
                  </button>
                </div>

                {tokenSuccess && (
                  <p style={{ marginTop: '14px', fontSize: '13px', color: '#34d399', fontWeight: 500 }}>
                    {tokenSuccess}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Tesla Video Player Bottom Controls Bar (Adapting Screenshot 3) */}
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: '#141820',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#d1d5db',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{ color: '#ffffff', display: 'flex', alignItems: 'center' }}
                aria-label={isPlaying ? 'Pause simulation' : 'Play simulation'}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <span style={{ fontSize: '13px', fontFamily: 'monospace' }}>
                0:24 / 0:52
              </span>
            </div>

            {/* Video progress scrub line */}
            <div
              style={{
                flex: 1,
                height: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                margin: '0 18px',
                borderRadius: '2px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '46%',
                  height: '100%',
                  backgroundColor: '#1b5aff',
                  borderRadius: '2px',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button
                onClick={() => setIsMuted(!isMuted)}
                style={{ color: '#9ca3af' }}
                aria-label="Toggle mute"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <button
                onClick={() => setActiveTab('telemetry')}
                style={{ color: '#9ca3af' }}
                aria-label="Fullscreen view"
              >
                <Maximize2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
