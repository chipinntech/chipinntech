import React, { useState } from 'react';
import {
  School,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Layers,
  ShieldCheck,
  Users,
  Calendar,
  FileText,
  Globe,
  X,
  Code2
} from 'lucide-react';

// ============================================================================
// BASELABS PRODUCT CONFIGURATION
// You can update the links, descriptions, and features for each product here
// ============================================================================
export const BASELABS_PRODUCTS = [
  {
    id: 'base16',
    name: 'Base16',
    subtitle: 'Institutional School Management OS',
    category: 'Educational Institutions',
    badge: 'Live & Deploying',
    accentColor: '#7c3aed',
    accentBg: 'rgba(124, 58, 237, 0.08)',
    icon: School,
    websiteUrl: 'https://base16schools.com', // Update with your Base16 link
    shortDescription: 'A unified cloud administrative suite connecting school proprietors, teachers, parents, and students with automated Mobile Money tuition reconciliation and biometric attendance.',
    targetAudience: 'K-12 Private Schools, International Academies, & Tertiary Colleges',
    image: '/assets/base16-dashboard.jpg',
    keyFeatures: [
      'Automated Tuition Ledger & Mobile Money (MoMo) Auto-Reconciliation',
      'Biometric & RFID Attendance Tracking for Students & Staff',
      'Continuous Assessment, Gradebooks & 1-Click Term Report Generator',
      'Parent Mobile Portal & Real-time SMS Attendance/Fee Alerts',
      'Hostel, Facility & Automated Timetable Schedule Planner',
      'Multi-Branch Consolidated Reporting for School Chains',
    ],
    technicalHighlights: [
      'Role-based access control for bursars, teachers, and heads of school',
      'Offline-first synchronization for rural and low-connectivity campuses',
      'Bank-grade encrypted student records and financial audit trails',
    ],
  },
  {
    id: 'base12',
    name: 'Base12',
    subtitle: 'Academic Research & Thesis Writing Engine',
    category: 'Higher Ed & Research',
    badge: 'Active Research Engine',
    accentColor: '#1b5aff',
    accentBg: 'rgba(27, 90, 255, 0.08)',
    icon: BookOpen,
    websiteUrl: 'https://base12studios.com', // Update with your Base12 link
    shortDescription: 'Engineered specifically for undergraduate final-year students (4th years) and postgraduate scholars. Eliminates thesis writing chaos with structured chapter scaffolding, citation synthesis, and defense metrics.',
    targetAudience: 'Final-Year Undergraduate Scholars (4th Years), Master’s Candidates, & Faculty Labs',
    image: '/assets/base12-thesis.jpg',
    keyFeatures: [
      'Guided Chapters 1–5 Academic Scaffolding with Methodology Templates',
      '1-Click IEEE, APA 7th, Harvard & Chicago Automated Citation Engine',
      'Literature Review Synthesis & Academic Research Gap Identifier',
      'Algorithmic Thesis Defense Readiness & Question Predictor Metric',
      'Plagiarism Prevention & Cross-Chapter Argument Consistency Check',
      'Automated LaTeX & University-Formatted Microsoft Word Export',
    ],
    technicalHighlights: [
      'Vector-indexed academic paper semantic search across millions of open-access papers',
      'Real-time supervisor annotation and peer collaborative co-authoring',
      'Automated PowerPoint slide deck generator from completed thesis chapters',
    ],
  },
];

