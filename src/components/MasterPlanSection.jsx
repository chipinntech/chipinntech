import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';

export default function MasterPlanSection({ onOpenOrderModal }) {
  const stages = [
    {
      num: '01',
      phase: 'STAGE 01 · ACTIVE NOW',
      title: 'Unity Meters: Split Bills Accurately & Stop Compound Fights',
      headline: 'Fixing the household problem first to build trust and cash flow.',
      image: '/assets/unity-meter-widescreen.jpg',
      tagline: 'Self-Funded Foundation',
      desc: 'In Ghana, compound houses and shared apartments are ground zero for energy friction. Four to eight tenants sharing one meter leads to constant arguments, unfair estimates, and pushes the compound into punitive higher PURC tariff tiers. We replace three separate sub-meters (which cost GH₵6,000) with a single 3-in-1 Unity Meter for just GH₵1,250. Every tenant gets their own balance, independent relay, and MoMo top-up.',
      impact: 'Outcome: Instant customer savings of GH₵4,750, elimination of household disputes, and rapid installation of Chipinn hardware in thousands of homes across Ghana.',
      cta: 'Order Unity Meter (GH₵1,250)',
      connectorText: 'Stage 01 customer base & revenue unlocks Stage 02',
    },
    {
      num: '02',
      phase: 'STAGE 02 · YEAR 2',
      title: 'Appliance Monitors: Kill Phantom Load & Energy Waste',
      headline: 'Teaching homes where their electricity is actually disappearing.',
      image: '/assets/unity-hero.jpg',
      tagline: 'Household Efficiency',
      desc: 'Once Chipinn meters are on the walls, we deploy intelligent clip-on appliance monitors. Faulty refrigerator compressors, unserviced AC units, and phantom standby loads quietly drain 20% to 30% of prepayments. Our sensors detect appliance power signatures and alert users directly via WhatsApp or mobile app with actionable fixes.',
      impact: 'Outcome: 20% to 30% reduction in electricity spend per household without waiting for national tariff adjustments.',
      cta: null,
      connectorText: 'Granular telemetry & efficiency data paves the way for Stage 03',
    },
    {
      num: '03',
      phase: 'STAGE 03 · YEAR 2–3',
      title: 'GridGuard: End Utility Theft & Protect ECG Revenue',
      headline: 'Eliminating the 30%+ commercial grid loss that causes tariff hikes.',
      image: '/assets/gridguard-theft-monitoring.jpg',
      tagline: 'Hardware Theft Monitoring',
      desc: 'Why are national tariffs in Ghana so high? Because ECG loses over 30% of generated power to illegal line bypasses, ghost meters, and unpaid commercial theft. When the utility bleeds hundreds of millions of cedis, it hikes tariffs on honest citizens and sheds load (Dumsor). Equipped with our dedicated GridGuard theft monitoring system, distribution utilities locate and eliminate bypass points in real-time.',
      impact: 'Outcome: ECG returns to commercial profitability, eliminating the root cause of tariff hikes and rolling blackouts.',
      cta: null,
      connectorText: 'A stabilized, solvent grid enables the ultimate clean energy rollout',
    },
    {
      num: '04',
      phase: 'STAGE 04 · YEAR 3',
      title: 'Distributed Clean Solar: Electricity Under GH₵1 / kWh',
      headline: 'Flooding the local grid with abundant, cheap solar power.',
      image: '/assets/solar-grid.jpg',
      tagline: 'Energy Abundance Endgame',
      desc: 'With thousands of homes already equipped with Chipinn metering and load controls, we roll out distributed rooftop solar and micro-storage across residential and commercial clusters. Instead of relying solely on expensive thermal plants and imported fuel, clean energy is captured from the African sun and distributed directly to neighbors.',
      impact: 'Outcome: Retail electricity drops permanently below GH₵1 per kWh, creating true energy abundance for Ghana and Africa.',
      cta: null,
      connectorText: null,
    },
  ];

  return (
    <section
      id="masterplan"
      className="masterplan-container"
      style={{
        padding: '120px 24px',
        backgroundColor: '#04070d',
        color: '#ffffff',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 80px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#38bdf8',
              marginBottom: '14px',
            }}
          >
            The Chipinn Master Plan
          </div>

          <h2
            style={{
              fontSize: 'clamp(30px, 4.4vw, 54px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}
          >
            How We Drop Power <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #38bdf8 0%, #34d399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Below GH₵1 per kWh
            </span>
          </h2>

          <p style={{ fontSize: 'clamp(15px, 1.6vw, 18px)', color: '#94a3b8', lineHeight: 1.6 }}>
            A systematic, 4-stage sequential roadmap to eliminate household billing disputes, end utility grid theft, and make clean energy abundant across Ghana.
          </p>
        </div>

        {/* Sequential Stages Walkthrough */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
          {stages.map((stage, idx) => (
            <div key={stage.num} style={{ position: 'relative' }}>
              {/* Stage Card */}
              <div
                className="stage-card"
                style={{
                  backgroundColor: '#0b101b',
                  border: '1px solid #1a2538',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  alignItems: 'stretch',
                }}
              >
                {/* Image Side */}
                <div
                  className="stage-image-box"
                  style={{
                    position: 'relative',
                    minHeight: '340px',
                    backgroundColor: '#070a12',
                    order: idx % 2 === 1 ? 2 : 1,
                  }}
                >
                  <img
                    src={stage.image}
                    alt={stage.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      backgroundColor: 'rgba(5, 7, 12, 0.75)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#38bdf8',
                    }}
                  >
                    {stage.tagline}
                  </div>
                </div>

                {/* Content Side */}
                <div
                  className="stage-content-box stage-content"
                  style={{
                    padding: '40px 36px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    order: idx % 2 === 1 ? 1 : 2,
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#38bdf8',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                    }}
                  >
                    {stage.phase}
                  </div>

                  <h3
                    style={{
                      fontSize: 'clamp(20px, 2.2vw, 28px)',
                      fontWeight: 700,
                      color: '#ffffff',
                      lineHeight: 1.25,
                      marginBottom: '10px',
                    }}
                  >
                    {stage.title}
                  </h3>

                  <div
                    style={{
                      fontSize: '14px',
                      color: '#34d399',
                      fontWeight: 500,
                      marginBottom: '16px',
                    }}
                  >
                    {stage.headline}
                  </div>

                  <p
                    style={{
                      fontSize: '14px',
                      color: '#94a3b8',
                      lineHeight: 1.6,
                      marginBottom: '20px',
                    }}
                  >
                    {stage.desc}
                  </p>

                  <div
                    style={{
                      backgroundColor: '#060911',
                      border: '1px solid #162032',
                      borderRadius: '12px',
                      padding: '14px',
                      fontSize: '13px',
                      color: '#cbd5e1',
                      lineHeight: 1.5,
                      marginBottom: stage.cta ? '20px' : 0,
                    }}
                  >
                    <strong style={{ color: '#ffffff' }}>Target Impact:</strong> {stage.impact}
                  </div>

                  {stage.cta && (
                    <div>
                      <button
                        onClick={onOpenOrderModal}
                        style={{
                          backgroundColor: '#1b5aff',
                          color: '#ffffff',
                          padding: '13px 24px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '13px',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 20px rgba(27, 90, 255, 0.4)',
                        }}
                      >
                        <span>{stage.cta}</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Connecting Downward Arrow Line */}
              {stage.connectorText && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '30px 0',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: '2px',
                      height: '24px',
                      background: 'linear-gradient(to bottom, #1b5aff, #38bdf8)',
                    }}
                  />
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#0c121e',
                      border: '1px solid #1e2c44',
                      padding: '6px 16px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#38bdf8',
                      margin: '8px 0',
                      textAlign: 'center',
                    }}
                  >
                    <span>{stage.connectorText}</span>
                    <ArrowDown size={13} />
                  </div>
                  <div
                    style={{
                      width: '2px',
                      height: '24px',
                      background: 'linear-gradient(to bottom, #38bdf8, #1b5aff)',
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
