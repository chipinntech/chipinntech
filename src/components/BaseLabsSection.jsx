import React, { useState, useRef, useEffect } from 'react';
import { 
  School, 
  BookOpen, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  X, 
  Code2, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Bot,
  Layers
} from 'lucide-react';

// ============================================================================
// BASELABS PRODUCTS CONFIGURATION
// You can edit product descriptions, links, and details here anytime
// ============================================================================
export const BASELABS_PRODUCTS = [
  {
    id: 'base16',
    name: 'Base16',
    tagline: 'AI-Powered School Management OS',
    category: 'Educational Institutions',
    badge: 'Flagship Platform',
    accentColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    icon: School,
    websiteUrl: 'https://base16schools.com', // Replace with your live Base16 URL
    shortPitch: 'Eliminates paper chaos and manual administration with automated Mobile Money tuition reconciliation, smart biometric attendance, and predictive gradebook analytics.',
    audience: 'K-12 Schools, Academies & Tertiary Campuses',
    image: '/assets/base16-dashboard.jpg',
    features: [
      'Automated Tuition Ledger with Instant MoMo Reconciliation',
      'Biometric & RFID Student/Staff Attendance Analytics',
      'AI Continuous Assessment & 1-Click Term Report Generator',
      'Parent Mobile Portal with Instant WhatsApp/SMS Alerts',
      'Multi-Branch Consolidated Reporting for School Chains',
      'Automated Timetable, Exam & Room Scheduling Engine',
    ],
    technicalHighlights: [
      'Role-based permissions for bursars, teachers, principals, and owners',
      'Offline-first synchronization for rural and low-bandwidth schools',
      'Bank-grade encrypted student records and financial ledger audit trails',
    ],
  },
  {
    id: 'base12',
    name: 'Base12',
    tagline: 'AI Academic Research & Thesis Engine',
    category: 'Higher Ed & Research',
    badge: 'Research Accelerator',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    icon: BookOpen,
    websiteUrl: 'https://base12thesis.com', // Replace with your live Base12 URL
    shortPitch: 'Engineered for final-year students (4th years) and postgraduate scholars. Removes the anxiety of thesis writing with automated citation formatting, literature gap discovery, and defense metrics.',
    audience: 'Undergraduate 4th Years, Master’s Candidates & University Labs',
    image: '/assets/base12-thesis.jpg',
    features: [
      'Guided Chapters 1–5 Scaffolding with Methodology Templates',
      '1-Click IEEE, APA 7th, Harvard & Chicago Automated Citations',
      'AI Literature Review Synthesis & Academic Research Gap Finder',
      'Predictive Thesis Defense Readiness Score & Question Predictor',
      'Plagiarism Prevention & Cross-Chapter Argument Consistency',
      'Automated LaTeX & University-Compliant Word/PDF Export',
    ],
    technicalHighlights: [
      'Semantic academic paper search across millions of peer-reviewed sources',
      'Real-time supervisor annotations, revision tracking, and defense slide generator',
      'Built-in data analysis copilot for survey disaggregation and charts',
    ],
  },
  {
    id: 'base-ai-studio',
    name: 'BaseLabs Studio',
    tagline: 'Bespoke AI Agents & Custom Software',
    category: 'Custom Engineering',
    badge: 'Specialized Labs',
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    icon: Bot,
    websiteUrl: 'mailto:contact@chipinntech.com?subject=BaseLabs%20Custom%20AI%20Software%20Inquiry',
    shortPitch: 'We don’t just write code — we build intelligent AI agents, telemetry dashboards, and high-performance custom platforms tailored to your business operations.',
    audience: 'Enterprises, Utilities & Rapidly Scaling Startups',
    image: '/assets/base16-dashboard-raw.png',
    features: [
      'Custom Autonomous AI Agents for Workflow Automation',
      'High-Throughput Edge Telemetry & IoT Cloud Dashboards',
      'Enterprise Mobile Money & Payment Gateway Integrations',
      'Legacy Database Modernization & Cloud Migrations',
      'Dedicated SLA Support & On-Premises Air-Gapped Deployments',
      'Rapid Prototyping to Full Production within Weeks',
    ],
    technicalHighlights: [
      'Full-stack React, FastAPI, Python ML, and Rust edge performance',
      'Encrypted telemetry pipelines handling millions of daily data points',
      'Architected under our core mission: Rethink Possibilities',
    ],
  },
];