export default function BaseLabsSection({ onOpenOrderModal }) {
  const [activeProductId, setActiveProductId] = useState('base16');
  const [detailModalProduct, setDetailModalProduct] = useState(null);

  const activeProduct = BASELABS_PRODUCTS.find((p) => p.id === activeProductId) || BASELABS_PRODUCTS[0];

  return (
    <section
      id="baselabs"
      style={{
        padding: '100px 24px 90px',
        backgroundColor: '#fafbfc',
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1360px', margin: '0 auto' }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 50px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(124, 58, 237, 0.09)',
              color: '#7c3aed',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            <Sparkles size={14} /> BaseLabs · Software Division
          </div>

          <h2
            style={{
              fontSize: 'clamp(32px, 4.2vw, 50px)',
              fontWeight: 700,
              color: '#111827',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '16px',
            }}
          >
            Intelligent Software for Institutions & Scholars
          </h2>

          <p
            style={{
              fontSize: 'clamp(16px, 1.8vw, 18px)',
              color: '#4b5563',
              lineHeight: 1.6,
              maxWidth: '740px',
              margin: '0 auto',
            }}
          >
            Under the banner of <strong>Rethink Possibilities</strong>, BaseLabs builds transformative enterprise platforms and research engines designed to eliminate friction in African schools and universities.
          </p>

          {/* Product Selector Cards */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap',
              marginTop: '34px',
            }}
          >
            {BASELABS_PRODUCTS.map((prod) => {
              const IconComp = prod.icon;
              const isSelected = prod.id === activeProductId;
              return (
                <button
                  key={prod.id}
                  onClick={() => setActiveProductId(prod.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.22s ease',
                    border: isSelected ? `2px solid ${prod.accentColor}` : '1px solid #d1d5db',
                    backgroundColor: isSelected ? '#ffffff' : '#f3f4f6',
                    color: isSelected ? '#111827' : '#4b5563',
                    boxShadow: isSelected ? '0 8px 24px rgba(0,0,0,0.08)' : 'none',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? prod.accentBg : 'rgba(0,0,0,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? prod.accentColor : '#6b7280',
                    }}
                  >
                    <IconComp size={18} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700 }}>{prod.name}</span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: prod.accentBg,
                          color: prod.accentColor,
                        }}
                      >
                        {prod.category}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{prod.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Product Detailed View */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
          }}
        >
          {/* Top Bar with Product Links */}
          <div
            style={{
              padding: '20px 32px',
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: activeProduct.accentBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: activeProduct.accentColor,
                }}
              >
                <activeProduct.icon size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>
                    {activeProduct.name}
                  </h3>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: activeProduct.accentColor,
                      backgroundColor: activeProduct.accentBg,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {activeProduct.badge}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                  {activeProduct.subtitle}
                </p>
              </div>
            </div>

            {/* Direct External Product Link & Detail Trigger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setDetailModalProduct(activeProduct)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                View Full Specs & Overview
              </button>

              <a
                href={activeProduct.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 20px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  backgroundColor: activeProduct.accentColor,
                  color: '#ffffff',
                  textDecoration: 'none',
                  boxShadow: `0 3px 12px ${activeProduct.accentColor}40`,
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <span>Launch {activeProduct.name} Site</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Grid Layout: Left Content, Right Interactive Screenshot */}
          <div
            style={{
              padding: '36px 32px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            {/* Left Description & Feature Matrix */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: activeProduct.accentColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '10px',
                }}
              >
                <Users size={14} /> Target: {activeProduct.targetAudience}
              </div>

              <p
                style={{
                  fontSize: '16px',
                  color: '#374151',
                  lineHeight: 1.6,
                  marginBottom: '26px',
                }}
              >
                {activeProduct.shortDescription}
              </p>

              <h4
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#111827',
                  marginBottom: '14px',
                }}
              >
                Key Platform Capabilities
              </h4>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '11px',
                  marginBottom: '32px',
                }}
              >
                {activeProduct.keyFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      fontSize: '14px',
                      color: '#4b5563',
                      lineHeight: 1.45,
                    }}
                  >
                    <CheckCircle2
                      size={17}
                      color={activeProduct.accentColor}
                      style={{ flexShrink: 0, marginTop: '2px' }}
                    />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Links */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <a
                  href={activeProduct.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    backgroundColor: activeProduct.accentColor,
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>Go to {activeProduct.websiteUrl.replace('https://', '')}</span>
                  <ArrowRight size={15} />
                </a>

                <button
                  onClick={() => setDetailModalProduct(activeProduct)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    color: '#111827',
                    border: '1px solid #d1d5db',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  <FileText size={15} /> Product Details
                </button>
              </div>
            </div>

            {/* Right: Interface Image Showcase */}
            <div>
              <div
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                  backgroundColor: '#0f1118',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onClick={() => setDetailModalProduct(activeProduct)}
              >
                <img
                  src={activeProduct.image}
                  alt={`${activeProduct.name} Interface Dashboard`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />

                {/* Floating pill over image */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '14px',
                    right: '14px',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Sparkles size={12} color="#38bdf8" /> Click to expand details
                </div>
              </div>
              <div
                style={{
                  marginTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: '#6b7280',
                  padding: '0 4px',
                }}
              >
                <span>Live production UI for {activeProduct.name}</span>
                <span style={{ fontWeight: 600, color: activeProduct.accentColor }}>
                  {activeProduct.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Deep-Dive Modal */}
      {detailModalProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setDetailModalProduct(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '720px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              padding: '36px 32px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setDetailModalProduct(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                color: '#4b5563',
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: detailModalProduct.accentBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: detailModalProduct.accentColor,
                }}
              >
                <detailModalProduct.icon size={26} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>
                    {detailModalProduct.name}
                  </h3>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: detailModalProduct.accentColor,
                      backgroundColor: detailModalProduct.accentBg,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {detailModalProduct.badge}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0' }}>
                  {detailModalProduct.subtitle}
                </p>
              </div>
            </div>

            {/* Modal Image */}
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
                marginBottom: '24px',
              }}
            >
              <img
                src={detailModalProduct.image}
                alt={detailModalProduct.name}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            {/* Summary */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: '#111827', marginBottom: '8px' }}>
                Executive Overview
              </h4>
              <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.6 }}>
                {detailModalProduct.shortDescription}
              </p>
            </div>

            {/* Technical Highlights */}
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: '#111827', marginBottom: '12px' }}>
                Technical & Architectural Advantages
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {detailModalProduct.technicalHighlights.map((tech, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                    <Code2 size={16} color={detailModalProduct.accentColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons with Link */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '20px',
                borderTop: '1px solid #e5e7eb',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '13px', color: '#6b7280' }}>
                Part of the <strong>Chipinn Technologies</strong> Software Portfolio
              </span>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={detailModalProduct.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 22px',
                    borderRadius: '8px',
                    backgroundColor: detailModalProduct.accentColor,
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    textDecoration: 'none',
                  }}
                >
                  <span>Launch Official Portal</span>
                  <ExternalLink size={14} />
                </a>

                <button
                  onClick={() => setDetailModalProduct(null)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
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
