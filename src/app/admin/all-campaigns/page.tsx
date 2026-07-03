"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { getCategoryIcon, EarningApp } from '../../../data/apps';
import { countries } from '../../../data/countries';

const COUNTRY_CURRENCIES: Record<string, { currency: string; symbol: string }> = {
  'Global': { currency: 'USD', symbol: '$' },
  'India': { currency: 'INR', symbol: '₹' },
  'United States': { currency: 'USD', symbol: '$' },
  'United Kingdom': { currency: 'GBP', symbol: '£' },
  'Europe': { currency: 'EUR', symbol: '€' }
};

export default function AdminAllCampaigns() {
  const { apps, submissions, updateOffer, deleteOffer } = useApp();
// Remove deactivatedIds state since it is now synced directly to the DB

  // Edit campaign states
  const [editingApp, setEditingApp] = useState<EarningApp | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<any>('Gaming');
  const [editPayout, setEditPayout] = useState('0.50');
  const [editCountry, setEditCountry] = useState('Global');
  const [editCompletions, setEditCompletions] = useState('1000');
  const [editLink, setEditLink] = useState('');
  const [editVideo, setEditVideo] = useState('');
  const [editLogo, setEditLogo] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editPlatforms, setEditPlatforms] = useState<('iOS' | 'Android' | 'Web')[]>([]);
  const [editAssignedEmail, setEditAssignedEmail] = useState('');

  // Search state for country inside edit modal
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');

  // Country filter state
  const [filterCountry, setFilterCountry] = useState('All');


  useEffect(() => {
    if (editingApp) {
      setEditName(editingApp.name);
      setEditCategory(editingApp.category);
      setEditPayout(editingApp.reward?.toString() || '0.50');
      setEditCountry(editingApp.targetCountry || 'Global');
      setEditCompletions(editingApp.targetCompletions?.toString() || '1000');
      setEditLink(editingApp.externalUrl || '');
      setEditVideo(editingApp.videoUrl || '');
      setEditLogo(editingApp.logoUrl || '');
      setEditTags(editingApp.tags?.join(', ') || '');
      setEditPlatforms(editingApp.platforms || []);
      setEditAssignedEmail(editingApp.assignedEmail || '');
    }
  }, [editingApp]);

  const handleToggleDeactivate = (id: string) => {
    const campaign = apps.find(a => a.id === id);
    if (!campaign) return;
    const updated = {
      ...campaign,
      isActive: campaign.isActive === false ? true : false
    };
    updateOffer(updated);
  };

  const getCurrencyDetails = (countryName: string) => {
    if (COUNTRY_CURRENCIES[countryName]) {
      return COUNTRY_CURRENCIES[countryName];
    }
    if (countryName === 'India') return { currency: 'INR', symbol: '₹' };
    if (countryName === 'United Kingdom') return { currency: 'GBP', symbol: '£' };
    return { currency: 'USD', symbol: '$' };
  };

  const handleTogglePlatform = (plat: 'iOS' | 'Android' | 'Web') => {
    if (editPlatforms.includes(plat)) {
      setEditPlatforms(editPlatforms.filter(p => p !== plat));
    } else {
      setEditPlatforms([...editPlatforms, plat]);
    }
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    const payoutNum = parseFloat(editPayout) || 0.50;
    const details = getCurrencyDetails(editCountry);
    const rateString = `${details.symbol}${payoutNum.toFixed(2)} / action`;
    const submissionsCount = parseInt(editCompletions) || 1000;
    const parsedTags = editTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const updatedApp: EarningApp = {
      ...editingApp,
      name: editName,
      category: editCategory,
      platforms: editPlatforms,
      earningRate: rateString,
      averageEarningsPerDay: payoutNum,
      tags: parsedTags.length > 0 ? parsedTags : ['Admin direct', 'Promoted'],
      actionText: `Launch ${editName}`,
      externalUrl: editLink,
      targetCountry: editCountry,
      currency: details.currency,
      currencySymbol: details.symbol,
      targetCompletions: submissionsCount,
      videoUrl: editVideo || undefined,
      reward: payoutNum,
      logoUrl: editLogo || undefined,
      assignedEmail: editAssignedEmail || undefined
    };

    updateOffer(updatedApp);
    setEditingApp(null);
  };

  return (
    <div className="admin-content-card">
      <div className="card-header-section">
        <h2 className="card-heading">Earning Apps Directory Manager</h2>
        <p className="card-subheading">Enable/disable or modify active campaigns currently published on the Offerwall.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Filter Target Country:</span>
        <select 
          value={filterCountry} 
          onChange={(e) => setFilterCountry(e.target.value)}
          style={{ padding: '6px 12px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '0.82rem', outline: 'none' }}
        >
          <option value="All">🌐 All Countries</option>
          <option value="Global">🌐 Global</option>
          {Array.from(new Set(apps.map(a => a.targetCountry).filter(Boolean)))
            .filter(c => c !== 'Global')
            .map(c => {
              const matchedCountry = countries.find(co => co.name === c);
              return (
                <option key={c} value={c}>
                  {matchedCountry?.flag || '🏳️'} {c}
                </option>
              );
            })}
        </select>
      </div>

      <div className="table-responsive-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Earning App</th>
              <th>Category</th>
              <th>Platform</th>
              <th>Earning Rate</th>
              <th>Conversions / Cap</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {apps
              .filter(app => filterCountry === 'All' || app.targetCountry === filterCountry)
              .map((app) => {
                const isDeactivated = app.isActive === false;
                const completedCount = submissions.filter(s => s.appId === app.id && s.status === 'Approved').length;
                const target = app.targetCompletions || 1000;
                const progressPercentage = Math.min(100, (completedCount / target) * 100);
                const matchedCountryObj = countries.find(c => c.name === app.targetCountry);
                const flag = app.targetCountry === 'Global' ? '🌐' : (matchedCountryObj?.flag || '🏳️');

                return (
                  <tr key={app.id}>
                    <td>
                      <strong style={{ display: 'block' }}>{app.name}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.7rem', padding: '1px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {flag} {app.targetCountry || 'Global'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rating: {app.rating} ★ ({app.reviewsCount} reviews)</span>
                      </div>
                    </td>
                  <td>
                    <span className="app-cat-badge">{getCategoryIcon(app.category)} {app.category}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem' }}>{app.platforms.join(', ')}</span>
                  </td>
                  <td style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
                    {app.earningRate}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {completedCount.toLocaleString()} / {target.toLocaleString()}
                      </span>
                      <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${progressPercentage}%`, height: '100%', background: 'var(--accent-indigo)' }}></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 'bold',
                      background: isDeactivated ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                      color: isDeactivated ? '#ef4444' : 'var(--accent-emerald)'
                    }}>
                      {isDeactivated ? 'Paused' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleToggleDeactivate(app.id)}
                        style={{
                          background: isDeactivated ? 'var(--accent-emerald)' : 'transparent',
                          border: '1px solid ' + (isDeactivated ? 'transparent' : 'var(--border-color)'),
                          color: isDeactivated ? 'black' : 'var(--text-primary)',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        {isDeactivated ? 'Resume' : 'Pause'}
                      </button>
                      <button
                        onClick={() => setEditingApp(app)}
                        style={{
                          background: 'var(--accent-indigo)',
                          border: 'none',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${app.name}"?`)) {
                            deleteOffer(app.id);
                          }
                        }}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          color: '#ef4444',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editingApp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 11, 14, 0.4)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'flex-end'
        }} onClick={() => setEditingApp(null)}>
          <div 
            className="edit-slide-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Modify Campaign</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Configuring parameters for: {editingApp.name}</span>
              </div>
              <button 
                onClick={() => setEditingApp(null)}
                className="drawer-close-btn"
                title="Close drawer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveChanges} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div className="drawer-form-group">
                <label>Campaign Name *</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  required
                  className="drawer-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="drawer-form-group">
                  <label>Category *</label>
                  <select 
                    value={editCategory} 
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="drawer-select"
                  >
                    <option value="Gaming">🎮 Gaming</option>
                    <option value="Surveys">📋 Surveys</option>
                    <option value="App Testing">🧪 App Testing</option>
                    <option value="Passive">💸 Passive</option>
                    <option value="App Install & Sign Up">📲 App Install & Sign Up</option>
                    <option value="LinkedIn Followers">👔 LinkedIn Followers</option>
                    <option value="Google Maps Reviews">📍 Google Maps Reviews</option>
                    <option value="Telegram Members">✈️ Telegram Members</option>
                    <option value="WhatsApp Members">💬 WhatsApp Members</option>
                    <option value="Instagram Followers">📸 Instagram Followers</option>
                    <option value="Facebook Page Followers">👍 Facebook Page Followers</option>
                    <option value="Youtube Subscribers">▶️ Youtube Subscribers</option>
                    <option value="Trustpilot Reviews">⭐ Trustpilot Reviews</option>
                    <option value="Justdial Reviews">📞 Justdial Reviews</option>
                    <option value="Play Store Reviews">🤖 Play Store Reviews</option>
                    <option value="Custom Task">⚙️ Custom Task</option>
                  </select>
                </div>

                <div className="drawer-form-group" style={{ position: 'relative' }}>
                  <label>Target Country *</label>
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-dark)',
                      border: '1px solid var(--border-color)',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      height: '45px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  >
                    <span>
                      {editCountry === 'Global' 
                        ? '🌍 Global' 
                        : `${countries.find(c => c.name === editCountry)?.flag || '🏳️'} ${editCountry}`
                      }
                    </span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
                  </button>

                  {isCountryDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      bottom: '102%',
                      left: 0,
                      right: 0,
                      zIndex: 200,
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      boxShadow: 'var(--shadow-premium)',
                      marginBottom: '4px',
                      padding: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <input
                        type="text"
                        value={countrySearchQuery}
                        onChange={(e) => setCountrySearchQuery(e.target.value)}
                        placeholder="Search country..."
                        autoFocus
                        style={{
                          background: 'var(--bg-dark)',
                          border: '1px solid var(--border-color)',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          color: 'var(--text-primary)',
                          fontSize: '0.85rem',
                          width: '100%',
                          boxSizing: 'border-box',
                          outline: 'none'
                        }}
                      />
                      <div style={{
                        maxHeight: '150px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        {('global'.includes(countrySearchQuery.toLowerCase())) && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditCountry('Global');
                              setIsCountryDropdownOpen(false);
                              setCountrySearchQuery('');
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-primary)',
                              padding: '8px 10px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              borderRadius: '4px'
                            }}
                            className="country-item-btn"
                          >
                            🌍 Global
                          </button>
                        )}
                        {countries
                          .filter(c => c.name.toLowerCase().includes(countrySearchQuery.toLowerCase()))
                          .map(c => (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => {
                                setEditCountry(c.name);
                                setIsCountryDropdownOpen(false);
                                setCountrySearchQuery('');
                              }}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary)',
                                padding: '8px 10px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                borderRadius: '4px'
                              }}
                              className="country-item-btn"
                            >
                              {c.flag} {c.name}
                            </button>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="drawer-form-group">
                  <label>Payout per Conversion *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0.01" 
                    value={editPayout} 
                    onChange={(e) => setEditPayout(e.target.value)} 
                    required
                    className="drawer-input"
                  />
                </div>

                <div className="drawer-form-group">
                  <label>Total Allowed Submissions *</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={editCompletions} 
                    onChange={(e) => setEditCompletions(e.target.value)} 
                    required
                    className="drawer-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="drawer-form-group">
                  <label>Task External Link *</label>
                  <input 
                    type="url" 
                    value={editLink} 
                    onChange={(e) => setEditLink(e.target.value)} 
                    required
                    placeholder="https://example.com/task"
                    className="drawer-input"
                  />
                </div>

                <div className="drawer-form-group">
                  <label>Video Tutorial Link (Optional)</label>
                  <input 
                    type="url" 
                    value={editVideo} 
                    onChange={(e) => setEditVideo(e.target.value)} 
                    placeholder="https://youtube.com/..."
                    className="drawer-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="drawer-form-group">
                  <label>Campaign Logo URL (Optional)</label>
                  <input 
                    type="url" 
                    value={editLogo} 
                    onChange={(e) => setEditLogo(e.target.value)} 
                    placeholder="https://example.com/logo.png"
                    className="drawer-input"
                  />
                </div>

                <div className="drawer-form-group">
                  <label>Tags (Comma separated)</label>
                  <input 
                    type="text" 
                    value={editTags} 
                    onChange={(e) => setEditTags(e.target.value)} 
                    placeholder="e.g. Premium, Signup, Hot"
                    className="drawer-input"
                  />
                </div>
              </div>

              <div className="drawer-form-group">
                <label>Assigned Partner / Developer Email (Optional)</label>
                <input 
                  type="email" 
                  value={editAssignedEmail} 
                  onChange={(e) => setEditAssignedEmail(e.target.value)} 
                  placeholder="e.g. partner@example.com (links campaign to their partner dashboard)"
                  className="drawer-input"
                />
              </div>

              <div className="drawer-form-group">
                <label>Platforms *</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['iOS', 'Android', 'Web'].map(plat => (
                    <button
                      type="button"
                      key={plat}
                      onClick={() => handleTogglePlatform(plat as any)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: editPlatforms.includes(plat as any) ? 'rgba(13, 148, 136, 0.15)' : 'transparent',
                        color: editPlatforms.includes(plat as any) ? 'var(--accent-teal)' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        outline: 'none'
                      }}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <button type="submit" className="glow-btn-cyan" style={{ flex: 1, padding: '12px', borderRadius: '8px' }}>
                  Save Parameters
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditingApp(null)} 
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'transparent',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--border-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-content-card {
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
        .table-responsive-container {
          width: 100%;
          overflow-x: auto;
        }
        .user-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.88rem;
        }
        .user-table th {
          border-bottom: 1px solid var(--border-color);
          padding: 12px 16px;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.72rem;
          letter-spacing: 0.05em;
        }
        .user-table td {
          border-bottom: 1px solid var(--border-color);
          padding: 16px;
          vertical-align: middle;
        }
        .app-cat-badge {
          display: inline-block;
          font-size: 0.7rem;
          background: var(--border-color);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--text-secondary);
        }
        .country-item-btn:hover {
          background: rgba(79, 70, 229, 0.08) !important;
          color: var(--accent-indigo) !important;
        }
        
        /* Premium Sliding Edit Drawer */
        .edit-slide-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 520px;
          background: var(--bg-card);
          border-left: 1px solid var(--border-color);
          box-shadow: var(--shadow-premium);
          z-index: 1001;
          padding: 36px 28px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .drawer-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 20px;
        }
        .drawer-form-group label {
          font-size: 0.76rem;
          text-transform: uppercase;
          color: var(--text-secondary);
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .drawer-input, .drawer-select {
          width: 100%;
          background: var(--bg-dark) !important;
          border: 1px solid var(--border-color) !important;
          padding: 12px 16px !important;
          border-radius: 8px !important;
          color: var(--text-primary) !important;
          font-size: 0.9rem !important;
          outline: none !important;
          transition: all 0.2s ease !important;
          box-sizing: border-box !important;
        }
        .drawer-input:focus, .drawer-select:focus {
          border-color: var(--accent-teal) !important;
          background: rgba(13, 148, 136, 0.03) !important;
          box-shadow: 0 0 0 3px var(--accent-teal-glow) !important;
        }
        .drawer-close-btn {
          background: var(--bg-dark);
          border: 1px solid var(--border-color);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }
        .drawer-close-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
      `}</style>
    </div>
  );
}
