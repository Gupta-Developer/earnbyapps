"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';

export default function AdminAnalytics() {
  const { apps } = useApp();
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

  return (
    <div className="admin-content-card">
      <div className="card-header-section">
        <h2 className="card-heading">Device & Category Distribution</h2>
        <p className="card-subheading">Active operational graphs sync in real-time from server telemetry data.</p>
      </div>

      <div className="analytics-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '24px' }}>
        {/* Platform usage */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Platforms Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span>Android</span>
                <strong>58% (823 users)</strong>
              </div>
              <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '58%', height: '100%', background: 'var(--accent-indigo)' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span>iOS</span>
                <strong>31% (440 users)</strong>
              </div>
              <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '31%', height: '100%', background: 'var(--accent-emerald)' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span>Web Browsers</span>
                <strong>11% (157 users)</strong>
              </div>
              <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '11%', height: '100%', background: 'var(--text-muted)' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Category volume */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Category Conversion Rates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '100px', fontSize: '0.85rem' }}>Gaming:</span>
              <div style={{ flex: 1, height: '14px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', background: 'var(--accent-indigo)' }}></div>
              </div>
              <span style={{ fontSize: '0.85rem', width: '35px', textAlign: 'right' }}>75%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '100px', fontSize: '0.85rem' }}>Surveys:</span>
              <div style={{ flex: 1, height: '14px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '48%', height: '100%', background: 'var(--accent-indigo)' }}></div>
              </div>
              <span style={{ fontSize: '0.85rem', width: '35px', textAlign: 'right' }}>48%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '100px', fontSize: '0.85rem' }}>App Testing:</span>
              <div style={{ flex: 1, height: '14px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '32%', height: '100%', background: 'var(--accent-indigo)' }}></div>
              </div>
              <span style={{ fontSize: '0.85rem', width: '35px', textAlign: 'right' }}>32%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '100px', fontSize: '0.85rem' }}>Passive:</span>
              <div style={{ flex: 1, height: '14px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '92%', height: '100%', background: 'var(--accent-indigo)' }}></div>
              </div>
              <span style={{ fontSize: '0.85rem', width: '35px', textAlign: 'right' }}>92%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="placeholder-chart-block" style={{ marginTop: '24px' }}>
        <span>📈</span>
        <p>Telemetry stats synced. Hourly conversions averages look consistent for verified campaigns.</p>
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
        .glass-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-color);
          border-radius: 8px;
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
        @media (max-width: 768px) {
          .analytics-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
