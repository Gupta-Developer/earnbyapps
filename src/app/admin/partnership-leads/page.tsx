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
      {/* List Panel */}
      <div className="submissions-panel">
        <div className="card-header-section" style={{ marginBottom: '20px' }}>
          <h2 className="card-heading">Partnership Leads ({partnershipLeads.length})</h2>
          <p className="card-subheading">Review proposed campaigns submitted by partners.</p>
        </div>

        <div className="pending-moderation-list">
          {partnershipLeads.length > 0 ? (
            partnershipLeads.map((lead) => (
              <div 
                key={lead.id}
                onClick={() => setSelectedLeadId(lead.id)}
                className={`pending-item-card ${selectedLeadId === lead.id ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <strong style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{lead.appName}</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="app-cat-badge">{getCategoryIcon(lead.category)} {lead.category}</span>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 'bold',
                        background: 
                          lead.status === 'New' ? 'rgba(245, 158, 11, 0.12)' : 
                          lead.status === 'Contacted' ? 'rgba(59, 130, 246, 0.12)' :
                          lead.status === 'Converted' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        color: 
                          lead.status === 'New' ? '#f59e0b' : 
                          lead.status === 'Contacted' ? '#3b82f6' :
                          lead.status === 'Converted' ? 'var(--accent-emerald)' : '#ef4444'
                      }}>{lead.status}</span>
                    </div>
                  </div>
                  <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{lead.earningRate}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-pending-banner">
              <span style={{ fontSize: '2rem' }}>✓</span>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem' }}>All clean! No partnership leads registered.</p>
            </div>
          )}
        </div>

        <div className="card-header-section" style={{ marginTop: '36px', marginBottom: '16px' }}>
          <h3 className="card-heading" style={{ fontSize: '1.2rem' }}>Active Live Campaigns ({apps.length})</h3>
          <p className="card-subheading">Currently active campaigns on the main offerwall directory.</p>
        </div>

        <div className="active-list-container">
          {apps.map((app) => (
            <div key={app.id} className="active-campaign-row">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{app.name}</strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{getCategoryIcon(app.category)} {app.category}</span>
              </div>
              <span style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: 700 }}>{app.earningRate}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inspector Panel */}
      <div className="inspector-panel">
        {selectedLead ? (
          <div className="inspector-content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <h3 className="inspector-title" style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold' }}>Lead Workspace</h3>
              <span style={{
                fontSize: '0.75rem',
                padding: '4px 12px',
                borderRadius: '6px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: 
                  selectedLead.status === 'New' ? 'rgba(245, 158, 11, 0.12)' : 
                  selectedLead.status === 'Contacted' ? 'rgba(59, 130, 246, 0.12)' :
                  selectedLead.status === 'Converted' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
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
                <strong className="meta-val" style={{ wordBreak: 'break-all' }}>{selectedLead.partnerEmail}</strong>
              </div>
              <div>
                <span className="meta-lbl">Target Completions</span>
                <strong className="meta-val">{(selectedLead.targetCompletions || 1000).toLocaleString()}</strong>
              </div>
              <div>
                <span className="meta-lbl">Budget Sizing</span>
                <strong className="meta-val" style={{ color: 'var(--accent-emerald)' }}>${(selectedLead.totalBudget || 500).toFixed(2)}</strong>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span className="meta-lbl">Redirect Link</span>
                <a href={selectedLead.externalUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-indigo)', fontSize: '0.85rem', wordBreak: 'break-all', display: 'inline-block', marginTop: '2px', fontWeight: 600 }}>
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
              <span className="meta-lbl" style={{ marginBottom: '8px' }}>Suggested Tasks ({selectedLead.suggestedTasks?.length || 0})</span>
              <div className="tasks-scroll-list">
                {selectedLead.suggestedTasks && selectedLead.suggestedTasks.length > 0 ? (
                  selectedLead.suggestedTasks.map((task, idx) => (
                    <div key={task.id} className="task-sub-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                        <span>{idx + 1}. {task.title}</span>
                        <span style={{ color: 'var(--accent-emerald)' }}>+${task.reward.toFixed(2)}</span>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px', margin: '4px 0 0 0', lineHeight: 1.4 }}>{task.description}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>No suggested tasks.</p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <a 
                href={`mailto:${selectedLead.partnerEmail}?subject=Partnership Proposal for ${selectedLead.appName}`}
                className="glow-btn-purple"
                style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600 }}
              >
                ✉ Connect via Email
              </a>
              <div className="inspector-action-buttons" style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => updateLeadStatus(selectedLead.id, 'Contacted')}
                  className="glow-btn-cyan"
                  style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                >
                  Mark Contacted
                </button>
                <button 
                  onClick={() => updateLeadStatus(selectedLead.id, 'Converted')}
                  className="glow-btn-cyan"
                  style={{ flex: 1, padding: '10px', background: 'var(--accent-emerald)', color: 'black', fontSize: '0.85rem' }}
                >
                  Mark Converted
                </button>
                <button 
                  onClick={() => updateLeadStatus(selectedLead.id, 'Declined')}
                  className="reject-moderation-btn"
                  style={{ padding: '10px', fontSize: '0.85rem' }}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-inspector-banner">
            <span style={{ fontSize: '2.5rem', opacity: 0.6 }}>🔍</span>
            <h4 style={{ margin: '12px 0 6px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>No Lead Selected</h4>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '300px', lineHeight: 1.5 }}>
              Select a partnership lead from the list on the left to review contact details, budget sizes, and manage workflow status.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .admin-moderation-layout {
          display: grid;
          grid-template-columns: 1.2fr 1.8fr;
          gap: 24px;
          align-items: flex-start;
          width: 100%;
        }

        .submissions-panel {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 24px;
          box-shadow: var(--shadow-md);
        }

        .pending-moderation-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pending-item-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s;
          cursor: pointer;
        }

        .pending-item-card:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: var(--border-hover);
        }

        .pending-item-card.active {
          border-color: var(--accent-indigo);
          background: rgba(79, 70, 229, 0.04);
          box-shadow: 0 0 12px rgba(79, 70, 229, 0.15);
        }

        .app-cat-badge {
          display: inline-block;
          font-size: 0.7rem;
          background: var(--border-color);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--text-secondary);
        }

        .empty-pending-banner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px;
          border: 1px dashed var(--border-color);
          border-radius: 8px;
          color: var(--text-muted);
          text-align: center;
        }

        .active-list-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .active-campaign-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 0.85rem;
        }

        .inspector-panel {
          position: sticky;
          top: 24px;
        }

        .inspector-content-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 24px;
          box-shadow: var(--shadow-md);
        }

        .meta-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .meta-lbl {
          display: block;
          font-size: 0.72rem;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 600;
          letter-spacing: 0.03em;
          margin-bottom: 2px;
        }

        .meta-val {
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .inspector-field {
          margin-bottom: 18px;
        }

        .field-text {
          margin: 4px 0 0 0;
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .tasks-scroll-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 180px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .task-sub-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 10px;
        }

        .empty-inspector-banner {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 60px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          box-shadow: var(--shadow-md);
        }

        @media (max-width: 992px) {
          .admin-moderation-layout {
            grid-template-columns: 1fr;
          }
          .inspector-panel {
            position: relative;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
}
