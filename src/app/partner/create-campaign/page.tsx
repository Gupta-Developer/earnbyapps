"use client";

import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { AppTask } from '../../../data/apps';

interface TaskPreset {
  title: string;
  desc: string;
  reward: number;
  icon: string;
  tag: string;
}

const TASK_PRESETS: TaskPreset[] = [
  { title: 'Download & Launch', desc: 'Download from the app store, open it, and accept terms.', reward: 0.50, icon: '📱', tag: 'Install' },
  { title: 'Create Verified Profile', desc: 'Register an account using your email and confirm it.', reward: 0.75, icon: '👤', tag: 'Register' },
  { title: 'Complete Level 5', desc: 'Play the game and reach profile or stage level 5.', reward: 1.50, icon: '🎮', tag: 'Gaming' },
  { title: 'Demographics Survey', desc: 'Submit the 5-minute demographic survey questionnaire.', reward: 1.00, icon: '📋', tag: 'Survey' },
  { title: 'Submit Review', desc: 'Leave an honest review on the app store with feedback.', reward: 1.25, icon: '⭐', tag: 'Feedback' },
  { title: 'Enable Background Share', desc: 'Keep background data connection active for 24 hours.', reward: 2.00, icon: '⚡', tag: 'Passive' }
];

const COUNTRY_CURRENCIES: Record<string, { currency: string; symbol: string }> = {
  'Global': { currency: 'USD', symbol: '$' },
  'India': { currency: 'INR', symbol: '₹' },
  'United States': { currency: 'USD', symbol: '$' },
  'United Kingdom': { currency: 'GBP', symbol: '£' },
  'Europe': { currency: 'EUR', symbol: '€' }
};

