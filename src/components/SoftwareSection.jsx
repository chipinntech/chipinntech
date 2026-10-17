import React, { useState } from 'react';
import { School, BookOpen, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function SoftwareSection({ onOpenPilotModal }) {
  const [activeTab, setActiveTab] = useState('base16'); // 'base16' | 'base12'

  return (
    <section
      id="software"
      style={{
        padding: '100px 24px 80px',
        backgroundColor: '#fafbfc',
        borderBottom: '1px solid #f1f2f4',
      }}
    >
      <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '20px',
              backgroundColor: 'rgba(124, 58, 237, 0.08)',
              color: '#7c3aed',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              marginBottom: '12px',
            }}
          >
            <Sparkles size={14} /> CHIPINN SOFTWARE ECOSYSTEM
          </div>

          <h2
            style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 600,
              color: '#171a20',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '14px',
            }}
          >
            Enterprise & Academic Software
          </h2>

          <p style={{ fontSize: '17px', color: '#5c5e62', lineHeight: 1.5 }}>
            Purpose-built platforms engineered to streamline educational institutions and empower final-year academic scholars.
          </p>

          {/* Interactive Toggle Pills */}
          <div
            style={{
              display: 'inline-flex',
              gap: '6px',
              padding: '6px',
              borderRadius: '12px',
              backgroundColor: '#e5e7eb',
              marginTop: '28px',
            }}
          >
            <button
              onClick={() => setActiveTab('base16')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: activeTab === 'base16' ? '#ffffff' : '#4b5563',
                backgroundColor: activeTab === 'base16' ? '#7c3aed' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <School size={16} /> Base16 · School Management
            </button>

            <button
              onClick={() => setActiveTab('base12')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: activeTab === 'base12' ? '#ffffff' : '#4b5563',
                backgroundColor: activeTab === 'base12' ? '#1b5aff' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <BookOpen size={16} /> Base12 · Thesis Writing Engine
            </button>
          </div>
        </div>

        {/* Tab 1: Base16 (School Management System) */}
        {activeTab === 'base16' && (
          <div
            id="base16"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '48px',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              padding: '40px',
              borderRadius: '24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              border: '1px solid #e5e7eb',
            }}
          >
            {/* Left info */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  color: '#7c3aed',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '12px',
                }}
              >
                K-12 & Tertiary Institution OS
              </div>

              <h3 style={{ fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 600, color: '#171a20', marginBottom: '14px' }}>
                Base16 School Management Platform
              </h3>

              <p style={{ fontSize: '16px', color: '#5c5e62', lineHeight: 1.6, marginBottom: '24px' }}>
                A unified, end-to-end administration suite connecting school proprietors, teachers, parents, and students. Eliminate manual paper workflows, reconcile tuition fees in real time, and streamline institutional reporting.
              </p>

              {/* Feature List */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '32px' }}>
                {[
                  'Automated Tuition & Mobile Money Ledger',
                  'Biometric & RFID Attendance Tracking',
                  'Instant Gradebooks & Report Card Generator',
                  'Parent Mobile Portal & SMS Notifications',
                  'Hostel & Timetable Schedule Planner',
                  'Multi-Branch Consolidated Reporting',
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13.5px', color: '#374151' }}>
                    <CheckCircle2 size={16} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a
                  href="https://base16schools.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{
                    backgroundColor: '#7c3aed',
                    color: '#ffffff',
                    height: '44px',
                    padding: '0 24px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                  }}
                >
                  Visit base16schools.com <ArrowRight size={15} />
                </a>

                <button
                  onClick={() => onOpenPilotModal('Base16 School Demo')}
                  className="btn btn-glass"
                  style={{ height: '44px', border: '1px solid #d1d5db', borderRadius: '8px', color: '#171a20' }}
                >
                  Schedule School Demo
                </button>
              </div>
            </div>

            {/* Right preview screenshot */}
            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                backgroundColor: '#0f1118',
              }}
            >
              <img
                src="/assets/base16-dashboard.jpg"
                alt="Base16 School Management Dashboard"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Base12 (Thesis Writing Engine for 4th Years) */}
        {activeTab === 'base12' && (
          <div
            id="base12"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '48px',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              padding: '40px',
              borderRadius: '24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              border: '1px solid #e5e7eb',
            }}
          >
            {/* Left info */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(27, 90, 255, 0.1)',
                  color: '#1b5aff',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '12px',
                }}
              >
                Academic Research System for 4th Years
              </div>

              <h3 style={{ fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 600, color: '#171a20', marginBottom: '14px' }}>
                Base12 Thesis Writing Engine
              </h3>

              <p style={{ fontSize: '16px', color: '#5c5e62', lineHeight: 1.6, marginBottom: '24px' }}>
                Engineered specifically for undergraduate final-year students (4th years) and postgraduate researchers. Base12 removes the chaos of thesis writing with structured chapter scaffolds, citation formatting, literature review synthesis, and defense deck generation.
              </p>

              {/* Feature List */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '32px' }}>
                {[
                  'Guided Chapters 1–5 Academic Scaffolding',
                  '1-Click IEEE, APA 7th, Harvard & Chicago Citations',
                  'Literature Review Synthesis & Gap Identifier',
                  'Algorithmic Thesis Defense Readiness Metric',
                  'Plagiarism & Structural Consistency Verification',
                  'Automated LaTeX & University-Compliant Word Export',
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13.5px', color: '#374151' }}>
                    <CheckCircle2 size={16} color="#1b5aff" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onOpenPilotModal('Base12 Thesis Engine Student Access')}
                  className="btn btn-primary"
                  style={{
                    height: '44px',
                    padding: '0 24px',
                    borderRadius: '8px',
                    fontWeight: 600,
                  }}
                >
                  Start 4th-Year Thesis Project <ArrowRight size={15} />
                </button>

                <button
                  onClick={() => onOpenPilotModal('Base12 University Academic Inquiries')}
                  className="btn btn-glass"
                  style={{ height: '44px', border: '1px solid #d1d5db', borderRadius: '8px', color: '#171a20' }}
                >
                  University Inquiries
                </button>
              </div>
            </div>

            {/* Right preview screenshot */}
            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                backgroundColor: '#0f1118',
              }}
            >
              <img
                src="/assets/base12-thesis.jpg"
                alt="Base12 Thesis Writing Engine UI"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
