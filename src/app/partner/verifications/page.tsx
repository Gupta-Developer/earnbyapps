"use client";

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

export default function PartnerVerifications() {
  const { userProfile, submissions, approveSubmission, rejectSubmission } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Lightbox modal state
  const [lightboxMedia, setLightboxMedia] = useState<{ type: 'image' | 'video', url: string } | null>(null);

  // Filter submissions assigned to this logged-in user
  const myVerifications = submissions.filter(sub => 
    userProfile && sub.verifierEmail === userProfile.email
  );

  const handleCopy = (text: string, subId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(subId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="partner-content-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '32px' }}>
      <div className="card-header-section" style={{ marginBottom: '24px' }}>
        <h2 className="card-heading" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
          Referral Link Completions Review
        </h2>
        <p className="card-subheading" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Review and verify screenshots or screen recordings submitted by earners on your referral links. Approve to reward them.
        </p>
      </div>

      <div className="table-responsive-container">
        <table className="partner-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>User Details</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>Campaign Name</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>Media Proof</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>Description / Text</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>Reward</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myVerifications.length > 0 ? (
              myVerifications.map((sub) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px' }}>
                    <strong>{sub.userName}</strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {sub.userEmail}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <strong>{sub.appName}</strong>
                  </td>
                  
                  {/* Media Proof Preview Column */}
                  <td style={{ padding: '16px' }}>
                    {sub.proofUrl ? (
                      <button
                        onClick={() => setLightboxMedia({ type: (sub.proofType === 'video' ? 'video' : 'image'), url: sub.proofUrl || '' })}
                        style={{
                          background: 'rgba(79, 70, 229, 0.08)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          color: 'var(--accent-indigo)',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {sub.proofType === 'video' ? '🎬 Play Video' : '🖼️ View Screenshot'}
                      </button>
                    ) : (
                      <span style={{ fontStyle: 'italic', fontSize: '0.75rem', color: 'var(--text-muted)' }}>No media</span>
                    )}
                  </td>

                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-color)',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)',
                        maxWidth: '180px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }} title={sub.proof}>
                        {sub.proof}
                      </div>
                      <button 
                        onClick={() => handleCopy(sub.proof, sub.id)}
                        style={{
                          padding: '6px 10px',
                          fontSize: '0.75rem',
                          background: copiedId === sub.id ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-color)',
                          color: copiedId === sub.id ? 'black' : 'var(--text-primary)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {copiedId === sub.id ? 'Copied!' : '📋 Copy'}
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                    +${sub.reward.toFixed(2)}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 'bold',
                      background: sub.status === 'Pending' ? 'rgba(245,158,11,0.1)' : sub.status === 'Approved' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: sub.status === 'Pending' ? '#f59e0b' : sub.status === 'Approved' ? 'var(--accent-emerald)' : '#ef4444'
                    }}>
                      {sub.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    {sub.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => approveSubmission(sub.id)} 
                          className="glow-btn-cyan" 
                          style={{ padding: '6px 12px', fontSize: '0.75rem', border: 'none', cursor: 'pointer' }}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => rejectSubmission(sub.id)} 
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Verified</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ padding: '32px', fontStyle: 'italic', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No pending earner submissions found for your referral links.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Lightbox Modal Backdrop */}
      {lightboxMedia && (
        <div 
          onClick={() => setLightboxMedia(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
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
                fontSize: '1.5rem',
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
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  borderRadius: '6px'
                }}
              />
            ) : (
              <img 
                src={lightboxMedia.url} 
                alt="Screenshot proof" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  borderRadius: '6px',
                  objectFit: 'contain'
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