export default function CreatePartnerCampaign() {
  const { submitPartnershipLead } = useApp();
  const [success, setSuccess] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Gaming' | 'Surveys' | 'App Testing' | 'Passive' | 'App Install & Sign Up' | 'LinkedIn Followers' | 'Google Maps Reviews' | 'Telegram Members' | 'WhatsApp Members' | 'Instagram Followers' | 'Facebook Page Followers' | 'Youtube Subscribers' | 'Trustpilot Reviews' | 'Justdial Reviews' | 'Play Store Reviews' | 'Custom Task'>('Gaming');
  const [platforms, setPlatforms] = useState<('iOS' | 'Android' | 'Web')[]>([]);
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [targetCountry, setTargetCountry] = useState('Global');

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

  // B2B Bulk Settings
  const [targetCompletions, setTargetCompletions] = useState<number>(1000);
  const [costPerCompletion, setCostPerCompletion] = useState<number>(0.50);

  // Task builder states
  const [tasks, setTasks] = useState<AppTask[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskReward, setTaskReward] = useState<number>(0.25);
  const [activePresetIndex, setActivePresetIndex] = useState<number | null>(null);

  // Calculate live campaign budget
  const totalCampaignBudget = useMemo(() => {
    return parseFloat((targetCompletions * costPerCompletion).toFixed(2));
  }, [targetCompletions, costPerCompletion]);

  const handleApplyPreset = (preset: TaskPreset, index: number) => {
    setTaskTitle(preset.title);
    setTaskDesc(preset.desc);
    setTaskReward(preset.reward);
    setActivePresetIndex(index);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    const newTask: AppTask = {
      id: `task-builder-${Date.now()}-${tasks.length}`,
      title: taskTitle,
      description: taskDesc,
      reward: taskReward
    };

    setTasks([...tasks, newTask]);
    setTaskTitle('');
    setTaskDesc('');
    setTaskReward(0.25);
    setActivePresetIndex(null);
  };

  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const togglePlatform = (plat: 'iOS' | 'Android' | 'Web') => {
    if (platforms.includes(plat)) {
      setPlatforms(platforms.filter(p => p !== plat));
    } else {
      setPlatforms([...platforms, plat]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !longDescription || !externalUrl || platforms.length === 0) {
      alert("Please fill in all required fields and select at least one platform.");
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const symbol = COUNTRY_CURRENCIES[targetCountry]?.symbol || '$';
    const displayEarningRate = `${symbol}${costPerCompletion.toFixed(2)} / action`;

    submitPartnershipLead({
      appName: name,
      category,
      platforms,
      earningRate: displayEarningRate,
      averageEarningsPerDay: costPerCompletion,
      description,
      longDescription,
      tags: tags.length > 0 ? tags : ['Bulk campaign', 'Verified partner'],
      actionText: `Open ${name}`,
      externalUrl,
      suggestedTasks: tasks,
      targetCompletions,
      costPerCompletion,
      totalBudget: totalCampaignBudget,
      targetCountry: targetCountry,
      currency: COUNTRY_CURRENCIES[targetCountry]?.currency || 'USD',
      currencySymbol: symbol
    });

    setSuccess(true);
  };

  const handleReset = () => {
    setName('');
    setCategory('Gaming');
    setPlatforms([]);
    setDescription('');
    setLongDescription('');
    setTagsInput('');
    setExternalUrl('');
    setTargetCompletions(1000);
    setCostPerCompletion(0.50);
    setTasks([]);
    setSuccess(false);
    setTargetCountry('Global');
  };

  return (
    <div className="partner-form-viewport">
      {success ? (
        <div className="partner-content-card success-card" style={{ textAlign: 'center', padding: '48px', maxWidth: '600px', margin: '0 auto' }}>
          <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '20px' }}>🎉</span>
          <h2 className="card-heading" style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Partnership Request Submitted!</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Your partnership lead for <strong>{name}</strong> has been registered. An administrator will review your suggested campaign and contact you shortly to create your official campaign.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button onClick={handleReset} className="glow-btn-cyan">Create Another Campaign</button>
            <a href="/partner/overview" className="glow-btn-purple" style={{ textDecoration: 'none', display: 'inline-block', lineHeight: '40px', padding: '0 24px', borderRadius: '8px', fontWeight: 600 }}>Go to Overview</a>
          </div>
        </div>
      ) : (
        <div className="builder-split-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', alignItems: 'start' }}>
          
          {/* Left Builder Form */}
          <div className="partner-content-card">
            <div className="card-header-section" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
              <h2 className="card-heading">Launch Bulk Campaign</h2>
              <p className="card-subheading">Submit your app details to gain bulk conversions, installations, and key actions from genuine users.</p>
            </div>

            <form onSubmit={handleSubmit} className="offer-form">
              
              {/* BULK SPECIFICATIONS */}
              <div className="form-section">
                <h2 className="section-header">1. Bulk Volume & Sizing</h2>
                <p className="section-desc">Define target conversions and budget size for your campaign.</p>

                <div className="form-row">
                  <div className="form-group">
                    <label>Target Conversions (Completions) *</label>
                    <input 
                      type="number" 
                      min="100"
                      step="50"
                      value={targetCompletions} 
                      onChange={(e) => setTargetCompletions(parseInt(e.target.value) || 0)} 
                      required
                    />
                    <span className="input-helper">Minimum 100 completions.</span>
                  </div>

                  <div className="form-group">
                    <label>Payout Per Action ({COUNTRY_CURRENCIES[targetCountry]?.currency || 'USD'} {COUNTRY_CURRENCIES[targetCountry]?.symbol || '$'}) *</label>
                    <input 
                      type="number" 
                      min="0.05"
                      step="0.05"
                      value={costPerCompletion} 
                      onChange={(e) => setCostPerCompletion(parseFloat(e.target.value) || 0)} 
                      required
                    />
                    <span className="input-helper">Reward distributed per verified user action.</span>
                  </div>
                </div>

                {/* Total budget display box */}
                <div className="glass-card budget-calculator-box">
                  <span className="budget-lbl">Total Estimated Budget</span>
                  <strong className="budget-total-val">{COUNTRY_CURRENCIES[targetCountry]?.symbol || '$'}{totalCampaignBudget.toFixed(2)}</strong>
                  <span className="budget-calc-formula">({targetCompletions.toLocaleString()} completions &times; {COUNTRY_CURRENCIES[targetCountry]?.symbol || '$'}{costPerCompletion.toFixed(2)} payout)</span>
                </div>
              </div>

              {/* APP SPECIFICATIONS */}
              <div className="form-section">
                <h2 className="section-header">2. Application Specifications</h2>
                
                <div className="form-group">
                  <label>Application Name *</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. MyMobileApp, CoinGame" 
                    required
                  />
                </div>

                <div className="form-group">
                  <label>App Target Link (Redirect URL) *</label>
                  <input 
                    type="url" 
                    value={externalUrl} 
                    onChange={(e) => setExternalUrl(e.target.value)} 
                    placeholder="https://example.com/download-or-test" 
                    required
                  />
                  <span className="input-helper">Link where users will perform actions (Play Store, App Store, Web page).</span>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Campaign Category *</label>
                    <select 
                      value={category} 
                      onChange={(e) => {
                        const newCat = e.target.value as any;
                        setCategory(newCat);
                        const autoDesc = CATEGORY_DESCRIPTIONS[newCat];
                        if (autoDesc) setDescription(autoDesc);
                      }}
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
                      <option value="Gaming">Gaming (Game Installs & Levels)</option>
                      <option value="Surveys">Surveys (Demographics Opinion)</option>
                      <option value="App Testing">App Testing (User Feedback)</option>
                      <option value="Passive">Passive Income (Idle Bandwidth)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Supported Platforms (Select all that apply) *</label>
                    <div className="checkbox-row">
                      {['iOS', 'Android', 'Web'].map((plat) => (
                        <div 
                          key={plat} 
                          onClick={() => togglePlatform(plat as any)}
                          className={`checkbox-selector ${platforms.includes(plat as any) ? 'active' : ''}`}
                        >
                          {platforms.includes(plat as any) ? '✓' : '+'} {plat}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Target Country *</label>
                  <select 
                    value={targetCountry} 
                    onChange={(e) => setTargetCountry(e.target.value)}
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '6px', color: 'var(--text-primary)', height: '40px' }}
                  >
                    {Object.keys(COUNTRY_CURRENCIES).map(country => (
                      <option key={country} value={country}>{country} ({COUNTRY_CURRENCIES[country].currency} - {COUNTRY_CURRENCIES[country].symbol})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Campaign Keywords (Comma separated)</label>
                  <input 
                    type="text" 
                    value={tagsInput} 
                    onChange={(e) => setTagsInput(e.target.value)} 
                    placeholder="e.g. Fast install, Level 5, Survey (comma separated)"
                  />
                </div>
              </div>

              {/* COPY & CONTENT */}
              <div className="form-section">
                <h2 className="section-header">3. Instructions & Description</h2>
                
                <div className="form-group">
                  <label>Short Pitch / Description *</label>
                  <input 
                    type="text" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="e.g. Install and play to level 10 to earn." 
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Detailed Steps & Guidelines *</label>
                  <textarea 
                    value={longDescription} 
                    onChange={(e) => setLongDescription(e.target.value)} 
                    placeholder="Describe details, eligibility, rules, and steps users need to follow on the external app."
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* TASK LIST BUILDER */}
              <div className="form-section">
                <h2 className="section-header">4. Action Task List</h2>
                <p className="section-desc">Design sub-tasks users perform to progress in the campaign. Use one of our quick presets to populate instantly!</p>

                {/* TASK PRESET GRID */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Click to Load Preset Template:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                    {TASK_PRESETS.map((preset, index) => (
                      <div
                        key={preset.title}
                        onClick={() => handleApplyPreset(preset, index)}
                        style={{
                          padding: '8px 12px',
                          background: activePresetIndex === index ? 'rgba(79, 70, 229, 0.12)' : 'rgba(255,255,255,0.01)',
                          border: '1px solid ' + (activePresetIndex === index ? 'var(--accent-indigo)' : 'var(--border-color)'),
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        className="preset-card"
                      >
                        <span style={{ fontSize: '1.4rem' }}>{preset.icon}</span>
                        <strong style={{ fontSize: '0.78rem', display: 'block', color: 'var(--text-primary)' }}>{preset.tag}</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>+${preset.reward.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="added-tasks-container">
                  {tasks.length > 0 ? (
                    tasks.map((task, idx) => (
                      <div key={task.id} className="task-preview-chip">
                        <div>
                          <strong>{idx + 1}. {task.title}</strong>
                          <span className="task-reward-preview">+{COUNTRY_CURRENCIES[targetCountry]?.symbol || '$'}{task.reward.toFixed(2)}</span>
                          <p className="task-desc-preview">{task.description}</p>
                        </div>
                        <button type="button" onClick={() => handleRemoveTask(task.id)} className="remove-task-btn">✕</button>
                      </div>
                    ))
                  ) : (
                    <p className="no-tasks-text">No sub-tasks configured. Add preset tasks or customize below.</p>
                  )}
                </div>

                <div className="glass-card task-builder-subform">
                  <h3>Customize Task Action</h3>
                  <div className="form-group">
                    <label>Action Title</label>
                    <input 
                      type="text" 
                      value={taskTitle} 
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="e.g. Register account with email"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group" style={{ flex: 2 }}>
                      <label>Action Description</label>
                      <input 
                        type="text" 
                        value={taskDesc} 
                        onChange={(e) => setTaskDesc(e.target.value)}
                        placeholder="e.g. Accounts must be verified to count."
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Action Payout ({COUNTRY_CURRENCIES[targetCountry]?.currency || 'USD'} {COUNTRY_CURRENCIES[targetCountry]?.symbol || '$'})</label>
                      <input 
                        type="number" 
                        step="0.05"
                        value={taskReward} 
                        onChange={(e) => setTaskReward(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <button type="button" onClick={handleAddTask} className="glow-btn-cyan" style={{ padding: '8px 16px', fontSize: '0.85rem', width: 'fit-content' }}>
                    + Insert Action
                  </button>
                </div>
              </div>

              <button type="submit" className="glow-btn-purple" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
                Submit Partnership Lead
              </button>
            </form>
          </div>

          {/* Right Live Mobile Offerwall Simulator */}
          <div className="sticky-mobile-simulator" style={{ position: 'sticky', top: '10px' }}>
            <div className="phone-device-mockup" style={{
              width: '320px',
              height: '500px',
              background: '#090d16',
              border: '12px solid #1f293d',
              borderRadius: '36px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              margin: '0 auto',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}>
              {/* iPhone Notch */}
              <div style={{
                width: '120px',
                height: '18px',
                background: '#1f293d',
                borderRadius: '0 0 14px 14px',
                margin: '0 auto',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10
              }} />

              {/* iOS Status Bar */}
              <div style={{
                height: '38px',
                background: '#111827',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                padding: '0 20px 6px 20px',
                fontSize: '0.72rem',
                color: '#fff',
                fontWeight: 600,
                borderBottom: '1px solid #1f293d',
                userSelect: 'none'
              }}>
                <span style={{ fontSize: '0.7rem' }}>9:41</span>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem' }}>📶</span>
                  <span style={{ fontSize: '0.75rem' }}>📶</span>
                  <span style={{ fontSize: '0.8rem', lineHeight: 1 }}>🔋</span>
                </div>
              </div>

              {/* Scrollable Screen Content */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }} className="phone-screen-scroll">
                
                {/* Mock Campaign Card */}
                <div style={{
                  background: '#1f293d',
                  borderRadius: '12px',
                  padding: '14px',
                  border: '1px solid rgba(79, 70, 229, 0.2)'
                }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      {name ? name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{ margin: 0, fontSize: '0.85rem', color: '#fff', fontWeight: 700 }}>{name || 'Your App Name'}</h5>
                      <span style={{
                        fontSize: '0.68rem',
                        padding: '1px 5px',
                        background: 'rgba(79, 70, 229, 0.2)',
                        color: '#a5b4fc',
                        borderRadius: '3px',
                        fontWeight: 600
                      }}>{category}</span>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af', lineHeight: 1.4 }}>
                    {description || 'Provide a short pitch describing the main conversion flow.'}
                  </p>
                </div>

                {/* Simulated Task List */}
                <div>
                  <h6 style={{ margin: '0 0 8px 0', fontSize: '0.78rem', color: '#e5e7eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions Required</h6>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {tasks.length > 0 ? (
                      tasks.map((task, idx) => (
                        <div key={task.id} style={{
                          background: '#111827',
                          border: '1px solid #1f293d',
                          borderRadius: '8px',
                          padding: '10px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div style={{ flex: 1, paddingRight: '8px' }}>
                            <strong style={{ fontSize: '0.75rem', color: '#fff', display: 'block' }}>{idx + 1}. {task.title}</strong>
                            <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>{task.description}</span>
                          </div>
                          <span style={{
                            color: '#10b981',
                            fontWeight: 'bold',
                            fontSize: '0.78rem',
                            fontFamily: 'var(--font-display)',
                            whiteSpace: 'nowrap'
                          }}>+{COUNTRY_CURRENCIES[targetCountry]?.symbol || '$'}{task.reward.toFixed(2)}</span>
                        </div>
                      ))
                    ) : (
                      <div style={{
                        textAlign: 'center',
                        padding: '24px 12px',
                        border: '1px dashed #1f293d',
                        borderRadius: '8px',
                        color: '#6b7280',
                        fontSize: '0.72rem'
                      }}>
                        No actions added. Click presets on the left to see tasks render live here!
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Call to Action Button inside mobile simulator */}
              <div style={{
                padding: '12px 16px',
                background: '#111827',
                borderTop: '1px solid #1f293d'
              }}>
                <button type="button" style={{
                  width: '100%',
                  background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  {name ? `Get ${name}` : 'Download App'}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      <style>{`
        .partner-content-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 32px;
          box-shadow: var(--shadow-md);
          transition: background-color 0.2s, border-color 0.2s;
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

        /* Forms configuration styling */
        .offer-form {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .form-section {
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-section:last-of-type {
          border-bottom: none;
          padding-bottom: 0;
        }
        .section-header {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--accent-indigo);
        }
        .section-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: -8px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .form-group input, 
        .form-group select, 
        .form-group textarea {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-color);
          padding: 10px 14px;
          border-radius: 6px;
          color: var(--text-primary);
          outline: none;
          font-size: 0.9rem;
          font-family: var(--font-primary);
          transition: all 0.2s;
        }
        .form-group input:focus, 
        .form-group select:focus, 
        .form-group textarea:focus {
          border-color: var(--accent-indigo);
          background: rgba(255, 255, 255, 0.04);
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 768px) {
          .builder-split-layout {
            grid-template-columns: 1fr !important;
          }
          .sticky-mobile-simulator {
            position: relative !important;
            top: 0 !important;
            margin-top: 24px;
          }
        }
        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
        .input-helper {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .checkbox-row {
          display: flex;
          gap: 10px;
        }
        .checkbox-selector {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-color);
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s;
          color: var(--text-secondary);
        }
        .checkbox-selector:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: var(--border-hover);
        }
        .checkbox-selector.active {
          border-color: var(--accent-indigo);
          background: rgba(79, 70, 229, 0.06);
          color: var(--accent-indigo);
        }
        .added-tasks-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .task-preview-chip {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-color);
          padding: 12px 14px;
          border-radius: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        .task-reward-preview {
          margin-left: 8px;
          color: var(--accent-emerald);
          font-family: var(--font-display);
          font-weight: 700;
        }
        .task-desc-preview {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .remove-task-btn {
          background: transparent;
          border: none;
          color: rgba(239, 68, 68, 0.6);
          font-size: 1rem;
          cursor: pointer;
        }
        .remove-task-btn:hover {
          color: rgba(239, 68, 68, 1);
        }
        .task-builder-subform {
          padding: 16px;
          background: rgba(0,0,0,0.02);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .task-builder-subform h3 {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
        }
        .budget-calculator-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(79, 70, 229, 0.03);
          border: 1px solid rgba(79, 70, 229, 0.12);
          border-radius: 6px;
          padding: 16px;
        }
        .budget-lbl {
          font-size: 0.72rem;
          text-transform: uppercase;
          color: var(--text-secondary);
          letter-spacing: 0.05em;
          font-weight: 600;
        }
        .budget-total-val {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 900;
          color: var(--accent-indigo);
          margin: 4px 0;
        }
        .budget-calc-formula {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .preset-card:hover {
          background: rgba(79, 70, 229, 0.05) !important;
          border-color: var(--border-hover) !important;
          transform: translateY(-2px);
        }
        .phone-screen-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .phone-screen-scroll::-webkit-scrollbar-thumb {
          background: #1f293d;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
