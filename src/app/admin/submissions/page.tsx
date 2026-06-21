"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';

const INITIAL_SUBMISSIONS = [
  { id: 'sub-1', name: 'Test User', appName: 'Swagbucks', taskTitle: 'Complete Daily Poll', reward: 0.25, time: '10 mins ago', status: 'Pending', country: 'United States', flag: '🇺🇸', paymentMethod: 'PayPal', paymentDetails: 'test_user_wallet@paypal.com' },
  { id: 'sub-2', name: 'Raj Patel', appName: 'Mistplay', taskTitle: 'Reach Level 10', reward: 4.50, time: '1 hour ago', status: 'Pending', country: 'India', flag: '🇮🇳', paymentMethod: 'UPI ID', paymentDetails: 'rajpatel99@ybl' },
  { id: 'sub-3', name: 'Sonia Sharma', appName: 'Prime Opinion', taskTitle: 'Demographics Survey', reward: 1.20, time: '4 hours ago', status: 'Approved', country: 'India', flag: '🇮🇳', paymentMethod: 'UPI ID', paymentDetails: 'sonia.sharma@paytm' },
  { id: 'sub-4', name: 'Amit Verma', appName: 'Honeygain', taskTitle: 'Share 1GB Bandwidth', reward: 0.50, time: '1 day ago', status: 'Approved', country: 'India', flag: '🇮🇳', paymentMethod: 'UPI ID', paymentDetails: 'amitverma@oksbi' }
];

export default function SubmissionsPage() {
  const { userProfile } = useApp();
  const [userSubmissions, setUserSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('eb_admin_submissions');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Synchronize the first mock item with the logged-in user profile details if present
      if (userProfile && parsed.length > 0) {
        parsed[0].name = userProfile.fullName;
        parsed[0].country = userProfile.country || 'Global';
        parsed[0].paymentDetails = userProfile.paymentDetails || 'No details set';
        parsed[0].paymentMethod = (userProfile.country === 'India') ? 'UPI ID' : 'PayPal';
        parsed[0].flag = (userProfile.country === 'India') ? '🇮🇳' : '🌍';
      }
      setUserSubmissions(parsed);
    } else {
      // Sync initial mock array on first render
      const updated = [...INITIAL_SUBMISSIONS];
      if (userProfile) {
        updated[0].name = userProfile.fullName;
        updated[0].country = userProfile.country || 'Global';
        updated[0].paymentDetails = userProfile.paymentDetails || 'No details set';
        updated[0].paymentMethod = (userProfile.country === 'India') ? 'UPI ID' : 'PayPal';
        updated[0].flag = (userProfile.country === 'India') ? '🇮🇳' : '🌍';
      }
      setUserSubmissions(updated);
      localStorage.setItem('eb_admin_submissions', JSON.stringify(updated));
    }
  }, [userProfile]);

  const handleModerateSubmission = (id: string, action: 'Approved' | 'Rejected') => {
    const updated = userSubmissions.map(s => s.id === id ? { ...s, status: action } : s);
    setUserSubmissions(updated);
    localStorage.setItem('eb_admin_submissions', JSON.stringify(updated));
  };

  const handleCopy = (text: string, subId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(subId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="admin-content-card">
      <div className="card-header-section">
        <h2 className="card-heading">Earner Task Completions Ledger</h2>
        <p className="card-subheading">Moderation workspace for task proof claims. Verify user payment details and disburse rewards before approval.</p>
      </div>

      <div className="table-responsive-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>User & Country</th>
              <th>Task / App</th>
              <th>Payout Address (Required)</th>
              <th>Reward</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userSubmissions.map((sub) => (
              <tr key={sub.id}>
                <td>
                  <strong>{sub.name}</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {sub.flag} {sub.country}
                  </span>
                </td>
                <td>
                  <div>{sub.taskTitle}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>App: {sub.appName}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--accent-indigo)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>{sub.paymentMethod}</span>
                      {sub.paymentDetails}
                    </div>
                    <button 
                      onClick={() => handleCopy(sub.paymentDetails, sub.id)}
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.75rem',
                        background: copiedId === sub.id ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-color)',
                        color: copiedId === sub.id ? 'black' : 'var(--text-primary)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'all 0.2s'
                      }}
                    >
                      {copiedId === sub.id ? 'Copied! ✓' : '📋 Copy'}
                    </button>
                  </div>
                </td>
                <td style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
                  ${sub.reward.toFixed(2)}
                </td>
                <td>
                  <span style={{ fontSize: '0.8rem' }}>{sub.time}</span>
                </td>
                <td>
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
                <td>
                  {sub.status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleModerateSubmission(sub.id, 'Approved')} className="glow-btn-cyan" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                        Approve
                      </button>
                      <button onClick={() => handleModerateSubmission(sub.id, 'Rejected')} className="reject-moderation-btn" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Moderated</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
