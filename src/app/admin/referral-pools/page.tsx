"use client";

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

export default function AdminReferralPools() {
  const { apps, addReferralSlotToCampaign, removeReferralSlot } = useApp();
  
  const [selectedAppId, setSelectedAppId] = useState<string>(apps[0]?.id || '');
  const [userEmail, setUserEmail] = useState('');
  const [referralUrl, setReferralUrl] = useState('');
  const [limit, setLimit] = useState<number>(5);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const selectedApp = apps.find(app => app.id === selectedAppId);

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId || !userEmail || !referralUrl) {
      alert("Please fill in all fields.");
      return;
    }
    addReferralSlotToCampaign(selectedAppId, {
      userEmail,
      referralUrl,
      limit
    });
    setUserEmail('');
    setReferralUrl('');
    setLimit(5);
    setSuccessMsg('Successfully added referral link to pool!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="admin-referral-pools-container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
      
      {/* Left panel: List of Referral Slots for selected campaign */}
      <div className="admin-content-card" style={{ padding: '28px' }}>
        <div className="card-header-section" style={{ marginBottom: '20px' }}>
          <h2 className="card-heading">Referral Pools Manager</h2>
          <p className="card-subheading">Rotate referral links dynamically for active campaigns. Users will be redirected to links sequentially until limits are met.</p>
        </div>

        {/* Campaign selector */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Select Campaign to Manage</label>
          <select 
            value={selectedAppId} 
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="filter-select"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              outline: 'none',
              fontWeight: 600
            }}
          >
            {apps.map(app => (
              <option key={app.id} value={app.id}>{app.name} ({app.category})</option>
            ))}
          </select>
        </div>

        {selectedApp ? (
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Active Pools for {selectedApp.name}
            </h3>

            {selectedApp.referralPool && selectedApp.referralPool.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {selectedApp.referralPool.map((slot, idx) => {
                  const progress = (slot.completedCount / slot.limit) * 100;
                  const isActive = slot.completedCount < slot.limit && 
                    (!selectedApp.referralPool || selectedApp.referralPool.slice(0, idx).every(s => s.completedCount >= s.limit));

                  return (
                    <div 
                      key={slot.id} 
                      style={{
                        background: 'rgba(255,255,255,0.01)',
                        border: `1px solid ${isActive ? 'var(--accent-indigo)' : 'var(--border-color)'}`,
                        borderRadius: '8px',
                        padding: '16px',
                        position: 'relative',
                        boxShadow: isActive ? '0 0 12px rgba(79, 70, 229, 0.15)' : 'none'
                      }}
                    >
                      {isActive && (
                        <span style={{
                          position: 'absolute',
                          top: '12px',
                          right: '16px',
                          background: 'rgba(79, 70, 229, 0.15)',
                          color: 'var(--accent-indigo)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          textTransform: 'uppercase'
                        }}>
                          Active Redirect URL
                        </span>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.9rem' }}>User: {slot.userEmail}</strong>
                          <a 
                            href={slot.referralUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ fontSize: '0.8rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}
                          >
                            {slot.referralUrl} ↗
                          </a>
                        </div>
                        <button 
                          onClick={() => removeReferralSlot(selectedApp.id, slot.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            height: 'fit-content'
                          }}
                        >
                          Delete
                        </button>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                          <span>Completions Limit</span>
                          <strong>{slot.completedCount} / {slot.limit} ({progress.toFixed(0)}%)</strong>
                        </div>
                        <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              width: `${Math.min(progress, 100)}%`, 
                              height: '100%', 
                              background: slot.completedCount >= slot.limit ? 'var(--text-muted)' : 'var(--accent-teal)' 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No referral slots configured. All users will be redirected to the default URL: <strong>{selectedApp.externalUrl || 'https://google.com'}</strong>
              </div>
            )}
          </div>
        ) : (
          <p>Please select a campaign.</p>
        )}
      </div>

      {/* Right panel: Add new slot */}
      <div className="admin-content-card" style={{ padding: '28px', height: 'fit-content' }}>
        <h3 className="card-heading" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Add Referral Link Slot</h3>
        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleAddSlot} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>User Email (Link Owner)</label>
            <input 
              type="email" 
              required
              placeholder="e.g. user@example.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="search-input"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'rgba(255,255,255,0.01)',
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>User Referral URL</label>
            <input 
              type="url" 
              required
              placeholder="e.g. https://groww.in/ref/user1"
              value={referralUrl}
              onChange={(e) => setReferralUrl(e.target.value)}
              className="search-input"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'rgba(255,255,255,0.01)',
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Completions Limit</label>
            <input 
              type="number" 
              required
              min={1}
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value) || 1)}
              className="search-input"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'rgba(255,255,255,0.01)',
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button 
            type="submit" 
            className="glow-btn-cyan" 
            style={{ width: '100%', padding: '12px', border: 'none', cursor: 'pointer', marginTop: '10px' }}
          >
            Add Link to Pool
          </button>
        </form>
      </div>

    </div>
  );
}
