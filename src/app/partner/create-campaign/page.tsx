"use client";

import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { AppTask } from '../../../data/apps';

export default function CreatePartnerCampaign() {
  const { submitOffer } = useApp();
  const [success, setSuccess] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Gaming' | 'Surveys' | 'App Testing' | 'Passive'>('Gaming');
  const [platforms, setPlatforms] = useState<('iOS' | 'Android' | 'Web')[]>([]);
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [externalUrl, setExternalUrl] = useState('');

  // B2B Bulk Settings
  const [targetCompletions, setTargetCompletions] = useState<number>(1000);
  const [costPerCompletion, setCostPerCompletion] = useState<number>(0.50);

  // Task builder states
  const [tasks, setTasks] = useState<AppTask[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskReward, setTaskReward] = useState<number>(0.25);

  // Calculate live campaign budget
  const totalCampaignBudget = useMemo(() => {
    return parseFloat((targetCompletions * costPerCompletion).toFixed(2));
  }, [targetCompletions, costPerCompletion]);

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

    const displayEarningRate = `$${costPerCompletion.toFixed(2)} / action`;

    submitOffer({
      name,
      category,
      platforms,
      earningRate: displayEarningRate,
      averageEarningsPerDay: costPerCompletion,
      description,
      longDescription,
      tags: tags.length > 0 ? tags : ['Bulk campaign', 'Verified partner'],
      actionText: `Open ${name}`,
      externalUrl,
      tasks
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
  };

  return (
    <div className="partner-form-viewport">
      {success ? (
        <div className="partner-content-card success-card" style={{ textAlign: 'center', padding: '48px' }}>
          <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '20px' }}>🎉</span>
          <h2 className="card-heading" style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Campaign Configured Successfully!</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Your campaign for <strong>{name}</strong> has been created. Once verified and approved by an administrator, it will be published to the Offerwall.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button onClick={handleReset} className="glow-btn-cyan">Create Another Campaign</button>
            <a href="/partner/overview" className="glow-btn-purple" style={{ textDecoration: 'none', display: 'inline-block', lineHeight: '40px', padding: '0 24px', borderRadius: '8px', fontWeight: 600 }}>Go to Overview</a>
          </div>
        </div>
      ) : (
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
                  <label>Payout Per Action ($ USD) *</label>
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
                <strong className="budget-total-val">${totalCampaignBudget.toFixed(2)}</strong>
                <span className="budget-calc-formula">({targetCompletions.toLocaleString()} completions &times; ${costPerCompletion.toFixed(2)} payout)</span>
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
                  <select value={category} onChange={(e) => setCategory(e.target.value as any)}>
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
              <p className="section-desc">Design sub-tasks users perform to progress in the campaign.</p>
              
              <div className="added-tasks-container">
                {tasks.length > 0 ? (
                  tasks.map((task, idx) => (
                    <div key={task.id} className="task-preview-chip">
                      <div>
                        <strong>{idx + 1}. {task.title}</strong>
                        <span className="task-reward-preview">+${task.reward.toFixed(2)}</span>
                        <p className="task-desc-preview">{task.description}</p>
                      </div>
                      <button type="button" onClick={() => handleRemoveTask(task.id)} className="remove-task-btn">✕</button>
                    </div>
                  ))
                ) : (
                  <p className="no-tasks-text">No sub-tasks configured. Add custom tasks below.</p>
                )}
              </div>

              <div className="glass-card task-builder-subform">
                <h3>Add Campaign Action</h3>
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
                    <label>Action Payout ($ USD)</label>
                    <input 
                      type="number" 
                      step="0.05"
                      value={taskReward} 
                      onChange={(e) => setTaskReward(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <button type="button" onClick={handleAddTask} className="glow-btn-cyan" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  + Insert Action
                </button>
              </div>
            </div>

            <button type="submit" className="glow-btn-purple" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
              Launch Bulk Campaign
            </button>
          </form>
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
      `}</style>
    </div>
  );
}
