import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 'unity-meter',
    title: 'Unity Meter',
    subtitle: 'From $58 · Multi-Tenant Smart Metering',
    image: '/assets/unity-meter-widescreen.jpg',
    primaryCta: 'Order Now',
    secondaryCta: 'Learn More',
  },
  {
    id: 'meter-guard',
    title: 'Meter Guard™',
    subtitle: 'Integrated Over & Under-Voltage Protection',
    image: '/assets/unity-meter-guard.jpg',
    primaryCta: 'Order Now',
    secondaryCta: 'Learn More',
  },
  {
    id: 'unity-mini',
    title: 'Unity Mini',
    subtitle: 'From $34 · Compact Sub-Metering (Non-Relay)',
    image: '/assets/unity-mini.jpg',
    primaryCta: 'Order Now',
    secondaryCta: 'Learn More',
  },
  {
    id: 'tenant-split',
    title: 'Multi-Tenant Splitting',
    subtitle: 'Independent Tenant Relays & Prepay Billing',
    image: '/assets/unity-tenant-split.jpg',
    primaryCta: 'Order Now',
    secondaryCta: 'Learn More',
  },
];

export default function HeroSection({ onOpenSpecs }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % slides.length);
  };

  const current = slides[currentIdx];

  return (
    <section
      id="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '680px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: '86px',
        paddingBottom: '40px',
        backgroundColor: '#0a0c10',
      }}
    >
      {/* Background Images Carousel */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: index === currentIdx ? 1 : 0,
            transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: index === currentIdx ? 'scale(1)' : 'scale(1.03)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
            }}
          />
          {/* Subtle Tesla Top & Bottom Contrast Vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 18%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.65) 100%)',
            }}
          />
        </div>
      ))}

      {/* Top Header: Pure Tesla Minimalist Title & Subtitle */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '20px 24px 0',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(34px, 4.5vw, 50px)',
            fontWeight: 600,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            margin: '0 0 6px 0',
            textShadow: '0 2px 14px rgba(0,0,0,0.45)',
          }}
        >
          {current.title}
        </h1>

        <p
          style={{
            fontSize: 'clamp(15px, 1.6vw, 18px)',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.92)',
            textShadow: '0 1px 8px rgba(0,0,0,0.5)',
            margin: 0,
          }}
        >
          {current.subtitle}
        </p>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        style={{
          position: 'absolute',
          left: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 15,
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.18)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
        }}
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        style={{
          position: 'absolute',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 15,
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.18)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
        }}
      >
        <ChevronRight size={22} />
      </button>

      {/* Bottom Action Area: Tesla Dual Buttons + Dots */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '560px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px',
          padding: '0 24px',
        }}
      >
        {/* Dual Buttons (Order Now & Learn More) */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            width: '100%',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="https://unitymeters.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              flex: '1 1 200px',
              maxWidth: '240px',
              height: '42px',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
            }}
          >
            {current.primaryCta}
          </a>

          <button
            onClick={() => onOpenSpecs(current.id)}
            className="btn btn-glass"
            style={{
              flex: '1 1 200px',
              maxWidth: '240px',
              height: '42px',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.88)',
              color: '#171a20',
            }}
          >
            {current.secondaryCta}
          </button>
        </div>

        {/* Carousel Dots */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {slides.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentIdx(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              style={{
                width: dotIdx === currentIdx ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: dotIdx === currentIdx ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                transition: 'all 0.3s ease',
                padding: 0,
                border: 'none',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
