import React from 'react';
import { Mail } from 'lucide-react';

export default function Footer({ onOpenSpecs, onOpenPilotModal }) {
  return (
    <footer
      style={{
        padding: '50px 24px 50px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #f1f2f4',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Direct Inquiries & Contact Email */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 20px',
              borderRadius: '24px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              fontSize: '13.5px',
              color: '#171a20',
              transition: 'all 0.2s ease',
            }}
          >
            <Mail size={16} color="#1b5aff" />
            <span style={{ color: '#64748b' }}>Direct Inquiries & Utility Pilots:</span>
            <a
              href="mailto:hello@chipinn.com"
              style={{
                color: '#1b5aff',
                fontWeight: 600,
                textDecoration: 'none',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              hello@chipinn.com
            </a>
          </div>
        </div>

        {/* Certification badges bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'clamp(14px, 3vw, 36px)',
            flexWrap: 'wrap',
            marginBottom: '30px',
            fontSize: '12px',
            color: '#71747a',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <span>✓ IEC 62053-22 Class 0.2S</span>
          <span>✓ DLMS / COSEM Certified</span>
          <span>✓ STS Association Compliant</span>
          <span>✓ ISO 9001 / ISO 27001</span>
          <span>✓ KEMA Type Tested</span>
        </div>

        {/* Minimal Navigation Links (Tesla Style) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'clamp(12px, 2.5vw, 24px)',
            flexWrap: 'wrap',
            fontSize: '12px',
            fontWeight: 500,
            color: '#5c5e62',
            marginBottom: '20px',
          }}
        >
          <span>Chipinn Technologies Ltd © 2026</span>
          <a href="#mission" style={{ color: 'inherit' }}>Our Mission</a>
          <a href="#hero" style={{ color: 'inherit' }}>Unity Meters</a>
          <a href="https://base16schools.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>Base16 Schools</a>
          <a href="#base12" style={{ color: 'inherit' }}>Base12 (Thesis Engine)</a>
          <a href="#solar-lab" style={{ color: 'inherit' }}>Solar Labs (1 TW 2032)</a>
          <a href="#biogas-lab" style={{ color: 'inherit' }}>Biogas Nodes (2028)</a>
          <a href="#gridpulse" style={{ color: 'inherit' }}>GridPulse™ AMI</a>
          <button onClick={() => onOpenSpecs('all')} style={{ color: 'inherit', fontSize: '12px' }}>
            Metrology Specs
          </button>
          <button onClick={() => onOpenPilotModal('Partnership')} style={{ color: 'inherit', fontSize: '12px' }}>
            Partnerships
          </button>
        </div>

        <p style={{ fontSize: '11px', color: '#9ca3af', maxWidth: '640px', margin: '0 auto', lineHeight: 1.5 }}>
          Chipinn Technologies Ltd is a pioneering grid hardware and intelligent smart metering company. 
          Unity Meters™ and GridPulse™ are registered trademarks. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
