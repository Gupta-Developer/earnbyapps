"use client";

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { getCategoryIcon } from '../../../data/apps';

export default function SubmissionsPage() {
  const { submissions, approveSubmission, rejectSubmission } = useApp();
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lightboxMedia, setLightboxMedia] = useState<{ type: 'image' | 'video', url: string } | null>(null);

  // Filter submissions assigned to admin verifications
  const adminSubmissions = submissions.filter(sub => sub.verifierEmail === 'admin');
  const selectedSub = adminSubmissions.find(sub => sub.id === selectedSubId);

  const handleCopy = (text: string, subId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(subId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="admin-moderation-layout">
      {/* List Panel */}
      <div className="submissions-panel">
        <div className="card-header-section" style={{ marginBottom: '20px' }}>
          <h2 className="card-heading">Completions Moderation ({adminSubmissions.length})</h2>
          <p className="card-subheading">Verify and approve task completions submitted by earners.</p>
        </div>

        <div className="pending-moderation-list">
          {adminSubmissions.length > 0 ? (
            adminSubmissions.map((sub) => (
              <div 
                key={sub.id}
                onClick={() => setSelectedSubId(sub.id)}
                className={`pending-item-card ${selectedSubId === sub.id ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      {sub.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)', display: 'block' }}>{sub.appName}</strong>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>by {sub.userName}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.85rem' }}>+${sub.reward.toFixed(2)}</span>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 'bold',
                      background: 
                        sub.status === 'Pending' ? 'rgba(245,158,11,0.12)' : 
                        sub.status === 'Approved' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                      color: 
                        sub.status === 'Pending' ? '#f59e0b' : 
                        sub.status === 'Approved' ? 'var(--accent-emerald)' : '#ef4444'
                    }}>{sub.status}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-pending-banner">
              <span style={{ fontSize: '2rem' }}>✓</span>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem' }}>No task completions pending verification.</p>
            </div>
          )}
        </div>
      </div>

      {/* Inspector Panel */}
      <div className="inspector-panel">
        {selectedSub ? (
          <div className="inspector-content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <h3 className="inspector-title" style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold' }}>Submission Inspector</h3>
              <span style={{
                fontSize: '0.75rem',
                padding: '4px 12px',
                borderRadius: '6px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: 
                  selectedSub.status === 'Pending' ? 'rgba(245,158,11,0.12)' : 
                  selectedSub.status === 'Approved' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                color: 
                  selectedSub.status === 'Pending' ? '#f59e0b' : 
                  selectedSub.status === 'Approved' ? 'var(--accent-emerald)' : '#ef4444'
              }}>{selectedSub.status}</span>
            </div>

            <div className="meta-details-grid">
              <div>
                <span className="meta-lbl">Earner Name</span>
                <strong className="meta-val">{selectedSub.userName}</strong>
              </div>
              <div>
                <span className="meta-lbl">Earner Email</span>
                <strong className="meta-val" style={{ wordBreak: 'break-all' }}>{selectedSub.userEmail}</strong>
              </div>
              <div>
                <span className="meta-lbl">Campaign / App</span>
                <strong className="meta-val">{selectedSub.appName}</strong>
              </div>
              <div>
                <span className="meta-lbl">Reward Amount</span>
                <strong className="meta-val" style={{ color: 'var(--accent-emerald)' }}>+${selectedSub.reward.toFixed(2)}</strong>
              </div>
              <div>
                <span className="meta-lbl">Submitted At</span>
                <strong className="meta-val">{selectedSub.time}</strong>
              </div>
              <div>
                <span className="meta-lbl">Submission ID</span>
                <strong className="meta-val" style={{ fontSize: '0.78rem', opacity: 0.8 }}>{selectedSub.id}</strong>
              </div>
            </div>

            {/* Media Proof Preview Panel */}
            {selectedSub.proofUrl && (
              <div className="inspector-field">
                <span className="meta-lbl" style={{ marginBottom: '8px' }}>Visual Media Proof</span>
                <div style={{
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  {selectedSub.proofType === 'video' ? (
                    <video 
                      src={selectedSub.proofUrl} 
                      controls 
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                    />
                  ) : (
                    <img 
                      src={selectedSub.proofUrl} 
                      alt="Proof Screenshot"
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px', cursor: 'pointer', objectFit: 'contain' }}
                      onClick={() => setLightboxMedia({ type: 'image', url: selectedSub.proofUrl || '' })}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setLightboxMedia({ type: selectedSub.proofType === 'video' ? 'video' : 'image', url: selectedSub.proofUrl || '' })}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    🔍 Zoom/Fullscreen Preview
                  </button>
                </div>
              </div>
            )}

            <div className="inspector-field">
              <span className="meta-lbl">Description / Text Proof</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '6px' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  flex: 1,
                  wordBreak: 'break-all'
                }}>
                  {selectedSub.proof}
                </div>
                <button 
                  onClick={() => handleCopy(selectedSub.proof, selectedSub.id)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '0.78rem',
                    background: copiedId === selectedSub.id ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-color)',
                    color: copiedId === selectedSub.id ? 'black' : 'var(--text-primary)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {copiedId === selectedSub.id ? 'Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>

            {selectedSub.status === 'Pending' && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <button 
                  onClick={() => approveSubmission(selectedSub.id)}
                  className="glow-btn-cyan"
                  style={{ flex: 1, padding: '12px', background: 'var(--accent-emerald)', color: 'black' }}
                >
                  Approve Completion
                </button>
                <button 
                  onClick={() => rejectSubmission(selectedSub.id)}
                  className="reject-moderation-btn"
                  style={{ flex: 1, padding: '12px' }}
                >
                  Reject Completion
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-inspector-banner">
            <span style={{ fontSize: '2.5rem', opacity: 0.6 }}>✔️</span>
            <h4 style={{ margin: '12px 0 6px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>Select Submission</h4>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '300px', lineHeight: 1.5 }}>
              Select a task completion claim from the list on the left to verify screenshots, media proofs, and approve payouts.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox zoom modal */}
      {lightboxMedia && (
        <div 
          onClick={() => setLightboxMedia(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '90%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <button
              onClick={() => setLightboxMedia(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ✕ Close Preview
            </button>

            {lightboxMedia.type === 'video' ? (
              <video 
                src={lightboxMedia.url} 
                controls 
                autoPlay 
                style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '6px' }}
              />
            ) : (
              <img 
                src={lightboxMedia.url} 
                alt="Zoomed proof" 
                style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '6px', objectFit: 'contain' }}
              />
            )}
          </div>
        </div>
      )}

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
