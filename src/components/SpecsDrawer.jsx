import React from 'react';
import { X, Download } from 'lucide-react';

const specsData = [
  {
    category: 'Electrical & Metrology',
    items: [
      { spec: 'Accuracy Class', one: 'Class 1.0 (Active) / Class 0.5S (Optional)', pro: 'Class 0.2S (Revenue Grade)', solar: 'Class 0.5S (4-Quadrant)' },
      { spec: 'Rated Voltage', one: '220V / 230V / 240V AC (±20%)', pro: '3×230/400V (3P4W) or 3×110V (3P3W)', solar: '230V / 400V Bi-directional' },
      { spec: 'Current Rating', one: '5(80)A Direct Connection', pro: '1.5(6)A CT / 5(100)A Direct', solar: '5(100)A Direct / CT' },
      { spec: 'Rated Frequency', one: '50Hz / 60Hz auto-detect', pro: '50Hz / 60Hz auto-detect', solar: '50Hz / 60Hz auto-detect' },
      { spec: 'Starting Current', one: '0.004 Ib (approx 20mA)', pro: '0.001 In (sub-milliamp)', solar: '0.002 Ib' },
      { spec: 'Power Consumption', one: '< 1.5W / 8VA in voltage circuit', pro: '< 1.2W / 6VA per phase', solar: '< 2.0W / 10VA' },
    ],
  },
  {
    category: 'Anti-Tamper & Security',
    items: [
      { spec: 'Magnetic Field Defense', one: '> 450mT 3-Axis Hall Sensor', pro: '> 500mT Shielded Core', solar: '> 450mT 3-Axis Shield' },
      { spec: 'Enclosure Break Detection', one: 'Optical microswitch + tamper pin', pro: 'Dual optical microswitch (Terminal + Main)', solar: 'Optical break detector' },
      { spec: 'Zero Neutral Bypass', one: 'Active reverse flow compensation', pro: '4-Quadrant vector sum check', solar: 'Bi-directional vector register' },
      { spec: 'Disconnect Relay', one: '100A UC3 compliant latching relay', pro: 'External circuit breaker trip shunt', solar: '100A Solar feed-in relay' },
      { spec: 'Relay Trip Time', one: '< 12 ms on critical breach', pro: '< 8 ms relay signal', solar: '< 15 ms' },
      { spec: 'Hardware Cryptochip', one: 'AES-128 Hardware STS / DLMS', pro: 'Dual AES-256 HSM Cryptochip', solar: 'AES-128 Hardware' },
    ],
  },
  {
    category: 'Communications & Protocols',
    items: [
      { spec: 'Cellular WAN', one: '4G LTE-M / NB-IoT eSIM', pro: '4G LTE Cat-1 + Dual SIM / eSIM', solar: '4G LTE Cat-1 eSIM' },
      { spec: 'RF & Mesh Options', one: 'LoRaWAN 868/915 MHz or Zigbee', pro: 'Modular plug-in LoRaWAN / Wi-SUN', solar: 'Wi-Fi 6 + LoRaWAN' },
      { spec: 'Local Optical Port', one: 'IEC 62056-21 FLAG magnetic', pro: 'IEC 62056-21 high speed 19200bps', solar: 'IEC 62056-21 Optical' },
      { spec: 'Wired Industrial Port', one: 'RS-485 Modbus RTU', pro: 'Dual Galvanic Isolated RS-485', solar: 'RS-485 Modbus SunSpec' },
      { spec: 'Firmware Upgrades', one: 'Secure OTA Diff FOTA', pro: 'Dual-Bank Fail-Safe OTA', solar: 'Secure OTA FOTA' },
    ],
  },
  {
    category: 'International Standards & Certifications',
    items: [
      { spec: 'IEC Metrology', one: 'IEC 62052-11, IEC 62053-21', pro: 'IEC 62052-11, IEC 62053-22 (0.2S)', solar: 'IEC 62053-22, IEC 62053-23' },
      { spec: 'Prepayment Standard', one: 'STS IEC 62055-41, IEC 62055-51', pro: 'STS Compliant + Multi-Tariff TOU', solar: 'Bi-directional Net-Metering' },
      { spec: 'Ingress Protection', one: 'IP54 (Outdoor UV Polycarbonate)', pro: 'IP54 / IP65 Substation Shroud', solar: 'IP54 Enclosure' },
      { spec: 'Operating Temp', one: '-25°C to +70°C', pro: '-40°C to +85°C Industrial', solar: '-30°C to +75°C' },
    ],
  },
];

export default function SpecsDrawer({ isOpen, onClose, onOpenPilot }) {
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
          maxWidth: '960px',
          height: '85vh',
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
            padding: '20px 28px',
            borderBottom: '1px solid #eef0f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fafbfc',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#1b5aff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Engineering Datasheet
              </span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#171a20', margin: '2px 0 0' }}>
              Unity Meter Technical Specifications Matrix
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => {
                alert('Downloading Unity_Meters_Full_Engineering_Datasheet_2026.pdf...');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#171a20',
                border: '1px solid #d1d5db',
                backgroundColor: '#ffffff',
              }}
            >
              <Download size={14} /> PDF Datasheet
            </button>

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
        </div>

        {/* Column Headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
            padding: '14px 28px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            fontWeight: 600,
            fontSize: '13px',
            color: '#334155',
          }}
        >
          <div>Specification Metric</div>
          <div style={{ color: '#1b5aff' }}>Unity One (Single-Phase)</div>
          <div style={{ color: '#0f172a' }}>Unity Pro (3-Phase 0.2S)</div>
          <div style={{ color: '#059669' }}>Unity Microgrid (Solar)</div>
        </div>

        {/* Scrollable specs table */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px 24px' }}>
          {specsData.map((cat, cIdx) => (
            <div key={cIdx} style={{ marginTop: '24px' }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#64748b',
                  marginBottom: '10px',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '4px',
                }}
              >
                {cat.category}
              </div>

              {cat.items.map((row, rIdx) => (
                <div
                  key={rIdx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
                    padding: '10px 0',
                    borderBottom: '1px solid #f1f5f9',
                    fontSize: '13px',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ fontWeight: 500, color: '#1e293b' }}>{row.spec}</div>
                  <div style={{ color: '#475569' }}>{row.one}</div>
                  <div style={{ color: '#475569' }}>{row.pro}</div>
                  <div style={{ color: '#475569' }}>{row.solar}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer in Drawer */}
        <div
          style={{
            padding: '16px 28px',
            borderTop: '1px solid #eef0f2',
            backgroundColor: '#fafbfc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Full conformance testing reports (KEMA / DLMS UA) available upon NDA execution.
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenPilot('Evaluation Matrix');
            }}
            className="btn btn-primary"
            style={{ height: '38px', fontSize: '13px' }}
          >
            Order Pilot Evaluation Kit
          </button>
        </div>
      </div>
    </div>
  );
}
