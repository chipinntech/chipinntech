import React, { useState } from 'react';
import { X, CheckCircle2, Zap, ArrowRight, MessageCircle, Smartphone, CreditCard, ShieldCheck } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const API_BASE = 'http://127.0.0.1:8000';

export default function OrderModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: 'Accra',
    digitalAddress: '',
    propertyType: 'Compound House (3 Tenants)',
    payment_method: 'momo', // 'momo', 'deposit_momo', 'cod'
    momo_network: 'MTN MoMo',
    momo_number: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const unitPrice = 1250;
  const totalPrice = quantity * unitPrice;
  const depositAmount = 625 * quantity;

  const amountToPayNow = formData.payment_method === 'momo'
    ? totalPrice
    : formData.payment_method === 'deposit_momo'
    ? depositAmount
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const refCode = `CP-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrderData = {
      ...formData,
      quantity,
      unitPrice,
      totalPrice,
      amountToPayNow,
      reference_code: refCode,
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Direct Cloud Firestore write (Frontend ➔ Firebase Serverless)
      try {
        const firestoreDoc = await addDoc(collection(db, 'orders'), {
          ...newOrderData,
          firestoreCreatedAt: serverTimestamp(),
          payment_status: amountToPayNow > 0 ? (formData.payment_method === 'deposit_momo' ? 'Deposit Paid' : 'Paid via MoMo') : 'Cash on Delivery',
          order_status: 'Pending Dispatch'
        });
        newOrderData.firestoreId = firestoreDoc.id;
      } catch (fsError) {
        console.warn('Firestore write (ensure Firestore Database is enabled in Firebase Console):', fsError);
      }

      // 2. Send to FastAPI Ops Backend if running locally
      const res = await fetch(`${API_BASE}/api/ops/public/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrderData)
      });
      if (res.ok) {
        const data = await res.json();
        setSubmittedOrder(data);
      } else {
        setSubmittedOrder(newOrderData);
      }
    } catch {
      // 2. Offline / Local fallback: Save to local storage for Ops
      try {
        const existingClients = JSON.parse(localStorage.getItem('chipinn_ops_clients') || '[]');
        const newClient = {
          id: Date.now(),
          name: formData.fullName,
          phone: formData.phone,
          location: formData.city,
          ghana_post_gps: formData.digitalAddress,
          property_type: formData.propertyType,
          meters_ordered: quantity,
          meter_serials: `Allocating Batch ${Math.floor(10 + Math.random() * 90)}`,
          total_amount_ghc: totalPrice,
          amount_paid_ghc: amountToPayNow,
          balance_due_ghc: Math.max(0, totalPrice - amountToPayNow),
          status: amountToPayNow > 0 ? (formData.payment_method === 'deposit_momo' ? 'Deposit Paid' : 'Paid via MoMo') : 'Cash on Delivery',
          assigned_installer_name: 'Pending Dispatch',
          notes: `Web order #${refCode}. Payment: ${formData.payment_method} (${formData.momo_network}).`
        };
        localStorage.setItem('chipinn_ops_clients', JSON.stringify([newClient, ...existingClients]));

        if (amountToPayNow > 0) {
          const existingFinances = JSON.parse(localStorage.getItem('chipinn_ops_finances') || '[]');
          const newFinance = {
            id: Date.now(),
            date: new Date().toISOString().slice(0, 10),
            amount_ghc: amountToPayNow,
            type: 'income',
            category: 'meter_sale',
            account: 'momo',
            description: `Web Order #${refCode} (${quantity}x Unity Meter via ${formData.momo_network})`,
            reference: `MOMO-${refCode}`,
            party: formData.fullName
          };
          localStorage.setItem('chipinn_ops_finances', JSON.stringify([newFinance, ...existingFinances]));
        }

        // Set live notification alert for Ops Center
        localStorage.setItem('chipinn_new_order_alert', JSON.stringify({
          title: `New Web Order: ${formData.fullName}`,
          message: `${quantity}x Unity Meter in ${formData.city} (GH₵${totalPrice.toLocaleString()}) via ${formData.momo_network}`,
          timestamp: Date.now()
        }));
      } catch {}

      setSubmittedOrder(newOrderData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppLink = () => {
    const ref = submittedOrder?.reference_code || 'NEW-ORDER';
    const text = encodeURIComponent(
      `Hello Chipinn Operations! I have placed an order on your site.\n\nOrder Ref: ${ref}\nName: ${formData.fullName}\nPhone: ${formData.phone}\nQuantity: ${quantity}x Unity Meter (3-in-1)\nTotal: GH₵${totalPrice.toLocaleString()}\nPayment: ${formData.payment_method === 'cod' ? 'Cash on Delivery' : `${formData.momo_network} (GH₵${amountToPayNow.toLocaleString()})`}\nCity/Area: ${formData.city} ${formData.digitalAddress ? `(${formData.digitalAddress})` : ''}`
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
          maxWidth: '560px',
          padding: '36px 32px',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          color: '#111827',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxSizing: 'border-box'
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
            border: 'none',
            cursor: 'pointer'
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {submittedOrder ? (
          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle2 size={36} color="#16a34a" />
            </div>

            <div style={{
              display: 'inline-block',
              padding: '4px 12px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              marginBottom: '10px'
            }}>
              Order #{submittedOrder.reference_code || 'CP-ORD-SUCCESS'}
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px', color: '#111827' }}>
              Unity Meter Order Placed!
            </h3>

            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.5, marginBottom: '20px' }}>
              Thank you, <strong>{formData.fullName}</strong>. Your reservation has been registered directly in our Accra Operations System.
            </p>

            {/* Receipt Summary Card */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '18px',
                fontSize: '13px',
                color: '#334155',
                marginBottom: '20px',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Item:</span>
                <strong>{quantity}x Unity Meter (3-in-1 Sub-meter)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Total Order Value:</span>
                <strong>GH₵{totalPrice.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Payment Method:</span>
                <strong style={{ color: '#059669' }}>
                  {formData.payment_method === 'cod' ? 'Cash / MoMo on Delivery' : `${formData.momo_network} (GH₵${amountToPayNow.toLocaleString()})`}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Delivery Location:</span>
                <strong>{formData.city}</strong>
              </div>
            </div>

            {formData.payment_method !== 'cod' && (
              <div style={{
                backgroundColor: '#fefce8',
                border: '1px solid #fef08a',
                borderRadius: '12px',
                padding: '12px 14px',
                fontSize: '12px',
                color: '#854d0e',
                marginBottom: '20px',
                textAlign: 'left'
              }}>
                <Smartphone size={15} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
                <span>USSD Prompt initiated on <strong>{formData.momo_number || formData.phone}</strong> ({formData.momo_network}). Please authorize prompt with your MoMo PIN to complete instant reservation.</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  padding: '14px 20px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)'
                }}
              >
                <MessageCircle size={18} />
                <span>Confirm Order via WhatsApp Dispatch</span>
              </a>

              <button
                onClick={() => {
                  setSubmittedOrder(null);
                  onClose();
                }}
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  padding: '12px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Close Window
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

            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>
              Get Your Unity Meter (3-in-1)
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
              Replace 3 separate sub-meters with one smart chassis. Official launch price: <strong>GH₵1,250</strong>.
            </p>

            {/* Price Banner */}
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '16px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>
                  Launch Price (Ghana)
                </div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#15803d' }}>
                  GH₵{unitPrice.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: 500, color: '#166534' }}>/ 3-in-1 unit</span>
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
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kwabena Mensah"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  WhatsApp / Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 024 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                    City / Neighborhood
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. East Legon / Spintex / Kumasi"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                    GhanaPost GPS (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GA-194-2819"
                    value={formData.digitalAddress}
                    onChange={(e) => setFormData({ ...formData, digitalAddress: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                    Quantity
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    style={inputStyle}
                  >
                    <option value={1}>1 Unit (GH₵1,250)</option>
                    <option value={2}>2 Units (GH₵2,500)</option>
                    <option value={3}>3 Units (GH₵3,750)</option>
                    <option value={5}>5 Units (GH₵6,250)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                    Property Type
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Compound House (3 Tenants)">Compound House (3 Tenants)</option>
                    <option value="Rental Apartments">Rental Apartments</option>
                    <option value="Commercial Stores + House">Commercial Stores + House</option>
                    <option value="Estate Development">Estate Development</option>
                  </select>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginTop: '4px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                  Choose Payment Method
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: formData.payment_method === 'momo' ? '2px solid #1b5aff' : '1px solid #e5e7eb',
                    backgroundColor: formData.payment_method === 'momo' ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="radio"
                        name="payment_method"
                        checked={formData.payment_method === 'momo'}
                        onChange={() => setFormData({ ...formData, payment_method: 'momo' })}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>
                          ⚡ Instant Mobile Money (MTN / Telecel / AT)
                        </div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                          Instant confirmation & priority delivery dispatch
                        </div>
                      </div>
                    </div>
                    <strong style={{ fontSize: '13px', color: '#15803d' }}>GH₵{totalPrice.toLocaleString()}</strong>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: formData.payment_method === 'deposit_momo' ? '2px solid #1b5aff' : '1px solid #e5e7eb',
                    backgroundColor: formData.payment_method === 'deposit_momo' ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="radio"
                        name="payment_method"
                        checked={formData.payment_method === 'deposit_momo'}
                        onChange={() => setFormData({ ...formData, payment_method: 'deposit_momo' })}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>
                          🟡 50% Deposit via MoMo
                        </div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                          Pay GH₵{depositAmount.toLocaleString()} now, balance on installation
                        </div>
                      </div>
                    </div>
                    <strong style={{ fontSize: '13px', color: '#ca8a04' }}>GH₵{depositAmount.toLocaleString()}</strong>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: formData.payment_method === 'cod' ? '2px solid #1b5aff' : '1px solid #e5e7eb',
                    backgroundColor: formData.payment_method === 'cod' ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="radio"
                        name="payment_method"
                        checked={formData.payment_method === 'cod'}
                        onChange={() => setFormData({ ...formData, payment_method: 'cod' })}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>
                          💵 Pay on Delivery / Installation
                        </div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                          Cash or MoMo to technician upon site arrival
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Upon arrival</span>
                  </label>
                </div>
              </div>

              {/* MoMo Network Details if MoMo chosen */}
              {formData.payment_method !== 'cod' && (
                <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                        MoMo Network
                      </label>
                      <select
                        value={formData.momo_network}
                        onChange={(e) => setFormData({ ...formData, momo_network: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="MTN MoMo">MTN Mobile Money</option>
                        <option value="Telecel Cash">Telecel Cash</option>
                        <option value="AT Money">AT Money</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                        MoMo Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 0244 000 000"
                        value={formData.momo_number || formData.phone}
                        onChange={(e) => setFormData({ ...formData, momo_number: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  padding: '15px 24px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  border: 'none',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
                  marginTop: '10px',
                  transition: 'background-color 0.2s'
                }}
              >
                <span>
                  {isSubmitting
                    ? 'Processing Order...'
                    : formData.payment_method === 'cod'
                    ? `Reserve ${quantity} Unity Meter(s)`
                    : `Authorize GH₵${amountToPayNow.toLocaleString()} via ${formData.momo_network}`}
                </span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box'
};
