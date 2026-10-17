import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const products = [
  {
    id: 'unity-meter',
    category: 'Multi-Tenant Smart Meter',
    name: 'Unity Meter',
    priceText: 'From $58 · Multi-Tenant Splitting & Meter Guard™',
    disclaimer: 'Splits the bill across multiple tenants, independent relay turns off power when credit is out, and Meter Guard protects from over/under voltage.',
    image: '/assets/hero_image.png',
    features: ['Multi-Tenant Bill Splitting', 'Individual Latching Cutoff Relay', 'Meter Guard™ Voltage Protection', 'STS 20-Digit Mobile Prepay'],
  },
  {
    id: 'unity-mini',
    category: 'Compact Sub-Meter',
    name: 'Unity Mini',
    priceText: 'From $34 · Non-Relay Transparent Sub-Metering',
    disclaimer: 'The exact same high-accuracy metrology without the internal cutoff relay, perfect for room sub-metering, private flats, and transparent billing.',
    image: '/assets/unity-mini.jpg',
    features: ['Precision Energy Sub-Metering', 'Non-Relay Streamlined Design', 'Compact Modern Profile', 'Real-Time Tenant Transparency'],
  },
  {
    id: 'unity-pro',
    category: 'Commercial 3-Phase',
    name: 'Unity Pro 3-Phase',
    priceText: 'From $129 · Class 0.2S Revenue Grade',
    disclaimer: 'Class 0.2S Revenue Grade with CT/VT connection, DLMS/COSEM HDLC, and dual optical port.',
    image: '/assets/unity-pro.jpg',
    features: ['3x230/400V 50/60Hz', '4-Quadrant TOU Tariffs', 'NB-IoT / 4G / LoRaWAN', 'Hardware Crypto Engine'],
  },
];

export default function ProductLineupSection({ onOpenSpecs }) {
  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % products.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  // Get current pair of products to display
  const p1 = products[startIndex];
  const p2 = products[(startIndex + 1) % products.length];

  return (
    <section
      id="lineup"
      style={{
        padding: '60px 24px 80px',
        backgroundColor: '#ffffff',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#1b5aff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Flagship Hardware Portfolio
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 600, color: '#171a20', marginTop: '6px' }}>
            Unity Meter Series
          </h2>
        </div>

        {/* Carousel controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handlePrev}
            aria-label="Previous Products"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1px solid #e2e4e8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f4f5f6')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            <ChevronLeft size={20} color="#171a20" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Products"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1px solid #e2e4e8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f4f5f6')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            <ChevronRight size={20} color="#171a20" />
          </button>
        </div>
      </div>

      {/* Grid of 2 Cards (Tesla Screenshot 4 Layout) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
        }}
      >
        {[p1, p2].map((prod, idx) => (
          <div
            key={`${prod.id}-${idx}`}
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              minHeight: '520px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
              backgroundColor: '#0a0d14',
            }}
          >
            {/* Background Image */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
              <img
                src={prod.image}
                alt={prod.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.9)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.85) 100%)',
                }}
              />
            </div>

            {/* Top Text: Category Badge */}
            <div style={{ position: 'relative', zIndex: 10, padding: '32px 32px 0' }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.9)',
                  letterSpacing: '0.04em',
                }}
              >
                {prod.category}
              </div>
            </div>

            {/* Bottom Content: Name, Price, Buttons (Pure Tesla Style) */}
            <div style={{ position: 'relative', zIndex: 10, padding: '0 32px 32px' }}>
              <h3
                style={{
                  fontSize: 'clamp(28px, 3.2vw, 36px)',
                  fontWeight: 600,
                  color: '#ffffff',
                  marginBottom: '4px',
                  letterSpacing: '-0.02em',
                }}
              >
                {prod.name}
              </h3>

              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 400,
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '20px',
                }}
              >
                {prod.priceText}
              </div>

              {/* Action Buttons: Blue and Glass White */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href="https://unitymeters.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    flex: '1 1 140px',
                    height: '40px',
                    fontSize: '14px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                  }}
                >
                  Order Now
                </a>

                <button
                  onClick={() => onOpenSpecs(prod.id)}
                  className="btn btn-glass"
                  style={{
                    flex: '1 1 140px',
                    height: '40px',
                    fontSize: '14px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#171a20',
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
