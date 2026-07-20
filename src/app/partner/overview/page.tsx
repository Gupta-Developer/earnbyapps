"use client";

import React, { useMemo } from 'react';
import { useApp } from '../../../context/AppContext';

export default function PartnerOverview() {
  const { partnershipLeads, apps, submissions, userProfile } = useApp();

  const partnerEmail = userProfile?.email || '';

  // 1. Total Campaigns (total campaign leads submitted by the partner)
  const totalCampaignsCount = useMemo(() => {
    return partnershipLeads.filter(lead => lead.partnerEmail?.toLowerCase() === partnerEmail.toLowerCase()).length;
  }, [partnershipLeads, partnerEmail]);

  // 2. Assigned Campaigns (real approved campaigns assigned to this partner)
  const allAssigned = useMemo(() => {
    return apps
      .filter(app => app.assignedEmail && app.assignedEmail.toLowerCase() === partnerEmail.toLowerCase())
      .map(app => {
        const campSubmissions = submissions.filter(sub => sub.appId === app.id);
        const completedCompletions = campSubmissions.filter(sub => sub.status === 'Paid').length;
        const target = app.targetCompletions || 1000;
        return {
          targetCompletions: target,
          completedCompletions: completedCompletions
        };
      });
  }, [apps, partnerEmail, submissions]);

  const assignedCampaignsCount = allAssigned.length;

  // 3. Completion rate = sum of completedCompletions / sum of targetCompletions
  const totalTarget = useMemo(() => allAssigned.reduce((acc, c) => acc + c.targetCompletions, 0), [allAssigned]);
  const totalCompleted = useMemo(() => allAssigned.reduce((acc, c) => acc + c.completedCompletions, 0), [allAssigned]);
  const completionRate = useMemo(() => totalTarget > 0 ? (totalCompleted / totalTarget) * 100 : 0, [totalCompleted, totalTarget]);

  return (
    <div className="partner-content-card">
      <div className="card-header-section">
        <h2 className="card-heading">Campaign Dashboard</h2>
        <p className="card-subheading">Monitor bulk conversions, campaign budgets, and audience traffic statistics.</p>
      </div>

      <div className="analytics-mock-grid">
        <div className="analytics-mini-card">
          <span className="mini-lbl">Total Campaigns</span>
          <strong className="mini-val">{totalCampaignsCount}</strong>
          <span className="mini-change green-txt">✓ Leads submitted</span>
        </div>
        <div className="analytics-mini-card">
          <span className="mini-lbl">Assigned Campaigns</span>
          <strong className="mini-val">{assignedCampaignsCount}</strong>
          <span className="mini-change green-txt">▲ Running live</span>
        </div>
        <div className="analytics-mini-card">
          <span className="mini-lbl">Completion Rate</span>
          <strong className="mini-val">{completionRate.toFixed(1)}%</strong>
          <span className="mini-change">Overall task progress</span>
        </div>
        <div className="analytics-mini-card">
          <span className="mini-lbl">Conversions Delivered</span>
          <strong className="mini-val">{totalCompleted.toLocaleString()} / {totalTarget.toLocaleString()}</strong>
          <span className="mini-change">Delivered targets</span>
        </div>
      </div>

      {/* Performance Tips Section */}
      <div className="performance-tips-container">
        <div className="tips-header">
          <span className="tips-icon">💡</span>
          <div>
            <h3 className="tips-heading">Performance Tips</h3>
            <p className="tips-subheading">Bring Out Better Results From Each Campaign</p>
          </div>
        </div>

        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-card-header">
              <span className="tip-card-icon bold-icon">📝</span>
              <h4>Define Clear Instructions</h4>
            </div>
            <p className="tip-card-desc">
              Make instructions simple and use <strong>HTML Code</strong> in instructions for best making text <strong>Bold</strong>, Attaching Samples etc.
            </p>
          </div>

          <div className="tip-card">
            <div className="tip-card-header">
              <span className="tip-card-icon verify-icon">🔍</span>
              <h4>Properly Verify Submissions</h4>
            </div>
            <p className="tip-card-desc">
              Monitor user submitted proofs as soon as possible. And provide clear reason if requesting resubmit.
            </p>
          </div>

          <div className="tip-card">
            <div className="tip-card-header">
              <span className="tip-card-icon reward-icon">💎</span>
              <h4>Maximize Users Reward</h4>
            </div>
            <p className="tip-card-desc">
              Don't pay tiny amount to users for task completion, pay them better than competitors to get your gig done much faster.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .partner-content-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 32px;
          box-shadow: var(--shadow-md);
          transition: background-color 0.2s, border-color 0.2s;
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
        
        /* Analytics mock grids */
        .analytics-mock-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 24px;
          margin-bottom: 32px;
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

        /* Performance Tips Styling */
        .performance-tips-container {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 24px;
          margin-top: 16px;
        }
        .tips-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
        }
        .tips-icon {
          font-size: 1.8rem;
        }
        .tips-heading {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 2px 0;
        }
        .tips-subheading {
          font-size: 0.85rem;
          color: var(--accent-indigo);
          margin: 0;
          font-weight: 600;
        }
        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        .tip-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 18px;
          transition: all 0.2s ease-in-out;
        }
        .tip-card:hover {
          transform: translateY(-2px);
          border-color: var(--accent-indigo);
          background: rgba(79, 70, 229, 0.03);
          box-shadow: 0 4px 20px rgba(79, 70, 229, 0.05);
        }
        .tip-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .tip-card-header h4 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .tip-card-icon {
          font-size: 1.1rem;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
        }
        .bold-icon {
          background: rgba(6, 182, 212, 0.1);
        }
        .verify-icon {
          background: rgba(245, 158, 11, 0.1);
        }
        .reward-icon {
          background: rgba(16, 185, 129, 0.1);
        }
        .tip-card-desc {
          font-size: 0.8rem;
          line-height: 1.5;
          color: var(--text-secondary);
          margin: 0;
        }
      `}</style>
    </div>
  );
}
