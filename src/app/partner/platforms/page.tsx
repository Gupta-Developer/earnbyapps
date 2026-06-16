"use client";

import React, { useState } from 'react';

export default function PartnerPlatforms() {
  const [targeting, setTargeting] = useState({
    ios: true,
    android: true,
    web: false
  });

  return (
    <div className="partner-content-card">
      <div className="card-header-section">
        <h2 className="card-heading">Platform Targeting Rules</h2>
        <p className="card-subheading">Manage active device channels and monitor traffic click volumes across platforms.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', marginTop: '20px' }}>
        
        {/* Metrics Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '16px', fontWeight: 700 }}>Conversion Rates by Device</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span>Android OS</span>
                  <strong>62% (1,519 conversions)</strong>
                </div>
                <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '62%', height: '100%', background: 'var(--accent-indigo)' }}></div>
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span>iOS Devices</span>
                  <strong>33% (808 conversions)</strong>
                </div>
                <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '33%', height: '100%', background: 'var(--accent-indigo)' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span>Web Browsers</span>
                  <strong>5% (123 conversions)</strong>
                </div>
                <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '5%', height: '100%', background: 'var(--text-muted)' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="placeholder-chart-block" style={{ padding: '40px' }}>
            <span>📊</span>
            <p>Hourly conversion distribution chart syncing from verification server logs.</p>
          </div>
        </div>

        {/* Configuration Toggles */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Quick Targeting Configuration</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>Enable or disable target options to automatically filter traffic.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>iOS App Traffic</span>
              <button 
                onClick={() => setTargeting(prev => ({ ...prev, ios: !prev.ios }))}
                style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  background: targeting.ios ? 'var(--accent-emerald)' : 'rgba(239, 68, 68, 0.1)',
                  color: targeting.ios ? 'black' : '#ef4444'
                }}
              >
                {targeting.ios ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Android OS Traffic</span>
              <button 
                onClick={() => setTargeting(prev => ({ ...prev, android: !prev.android }))}
                style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  background: targeting.android ? 'var(--accent-emerald)' : 'rgba(239, 68, 68, 0.1)',
                  color: targeting.android ? 'black' : '#ef4444'
                }}
              >
                {targeting.android ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Web Redirects</span>
              <button 
                onClick={() => setTargeting(prev => ({ ...prev, web: !prev.web }))}
                style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  background: targeting.web ? 'var(--accent-emerald)' : 'rgba(239, 68, 68, 0.1)',
                  color: targeting.web ? 'black' : '#ef4444'
                }}
              >
                {targeting.web ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>
          
          <button onClick={() => alert('Platform targeting guidelines saved.')} className="glow-btn-cyan" style={{ width: '100%', marginTop: '12px', padding: '10px' }}>
            Save Settings
          </button>
        </div>

      </div>

      <style>{`
        .partner-content-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 32px;
          box-shadow: var(--shadow-md);
        }
        .card-header-section {
          margin-bottom: 24px;
        }
        .card-heading {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }
        .card-subheading {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .placeholder-chart-block {
          background: rgba(255,255,255,0.01);
          border: 1px dashed var(--border-color);
          border-radius: 8px;
          text-align: center;
          color: var(--text-secondary);
        }
        .placeholder-chart-block span {
          font-size: 2rem;
          display: block;
          margin-bottom: 8px;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
