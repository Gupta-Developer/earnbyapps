"use client";

import React from 'react';
import { useApp } from '../../../context/AppContext';

export default function PartnerTasks() {
  const { apps } = useApp();

  // Mock list of partner submissions including some directory matches
  const partnerCampaigns = [
    { id: 'part-c-1', name: 'Mistplay Partner Campaign', target: 2000, completed: 890, cost: 0.50, status: 'Active' },
    { id: 'part-c-2', name: 'Prime Opinion Surveys B2B', target: 3000, completed: 1560, cost: 0.75, status: 'Active' },
    { id: 'part-c-3', name: 'Swagbucks Premium Trial', target: 500, completed: 500, cost: 1.20, status: 'Completed' },
    { id: 'part-c-4', name: 'TestAppPro (Awaiting Sync)', target: 1200, completed: 0, cost: 0.75, status: 'Pending Review' }
  ];

  return (
    <div className="partner-content-card">
      <div className="card-header-section">
        <h2 className="card-heading">My Configured Tasks</h2>
        <p className="card-subheading">A list of all advertising placements and bulk conversion states submitted under your account.</p>
      </div>

      <div className="table-responsive-container">
        <table className="partner-table">
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Payout / Action</th>
              <th>Volume Delivered</th>
              <th>Total Budget</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {partnerCampaigns.map((camp) => {
              const spent = camp.completed * camp.cost;
              const total = camp.target * camp.cost;
              return (
                <tr key={camp.id}>
                  <td>
                    <strong style={{ display: 'block' }}>{camp.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {camp.id}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>${camp.cost.toFixed(2)}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{camp.completed.toLocaleString()} / {camp.target.toLocaleString()}</span>
                      <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden', width: '150px' }}>
                        <div style={{ width: `${(camp.completed / camp.target) * 100}%`, height: '100%', background: 'var(--accent-indigo)' }}></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--accent-emerald)' }}>${spent.toFixed(2)}</strong>
                    <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-secondary)' }}>of ${total.toFixed(2)}</span>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 'bold',
                      background: 
                        camp.status === 'Active' ? 'rgba(16,185,129,0.1)' : 
                        camp.status === 'Completed' ? 'rgba(79,70,229,0.1)' : 'rgba(245,158,11,0.1)',
                      color: 
                        camp.status === 'Active' ? 'var(--accent-emerald)' : 
                        camp.status === 'Completed' ? 'var(--accent-indigo)' : '#f59e0b'
                    }}>
                      {camp.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
        .table-responsive-container {
          width: 100%;
          overflow-x: auto;
          margin-top: 16px;
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
      `}</style>
    </div>
  );
}
