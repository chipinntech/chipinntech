import React from 'react';
import { Target, Zap, GraduationCap, FlaskConical, ArrowRight } from 'lucide-react';

export default function MissionSection() {
  return (
    <section
      id="mission"
      style={{
        padding: '90px 24px 80px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f1f2f4',
      }}
    >
      <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto 60px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '20px',
              backgroundColor: 'rgba(27, 90, 255, 0.08)',
              color: '#1b5aff',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              marginBottom: '16px',
            }}
          >
            <Target size={14} /> OUR MISSION
          </div>

          <h2
            style={{
              fontSize: 'clamp(32px, 4.2vw, 54px)',
              fontWeight: 600,
              color: '#171a20',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '20px',
            }}
          >
            To make physical energy fully decentralized and abundant.
          </h2>

          <p
            style={{
              fontSize: 'clamp(16px, 1.8vw, 19px)',
              color: '#5c5e62',
              lineHeight: 1.6,
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            Current energy systems are centralized, fragile, and inefficient. Chipinn Technologies designs hardware, telemetry layers, and autonomous edge intelligence to give every tenant, building, and community full control over how power is measured, generated, and shared.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
          }}
        >
          {/* Pillar 1: Unity Meters */}
          <div
            style={{
              padding: '36px 30px',
              borderRadius: '16px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(27, 90, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <Zap size={24} color="#1b5aff" />
            </div>

            <span style={{ fontSize: '11px', fontWeight: 700, color: '#1b5aff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              PILLAR 01 · HARDWARE
            </span>
            <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#171a20', margin: '8px 0 12px' }}>
              Unity Smart Meters
            </h3>
            <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>
              Revenue-grade Class 0.2S smart electricity meters, sub-second anti-tamper security, and autonomous GridPulse™ AMI intelligence eliminating non-technical losses across national power grids.
            </p>

            <a
              href="#hero"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#1b5aff',
              }}
            >
              Explore Unity Meters <ArrowRight size={14} />
            </a>
          </div>

          {/* Pillar 2: Software Suite */}
          <div
            style={{
              padding: '36px 30px',
              borderRadius: '16px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <GraduationCap size={24} color="#7c3aed" />
            </div>

            <span style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              PILLAR 02 · SOFTWARE
            </span>
            <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#171a20', margin: '8px 0 12px' }}>
              Base16 & Base12 Platforms
            </h3>
            <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>
              Digitizing education and academic rigor. Base16 delivers modern institutional school management, while Base12 empowers 4th-year university seniors to research, synthesize, and defend undergraduate theses.
            </p>

            <a
              href="#software"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#7c3aed',
              }}
            >
              Explore Software Suite <ArrowRight size={14} />
            </a>
          </div>

          {/* Pillar 3: Labs */}
          <div
            style={{
              padding: '36px 30px',
              borderRadius: '16px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <FlaskConical size={24} color="#10b981" />
            </div>

            <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              PILLAR 03 · RESEARCH LABS
            </span>
            <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#171a20', margin: '8px 0 12px' }}>
              Chipinn Labs & Clean Energy
            </h3>
            <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>
              Pioneering regional solar cell efficiency with a mission to unlock <strong>1 Terawatt by 2032</strong>, alongside real-time IoT <strong>Biogas monitoring nodes</strong> deploying across 10 sites by 2028.
            </p>

            <a
              href="#labs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#10b981',
              }}
            >
              Explore Chipinn Labs <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
