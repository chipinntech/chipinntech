import React, { useState } from 'react';
import { X, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

export default function PilotModal({ isOpen, onClose, preselectedProduct }) {
  const [model, setModel] = useState(preselectedProduct || 'Unity One');
  const [comms, setComms] = useState('4G LTE + LoRaWAN Dual');
  const [quantity, setQuantity] = useState('20 Units (Standard Evaluation)');
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('United States / Canada (ANSI)');
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const mockTrack = `CHIPINN-PLT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTrackingNumber(mockTrack);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '92vh',
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #eef0f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fafbfc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#1b5aff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={18} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#171a20', margin: 0 }}>
                Schedule Utility Pilot & Deployment Kit
              </h3>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                Chipinn Technologies Ltd — Revenue Assurance Hardware
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#5c5e62',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <CheckCircle2 size={36} color="#10b981" />
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#171a20', marginBottom: '8px' }}>
                Pilot Kit Order Confirmed
              </h3>
              <p style={{ fontSize: '14.5px', color: '#5c5e62', maxWidth: '440px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                Your pilot evaluation request has been processed. A Chipinn Field Application Engineer will reach out within 2 hours to confirm your cellular eSIM carrier provisioning.
              </p>

              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  maxWidth: '380px',
                  margin: '0 auto 28px',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>
                  Pilot Evaluation Reference
                </div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: '#1b5aff', marginTop: '2px' }}>
                  {trackingNumber}
                </div>
                <div style={{ fontSize: '13px', color: '#334155', marginTop: '6px' }}>
                  Hardware: <strong>{model}</strong> ({quantity})
                </div>
                <div style={{ fontSize: '13px', color: '#334155' }}>
                  Comms: <strong>{comms}</strong>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="btn btn-primary"
                style={{ height: '42px', padding: '0 28px' }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Product selector */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Select Unity Meter Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="Unity One (Single-Phase STS Prepay)">Unity One (Single-Phase STS Prepayment & 100A Relay)</option>
                  <option value="Unity Pro 3-Phase (Class 0.2S Revenue Grade)">Unity Pro 3-Phase (Class 0.2S High-Voltage Substation)</option>
                  <option value="Unity Microgrid Pro (Solar Net-Metering)">Unity Microgrid Pro (Bi-directional Solar Net-Metering)</option>
                  <option value="Complete Utility Fleet Evaluation Kit (5 Units Each)">Complete Fleet Evaluation Bundle (All Models + Optical Probe)</option>
                </select>
              </div>

              {/* Comms & Quantity Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Telemetry Architecture
                  </label>
                  <select
                    value={comms}
                    onChange={(e) => setComms(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <option value="4G LTE + LoRaWAN Dual">4G LTE Cat-1 + LoRaWAN Dual</option>
                    <option value="NB-IoT Cellular Only">NB-IoT / Cat-M1 Low Power Cellular</option>
                    <option value="LoRaWAN 868 / 915 MHz Mesh">LoRaWAN Long-Range Mesh</option>
                    <option value="RS485 Modbus + Optical Probe">RS-485 Modbus Industrial</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Evaluation Batch Size
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <option value="5 Units (Benchtop Test)">5 Units (Lab & Benchtop Verification)</option>
                    <option value="20 Units (Standard Evaluation)">20 Units (Field Feeder Pilot)</option>
                    <option value="50 Units (Substation Pilot)">50 Units (District Feeder Deployment)</option>
                    <option value="500+ Units (Commercial Tender)">500+ Units (Commercial Grid RFP Tender)</option>
                  </select>
                </div>
              </div>

              {/* Contact Details */}
              <div style={{ borderTop: '1px solid #f1f2f4', paddingTop: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Lead Engineer / Contact Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Arthur Vance"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Corporate Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="vance@utilitypower.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Utility or Organization Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Metro Grid Energy Ltd"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Region / Grid Standards
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <option value="International (IEC 62053 / 230V 50Hz)">International (IEC 62053 / 230V 50Hz)</option>
                      <option value="Americas (ANSI C12.20 / 120-240V 60Hz)">Americas (ANSI C12.20 / 120-240V 60Hz)</option>
                      <option value="Africa & Asia (STS Prepaid / 220-240V 50Hz)">Africa & Asia (STS Prepaid / 220-240V 50Hz)</option>
                      <option value="Europe / UK (MID Approved / 230-400V 50Hz)">Europe / UK (MID Approved / 230-400V 50Hz)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div style={{ marginTop: '10px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    height: '46px',
                    fontSize: '15px',
                    borderRadius: '8px',
                  }}
                >
                  Confirm Pilot Dispatch Order <ArrowRight size={16} />
                </button>
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '10px' }}>
                  Includes 12 months access to Chipinn GridOS Cloud Head-End System. Or email our procurement team directly at{' '}
                  <a href="mailto:hello@chipinn.com" style={{ color: '#1b5aff', fontWeight: 600, textDecoration: 'none' }}>
                    hello@chipinn.com
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
