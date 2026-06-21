"use client";

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { countries } from '../../../data/countries';

const COUNTRY_CURRENCIES: Record<string, { currency: string; symbol: string }> = {
  'Global': { currency: 'USD', symbol: '$' },
  'India': { currency: 'INR', symbol: '₹' },
  'United States': { currency: 'USD', symbol: '$' },
  'United Kingdom': { currency: 'GBP', symbol: '£' },
  'Europe': { currency: 'EUR', symbol: '€' }
};

export default function AdminNewCampaign() {
  const { submitOffer } = useApp();

  const [taskName, setTaskName] = useState('');
  const [category, setCategory] = useState<'Gaming' | 'Surveys' | 'App Testing' | 'Passive' | 'App Install & Sign Up' | 'LinkedIn Followers' | 'Google Maps Reviews' | 'Telegram Members' | 'WhatsApp Members' | 'Instagram Followers' | 'Facebook Page Followers' | 'Youtube Subscribers' | 'Trustpilot Reviews' | 'Justdial Reviews' | 'Play Store Reviews' | 'Custom Task'>('Gaming');
  const [targetCountry, setTargetCountry] = useState('Global');
  const [payout, setPayout] = useState('0.50');
  const [taskLink, setTaskLink] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [platforms, setPlatforms] = useState<('iOS' | 'Android' | 'Web')[]>([]);
  const [description, setDescription] = useState('');
  const [allowedSubmissions, setAllowedSubmissions] = useState('1000');
  
  const [success, setSuccess] = useState(false);

  const getCurrencyDetails = (countryName: string) => {
    if (COUNTRY_CURRENCIES[countryName]) {
      return COUNTRY_CURRENCIES[countryName];
    }
    if (countryName === 'India') return { currency: 'INR', symbol: '₹' };
    if (countryName === 'United Kingdom') return { currency: 'GBP', symbol: '£' };
    return { currency: 'USD', symbol: '$' };
  };

  const handleTogglePlatform = (plat: 'iOS' | 'Android' | 'Web') => {
    if (platforms.includes(plat)) {
      setPlatforms(platforms.filter(p => p !== plat));
    } else {
      setPlatforms([...platforms, plat]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName || !taskLink || platforms.length === 0 || !description || !allowedSubmissions) {
      alert('Please fill out all required fields and select at least one platform.');
      return;
    }

    const payoutNum = parseFloat(payout) || 0.50;
    const details = getCurrencyDetails(targetCountry);
    const rateString = `${details.symbol}${payoutNum.toFixed(2)} / action`;
    const submissionsCount = parseInt(allowedSubmissions) || 1000;

    submitOffer({
      name: taskName,
      category: category,
      platforms: platforms,
      earningRate: rateString,
      averageEarningsPerDay: payoutNum,
      description: description,
      longDescription: description,
      tags: ['Admin direct', 'Promoted'],
      actionText: `Launch ${taskName}`,
      externalUrl: taskLink,
      tasks: [
        { id: `task-admin-${Date.now()}`, title: 'Complete action', description: description, reward: payoutNum }
      ],
      targetCountry: targetCountry,
      currency: details.currency,
      currencySymbol: details.symbol,
      targetCompletions: submissionsCount,
      videoUrl: videoUrl || undefined
    });

    setSuccess(true);
  };

  const handleReset = () => {
    setTaskName('');
    setCategory('Gaming');
    setTargetCountry('Global');
    setPayout('0.50');
    setTaskLink('');
    setVideoUrl('');
    setPlatforms([]);
    setDescription('');
    setAllowedSubmissions('1000');
    setSuccess(false);
  };

  const details = getCurrencyDetails(targetCountry);

  return (
    <div className="admin-content-card">
      {success ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🎉</span>
          <h3 className="card-heading" style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Direct Campaign Configured!</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
            The campaign for <strong>{taskName}</strong> has been configured and is live in the Offerwall directory immediately.
          </p>
          <button onClick={handleReset} className="glow-btn-cyan">Create Another Offer</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card-header-section" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h2 className="card-heading">Post New Direct Campaign</h2>
            <p className="card-subheading">Configure system offers directly into the directory queue.</p>
          </div>

          <div className="form-group">
            <label htmlFor="task-name">Task Name *</label>
            <input 
              id="task-name"
              type="text" 
              value={taskName} 
              onChange={(e) => setTaskName(e.target.value)} 
              placeholder="e.g. Swagbucks Direct, Prime Survey Extra"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-responsive">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select 
                id="category"
                value={category} 
                onChange={(e) => setCategory(e.target.value as any)}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '6px', color: 'var(--text-primary)', height: '40px' }}
              >
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
                <option value="Gaming">🎮 Gaming</option>
                <option value="Surveys">📋 Surveys</option>
                <option value="App Testing">🧪 App Testing</option>
                <option value="Passive">💸 Passive</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="target-country">Target Country *</label>
              <select 
                id="target-country"
                value={targetCountry} 
                onChange={(e) => setTargetCountry(e.target.value)}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '6px', color: 'var(--text-primary)', height: '40px' }}
              >
                <option value="Global">🌍 Global (USD - $)</option>
                {countries.map(c => (
                  <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-responsive">
            <div className="form-group">
              <label htmlFor="payout">Payout per Conversion ({details.currency} {details.symbol}) *</label>
              <input 
                id="payout"
                type="number" 
                step="0.01"
                min="0.01"
                value={payout} 
                onChange={(e) => setPayout(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="allowed-submissions">Total Number of Allowed Submission *</label>
              <input 
                id="allowed-submissions"
                type="number" 
                min="1"
                value={allowedSubmissions} 
                onChange={(e) => setAllowedSubmissions(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-responsive">
            <div className="form-group">
              <label htmlFor="task-link">Task Link *</label>
              <input 
                id="task-link"
                type="url" 
                value={taskLink} 
                onChange={(e) => setTaskLink(e.target.value)} 
                placeholder="https://example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="video-link">Video Tutorial Link (Optional)</label>
              <input 
                id="video-link"
                type="url" 
                value={videoUrl} 
                onChange={(e) => setVideoUrl(e.target.value)} 
                placeholder="e.g. YouTube Shorts or tutorial URL"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Platform *</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['iOS', 'Android', 'Web'].map(plat => (
                <button
                  type="button"
                  key={plat}
                  onClick={() => handleTogglePlatform(plat as any)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: platforms.includes(plat as any) ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                    color: platforms.includes(plat as any) ? 'var(--accent-indigo)' : 'var(--text-secondary)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea 
              id="description"
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter simple instructions or conversion details..."
              style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem', minHeight: '100px', resize: 'vertical' }}
              required
            />
          </div>

          <button type="submit" className="glow-btn-cyan" style={{ padding: '12px 24px', width: '100%', marginTop: '20px' }}>
            Publish Campaign to Offerwall
          </button>
        </form>
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
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
        }
        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .form-group input, .form-group select {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-color);
          padding: 10px 14px;
          border-radius: 6px;
          color: var(--text-primary);
          outline: none;
          font-size: 0.9rem;
        }
        .form-group input:focus, .form-group select:focus {
          border-color: var(--accent-indigo);
        }
        @media (max-width: 768px) {
          .grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
        /* Disable number input spinners */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
