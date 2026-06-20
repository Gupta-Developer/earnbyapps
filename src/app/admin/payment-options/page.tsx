"use client";

import React, { useState, useEffect } from 'react';

const INITIAL_SETTINGS = {
  upiEnabled: true,
  payPalEnabled: true,
  stripeEnabled: false,
  cryptoEnabled: false,
  minWithdrawal: 50
};

export default function PaymentOptionsPage() {
  const [paymentSettings, setPaymentSettings] = useState(INITIAL_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem('eb_admin_payment_settings');
    if (saved) {
      setPaymentSettings(JSON.parse(saved));
    }
  }, []);

  const updateSetting = (key: keyof typeof INITIAL_SETTINGS, val: boolean | number) => {
    const updated = { ...paymentSettings, [key]: val };
    setPaymentSettings(updated);
    localStorage.setItem('eb_admin_payment_settings', JSON.stringify(updated));
  };

  return (
    <div className="admin-content-card">
      <div className="card-header-section">
        <h2 className="card-heading">Gateway Provider Switcher</h2>
        <p className="card-subheading">Control active transaction options available for earners requesting withdrawals.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <div>
              <strong style={{ display: 'block' }}>UPI Gateway (Direct Transfer)</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Highly popular for instant withdrawals in India.</span>
            </div>
            <button
              onClick={() => updateSetting('upiEnabled', !paymentSettings.upiEnabled)}
              style={{
                padding: '6px 16px',
                borderRadius: '4px',
                background: paymentSettings.upiEnabled ? 'var(--accent-emerald)' : 'rgba(239,68,68,0.1)',
                color: paymentSettings.upiEnabled ? 'black' : '#ef4444',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {paymentSettings.upiEnabled ? 'ACTIVE' : 'DISABLED'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <div>
              <strong style={{ display: 'block' }}>PayPal Gateway</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Used for international currency disbursements.</span>
            </div>
            <button
              onClick={() => updateSetting('payPalEnabled', !paymentSettings.payPalEnabled)}
              style={{
                padding: '6px 16px',
                borderRadius: '4px',
                background: paymentSettings.payPalEnabled ? 'var(--accent-emerald)' : 'rgba(239,68,68,0.1)',
                color: paymentSettings.payPalEnabled ? 'black' : '#ef4444',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {paymentSettings.payPalEnabled ? 'ACTIVE' : 'DISABLED'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <div>
              <strong style={{ display: 'block' }}>Stripe (Direct Bank Account Wire)</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Direct wire transfers for registered partners.</span>
            </div>
            <button
              onClick={() => updateSetting('stripeEnabled', !paymentSettings.stripeEnabled)}
              style={{
                padding: '6px 16px',
                borderRadius: '4px',
                background: paymentSettings.stripeEnabled ? 'var(--accent-emerald)' : 'rgba(239,68,68,0.1)',
                color: paymentSettings.stripeEnabled ? 'black' : '#ef4444',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {paymentSettings.stripeEnabled ? 'ACTIVE' : 'DISABLED'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <div>
              <strong style={{ display: 'block' }}>Cryptocurrency Payments</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Disburse earnings via USDT or USDC tokens.</span>
            </div>
            <button
              onClick={() => updateSetting('cryptoEnabled', !paymentSettings.cryptoEnabled)}
              style={{
                padding: '6px 16px',
                borderRadius: '4px',
                background: paymentSettings.cryptoEnabled ? 'var(--accent-emerald)' : 'rgba(239,68,68,0.1)',
                color: paymentSettings.cryptoEnabled ? 'black' : '#ef4444',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {paymentSettings.cryptoEnabled ? 'ACTIVE' : 'DISABLED'}
            </button>
          </div>

        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Minimum Withdrawal Threshold (₹ INR)</label>
          <input 
            type="number"
            value={paymentSettings.minWithdrawal}
            onChange={(e) => updateSetting('minWithdrawal', parseInt(e.target.value) || 0)}
            style={{ padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', width: '100px' }}
          />
        </div>
      </div>
    </div>
  );
}
