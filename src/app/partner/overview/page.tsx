"use client";

import React from 'react';
import { useApp } from '../../../context/AppContext';

export default function PartnerOverview() {
  const { partnershipLeads } = useApp();
  const pendingCount = partnershipLeads.filter(l => l.status === 'New').length;

  return (
    <div className="partner-content-card">
      <div className="card-header-section">
        <h2 className="card-heading">Campaign Dashboard</h2>
        <p className="card-subheading">Monitor bulk conversions, campaign budgets, and audience traffic statistics.</p>
      </div>

      <div className="analytics-mock-grid">
        <div className="analytics-mini-card">
          <span className="mini-lbl">Total Spent Budget</span>
          <strong className="mini-val">$1,250.00</strong>
          <span className="mini-change green-txt">✓ Active conversions paid</span>
        </div>
        <div className="analytics-mini-card">
          <span className="mini-lbl">Conversions Delivered</span>
          <strong className="mini-val">2,450 / 5,000</strong>
          <span className="mini-change green-txt">▲ 49% progress</span>
        </div>
        <div className="analytics-mini-card">
          <span className="mini-lbl">Active Campaigns</span>
          <strong className="mini-val">3</strong>
          <span className="mini-change">Running on Offerwall</span>
        </div>
        <div className="analytics-mini-card">
          <span className="mini-lbl">Pending Review</span>
          <strong className="mini-val">{pendingCount}</strong>
          <span className="mini-change">Awaiting moderation</span>
        </div>
      </div>

      <div className="placeholder-chart-block">
        <span>📈</span>
        <p>Mock conversion traffic details are syncing from developer API daemons.</p>
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
        .placeholder-chart-block {
          background: rgba(255,255,255,0.01);
          border: 1px dashed var(--border-color);
          border-radius: 8px;
          padding: 80px 40px;
          text-align: center;
          color: var(--text-secondary);
        }
        .placeholder-chart-block span {
          font-size: 3rem;
          display: block;
          margin-bottom: 12px;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
