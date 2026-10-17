import React, { useState, useEffect } from 'react';
import { HelpCircle, User, Menu, X, ChevronDown, ChevronRight, School, BookOpen, Sun, Flame } from 'lucide-react';

export default function Navbar({ onOpenPilotModal, onOpenSpecs }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Hover states for desktop dropdowns
  const [softwareDropdown, setSoftwareDropdown] = useState(false);
  const [labsDropdown, setLabsDropdown] = useState(false);

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
    setSoftwareDropdown(false);
    setLabsDropdown(false);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #edf0f3',
          boxShadow: isScrolled
            ? '0 4px 20px rgba(0, 0, 0, 0.06)'
            : '0 2px 10px rgba(0, 0, 0, 0.03)',
          padding: isScrolled ? '10px 28px' : '14px 28px',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Prominent Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <img
              src="/assets/chipinn-logo-transparent.png"
              alt="Chipinn Technologies Ltd"
              style={{
                height: '38px',
                maxHeight: '42px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            className="desktop-nav"
          >
            {/* 1. Our Mission */}
            <button
              onClick={() => scrollTo('mission')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#171a20',
                letterSpacing: '-0.01em',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Our Mission
            </button>

            {/* 2. Unity Meters */}
            <button
              onClick={() => scrollTo('hero')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#171a20',
                letterSpacing: '-0.01em',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Unity Meters
            </button>

            {/* 3. Software (Dropdown on Hover: Base16 and Base12) */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setSoftwareDropdown(true)}
              onMouseLeave={() => setSoftwareDropdown(false)}
            >
              <button
                onClick={() => scrollTo('software')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#171a20',
                  letterSpacing: '-0.01em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: softwareDropdown ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <span>Software</span>
                <ChevronDown size={14} color="#6b7280" />
              </button>

              {/* Hover Dropdown Menu for Software */}
              {softwareDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    width: '360px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0,0,0,0.04)',
                    border: '1px solid #e5e7eb',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    zIndex: 60,
                    animation: 'fadeIn 0.2s ease forwards',
                  }}
                >
                  {/* Base16 */}
                  <div
                    onClick={() => scrollTo('software')}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(124, 58, 237, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <School size={18} color="#7c3aed" />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#171a20' }}>
                        Base16
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4, marginTop: '2px' }}>
                        School Management System · Attendance, fees, exams & parent portals.
                      </div>
                    </div>
                  </div>

                  {/* Base12 */}
                  <div
                    onClick={() => scrollTo('software')}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(27, 90, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <BookOpen size={18} color="#1b5aff" />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#171a20' }}>
                        Base12
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4, marginTop: '2px' }}>
                        Thesis Writing Engine · Purpose-built for 4th-year university seniors.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Labs (Dropdown on Hover: Solar 1TW by 2032 and Biogas 10 Nodes by 2028) */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setLabsDropdown(true)}
              onMouseLeave={() => setLabsDropdown(false)}
            >
              <button
                onClick={() => scrollTo('labs')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#171a20',
                  letterSpacing: '-0.01em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: labsDropdown ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <span>Labs</span>
                <ChevronDown size={14} color="#6b7280" />
              </button>

              {/* Hover Dropdown Menu for Labs */}
              {labsDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    width: '380px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0,0,0,0.04)',
                    border: '1px solid #e5e7eb',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    zIndex: 60,
                    animation: 'fadeIn 0.2s ease forwards',
                  }}
                >
                  {/* Solar Panels Research (1 TW by 2032) */}
                  <div
                    onClick={() => scrollTo('solar-lab')}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(250, 204, 21, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Sun size={18} color="#ca8a04" />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#171a20' }}>
                        Regional Solar Research
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4, marginTop: '2px' }}>
                        Target: <strong>1 Terawatt (1 TW)</strong> clean power by 2032.
                      </div>
                    </div>
                  </div>

                  {/* Biogas Monitoring Layer (10 Nodes by 2028) */}
                  <div
                    onClick={() => scrollTo('biogas-lab')}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Flame size={18} color="#10b981" />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#171a20' }}>
                        Biogas Monitoring Layer
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4, marginTop: '2px' }}>
                        Deploying <strong>10 Active Nodes</strong> by 2028 · Real-time CH4 & pressure.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* GridPulse AMI */}
            <button
              onClick={() => scrollTo('gridpulse')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#171a20',
                letterSpacing: '-0.01em',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              GridPulse™ AMI
            </button>

            {/* Utility Pilot */}
            <button
              onClick={() => onOpenPilotModal('General Pilot')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#1b5aff',
                letterSpacing: '-0.01em',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(27, 90, 255, 0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Utility Pilot
            </button>
          </nav>

          {/* Right Action Icons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <button
              onClick={() => onOpenSpecs('all')}
              title="Help & Specifications"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#171a20',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <HelpCircle size={18} />
            </button>

            <button
              onClick={() => onOpenPilotModal('Enterprise Portal Login')}
              title="Utility & Client Portal"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#171a20',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <User size={16} />
              <span className="hidden-sm">Portal</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#171a20',
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '66px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#ffffff',
            zIndex: 45,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto',
          }}
        >
          <div style={{ paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: '12px' }}>
              Navigation & Products
            </p>
            {[
              { label: 'Our Mission', target: 'mission' },
              { label: 'Unity Meters', target: 'hero' },
              { label: 'Base16 · School Management', target: 'software' },
              { label: 'Base12 · Thesis Engine (4th Years)', target: 'software' },
              { label: 'Solar Research (1 TW by 2032)', target: 'solar-lab' },
              { label: 'Biogas Layer (10 Nodes by 2028)', target: 'biogas-lab' },
              { label: 'GridPulse™ Autonomous AMI', target: 'gridpulse' },
            ].map((link, idx) => (
              <div
                key={idx}
                onClick={() => scrollTo(link.target)}
                style={{
                  padding: '12px 0',
                  fontSize: '15px',
                  fontWeight: 500,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f8fafc',
                }}
              >
                <span>{link.label}</span>
                <ChevronRight size={16} color="#aaa" />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPilotModal('Mobile Pilot Request');
              }}
              className="btn btn-primary"
              style={{ width: '100%', height: '44px' }}
            >
              Order Pilot Deployment Kit
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
          .hidden-sm {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
