"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';

export default function AdminOverview() {
  const { apps, partnershipLeads } = useApp();
  
  const [payoutRequests, setPayoutRequests] = useState([
    { id: 'payout-1', name: 'Test User', email: 'user@example.com', amount: 500, upi: 'user@bank', status: 'Pending', date: '15 Jun 2026' },
    { id: 'payout-2', name: 'Kunal Kumar', email: 'kunal@gmail.com', amount: 150, upi: 'kunal@okaxis', status: 'Pending', date: '14 Jun 2026' },
    { id: 'payout-3', name: 'Rohan Mehta', email: 'rohan@ybl', amount: 1200, upi: 'rohan@okicici', status: 'Processed', date: '12 Jun 2026' }
  ]);

  const [deactivatedIds, setDeactivatedIds] = useState<string[]>([]);

  useEffect(() => {
    const storedPayouts = localStorage.getItem('eb_admin_payouts');
    if (storedPayouts) {
      setPayoutRequests(JSON.parse(storedPayouts));
    }
    const storedDeactivated = localStorage.getItem('eb_admin_deactivated');
    if (storedDeactivated) {
      setDeactivatedIds(JSON.parse(storedDeactivated));
    }
  }, []);

  const activeAppsCount = useMemo(() => {
    return apps.filter(app => !deactivatedIds.includes(app.id)).length;
  }, [apps, deactivatedIds]);

  const pendingPayoutsCount = useMemo(() => {
    return payoutRequests.filter(p => p.status === 'Pending').length;
  }, [payoutRequests]);

  return (
    <div className="admin-overview-grid">
      
      {/* Stats Block */}
      <div className="analytics-mock-grid" style={{ marginTop: 0 }}>
        <div className="analytics-mini-card">
          <span className="mini-lbl">Active Users</span>
          <strong className="mini-val">1,420</strong>
          <span className="mini-change green-txt">▲ 12.3% this week</span>
        </div>
        <div className="analytics-mini-card">
          <span className="mini-lbl">Live Directory Apps</span>
          <strong className="mini-val">{activeAppsCount}</strong>
          <span className="mini-change">Running offers</span>
        </div>
        <div className="analytics-mini-card">
          <span className="mini-lbl">Partnership Leads</span>
          <strong className="mini-val">{partnershipLeads.filter(l => l.status === 'New').length}</strong>
          <span className="mini-change">{partnershipLeads.filter(l => l.status === 'New').length > 0 ? '⚠️ New leads review' : '✓ Clean queue'}</span>
        </div>
        <div className="analytics-mini-card">
          <span className="mini-lbl">UPI Withdrawal Queue</span>
          <strong className="mini-val">{pendingPayoutsCount}</strong>
          <span className="mini-change">Awaiting transfer</span>
        </div>
      </div>

      {/* Overview Details Section */}
      <div className="overview-row-container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        
        {/* Recent Activities */}
        <div className="admin-content-card" style={{ padding: '24px' }}>
          <h3 className="card-heading" style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Recent Platform Activity</h3>
          <div className="activities-timeline" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="activity-item" style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '1.2rem' }}>👤</span>
              <div>
                <p style={{ fontSize: '0.88rem', margin: 0 }}>Partner <strong>Alice Partner</strong> submitted new campaign <strong>'TestAppPro'</strong>.</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>10 mins ago</span>
              </div>
            </div>
            <div className="activity-item" style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '1.2rem' }}>💸</span>
              <div>
                <p style={{ fontSize: '0.88rem', margin: 0 }}>User <strong>Test User</strong> requested a UPI payout of <strong>₹500.00</strong>.</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>45 mins ago</span>
              </div>
            </div>
            <div className="activity-item" style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '1.2rem' }}>⚡</span>
              <div>
                <p style={{ fontSize: '0.88rem', margin: 0 }}>System auto-tracked completed task action: <strong>Swagbucks - Complete Profile</strong>.</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 hours ago</span>
              </div>
            </div>
            <div className="activity-item" style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '1.2rem' }}>🔑</span>
              <div>
                <p style={{ fontSize: '0.88rem', margin: 0 }}>Admin approved Prime Opinion campaign to live offerwall directory.</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>5 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="admin-content-card" style={{ padding: '24px' }}>
          <h3 className="card-heading" style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/admin/partnership-leads" className="glow-btn-cyan" style={{ padding: '12px 16px', fontSize: '0.85rem', width: '100%', textDecoration: 'none', textAlign: 'left', display: 'block' }}>
              ⏳ New Leads for Partnership ({partnershipLeads.filter(l => l.status === 'New').length})
            </Link>
            <Link href="/admin/wallet" className="glow-btn-purple" style={{ padding: '12px 16px', fontSize: '0.85rem', width: '100%', textDecoration: 'none', textAlign: 'left', display: 'block' }}>
              💸 Process User Withdrawals
            </Link>
            <Link href="/admin/new-campaign" className="menu-item-btn" style={{ padding: '12px 16px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', textDecoration: 'none', textAlign: 'left', width: '100%', display: 'flex' }}>
              ➕ Create New Direct Offer
            </Link>
            <Link href="/admin/users" className="menu-item-btn" style={{ padding: '12px 16px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', textDecoration: 'none', textAlign: 'left', width: '100%', display: 'flex' }}>
              👤 Inspect Registered Users
            </Link>
          </div>
        </div>

      </div>

      <style>{`
        .admin-overview-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .analytics-mock-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        .analytics-mini-card {
          background: rgba(255,255,255,0.01);
          border: 1px solid var(--border-color);
          padding: 20px;
          border-radius: 8px;
        }
        .mini-lbl {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        .mini-val {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 700;
          display: block;
          margin: 6px 0;
          color: var(--text-primary);
        }
        .mini-change {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .green-txt {
          color: var(--accent-emerald) !important;
        }
        .admin-content-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 32px;
          box-shadow: var(--shadow-md);
        }
        .card-heading {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }
        .menu-item-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 10px 16px;
          border-radius: 8px;
          font-family: var(--font-primary);
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .menu-item-btn:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }
        @media (max-width: 768px) {
          .overview-row-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
