"use client";

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { getCategoryIcon } from '../../../data/apps';

export default function PartnershipLeadsPage() {
  const { apps, partnershipLeads, updateLeadStatus } = useApp();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const selectedLead = partnershipLeads.find(lead => lead.id === selectedLeadId);

  return (
    <div className="admin-moderation-layout">
      <div className="submissions-panel">
        <div className="card-header-section">
          <h2 className="card-heading">Partnership Leads ({partnershipLeads.length})</h2>
          <p className="card-subheading">Review proposed campaigns submitted by users for partnership.</p>
        </div>

        <div className="pending-moderation-list">
          {partnershipLeads.length > 0 ? (
            partnershipLeads.map((lead) => (
              <div 
                key={lead.id}
                onClick={() => setSelectedLeadId(lead.id)}
                className={`pending-item-card ${selectedLeadId === lead.id ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem' }}>{lead.appName}</strong>
                    <span className="app-cat-badge">{getCategoryIcon(lead.category)} {lead.category}</span>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      marginLeft: '8px',
                      background: 
                      lead.status === 'New' ? 'rgba(245,158,11,0.1)' : 
                      lead.status === 'Contacted' ? 'rgba(59,130,246,0.1)' :
                      lead.status === 'Converted' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: 
                      lead.status === 'New' ? '#f59e0b' : 
                      lead.status === 'Contacted' ? '#3b82f6' :
                      lead.status === 'Converted' ? 'var(--accent-emerald)' : '#ef4444'
                    }}>{lead.status}</span>
                  </div>
                  <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>{lead.earningRate}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-pending-banner">
              <span>✓</span>
              <p>All clean! There are no partnership leads registered.</p>
            </div>
          )}
        </div>

        <h2 className="card-heading" style={{ marginTop: '36px', fontSize: '1.2rem' }}>Active Live Campaigns ({apps.length})</h2>
        <div className="active-list-container">
          {apps.map((app) => (
            <div key={app.id} className="active-campaign-row">
              <div>
                <strong>{app.name}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '8px' }}>({getCategoryIcon(app.category)} {app.category})</span>
              </div>
              <span style={{ color: 'var(--accent-emerald)', fontSize: '0.9rem', fontWeight: 600 }}>{app.earningRate}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inspector panel */}
      <div className="inspector-panel">
        {selectedLead ? (
          <div className="glass-card inspector-content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 className="inspector-title" style={{ margin: 0 }}>Lead Parameters</h3>
              <span style={{
                fontSize: '0.78rem',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: 'bold',
                background: 
                  selectedLead.status === 'New' ? 'rgba(245,158,11,0.1)' : 
                  selectedLead.status === 'Contacted' ? 'rgba(59,130,246,0.1)' :
                  selectedLead.status === 'Converted' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                color: 
                  selectedLead.status === 'New' ? '#f59e0b' : 
                  selectedLead.status === 'Contacted' ? '#3b82f6' :
                  selectedLead.status === 'Converted' ? 'var(--accent-emerald)' : '#ef4444'
              }}>{selectedLead.status}</span>
            </div>
            
            <div className="meta-details-grid">
              <div>
                <span className="meta-lbl">App Name</span>
                <strong className="meta-val">{selectedLead.appName}</strong>
              </div>
              <div>
                <span className="meta-lbl">Category</span>
                <strong className="meta-val">{selectedLead.category}</strong>
              </div>
              <div>
                <span className="meta-lbl">Earning Metric</span>
                <strong className="meta-val">{selectedLead.earningRate}</strong>
              </div>
              <div>
                <span className="meta-lbl">Platforms</span>
                <strong className="meta-val">{selectedLead.platforms.join(', ')}</strong>
              </div>
              <div>
                <span className="meta-lbl">Partner Name</span>
                <strong className="meta-val">{selectedLead.partnerName}</strong>
              </div>
              <div>
                <span className="meta-lbl">Partner Email</span>
                <strong className="meta-val">{selectedLead.partnerEmail}</strong>
              </div>
              <div>
                <span className="meta-lbl">Target Completions</span>
                <strong className="meta-val">{selectedLead.targetCompletions.toLocaleString()}</strong>
              </div>
              <div>
                <span className="meta-lbl">Budget Sizing</span>
                <strong className="meta-val" style={{ color: 'var(--accent-emerald)' }}>${selectedLead.totalBudget.toFixed(2)}</strong>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span className="meta-lbl">Redirect Link</span>
                <a href={selectedLead.externalUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-indigo)', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                  {selectedLead.externalUrl} ↗
                </a>
              </div>
            </div>

            <div className="inspector-field">
              <span className="meta-lbl">Short Description</span>
              <p className="field-text">{selectedLead.description}</p>
            </div>

            <div className="inspector-field">
              <span className="meta-lbl">Detailed Overview</span>
              <p className="field-text" style={{ whiteSpace: 'pre-wrap' }}>{selectedLead.longDescription}</p>
            </div>

            <div className="inspector-field">
              <span className="meta-lbl">Suggested Tasks ({selectedLead.suggestedTasks?.length || 0})</span>
              <div className="tasks-scroll-list">
                {selectedLead.suggestedTasks && selectedLead.suggestedTasks.length > 0 ? (
                  selectedLead.suggestedTasks.map((task, idx) => (
                    <div key={task.id} className="task-sub-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.85rem' }}>
                        <span>{idx + 1}. {task.title}</span>
                        <span style={{ color: 'var(--accent-emerald)' }}>+${task.reward.toFixed(2)}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{task.description}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-muted)' }}>No suggested tasks.</p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              <a 
                href={`mailto:${selectedLead.partnerEmail}?subject=Partnership Proposal for ${selectedLead.appName}`}
                className="glow-btn-purple"
                style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600 }}
              >
                ✉ Connect with Partner
              </a>
              <div className="inspector-action-buttons" style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => updateLeadStatus(selectedLead.id, 'Contacted')}
                  className="glow-btn-cyan"
                  style={{ flex: 1, padding: '10px' }}
                >
                  Mark Contacted
                </button>
                <button 
                  onClick={() => updateLeadStatus(selectedLead.id, 'Converted')}
                  className="glow-btn-cyan"
                  style={{ flex: 1, padding: '10px', background: 'var(--accent-emerald)', color: 'black' }}
                >
                  Mark Converted
                </button>
                <button 
                  onClick={() => updateLeadStatus(selectedLead.id, 'Declined')}
                  className="reject-moderation-btn"
                  style={{ padding: '10px' }}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card empty-inspector-banner">
            <span>🔍</span>
            <p>Select a partnership lead to view contact details, suggested tasks, and manage outreach status.</p>
          </div>
        )}
      </div>
    </div>
  );
}
