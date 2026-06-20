"use client";

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

const COUNTRY_CURRENCIES: Record<string, { currency: string; symbol: string }> = {
  'Global': { currency: 'USD', symbol: '$' },
  'India': { currency: 'INR', symbol: '₹' },
  'United States': { currency: 'USD', symbol: '$' },
  'United Kingdom': { currency: 'GBP', symbol: '£' },
  'Europe': { currency: 'EUR', symbol: '€' }
};

export default function AdminNewCampaign() {
  const { submitOffer } = useApp();

  const [adminAppName, setAdminAppName] = useState('');
  const [adminAppCategory, setAdminAppCategory] = useState<'Gaming' | 'Surveys' | 'App Testing' | 'Passive' | 'App Install & Sign Up' | 'LinkedIn Followers' | 'Google Maps Reviews' | 'Telegram Members' | 'WhatsApp Members' | 'Instagram Followers' | 'Facebook Page Followers' | 'Youtube Subscribers' | 'Trustpilot Reviews' | 'Justdial Reviews' | 'Play Store Reviews' | 'Custom Task'>('Gaming');
  const [adminAppPlatforms, setAdminAppPlatforms] = useState<('iOS' | 'Android' | 'Web')[]>([]);
  const [adminAppUrl, setAdminAppUrl] = useState('');
  const [adminAppRate, setAdminAppRate] = useState('0.50');
  const [adminAppDesc, setAdminAppDesc] = useState('');
  const [adminAppLongDesc, setAdminAppLongDesc] = useState('');
  const [adminAppSuccess, setAdminAppSuccess] = useState(false);
  const [adminAppCountry, setAdminAppCountry] = useState('Global');

  // Admin Task Builder States
  const [adminTasks, setAdminTasks] = useState<{ id: string; title: string; description: string; reward: number }[]>([]);
  const [adminTaskTitle, setAdminTaskTitle] = useState('');
  const [adminTaskDesc, setAdminTaskDesc] = useState('');
  const [adminTaskReward, setAdminTaskReward] = useState<number>(0.25);

  const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    'App Install & Sign Up': 'Get Genuine Users On Your App from India. High Value Users',
    'LinkedIn Followers': 'Get Genuine Active LinkedIn Followers from India',
    'Google Maps Reviews': 'Get 5 Star Reviews On Your GMB Profile (⚠️Facing Dropping)',
    'Telegram Members': 'Get Real Active Indian Telegram Users On Your Telegram Channel',
    'WhatsApp Members': 'Get Real Active Indian WhatsApp Users On Your WhatsApp Channel',
    'Instagram Followers': 'Get Real Active Indian Followers On Your Profile',
    'Facebook Page Followers': 'Get Page Likes & Real Followers from India',
    'Youtube Subscribers': 'Get Genuine Youtube Subscribers from India',
    'Trustpilot Reviews': 'Get 5 Star Reviews On Your Business\'s Trustpilot Profile',
    'Justdial Reviews': 'Get 5 Star Reviews On Your Business\'s Justdial Profile',
    'Play Store Reviews': 'Get 5 Star Positive Reviews On Your App',
    'Custom Task': 'Get Your Gigs Completed With Our Platform Users',
    'Gaming': 'Complete in-game actions, download and play to earn.',
    'Surveys': 'Share your feedback, answer daily opinion polls to earn.',
    'App Testing': 'Test beta versions of apps and write UI feedback reviews.',
    'Passive': 'Earn passive income in the background automatically.'
  };

  const handleAdminAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminTaskTitle) return;
    const newTask = {
      id: `task-admin-${Date.now()}-${adminTasks.length}`,
      title: adminTaskTitle,
      description: adminTaskDesc,
      reward: adminTaskReward
    };
    setAdminTasks([...adminTasks, newTask]);
    setAdminTaskTitle('');
    setAdminTaskDesc('');
    setAdminTaskReward(0.25);
  };

  const handleAdminRemoveTask = (id: string) => {
    setAdminTasks(adminTasks.filter(t => t.id !== id));
  };

  const handleDirectAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminAppName || !adminAppUrl || adminAppPlatforms.length === 0 || !adminAppDesc) {
      alert('Please fill out all required fields.');
      return;
    }

    const costNum = parseFloat(adminAppRate) || 0.50;
    const symbol = COUNTRY_CURRENCIES[adminAppCountry]?.symbol || '$';
    const rateString = `${symbol}${costNum.toFixed(2)} / action`;

    submitOffer({
      name: adminAppName,
      category: adminAppCategory,
      platforms: adminAppPlatforms,
      earningRate: rateString,
      averageEarningsPerDay: costNum,
      description: adminAppDesc,
      longDescription: adminAppLongDesc || adminAppDesc,
      tags: ['Admin direct', 'Promoted'],
      actionText: `Launch ${adminAppName}`,
      externalUrl: adminAppUrl,
      tasks: adminTasks.length > 0 ? adminTasks : [
        { id: `task-admin-${Date.now()}`, title: 'Complete registration', description: 'Download and create verified account.', reward: costNum }
      ],
      targetCountry: adminAppCountry,
      currency: COUNTRY_CURRENCIES[adminAppCountry]?.currency || 'USD',
      currencySymbol: symbol
    });

    setAdminAppSuccess(true);
  };

  const handleResetAdminCampaign = () => {
    setAdminAppName('');
    setAdminAppCategory('Gaming');
    setAdminAppPlatforms([]);
    setAdminAppUrl('');
    setAdminAppRate('0.50');
    setAdminAppDesc('');
    setAdminAppLongDesc('');
    setAdminTasks([]);
    setAdminAppSuccess(false);
    setAdminAppCountry('Global');
  };

  const toggleAdminPlatform = (plat: 'iOS' | 'Android' | 'Web') => {
    if (adminAppPlatforms.includes(plat)) {
      setAdminAppPlatforms(adminAppPlatforms.filter(p => p !== plat));
    } else {
      setAdminAppPlatforms([...adminAppPlatforms, plat]);
    }
  };

  return (
    <div className="admin-content-card">
      {adminAppSuccess ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🎉</span>
          <h3 className="card-heading" style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Direct Campaign Configured!</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
            The campaign for <strong>{adminAppName}</strong> has been configured and is live in the Offerwall directory immediately.
          </p>
          <button onClick={handleResetAdminCampaign} className="glow-btn-cyan">Create Another Offer</button>
        </div>
      ) : (
        <form onSubmit={handleDirectAddCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card-header-section" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h2 className="card-heading">Post New Direct Campaign</h2>
            <p className="card-subheading">Configure system offers directly into the directory queue.</p>
          </div>

          <div className="form-group">
            <label>Application Name *</label>
            <input 
              type="text" 
              value={adminAppName} 
              onChange={(e) => setAdminAppName(e.target.value)} 
              placeholder="e.g. Swagbucks Direct, Prime Survey Extra"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-responsive">
            <div className="form-group">
              <label>Category *</label>
              <select 
                value={adminAppCategory} 
                onChange={(e) => {
                  const newCat = e.target.value as any;
                  setAdminAppCategory(newCat);
                  const autoDesc = CATEGORY_DESCRIPTIONS[newCat];
                  if (autoDesc) setAdminAppDesc(autoDesc);
                }}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '6px', color: 'var(--text-primary)', height: '40px' }}
              >
                <option value="App Install & Sign Up">App Install & Sign Up</option>
                <option value="LinkedIn Followers">LinkedIn Followers</option>
                <option value="Google Maps Reviews">Google Maps Reviews</option>
                <option value="Telegram Members">Telegram Members</option>
                <option value="WhatsApp Members">WhatsApp Members</option>
                <option value="Instagram Followers">Instagram Followers</option>
                <option value="Facebook Page Followers">Facebook Page Followers</option>
                <option value="Youtube Subscribers">Youtube Subscribers</option>
                <option value="Trustpilot Reviews">Trustpilot Reviews</option>
                <option value="Justdial Reviews">Justdial Reviews</option>
                <option value="Play Store Reviews">Play Store Reviews</option>
                <option value="Custom Task">Custom Task</option>
                <option value="Gaming">Gaming</option>
                <option value="Surveys">Surveys</option>
                <option value="App Testing">App Testing</option>
                <option value="Passive">Passive</option>
              </select>
            </div>

            <div className="form-group">
              <label>Payout Per Action ({COUNTRY_CURRENCIES[adminAppCountry]?.currency || 'USD'} {COUNTRY_CURRENCIES[adminAppCountry]?.symbol || '$'}) *</label>
              <input 
                type="number" 
                step="0.05"
                value={adminAppRate} 
                onChange={(e) => setAdminAppRate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>App Redirect Target Link *</label>
            <input 
              type="url" 
              value={adminAppUrl} 
              onChange={(e) => setAdminAppUrl(e.target.value)} 
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Platforms *</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['iOS', 'Android', 'Web'].map(plat => (
                <button
                  type="button"
                  key={plat}
                  onClick={() => toggleAdminPlatform(plat as any)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: adminAppPlatforms.includes(plat as any) ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                    color: adminAppPlatforms.includes(plat as any) ? 'var(--accent-indigo)' : 'var(--text-secondary)',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Target Country *</label>
            <select 
              value={adminAppCountry} 
              onChange={(e) => setAdminAppCountry(e.target.value)}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '6px', color: 'var(--text-primary)', height: '40px' }}
            >
              {Object.keys(COUNTRY_CURRENCIES).map(country => (
                <option key={country} value={country}>{country} ({COUNTRY_CURRENCIES[country].currency} - {COUNTRY_CURRENCIES[country].symbol})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Short Description *</label>
            <input 
              type="text" 
              value={adminAppDesc} 
              onChange={(e) => setAdminAppDesc(e.target.value)}
              placeholder="e.g. Install and signup to get reward"
              required
            />
          </div>

          {/* ADMIN TASK LIST BUILDER */}
          <div className="form-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', marginBottom: '8px', color: 'var(--accent-indigo)' }}>Configure Active Actions/Tasks</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Define direct sub-tasks earners will complete to get rewards.</p>

            <div className="added-tasks-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {adminTasks.length > 0 ? (
                adminTasks.map((task, idx) => (
                  <div key={task.id} className="task-preview-chip" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '6px' }}>
                    <div>
                      <strong style={{ fontSize: '0.88rem' }}>{idx + 1}. {task.title}</strong>
                      <span style={{ marginLeft: '8px', color: 'var(--accent-emerald)', fontWeight: 'bold', fontSize: '0.85rem' }}>+{COUNTRY_CURRENCIES[adminAppCountry]?.symbol || '$'}{task.reward.toFixed(2)}</span>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>{task.description}</p>
                    </div>
                    <button type="button" onClick={() => handleAdminRemoveTask(task.id)} className="remove-task-btn" style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>
                  </div>
                ))
              ) : (
                <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-muted)' }}>No actions added yet. Add at least one task action below.</p>
              )}
            </div>

            <div className="glass-card task-builder-subform" style={{ padding: '16px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-color)', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem' }}>Add Live Campaign Action</h4>
              <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Action Title</label>
                <input 
                  type="text" 
                  value={adminTaskTitle} 
                  onChange={(e) => setAdminTaskTitle(e.target.value)}
                  placeholder="e.g. Download and play for 10 minutes"
                  style={{ padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Action Description</label>
                  <input 
                    type="text" 
                    value={adminTaskDesc} 
                    onChange={(e) => setAdminTaskDesc(e.target.value)}
                    placeholder="e.g. Accounts must be unique."
                    style={{ padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Reward ({COUNTRY_CURRENCIES[adminAppCountry]?.currency || 'USD'} {COUNTRY_CURRENCIES[adminAppCountry]?.symbol || '$'})</label>
                  <input 
                    type="number" 
                    step="0.05"
                    value={adminTaskReward} 
                    onChange={(e) => setAdminTaskReward(parseFloat(e.target.value) || 0)}
                    style={{ padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <button type="button" onClick={handleAdminAddTask} className="glow-btn-cyan" style={{ padding: '6px 12px', fontSize: '0.8rem', alignSelf: 'flex-start' }}>
                + Add Action
              </button>
            </div>
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
        .form-group input:focus {
          border-color: var(--accent-indigo);
        }
        .added-tasks-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .task-preview-chip {
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
        }
        .remove-task-btn {
          background: transparent;
          border: none;
          color: #ef4444;
          cursor: pointer;
        }
        .glass-card {
          background: rgba(255,255,255,0.01);
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }
        @media (max-width: 768px) {
          .grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
