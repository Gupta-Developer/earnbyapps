"use client";

import React, { useState, useEffect } from 'react';

const INITIAL_BANNERS = [
  { id: 'banner-1', title: '100 Free Campaign Credits for New Partners!', link: '/partner/create-campaign', status: 'Active', image: '🎁' },
  { id: 'banner-2', title: 'Top Earner League: Win ₹5,000 Daily!', link: '/offerwall', status: 'Active', image: '🏆' },
  { id: 'banner-3', title: 'Passive Earnings: Try Honeygain Now', link: '/offerwall', status: 'Draft', image: '🐝' }
];

export default function BannersPage() {
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerLink, setNewBannerLink] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('eb_admin_banners');
    if (saved) {
      setBanners(JSON.parse(saved));
    }
  }, []);

  const handleToggleBanner = (id: string) => {
    const updated = banners.map(b => b.id === id ? { ...b, status: b.status === 'Active' ? 'Draft' : 'Active' } : b);
    setBanners(updated);
    localStorage.setItem('eb_admin_banners', JSON.stringify(updated));
  };

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle || !newBannerLink) return;
    const updated = [...banners, {
      id: `banner-${Date.now()}`,
      title: newBannerTitle,
      link: newBannerLink,
      status: 'Active',
      image: '✨'
    }];
    setBanners(updated);
    localStorage.setItem('eb_admin_banners', JSON.stringify(updated));
    setNewBannerTitle('');
    setNewBannerLink('');
  };

  return (
    <div className="admin-content-card">
      <div className="card-header-section">
        <h2 className="card-heading">Homepage Promotional Slider</h2>
        <p className="card-subheading">Configure ad banners shown to earners.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {banners.map(b => (
            <div key={b.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
              <span style={{ fontSize: '2rem' }}>{b.image}</span>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '0.95rem' }}>{b.title}</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-indigo)', marginTop: '2px' }}>Link: {b.link}</div>
              </div>
              <span style={{
                fontSize: '0.72rem',
                padding: '2px 6px',
                borderRadius: '4px',
                background: b.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                color: b.status === 'Active' ? 'var(--accent-emerald)' : 'var(--text-muted)'
              }}>{b.status}</span>
              <button onClick={() => handleToggleBanner(b.id)} style={{ padding: '6px 12px', fontSize: '0.78rem', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}>
                Toggle State
              </button>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Insert Slider Ad</h3>
          <form onSubmit={handleAddBanner} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-group">
              <label>Ad Campaign Headline</label>
              <input 
                type="text" 
                value={newBannerTitle} 
                onChange={(e) => setNewBannerTitle(e.target.value)} 
                placeholder="e.g. Freecash Giveaway Campaign"
                required
                style={{ padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px' }}
              />
            </div>
            <div className="form-group">
              <label>Redirect Path</label>
              <input 
                type="text" 
                value={newBannerLink} 
                onChange={(e) => setNewBannerLink(e.target.value)} 
                placeholder="/offerwall"
                required
                style={{ padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px' }}
              />
            </div>
            <button type="submit" className="glow-btn-cyan" style={{ padding: '10px' }}>Create Active Placement</button>
          </form>
        </div>
      </div>
    </div>
  );
}
