import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar({ onOpenOrderModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className="header-nav"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'all 0.25s ease',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: isScrolled
            ? '0 4px 20px rgba(0, 0, 0, 0.08)'
            : '0 1px 3px rgba(0, 0, 0, 0.04)',
          padding: isScrolled ? '12px 32px' : '16px 32px',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo only on Clean White Background */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <img
              src="/assets/chipinn-logo-transparent.png"
              alt="Chipinn"
              style={{
                height: '30px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>

          {/* Desktop Nav Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '36px',
            }}
            className="md-flex"
          >
            <button
              onClick={() => scrollTo('hero')}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#1f2937',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#1b5aff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#1f2937')}
            >
              Mission
            </button>
            <button
              onClick={() => scrollTo('masterplan')}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#1f2937',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#1b5aff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#1f2937')}
            >
              Master Plan
            </button>
            <button
              onClick={() => scrollTo('unity-meter')}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#1f2937',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#1b5aff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#1f2937')}
            >
              Unity Meter
            </button>
          </nav>

          {/* Right Action Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onOpenOrderModal}
              style={{
                backgroundColor: '#1b5aff',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '13px',
                letterSpacing: '0.04em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 10px rgba(27, 90, 255, 0.3)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1246d6';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1b5aff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span className="nav-order-text-full">Order Unity Meter</span>
              <span className="nav-order-text-short">Order</span>
              <span
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                GH₵1,250
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                padding: '6px',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="md-hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '56px',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            padding: '20px 18px',
            zIndex: 49,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          }}
        >
          <button
            onClick={() => scrollTo('hero')}
            style={{
              textAlign: 'left',
              fontSize: '15px',
              fontWeight: 600,
              color: '#111827',
              padding: '8px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Mission
          </button>
          <button
            onClick={() => scrollTo('masterplan')}
            style={{
              textAlign: 'left',
              fontSize: '15px',
              fontWeight: 600,
              color: '#111827',
              padding: '8px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Master Plan
          </button>
          <button
            onClick={() => scrollTo('unity-meter')}
            style={{
              textAlign: 'left',
              fontSize: '15px',
              fontWeight: 600,
              color: '#1b5aff',
              padding: '8px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Unity Meter (3-in-1)
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenOrderModal();
            }}
            style={{
              marginTop: '10px',
              backgroundColor: '#1b5aff',
              color: '#ffffff',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '15px',
              textAlign: 'center',
            }}
          >
            Order Unity Meter — GH₵1,250
          </button>
        </div>
      )}
    </>
  );
}
