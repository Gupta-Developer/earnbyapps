"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';

export default function AdminAnalytics() {
  const { apps, submissions, partnershipLeads } = useApp();
  const [deactivatedIds, setDeactivatedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('eb_admin_deactivated');
    if (stored) {
      setDeactivatedIds(JSON.parse(stored));
    }
  }, []);

  const activeAppsCount = useMemo(() => {
    return apps.filter(app => !deactivatedIds.includes(app.id)).length;
  }, [apps, deactivatedIds]);

  // Submission statistics
  const submissionStats = useMemo(() => {
    const total = submissions.length;
    const pending = submissions.filter(s => s.status === 'Pending').length;
    const paid = submissions.filter(s => s.status === 'Paid').length;
    const rejected = total - pending - paid;

    const pendingPercent = total > 0 ? Math.round((pending / total) * 100) : 0;
    const paidPercent = total > 0 ? Math.round((paid / total) * 100) : 0;
    const rejectedPercent = total > 0 ? Math.round((rejected / total) * 100) : 0;

    return { total, pending, paid, rejected, pendingPercent, paidPercent, rejectedPercent };
  }, [submissions]);

  // Leads pipeline statistics
  const leadStats = useMemo(() => {
    const total = partnershipLeads.length;
    const newLeads = partnershipLeads.filter(l => l.status === 'New').length;
    const contacted = partnershipLeads.filter(l => l.status === 'Contacted').length;
    const converted = partnershipLeads.filter(l => l.status === 'Converted').length;
    const declined = partnershipLeads.filter(l => l.status === 'Declined').length;

    return { total, newLeads, contacted, converted, declined };
  }, [partnershipLeads]);

  // Top Campaigns by Submission Count
  const topCampaigns = useMemo(() => {
    const counts: Record<string, number> = {};
    submissions.forEach(sub => {
      counts[sub.appId] = (counts[sub.appId] || 0) + 1;
    });

    return apps
      .map(app => ({
        ...app,
        submissionCount: counts[app.id] || 0,
      }))
      .sort((a, b) => b.submissionCount - a.submissionCount)
      .slice(0, 5);
  }, [apps, submissions]);

  return (
    <div className="admin-analytics-container">
      {/* Page Header */}
      <div className="analytics-header">
        <h2 className="card-heading">Platform Telemetry & Analytics</h2>
        <p className="card-subheading">Real-time indicators processed from live database transactions and lead channels.</p>
      </div>

      {/* Main Metrics Grid */}
      <div className="metrics-summary-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper active-apps">📱</div>
          <div className="stat-info">
            <span className="stat-label">Active / Total Apps</span>
            <strong className="stat-value">{activeAppsCount} <span className="stat-slash">/</span> {apps.length}</strong>
            <span className="stat-subtext green-txt">● Live on directory</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper total-submissions">📝</div>
          <div className="stat-info">
            <span className="stat-label">Total Submissions</span>
            <strong className="stat-value">{submissionStats.total}</strong>
            <span className="stat-subtext">All submitted user tasks</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper pending-verifications">⏳</div>
          <div className="stat-info">
            <span className="stat-label">Pending Verifications</span>
            <strong className="stat-value" style={{ color: 'var(--accent-amber, #eab308)' }}>{submissionStats.pending}</strong>
            <span className="stat-subtext">Awaiting admin review</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper business-leads">🤝</div>
          <div className="stat-info">
            <span className="stat-label">Partnership Leads</span>
            <strong className="stat-value">{leadStats.total}</strong>
            <span className="stat-subtext">{leadStats.converted} successfully converted</span>
          </div>
        </div>
      </div>

      {/* Lower Dashboard Layout */}
      <div className="analytics-layout-flex">
        {/* Left: Task Submissions Breakdown */}
        <div className="analytics-card submissions-breakdown">
          <h3 className="section-title">Submission Approval Pipeline</h3>
          <p className="section-subtitle">Real-time audit verification breakdown metrics.</p>

          <div className="pipeline-bar-wrapper">
            <div className="pipeline-bar">
              <div style={{ width: `${submissionStats.paidPercent}%`, background: 'var(--accent-emerald, #10b981)' }} title={`Paid: ${submissionStats.paidPercent}%`}></div>
              <div style={{ width: `${submissionStats.pendingPercent}%`, background: 'var(--accent-amber, #f59e0b)' }} title={`Pending: ${submissionStats.pendingPercent}%`}></div>
              <div style={{ width: `${submissionStats.rejectedPercent}%`, background: 'var(--accent-rose, #f43f5e)' }} title={`Rejected: ${submissionStats.rejectedPercent}%`}></div>
            </div>
            <div className="pipeline-legend">
              <div className="legend-item">
                <span className="dot dot-green"></span>
                <span>Paid: <strong>{submissionStats.paid}</strong> ({submissionStats.paidPercent}%)</span>
              </div>
              <div className="legend-item">
                <span className="dot dot-yellow"></span>
                <span>Pending: <strong>{submissionStats.pending}</strong> ({submissionStats.pendingPercent}%)</span>
              </div>
              <div className="legend-item">
                <span className="dot dot-red"></span>
                <span>Rejected: <strong>{submissionStats.rejected}</strong> ({submissionStats.rejectedPercent}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Partnership Conversion Status */}
        <div className="analytics-card partnership-funnel">
          <h3 className="section-title">Partnership Funnel</h3>
          <p className="section-subtitle">Status stages of inbound leads from potential advertisers.</p>
          <div className="funnel-metrics">
            <div className="funnel-stage">
              <span className="stage-name">New Requests</span>
              <div className="stage-track">
                <div className="stage-fill" style={{ width: leadStats.total > 0 ? `${(leadStats.newLeads / leadStats.total) * 100}%` : '0%', background: 'var(--accent-indigo, #6366f1)' }}></div>
              </div>
              <span className="stage-count">{leadStats.newLeads}</span>
            </div>
            <div className="funnel-stage">
              <span className="stage-name">Contacted / Pitching</span>
              <div className="stage-track">
                <div className="stage-fill" style={{ width: leadStats.total > 0 ? `${(leadStats.contacted / leadStats.total) * 100}%` : '0%', background: '#60a5fa' }}></div>
              </div>
              <span className="stage-count">{leadStats.contacted}</span>
            </div>
            <div className="funnel-stage">
              <span className="stage-name">Converted (Live)</span>
              <div className="stage-track">
                <div className="stage-fill" style={{ width: leadStats.total > 0 ? `${(leadStats.converted / leadStats.total) * 100}%` : '0%', background: 'var(--accent-emerald, #10b981)' }}></div>
              </div>
              <span className="stage-count">{leadStats.converted}</span>
            </div>
            <div className="funnel-stage">
              <span className="stage-name">Declined / Closed</span>
              <div className="stage-track">
                <div className="stage-fill" style={{ width: leadStats.total > 0 ? `${(leadStats.declined / leadStats.total) * 100}%` : '0%', background: 'var(--text-muted, #94a3b8)' }}></div>
              </div>
              <span className="stage-count">{leadStats.declined}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Campaigns Table */}
      <div className="analytics-card campaign-leaderboard" style={{ marginTop: '24px' }}>
        <h3 className="section-title">Top Campaign Conversion Drivers</h3>
        <p className="section-subtitle font-sm">Directory apps ranked by total volume of verification submissions.</p>
        
        <div style={{ overflowX: 'auto', marginTop: '16px' }}>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Category</th>
                <th>Reward Rate</th>
                <th>Submissions Volume</th>
              </tr>
            </thead>
            <tbody>
              {topCampaigns.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {c.logoUrl ? (
                        <img src={c.logoUrl} alt={c.name} style={{ width: '20px', height: '20px', borderRadius: '4px' }} />
                      ) : (
                        <span>✨</span>
                      )}
                      <strong>{c.name}</strong>
                    </div>
                  </td>
                  <td><span className="category-badge">{c.category}</span></td>
                  <td>₹{c.reward.toFixed(2)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="progress-num">{c.submissionCount}</span>
                      <div className="mini-progress-track">
                        <div 
                          className="mini-progress-fill" 
                          style={{ 
                            width: submissionStats.total > 0 ? `${(c.submissionCount / submissionStats.total) * 100}%` : '0%' 
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {topCampaigns.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                    No campaigns registered in memory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .admin-analytics-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .analytics-header {
          margin-bottom: 8px;
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
        
        /* Grid and cards */
        .metrics-summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }
        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255,255,255,0.15);
        }
        .stat-icon-wrapper {
          font-size: 1.8rem;
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-color);
        }
        .stat-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stat-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .stat-value {
          font-size: 1.6rem;
          font-family: var(--font-display);
          color: var(--text-primary);
        }
        .stat-slash {
          color: var(--text-muted);
          font-weight: 300;
        }
        .stat-subtext {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .green-txt {
          color: var(--accent-emerald, #10b981) !important;
        }

        /* Secondary sections */
        .analytics-layout-flex {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 900px) {
          .analytics-layout-flex {
            grid-template-columns: 1fr;
          }
        }
        .analytics-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 28px;
          box-shadow: var(--shadow-sm);
        }
        .section-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .section-subtitle {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }
        .font-sm {
          margin-bottom: 12px;
        }

        /* Pipelines & Legends */
        .pipeline-bar-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 12px;
        }
        .pipeline-bar {
          height: 16px;
          display: flex;
          border-radius: 8px;
          overflow: hidden;
          background: rgba(255,255,255,0.05);
        }
        .pipeline-bar > div {
          height: 100%;
          transition: width 0.3s ease;
        }
        .pipeline-legend {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }
        .dot-green { background: var(--accent-emerald, #10b981); }
        .dot-yellow { background: var(--accent-amber, #f59e0b); }
        .dot-red { background: var(--accent-rose, #f43f5e); }

        /* Funnel Progress list */
        .funnel-metrics {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .funnel-stage {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.85rem;
        }
        .stage-name {
          width: 140px;
          color: var(--text-secondary);
        }
        .stage-track {
          flex: 1;
          height: 8px;
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
          overflow: hidden;
        }
        .stage-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        .stage-count {
          width: 30px;
          text-align: right;
          font-weight: 700;
          color: var(--text-primary);
        }

        /* Leaderboard table */
        .analytics-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
        .analytics-table th {
          text-align: left;
          padding: 12px 16px;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border-color);
          font-weight: 500;
        }
        .analytics-table td {
          padding: 14px 16px;
          color: var(--text-secondary);
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .analytics-table tr:last-child td {
          border-bottom: none;
        }
        .category-badge {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-color);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
        }
        .progress-num {
          font-weight: 700;
          color: var(--text-primary);
          min-width: 20px;
        }
        .mini-progress-track {
          width: 100px;
          height: 6px;
          background: rgba(255,255,255,0.05);
          border-radius: 3px;
          overflow: hidden;
        }
        .mini-progress-fill {
          height: 100%;
          background: var(--accent-indigo, #6366f1);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}

