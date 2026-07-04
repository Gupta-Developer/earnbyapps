"use client";

import React, { useState, useEffect } from 'react';

const INITIAL_PAYOUTS = [
  { id: 'payout-1', name: 'Test User', email: 'user@example.com', amount: 500, upi: 'user@bank', status: 'Pending', date: '15 Jun 2026' },
  { id: 'payout-2', name: 'Kunal Kumar', email: 'kunal@gmail.com', amount: 150, upi: 'kunal@okaxis', status: 'Pending', date: '14 Jun 2026' },
  { id: 'payout-3', name: 'Rohan Mehta', email: 'rohan@ybl', amount: 1200, upi: 'rohan@okicici', status: 'Processed', date: '12 Jun 2026' }
];

export default function WalletPage() {
  const [payoutRequests, setPayoutRequests] = useState(INITIAL_PAYOUTS);

  useEffect(() => {
    const saved = localStorage.getItem('eb_admin_payouts');
    if (saved) {
      setPayoutRequests(JSON.parse(saved));
    }
  }, []);

  const handleProcessPayout = (id: string) => {
    const updated = payoutRequests.map(p => p.id === id ? { ...p, status: 'Processed' } : p);
    setPayoutRequests(updated);
    localStorage.setItem('eb_admin_payouts', JSON.stringify(updated));
  };

  const pendingWithdrawalSum = payoutRequests
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="admin-content-card">
      <div className="card-header-section">
        <h2 className="card-heading">Payment Withdrawal Requests</h2>
        <p className="card-subheading">Process active money withdrawal transactions requested by platform earners.</p>
      </div>

      <div className="analytics-mock-grid" style={{ marginTop: 0 }}>
        <div className="analytics-mini-card">
          <span className="mini-lbl">Total Disbursed Payouts</span>
          <strong className="mini-val">₹3,84,000</strong>
          <span className="mini-change green-txt">✓ UPI auto-gateway</span>
        </div>
        <div className="analytics-mini-card">
          <span className="mini-lbl">Pending Withdrawal Claims</span>
          <strong className="mini-val">₹{pendingWithdrawalSum}</strong>
          <span className="mini-change">{payoutRequests.filter(p => p.status === 'Pending').length} earners waiting</span>
        </div>
      </div>

      <div className="table-responsive-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Earner Profile</th>
              <th>UPI ID / Details</th>
              <th>Amount</th>
              <th>Request Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payoutRequests.map((req) => (
              <tr key={req.id}>
                <td>
                  <strong>{req.name}</strong>
                  <span style={{ fontSize: '0.78rem', display: 'block', color: 'var(--text-muted)' }}>{req.email}</span>
                </td>
                <td>
                  {(() => {
                    if (req.upi && (req.upi.trim().startsWith('{') || req.upi.trim().startsWith('['))) {
                      try {
                        const parsed = JSON.parse(req.upi);
                        if (Array.isArray(parsed)) {
                          const preferred = parsed.find(p => p.isPreferred) || parsed[0];
                          if (!preferred) return <span style={{ color: 'var(--text-muted)' }}>No details</span>;
                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{preferred.methodName}</strong>
                              {Object.entries(preferred.details || {}).map(([key, val]: [string, any]) => (
                                <div key={key} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                  <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{key.replace('_', ' ')}:</span> {val}
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {Object.entries(parsed).map(([key, val]: [string, any]) => (
                              <div key={key} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{key.replace('_', ' ')}:</span> {val}
                              </div>
                            ))}
                          </div>
                        );
                      } catch (e) {}
                    }
                    return <code style={{ fontSize: '0.85rem', color: 'var(--accent-indigo)' }}>{req.upi}</code>;
                  })()}
                </td>
                <td style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  ₹{req.amount}
                </td>
                <td>
                  <span style={{ fontSize: '0.8rem' }}>{req.date}</span>
                </td>
                <td>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 'bold',
                    background: req.status === 'Pending' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                    color: req.status === 'Pending' ? '#f59e0b' : 'var(--accent-emerald)'
                  }}>
                    {req.status}
                  </span>
                </td>
                <td>
                  {req.status === 'Pending' ? (
                    <button
                      onClick={() => handleProcessPayout(req.id)}
                      className="glow-btn-cyan"
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    >
                      Process Auto-UPI
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>✓ Sent</span>
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
