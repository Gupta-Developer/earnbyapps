"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';

export default function AdminOverview() {
  const { partnershipLeads, submissions } = useApp();
  
  const [payoutRequests, setPayoutRequests] = useState([
    { id: 'payout-1', name: 'Test User', email: 'user@example.com', amount: 500, upi: 'user@bank', status: 'Pending', date: '15 Jun 2026' },
    { id: 'payout-2', name: 'Kunal Kumar', email: 'kunal@gmail.com', amount: 150, upi: 'kunal@okaxis', status: 'Pending', date: '14 Jun 2026' },
    { id: 'payout-3', name: 'Rohan Mehta', email: 'rohan@ybl', amount: 1200, upi: 'rohan@okicici', status: 'Processed', date: '12 Jun 2026' }
  ]);

  const [realUserCount, setRealUserCount] = useState<number | null>(null);
  const [realCampaignCount, setRealCampaignCount] = useState<number | null>(null);

  useEffect(() => {
    const storedPayouts = localStorage.getItem('eb_admin_payouts');
    if (storedPayouts) {
      setPayoutRequests(JSON.parse(storedPayouts));
    }
  }, []);

  // Fetch real count of registered users from database
  useEffect(() => {
    async function loadUserCount() {
      try {
        const res = await fetch('/api/users?page=1&limit=1');
        if (res.ok) {
          const data = await res.json();
          if (typeof data.totalCount === 'number') {
            setRealUserCount(data.totalCount);
          }
        }
      } catch (e) {
        console.error("Failed to load real user count:", e);
      }
    }
    loadUserCount();
  }, []);

  // Fetch real count of active campaigns directly from the campaigns database API
  useEffect(() => {
    async function loadCampaignCount() {
      try {
        const res = await fetch('/api/campaigns');
        if (res.ok) {
          const dbApps = await res.json();
          if (Array.isArray(dbApps)) {
            // Count active offers
            const activeCount = dbApps.filter(app => app.isActive !== false).length;
            setRealCampaignCount(activeCount);
          }
        }
      } catch (e) {
        console.error("Failed to load real campaigns count:", e);
      }
    }
    loadCampaignCount();
  }, []);

  const pendingPayoutsCount = useMemo(() => {
    return payoutRequests.filter(p => p.status === 'Pending').length;
  }, [payoutRequests]);

  // Generate real recent activities from real submissions list
  const recentActivities = useMemo(() => {
    if (!submissions || submissions.length === 0) return [];
    return submissions.slice(0, 5).map(sub => {
      let emoji = '⚡';
      if (sub.status === 'Paid') emoji = '✅';
      else if (sub.status === 'Rejected') emoji = '❌';
      else if (sub.status === 'Pending') emoji = '⏳';

      return {
        id: sub.id,
        emoji,
        text: `User ${sub.userName} (${sub.userEmail}) submitted completion for ${sub.appName} (Reward: ₹${sub.reward.toFixed(2)})`,
        status: sub.status,
        time: sub.time
      };
    });
  }, [submissions]);

  return (
    <div className="admin-overview-grid">
      
      {/* Stats Block */}
      <div className="analytics-mock-grid" style={{ marginTop: 0 }}>
        <div className="analytics-mini-card">
          <span className="mini-lbl">Active Users</span>
          <strong className="mini-val">{realUserCount !== null ? realUserCount : 'Loading...'}</strong>
          <span className="mini-change green-txt">Registered in database</span>
        </div>
        <div className="analytics-mini-card">
          <span className="mini-lbl">Live Directory Apps</span>
          <strong className="mini-val">{realCampaignCount !== null ? realCampaignCount : 'Loading...'}</strong>
          <span className="mini-change">Running offers</span>
        </div>
        <div className="analytics-mini-card">
          <span className="mini-lbl">Partnership Leads</span>
          <strong className="mini-val">{partnershipLeads.filter(l => l.status === 'New').length}</strong>
          <span className="mini-change">{partnershipLeads.filter(l => l.status === 'New').length > 0 ? '⚠️ New leads review' : '✓ Clean queue'}</span>
        </div>

      </div>

      {/* Overview Details Section */}
      <div className="overview-row-container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        
        {/* Recent Activities */}
        <div className="admin-content-card" style={{ padding: '24px' }}>
          <h3 className="card-heading" style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Recent Platform Activity</h3>
          <div className="activities-timeline" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentActivities.length > 0 ? (
              recentActivities.map((act) => (
                <div key={act.id} className="activity-item" style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{act.emoji}</span>
                  <div>
                    <p style={{ fontSize: '0.88rem', margin: 0, color: 'var(--text-primary)' }}>{act.text}</p>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{act.time}</span>
                      <span style={{ 
                        fontSize: '0.68rem', 
                        padding: '1px 5px', 
                        borderRadius: '3px', 
                        fontWeight: 'bold',
                        background: act.status === 'Pending' ? 'rgba(245,158,11,0.12)' : act.status === 'Paid' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                        color: act.status === 'Pending' ? '#f59e0b' : act.status === 'Paid' ? 'var(--accent-emerald)' : '#ef4444'
                      }}>{act.status}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>No recent submission activity found.</p>
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="admin-content-card" style={{ padding: '24px' }}>
          <h3 className="card-heading" style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/admin/partnership-leads" className="glow-btn-cyan" style={{ padding: '12px 16px', fontSize: '0.85rem', width: '100%', textDecoration: 'none', textAlign: 'left', display: 'block' }}>
              ⏳ New Leads for Partnership ({partnershipLeads.filter(l => l.status === 'New').length})
            </Link>
            <Link href="/admin/referral-pools" className="glow-btn-cyan" style={{ padding: '12px 16px', fontSize: '0.85rem', width: '100%', textDecoration: 'none', textAlign: 'left', display: 'block', background: 'linear-gradient(135deg, var(--accent-indigo), #0ea5e9)' }}>
              🔗 Manage Referral Pools & Rotate Links
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
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.01);
          padding: 12px;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .menu-item-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: var(--border-hover) !important;
        }
      `}</style>
    </div>
  );
}