export default function BaseLabsSection({ onOpenOrderModal }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [detailProduct, setDetailProduct] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef(null);

  const scrollToCard = (index) => {
    setActiveIdx(index);
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const card = container.children[index];
      if (card) {
        const targetLeft = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
        container.scrollTo({ left: targetLeft, behavior: 'smooth' });
      }
    }
  };

  // 3-Second Auto-Scroll Interval with Hover & Touch Pause
  useEffect(() => {
    if (isPaused || detailProduct !== null) return;

    const interval = setInterval(() => {
      setActiveIdx((prevIdx) => {
        const nextIdx = (prevIdx + 1) % BASELABS_PRODUCTS.length;
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const card = container.children[nextIdx];
          if (card) {
            const targetLeft = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
            container.scrollTo({ left: targetLeft, behavior: 'smooth' });
          }
        }
        return nextIdx;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, detailProduct]);

  const handlePrev = () => {
    const nextIdx = (activeIdx - 1 + BASELABS_PRODUCTS.length) % BASELABS_PRODUCTS.length;
    scrollToCard(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeIdx + 1) % BASELABS_PRODUCTS.length;
    scrollToCard(nextIdx);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.offsetWidth * 0.85;
    const newIdx = Math.round(scrollLeft / (cardWidth || 1));
    if (newIdx >= 0 && newIdx < BASELABS_PRODUCTS.length && newIdx !== activeIdx) {
      setActiveIdx(newIdx);
    }
  };

  return (
    <section
      id="baselabs"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      style={{
        position: 'relative',
        padding: '64px 20px 72px',
        backgroundColor: '#05070e',
        color: '#ffffff',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Radiant Glass Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.16) 0%, rgba(168, 85, 247, 0) 70%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '10%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, rgba(56, 189, 248, 0) 70%)',
          pointerEvents: 'none',
          filter: 'blur(70px)',
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: '1360px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Compact, High-Impact Top Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          {/* Left Brand & Title */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(168, 85, 247, 0.12)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                color: '#d8b4fe',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              <Sparkles size={12} color="#c084fc" />
              <span>BaseLabs · AI Software Division</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(24px, 3.2vw, 36px)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                margin: '0 0 6px 0',
              }}
            >
              We Build AI-Powered Software That Solves Real Problems.
            </h2>

            <p
              style={{
                fontSize: '14.5px',
                color: '#94a3b8',
                lineHeight: 1.5,
                maxWidth: '640px',
                margin: 0,
              }}
            >
              From institutional school operations on <strong>Base16</strong> to academic research acceleration on <strong>Base12</strong> — crafted with intelligence, speed, and precision.
            </p>
          </div>

          {/* Right: Glass Carousel Controls & Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Pill Selectors */}
            <div
              style={{
                display: 'flex',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '3px',
                borderRadius: '10px',
                backdropFilter: 'blur(10px)',
              }}
            >
              {BASELABS_PRODUCTS.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => scrollToCard(idx)}
                  style={{
                    backgroundColor: activeIdx === idx ? p.accentColor : 'transparent',
                    color: activeIdx === idx ? '#ffffff' : '#94a3b8',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '7px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={handlePrev}
                aria-label="Previous Product"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(12px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={handleNext}
                aria-label="Next Product"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(12px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Glass Carousel Track */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            paddingBottom: '16px',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {BASELABS_PRODUCTS.map((prod, idx) => {
            const IconComponent = prod.icon;
            const isFeatured = idx === activeIdx;

            return (
              <div
                key={prod.id}
                className="glass-panel-dark"
                style={{
                  flex: '0 0 100%',
                  maxWidth: '100%',
                  scrollSnapAlign: 'center',
                  borderRadius: '24px',
                  padding: '36px 32px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '36px',
                  alignItems: 'center',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isFeatured ? `0 20px 60px ${prod.glowColor}` : '0 16px 40px rgba(0, 0, 0, 0.4)',
                  border: isFeatured ? `1px solid ${prod.accentColor}70` : '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                {/* Left Product Information & Actions */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: `${prod.accentColor}25`,
                        border: `1px solid ${prod.accentColor}50`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: prod.accentColor,
                      }}
                    >
                      <IconComponent size={22} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>
                          {prod.name}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            backgroundColor: `${prod.accentColor}25`,
                            color: prod.accentColor,
                            border: `1px solid ${prod.accentColor}40`,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {prod.badge}
                        </span>
                      </div>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                        {prod.category}
                      </span>
                    </div>
                  </div>

                  <h3
                    style={{
                      fontSize: 'clamp(18px, 2.2vw, 22px)',
                      fontWeight: 700,
                      color: '#f8fafc',
                      lineHeight: 1.3,
                      marginBottom: '12px',
                    }}
                  >
                    {prod.tagline}
                  </h3>

                  <p
                    style={{
                      fontSize: '14.5px',
                      color: '#cbd5e1',
                      lineHeight: 1.6,
                      marginBottom: '22px',
                    }}
                  >
                    {prod.shortPitch}
                  </p>

                  {/* Capabilities List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '28px' }}>
                    {prod.features.slice(0, 4).map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          fontSize: '13.5px',
                          color: '#e2e8f0',
                          lineHeight: 1.4,
                        }}
                      >
                        <CheckCircle2
                          size={16}
                          color={prod.accentColor}
                          style={{ flexShrink: 0, marginTop: '2px' }}
                        />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Glass Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <a
                      href={prod.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '11px 22px',
                        borderRadius: '10px',
                        backgroundColor: prod.accentColor,
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '13.5px',
                        textDecoration: 'none',
                        boxShadow: `0 4px 18px ${prod.accentColor}50`,
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.opacity = '0.92';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      <span>Open {prod.name}</span>
                      <ExternalLink size={14} />
                    </a>

                    <button
                      onClick={() => setDetailProduct(prod)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '11px 18px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        backdropFilter: 'blur(10px)',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.14)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                      }}
                    >
                      <span>View Architecture</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Right: Glass-Framed Interactive UI Mockup */}
                <div
                  style={{
                    position: 'relative',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                    backgroundColor: '#0a0d16',
                    cursor: 'pointer',
                  }}
                  onClick={() => setDetailProduct(prod)}
                >
                  <img
                    src={prod.image}
                    alt={`${prod.name} Live UI Dashboard`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '380px',
                      display: 'block',
                      objectFit: 'cover',
                      objectPosition: 'top center',
                      transition: 'transform 0.4s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />

                  {/* Glass Floating Overlay Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(10, 14, 26, 0.82)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: prod.accentColor,
                        boxShadow: `0 0 8px ${prod.accentColor}`,
                      }}
                    />
                    <span>AI Engine Live</span>
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(10, 14, 26, 0.85)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      color: '#ffffff',
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Sparkles size={12} color={prod.accentColor} /> Click to expand
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Bottom Dot Indicators */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '18px',
          }}
        >
          {BASELABS_PRODUCTS.map((prod, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => scrollToCard(dotIdx)}
              aria-label={`Go to ${prod.name}`}
              style={{
                width: dotIdx === activeIdx ? '28px' : '8px',
                height: '6px',
                borderRadius: '4px',
                backgroundColor: dotIdx === activeIdx ? prod.accentColor : 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Deep-Dive Glassmorphism Modal */}
      {detailProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(3, 6, 15, 0.82)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setDetailProduct(null)}
        >
          <div
            className="glass-panel-dark"
            style={{
              borderRadius: '24px',
              maxWidth: '760px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '36px',
              position: 'relative',
              backgroundColor: '#0b0f1a',
              border: `1px solid ${detailProduct.accentColor}60`,
              boxShadow: `0 25px 80px rgba(0, 0, 0, 0.8), 0 0 50px ${detailProduct.glowColor}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setDetailProduct(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  backgroundColor: `${detailProduct.accentColor}25`,
                  border: `1px solid ${detailProduct.accentColor}60`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: detailProduct.accentColor,
                }}
              >
                <detailProduct.icon size={26} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    {detailProduct.name}
                  </h3>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: detailProduct.accentColor,
                      backgroundColor: `${detailProduct.accentColor}20`,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: `1px solid ${detailProduct.accentColor}40`,
                    }}
                  >
                    {detailProduct.badge}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>
                  {detailProduct.tagline}
                </p>
              </div>
            </div>

            {/* Modal Screenshot */}
            <div
              style={{
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                marginBottom: '22px',
                backgroundColor: '#04060c',
              }}
            >
              <img
                src={detailProduct.image}
                alt={detailProduct.name}
                style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '340px', objectFit: 'cover' }}
              />
            </div>

            {/* Overview */}
            <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '22px' }}>
              {detailProduct.shortPitch}
            </p>

            {/* Technical Highlights */}
            <div style={{ marginBottom: '26px' }}>
              <h4 style={{ fontSize: '12.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: detailProduct.accentColor, marginBottom: '12px' }}>
                Technical Architecture & Intelligence
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {detailProduct.technicalHighlights.map((tech, tIdx) => (
                  <div key={tIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: '#94a3b8' }}>
                    <Code2 size={16} color={detailProduct.accentColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                BaseLabs · Rethink Possibilities
              </span>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={detailProduct.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    backgroundColor: detailProduct.accentColor,
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    textDecoration: 'none',
                    boxShadow: `0 3px 14px ${detailProduct.accentColor}60`,
                  }}
                >
                  <span>Launch Official Portal</span>
                  <ExternalLink size={14} />
                </a>

                <button
                  onClick={() => setDetailProduct(null)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
