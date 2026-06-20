"use client";

import React from 'react';

export default function ReferralsPage() {
  const handleSave = () => {
    alert('Referral rules updated successfully!');
  };

  return (
    <div className="admin-content-card">
      <div className="card-header-section">
        <h2 className="card-heading">Referral System Parameters</h2>
        <p className="card-subheading">Configure bonus rates and commission scales for users inviting their friends.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Sign-up Referral Reward (₹ INR)</label>
            <input 
              type="number" 
              defaultValue="10" 
              style={{ padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', width: '100%' }}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Granted immediately to referrer when referee completes their first task.</span>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Lifetime Commission Fee (%)</label>
            <input 
              type="number" 
              defaultValue="5" 
              style={{ padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', width: '100%' }}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Commission cut paid on all lifetime earner task points.</span>
          </div>
        </div>

        <button onClick={handleSave} className="glow-btn-cyan" style={{ padding: '12px' }}>
          Save Rules Config
        </button>
      </div>
    </div>
  );
}
