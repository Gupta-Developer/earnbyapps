"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';

export default function AdminAllCampaigns() {
  const { apps } = useApp();
  const [deactivatedIds, setDeactivatedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('eb_admin_deactivated');
    if (stored) {
      setDeactivatedIds(JSON.parse(stored));
    }
  }, []);

  const handleToggleDeactivate = (id: string) => {
    let nextIds: string[];
    if (deactivatedIds.includes(id)) {
      nextIds = deactivatedIds.filter(x => x !== id);
    } else {
      nextIds = [...deactivatedIds, id];
    }
    setDeactivatedIds(nextIds);
    localStorage.setItem('eb_admin_deactivated', JSON.stringify(nextIds));
  };

  return (
    <div className="admin-content-card">
      <div className="card-header-section">
        <h2 className="card-heading">Earning Apps Directory Manager</h2>
        <p className="card-subheading">Enable/disable or modify active campaigns currently published on the Offerwall.</p>
      </div>

      <div className="table-responsive-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Earning App</th>
              <th>Category</th>
              <th>Platform</th>
              <th>Earning Rate</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => {
              const isDeactivated = deactivatedIds.includes(app.id);
              return (
                <tr key={app.id}>
                  <td>
                    <strong style={{ display: 'block' }}>{app.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rating: {app.rating} ★ ({app.reviewsCount} reviews)</span>
                  </td>
                  <td>
                    <span className="app-cat-badge">{app.category}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem' }}>{app.platforms.join(', ')}</span>
                  </td>
                  <td style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
                    {app.earningRate}
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 'bold',
                      background: isDeactivated ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                      color: isDeactivated ? '#ef4444' : 'var(--accent-emerald)'
                    }}>
                      {isDeactivated ? 'Paused' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleDeactivate(app.id)}
                      style={{
                        background: isDeactivated ? 'var(--accent-emerald)' : 'transparent',
                        border: '1px solid ' + (isDeactivated ? 'transparent' : 'var(--border-color)'),
                        color: isDeactivated ? 'black' : 'var(--text-primary)',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      {isDeactivated ? 'Resume' : 'Pause'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        .admin-content-card {
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
        }
        .user-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.88rem;
        }
        .user-table th {
          border-bottom: 1px solid var(--border-color);
          padding: 12px 16px;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.72rem;
          letter-spacing: 0.05em;
        }
        .user-table td {
          border-bottom: 1px solid var(--border-color);
          padding: 16px;
          vertical-align: middle;
        }
        .app-cat-badge {
          display: inline-block;
          font-size: 0.7rem;
          background: var(--border-color);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
