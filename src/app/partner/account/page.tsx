"use client";

import React from 'react';
import { useApp } from '../../../context/AppContext';
import { useSession } from 'next-auth/react';

export default function PartnerAccountPage() {
  const { userProfile } = useApp();
  const { data: session } = useSession();

  const handleEditProfile = () => {
    window.dispatchEvent(new CustomEvent('open-profile-modal'));
  };

  return (
    <div className="account-page-container">
      <div className="glass-card account-card">
        {/* Profile Header */}
        <div className="account-header">
          <div className="profile-avatar-container">
            {session && session.user?.image ? (
              <img 
                src={session.user.image} 
                alt="Profile Avatar" 
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar-placeholder">👤</div>
            )}
          </div>
          <div className="profile-title-section">
            <h2>{userProfile?.fullName || 'Partner User'}</h2>
            <p className="profile-role-badge">Campaign Partner</p>
          </div>
          <button onClick={handleEditProfile} className="edit-profile-btn">
            ✏️ Edit Profile
          </button>
        </div>

        <hr className="divider" />

        {/* Profile Details Sections */}
        <div className="details-grid">
          {/* Personal Info */}
          <div className="details-section">
            <h3>📋 Personal Information</h3>
            <div className="details-list">
              <div className="detail-item">
                <span className="detail-label">Full Name</span>
                <span className="detail-value">{userProfile?.fullName || 'Not Shared'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email Address</span>
                <span className="detail-value">{userProfile?.email || 'Not Shared'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone Number</span>
                <span className="detail-value">{userProfile?.phone || 'Not Shared'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Gender</span>
                <span className="detail-value">{userProfile?.gender || 'Not Shared'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Country</span>
                <span className="detail-value">{userProfile?.country || 'Not Shared'}</span>
              </div>
            </div>
          </div>

          {/* Payout Details */}
          <div className="details-section">
            <h3>💳 Payout Information</h3>
            <div className="details-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {userProfile?.paymentDetails && (userProfile.paymentDetails.trim().startsWith('[') || userProfile.paymentDetails.trim().startsWith('{')) ? (
                (() => {
                  try {
                    const parsed = JSON.parse(userProfile.paymentDetails);
                    if (Array.isArray(parsed)) {
                      return parsed.map((m: any, idx: number) => (
                        <div key={m.id || idx} style={{ borderBottom: idx < parsed.length - 1 ? '1px dashed var(--border-color)' : 'none', paddingBottom: '12px', marginBottom: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem' }}>{m.methodName}</span>
                            {m.isPreferred && (
                              <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: '#10b981', color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>
                                Active
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.85rem', paddingLeft: '8px' }}>
                            {Object.entries(m.details || {}).map(([key, val]: [string, any]) => (
                              <div key={key} style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                                <span style={{ textTransform: 'capitalize', color: 'var(--text-muted)' }}>{key.replace('_', ' ')}:</span> {val}
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    }
                  } catch (e) {}
                  return (
                    <div className="detail-item">
                      <span className="detail-label">Details</span>
                      <span className="detail-value text-monospace">{userProfile?.paymentDetails}</span>
                    </div>
                  );
                })()
              ) : (
                <>
                  <div className="detail-item">
                    <span className="detail-label">Payment Method</span>
                    <span className="detail-value highlight-payout">{userProfile?.paymentMethod || 'Not Configured'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Payment Details</span>
                    <span className="detail-value text-monospace">{userProfile?.paymentDetails || 'Not Configured'}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .account-page-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 8px 0;
        }
        .account-card {
          padding: 32px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          box-shadow: var(--shadow-md);
        }
        .account-header {
          display: flex;
          align-items: center;
          gap: 24px;
          position: relative;
          flex-wrap: wrap;
        }
        .profile-avatar-container {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          background: var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--accent-indigo);
          box-shadow: 0 0 15px rgba(79, 70, 229, 0.2);
        }
        .profile-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .profile-avatar-placeholder {
          font-size: 2.5rem;
          color: var(--text-secondary);
        }
        .profile-title-section {
          flex: 1;
        }
        .profile-title-section h2 {
          font-family: var(--font-display);
          font-size: 1.8rem;
          margin: 0 0 6px 0;
          color: var(--text-primary);
        }
        .profile-role-badge {
          display: inline-block;
          background: rgba(79, 70, 229, 0.1);
          color: var(--accent-indigo);
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 600;
          margin: 0;
        }
        .edit-profile-btn {
          background: var(--bg-card-hover);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .edit-profile-btn:hover {
          border-color: var(--accent-indigo);
          background: rgba(79, 70, 229, 0.05);
          transform: translateY(-1px);
        }
        .divider {
          border: 0;
          height: 1px;
          background: var(--border-color);
          margin: 32px 0;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }
        @media (max-width: 768px) {
          .details-grid {
            grid-template-columns: 1fr;
          }
          .account-header {
            flex-direction: column;
            text-align: center;
          }
          .edit-profile-btn {
            width: 100%;
          }
        }
        .details-section h3 {
          font-family: var(--font-display);
          font-size: 1.2rem;
          margin: 0 0 16px 0;
          color: var(--text-primary);
          border-bottom: 1px dashed var(--border-color);
          padding-bottom: 8px;
        }
        .details-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .detail-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .detail-value {
          font-size: 0.95rem;
          color: var(--text-primary);
          font-weight: 500;
        }
        .highlight-payout {
          color: #10b981;
          font-weight: 700;
        }
        .text-monospace {
          font-family: monospace;
          background: rgba(0, 0, 0, 0.15);
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
          font-size: 0.85rem;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
