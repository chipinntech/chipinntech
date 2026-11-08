import React from 'react';
import { MapPin, Phone, Mail, ArrowUp } from 'lucide-react';

export default function Footer({ onOpenOrderModal }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        color: '#111827',
        borderTop: '1px solid #e5e7eb',
        padding: '80px 24px 40px',
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '48px',
            marginBottom: '60px',
          }}
        >
          {/* Column 1: Brand Logo Only & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '18px' }}>
              <img
                src="/assets/chipinn-logo-transparent.png"
                alt="Chipinn"
                style={{ height: '34px', width: 'auto', display: 'block' }}
              />
            </div>

            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, marginBottom: '20px' }}>
              Making energy intelligent, accessible, and abundant. Starting in Ghana with an unapologetic 3-year mission: eliminate Dumsor and drop electricity prices to under GH₵1 per kWh.
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1b5aff', fontWeight: 600 }}>
              <MapPin size={16} />
              <span>Accra, Ghana</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#111827', marginBottom: '16px' }}>
              Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <button
                onClick={() => scrollTo('hero')}
                style={{ textAlign: 'left', color: '#4b5563', transition: 'color 0.2s', fontWeight: 500 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1b5aff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#4b5563')}
              >
                Mission
              </button>
              <button
                onClick={() => scrollTo('masterplan')}
                style={{ textAlign: 'left', color: '#4b5563', transition: 'color 0.2s', fontWeight: 500 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1b5aff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#4b5563')}
              >
                The 3-Year Master Plan
              </button>
              <button
                onClick={() => scrollTo('unity-meter')}
                style={{ textAlign: 'left', color: '#4b5563', transition: 'color 0.2s', fontWeight: 500 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1b5aff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#4b5563')}
              >
                Unity Meter (3-in-1 Sub-meter)
              </button>
              <button
                onClick={onOpenOrderModal}
                style={{ textAlign: 'left', color: '#1b5aff', fontWeight: 600 }}
              >
                Order Unity Meter — GH₵1,250
              </button>
            </div>
          </div>

          {/* Column 3: The 3-Year Commitments */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#111827', marginBottom: '16px' }}>
              Our 3-Year Target
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#16a34a', display: 'block', fontSize: '16px', marginBottom: '2px' }}>&lt; GH₵1.00 / kWh</strong>
                <span style={{ color: '#64748b' }}>Affordable clean electricity within 36 months.</span>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#1b5aff', display: 'block', fontSize: '16px', marginBottom: '2px' }}>Zero Dumsor</strong>
                <span style={{ color: '#64748b' }}>Eliminating utility bypasses and expanding distributed solar.</span>
              </div>
            </div>
          </div>

          {/* Column 4: Verified Contact Info */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#111827', marginBottom: '16px' }}>
              Get In Touch
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <a
                href="tel:+233502560760"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#1f2937',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1b5aff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#1f2937')}
              >
                <Phone size={16} color="#1b5aff" />
                <span>+233 50 256 0760</span>
              </a>

              <a
                href="mailto:hello@chipinntech.com"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#1f2937',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1b5aff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#1f2937')}
              >
                <Mail size={16} color="#1b5aff" />
                <span>hello@chipinntech.com</span>
              </a>

              <button
                onClick={onOpenOrderModal}
                style={{
                  marginTop: '10px',
                  backgroundColor: '#1b5aff',
                  color: '#ffffff',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '13px',
                  transition: 'background-color 0.2s',
                  boxShadow: '0 2px 8px rgba(27, 90, 255, 0.25)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1246d6')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1b5aff')}
              >
                Order / Reserve Meter
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '28px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '13px',
            color: '#6b7280',
          }}
        >
          <div>
            © {new Date().getFullYear()} Chipinn Technologies Ltd. Built for Ghana & Africa.
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#6b7280',
              fontSize: '12px',
              fontWeight: 500,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#1b5aff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
          >
            <span>Back to top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
