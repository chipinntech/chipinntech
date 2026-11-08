import React from 'react';
import { Play } from 'lucide-react';

export default function HeroSection({ onOpenOrderModal }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#04070d',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        color: '#ffffff',
        paddingTop: '80px',
        paddingBottom: '60px',
      }}
    >
      {/* 100% Raw, Natural Hero Background Image — ZERO Overlays or Dark Masks */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/assets/hero-africa-dawn.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 45%',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
        }}
      />

      {/* Content Container (Positioned Cleanly Without Obscuring the Earth) */}
      <div
        className="hero-container"
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 36px',
          position: 'relative',
          zIndex: 2,
          width: '100%',
        }}
      >
        <div style={{ maxWidth: '720px' }}>
          {/* Tag */}
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#38bdf8',
              marginBottom: '10px',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.95)',
            }}
          >
            The 3-Year Master Plan · Ghana
          </div>

          {/* Balanced, Sleek Headline */}
          <h1
            style={{
              fontSize: 'clamp(30px, 4.4vw, 54px)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              textTransform: 'uppercase',
              marginBottom: '14px',
              fontFamily: 'var(--font-display, inherit)',
              textShadow: '0 3px 20px rgba(0, 0, 0, 0.95), 0 1px 4px rgba(0, 0, 0, 0.9)',
            }}
          >
            Making Energy <br />
            Abundant
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              lineHeight: 1.5,
              color: '#f1f5f9',
              marginBottom: '26px',
              fontWeight: 400,
              maxWidth: '580px',
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.95)',
            }}
          >
            Our 3-year mission: eliminate Dumsor and drive electricity in Ghana to <strong>less than GH₵1 per kWh</strong>. Starting from the compound house, scaling to the national grid.
          </p>

          {/* Action Buttons */}
          <div
            className="hero-buttons"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <button
              className="hero-btn"
              onClick={onOpenOrderModal}
              style={{
                backgroundColor: '#ffffff',
                color: '#05070c',
                padding: '13px 26px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#38bdf8';
                e.currentTarget.style.color = '#05070c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#05070c';
              }}
            >
              <span>Order Unity Meter — GH₵1,250</span>
              <Play size={11} fill="currentColor" />
            </button>

            <button
              className="hero-btn"
              onClick={() => scrollTo('masterplan')}
              style={{
                backgroundColor: 'rgba(5, 7, 12, 0.65)',
                color: '#ffffff',
                padding: '13px 24px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: '1px solid rgba(255, 255, 255, 0.45)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.5)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ffffff';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.45)';
                e.currentTarget.style.backgroundColor = 'rgba(5, 7, 12, 0.65)';
              }}
            >
              The Master Plan ↓
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
