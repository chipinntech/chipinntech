import React, { useState } from 'react';
import { X, CheckCircle2, Zap, ArrowRight, MessageCircle } from 'lucide-react';

export default function OrderModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: 'Accra',
    propertyType: 'Compound House',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const unitPrice = 1250;
  const totalPrice = quantity * unitPrice;
  const savings = quantity * 4750;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const getWhatsAppLink = () => {
    const text = encodeURIComponent(
      `Hello Chipinn Technologies! I want to order ${quantity}x Unity Meter (3-in-1) for GH₵${totalPrice.toLocaleString()}.\n\nName: ${formData.fullName || 'Customer'}\nPhone: ${formData.phone || 'N/A'}\nCity: ${formData.city}\nProperty: ${formData.propertyType}`
    );
    return `https://wa.me/233502560760?text=${text}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 7, 13, 0.75)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '540px',
          padding: '36px 32px',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          color: '#111827',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '8px',
            color: '#6b7280',
            borderRadius: '50%',
            backgroundColor: '#f3f4f6',
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 8px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <CheckCircle2 size={36} color="#16a34a" />
            </div>

            <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '10px', color: '#111827' }}>
              Order Request Received!
            </h3>

            <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.6, marginBottom: '24px' }}>
              Thank you, <strong>{formData.fullName || 'Customer'}</strong>. Our team in Accra will contact you via WhatsApp or phone (<strong>{formData.phone}</strong>) within 24 hours to confirm delivery and installation details.
            </p>

            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                color: '#334155',
                marginBottom: '24px',
                textAlign: 'left',
              }}
            >
              <div><strong>Item:</strong> {quantity}x Unity Meter (3-in-1 Sub-meter)</div>
              <div><strong>Total Price:</strong> GH₵{totalPrice.toLocaleString()}</div>
              <div><strong>Location:</strong> {formData.city}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                }}
              >
                <MessageCircle size={18} />
                <span>Confirm Instantly via WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  padding: '12px 28px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '14px',
                  width: '100%',
                }}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Zap size={18} color="#1b5aff" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#1b5aff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Direct Order & Reservation
              </span>
            </div>

            <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
              Get Your Unity Meter (3-in-1)
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '22px' }}>
              Deliveries active across Accra, Tema, Kumasi, Takoradi, and nationwide.
            </p>

            {/* Price Box */}
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '22px',
              }}
            >
              <div>
                <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>
                  Special Launch Price:
                </div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#15803d' }}>
                  GH₵{unitPrice.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: 500, color: '#166534' }}>/ 3-in-1 unit</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#166534' }}>
                <span style={{ textDecoration: 'line-through', color: '#991b1b' }}>GH₵6,000</span>
                <div style={{ fontWeight: 700, color: '#15803d' }}>Save GH₵4,750</div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kwame Mensah"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  WhatsApp / Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 024 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                    Delivery City
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <option value="Accra">Greater Accra</option>
                    <option value="Tema">Tema</option>
                    <option value="Kumasi">Kumasi</option>
                    <option value="Takoradi">Takoradi</option>
                    <option value="Cape Coast">Cape Coast</option>
                    <option value="Sunyani">Sunyani</option>
                    <option value="Tamale">Tamale</option>
                    <option value="Other">Other (Nationwide Delivery)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                    Quantity (3-in-1 units)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{
                        padding: '10px 14px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 700,
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '16px', fontWeight: 700, flex: 1, textAlign: 'center' }}>
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      style={{
                        padding: '10px 14px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 700,
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  Property Type
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="Compound House">Compound House (Multiple Tenants)</option>
                  <option value="Apartment Block">Apartment Block / Rental Units</option>
                  <option value="Landlord">Landlord / Property Owner</option>
                  <option value="Tenant">Tenant Requesting Split-meter</option>
                  <option value="Commercial">Commercial / Shops</option>
                </select>
              </div>

              {/* Summary line */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderTop: '1px solid #e5e7eb',
                  marginTop: '8px',
                }}
              >
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Total (Pay upon delivery/setup):</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>
                  GH₵{totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: '#1b5aff',
                  color: '#ffffff',
                  padding: '14px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  boxShadow: '0 4px 14px rgba(27, 90, 255, 0.35)',
                }}
              >
                Confirm Order / Reservation
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
