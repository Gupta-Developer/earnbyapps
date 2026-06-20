"use client";

import React, { useState, useEffect } from 'react';

const INITIAL_SUBMISSIONS = [
  { id: 'sub-1', name: 'Test User', appName: 'Swagbucks', taskTitle: 'Complete Daily Poll', reward: 0.25, time: '10 mins ago', status: 'Pending' },
  { id: 'sub-2', name: 'Raj Patel', appName: 'Mistplay', taskTitle: 'Reach Level 10', reward: 4.50, time: '1 hour ago', status: 'Pending' },
  { id: 'sub-3', name: 'Sonia Sharma', appName: 'Prime Opinion', taskTitle: 'Demographics Survey', reward: 1.20, time: '4 hours ago', status: 'Approved' },
  { id: 'sub-4', name: 'Amit Verma', appName: 'Honeygain', taskTitle: 'Share 1GB Bandwidth', reward: 0.50, time: '1 day ago', status: 'Approved' }
];

export default function SubmissionsPage() {
  const [userSubmissions, setUserSubmissions] = useState(INITIAL_SUBMISSIONS);

  useEffect(() => {
    const saved = localStorage.getItem('eb_admin_submissions');
    if (saved) {
      setUserSubmissions(JSON.parse(saved));
    }
  }, []);

  const handleModerateSubmission = (id: string, action: 'Approved' | 'Rejected') => {
    const updated = userSubmissions.map(s => s.id === id ? { ...s, status: action } : s);
    setUserSubmissions(updated);
    localStorage.setItem('eb_admin_submissions', JSON.stringify(updated));
  };

  return (
    <div className="admin-content-card">
      <div className="card-header-section">
        <h2 className="card-heading">Earner Task Completions Ledger</h2>
        <p className="card-subheading">Moderation workspace for task proof claims. Approve payouts or reject fraudulent completions.</p>
      </div>

      <div className="table-responsive-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Task / App</th>
              <th>Reward Payout</th>
              <th>Time Sent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userSubmissions.map((sub) => (
              <tr key={sub.id}>
                <td>
                  <strong>{sub.name}</strong>
                </td>
                <td>
                  <div>{sub.taskTitle}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>App: {sub.appName}</span>
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
