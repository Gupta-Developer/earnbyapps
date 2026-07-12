"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { useSession } from 'next-auth/react';

export default function PartnerAccountPage() {
  const { userProfile, updateUserProfile } = useApp();
  const { data: session } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  
  // Local form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');

  // Sync form states with profile data
  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName || '');
      setPhone(userProfile.phone || '');
      setGender(userProfile.gender || 'Male');
    }
  }, [userProfile, isEditing]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfile) {
      updateUserProfile({
        ...userProfile,
        fullName,
        phone,
        gender
      });
    }
    setIsEditing(false);
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
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="edit-profile-btn">
              ✏️ Edit Profile
            </button>
          )}
        </div>

        <hr className="divider" />

        {/* Profile Details Section */}
        <form onSubmit={handleSave} className="details-section">
          <h3 className="section-title">📋 Personal Information</h3>
          
          <div className="details-list">
            {/* Full Name */}
            <div className="detail-item">
              <span className="detail-label">Full Name</span>
              {isEditing ? (
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                  className="edit-input"
                  required
                />
              ) : (
                <span className="detail-value">{userProfile?.fullName || 'Not Shared'}</span>
              )}
            </div>

            {/* Email Address (Always read-only/verified) */}
            <div className="detail-item">
              <span className="detail-label">Email Address</span>
              <span className="detail-value text-muted-email">{userProfile?.email || 'Not Shared'}</span>
            </div>

            {/* Phone Number */}
            <div className="detail-item">
              <span className="detail-label">Phone Number</span>
              {isEditing ? (
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="edit-input"
                  placeholder="e.g. +91 9876543210"
                />
              ) : (
                <span className="detail-value">{userProfile?.phone || 'Not Shared'}</span>
              )}
            </div>

            {/* Gender */}
            <div className="detail-item">
              <span className="detail-label">Gender</span>
              {isEditing ? (
                <select 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)}
                  className="edit-select"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              ) : (
                <span className="detail-value">{userProfile?.gender || 'Not Shared'}</span>
              )}
            </div>
          </div>

          {/* Form Actions */}
          {isEditing && (
            <div className="form-actions">
              <button type="submit" className="save-btn">
                💾 Save Changes
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
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
        .details-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: 1.2rem;
          margin: 0 0 8px 0;
          color: var(--text-primary);
          border-bottom: 1px dashed var(--border-color);
          padding-bottom: 8px;
        }
        .details-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px 32px;
        }
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
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
        .text-muted-email {
          font-size: 0.95rem;
          color: var(--text-secondary);
          opacity: 0.8;
          font-weight: 500;
        }
        .edit-input {
          width: 100%;
          max-width: 450px;
          padding: 10px 14px;
          border-radius: 8px;
          background: var(--bg-dark);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          font-size: 0.9rem;
          transition: border-color 0.2s;
        }
        .edit-input:focus {
          border-color: var(--accent-indigo);
          outline: none;
        }
        .edit-select {
          width: 100%;
          max-width: 450px;
          padding: 10px 14px;
          border-radius: 8px;
          background: var(--bg-dark);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          font-size: 0.9rem;
          cursor: pointer;
        }
        .edit-select:focus {
          border-color: var(--accent-indigo);
          outline: none;
        }
        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 12px;
        }
        .save-btn {
          background: var(--accent-indigo);
          border: none;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .save-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .cancel-btn {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .cancel-btn:hover {
          border-color: var(--text-secondary);
          background: rgba(255,255,255,0.02);
        }
        @media (max-width: 768px) {
          .details-list {
            grid-template-columns: 1fr;
          }
          .account-header {
            flex-direction: column;
            text-align: center;
          }
          .edit-profile-btn {
            width: 100%;
          }
          .edit-input, .edit-select {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
