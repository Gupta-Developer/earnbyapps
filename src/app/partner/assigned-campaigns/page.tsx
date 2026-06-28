"use client";

import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { EarningApp } from '../../../data/apps';

export default function PartnerAssignedCampaigns() {
  const { apps } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedCampaign, setSelectedCampaign] = useState<EarningApp | null>(null);

  // Combine live custom approved campaigns with mock active assigned campaigns
  const assignedCampaigns = useMemo(() => {
    // Standard mock assigned campaigns
    const mockAssigned = [
      {
        id: 'mock-assigned-1',
        name: 'Mistplay Gaming Campaign',
        category: 'Gaming' as const,
        platforms: ['Android'] as const,
        earningRate: '$0.75 / action',
        averageEarningsPerDay: 0.75,
        rating: 4.5,
        reviewsCount: 3200,
        description: 'Deliver game installs and level completions.',
        longDescription: 'Monitored gaming conversions focusing on strategy and arcade applications.',
        tags: ['High Engagement', 'Android'],
        actionText: 'Open Mistplay',
        tasks: [
          { id: 'm-t-1', title: 'Install Mistplay', description: 'Install app and register profile.', reward: 1.0 },
          { id: 'm-t-2', title: 'Reach level 5', description: 'Reach level 5 in any recommended game.', reward: 2.5 }
        ],
        targetCompletions: 3000,
        completedCompletions: 1840,
        budget: 2250,
        spent: 1380
      },
      {
        id: 'mock-assigned-2',
        name: 'Prime Opinion Panel B2B',
        category: 'Surveys' as const,
        platforms: ['iOS', 'Android', 'Web'] as const,
        earningRate: '$1.20 / action',
        averageEarningsPerDay: 1.20,
        rating: 4.6,
        reviewsCount: 1200,
        description: 'Gather verified demographics survey reviews.',
        longDescription: 'High-quality survey panel conversions for research purposes.',
        tags: ['Surveys', 'Multiplatform'],
        actionText: 'Join Prime Opinion',
        tasks: [
          { id: 'm-t-3', title: 'Verify demographic data', description: 'Complete initial onboarding survey.', reward: 1.5 }
        ],
        targetCompletions: 5000,
        completedCompletions: 2150,
        budget: 6000,
        spent: 2580
      }
    ];

    // Get live approved campaigns from context (specifically ones created dynamically/by partner)
    const liveCustom = apps
      .filter(app => app.id.startsWith('custom-'))
      .map(app => {
        // Calculate completions and budget info based on typical target metrics
        const target = app.targetCompletions || 1000;
        const rateVal = parseFloat(app.earningRate.replace(/[^0-9.]/g, '')) || 0.5;
        const budget = target * rateVal;
        return {
          ...app,
          targetCompletions: target,
          completedCompletions: Math.floor(target * 0.18), // mock 18% progress
          budget: budget,
          spent: Math.floor(target * 0.18) * rateVal
        };
      });

    return [...liveCustom, ...mockAssigned];
  }, [apps]);

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    return assignedCampaigns.filter(camp => {
      const matchesSearch = camp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            camp.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || camp.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [assignedCampaigns, searchTerm, categoryFilter]);

  // Summary Metrics
  const totalBudget = useMemo(() => assignedCampaigns.reduce((acc, c) => acc + c.budget, 0), [assignedCampaigns]);
  const totalSpent = useMemo(() => assignedCampaigns.reduce((acc, c) => acc + c.spent, 0), [assignedCampaigns]);
  const totalConversions = useMemo(() => assignedCampaigns.reduce((acc, c) => acc + c.completedCompletions, 0), [assignedCampaigns]);

  return (
    <div className="partner-content-card">
      <div className="card-header-section">
        <h2 className="card-heading">Assigned Campaigns</h2>
        <p className="card-subheading">Monitor live performance, budget burn, and conversions for campaigns assigned to your developer profile.</p>
      </div>

      {/* Stats row */}
      <div className="analytics-mock-grid">
        <div className="analytics-mini-card">
          <span className="mini-lbl">Conversions Delivered</span>
          <strong className="mini-val">{totalConversions.toLocaleString()}</strong>
          <span className="mini-change green-txt">▲ Active user traction</span>
        </div>
        <div className="analytics-mini-card">
          <span className="mini-lbl">Total Burned Budget</span>
          <strong className="mini-val">${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          <span className="mini-change green-txt">{(totalSpent / totalBudget * 100).toFixed(0)}% consumed</span>
        </div>
        <div className="analytics-mini-card">
          <span className="mini-lbl">Remaining Budget</span>
          <strong className="mini-val">${(totalBudget - totalSpent).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          <span className="mini-change">Allocated campaign funds</span>
        </div>
        <div className="analytics-mini-card">
          <span className="mini-lbl">Active Campaigns</span>
          <strong className="mini-val">{assignedCampaigns.length}</strong>
          <span className="mini-change">Running live on Offerwall</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="controls-row" style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search assigned campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'rgba(255,255,255,0.01)',
            color: 'var(--text-primary)',
            outline: 'none'
          }}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="filter-select"
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            outline: 'none'
          }}
        >
          <option value="All">All Categories</option>
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

      {/* Campaigns list table */}
      <div className="table-responsive-container">
        <table className="partner-table">
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Category</th>
              <th>Payout / Action</th>
              <th>Conversion Progress</th>
              <th>Budget Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((camp) => {
                const progress = (camp.completedCompletions / camp.targetCompletions) * 100;
                return (
                  <tr key={camp.id}>
                    <td>
                      <strong style={{ display: 'block' }}>{camp.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Platforms: {camp.platforms.join(', ')}</span>
                    </td>
                    <td>
                      <span className="category-tag">{camp.category}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>
                      {camp.earningRate}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                          {camp.completedCompletions.toLocaleString()} / {camp.targetCompletions.toLocaleString()} ({progress.toFixed(0)}%)
                        </span>
                        <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden', width: '100%' }}>
                          <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-indigo)' }}></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong style={{ display: 'block', fontSize: '0.85rem' }}>${camp.spent.toFixed(2)} spent</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>of ${camp.budget.toFixed(2)}</span>
                    </td>
                    <td>
                      <button 
                        onClick={() => setSelectedCampaign(camp as any)}
                        className="details-btn"
                        style={{
                          background: 'rgba(79, 70, 229, 0.1)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--accent-indigo)',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        Inspect Tasks
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '32px', fontStyle: 'italic', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No assigned campaigns match the search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details modal */}
      {selectedCampaign && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div className="glass-card modal-card" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>{selectedCampaign.name} Actions</h3>
              <button 
                onClick={() => setSelectedCampaign(null)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Below is the details of this campaign task active on the main earner offerwall.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.95rem', marginBottom: '8px' }}>
                  <span>Earning Action Payout</span>
                  <span style={{ color: 'var(--accent-emerald)' }}>+${selectedCampaign.reward.toFixed(2)}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                  {selectedCampaign.longDescription || selectedCampaign.description}
                </p>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Platform: <strong>{selectedCampaign.platforms.join(', ')}</strong> | Category: <strong>{selectedCampaign.category}</strong>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedCampaign(null)}
              className="glow-btn-cyan"
              style={{ padding: '10px', marginTop: '8px' }}
            >
              Close Inspector
            </button>
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
        .analytics-mock-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }
        .analytics-mini-card {
          background: rgba(255,255,255,0.01);
          border: 1px solid var(--border-color);
          padding: 20px;
          border-radius: 8px;
        }
        .mini-lbl {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        .mini-val {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 700;
          display: block;
          margin: 6px 0;
          color: var(--text-primary);
        }
        .mini-change {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .green-txt {
          color: var(--accent-emerald) !important;
        }
        .table-responsive-container {
          width: 100%;
          overflow-x: auto;
        }
        .partner-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.88rem;
        }
        .partner-table th {
          border-bottom: 1px solid var(--border-color);
          padding: 12px 16px;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.72rem;
          letter-spacing: 0.05em;
        }
        .partner-table td {
          border-bottom: 1px solid var(--border-color);
          padding: 16px;
          vertical-align: middle;
        }
        .category-tag {
          background: rgba(79, 70, 229, 0.06);
          color: var(--accent-indigo);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .details-btn:hover {
          background: rgba(79, 70, 229, 0.2) !important;
        }
      `}</style>
    </div>
  );
}
