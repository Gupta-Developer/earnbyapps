"use client";

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { AppTask } from '../../../data/apps';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TaskDetails({ params }: PageProps) {
  const resolvedParams = use(params);
  const { apps, completedTaskIds, claimTask } = useApp();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Find the current app
  const app = apps.find(a => a.id === resolvedParams.id);

  if (!app) {
    return (
      <div className="error-container">
        <div className="glass-card error-card">
          <h2>App Not Found</h2>
          <p>The campaign task details you requested could not be resolved or found.</p>
          <Link href="/offerwall" className="glow-btn-purple">
            Back to Offerwall
          </Link>
        </div>
        <style>{`
          .error-container {
            min-height: calc(100vh - 71px);
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-dark);
            padding: 24px;
          }
          .error-card {
            padding: 40px;
            text-align: center;
            max-width: 450px;
          }
          .error-card h2 {
            font-family: var(--font-display);
            margin-bottom: 12px;
          }
          .error-card p {
            color: var(--text-secondary);
            margin-bottom: 24px;
            line-height: 1.5;
          }
        `}</style>
      </div>
    );
  }

  // Start Task Trigger
  const handleStartTask = (task: AppTask) => {
    if (completedTaskIds.includes(task.id)) return;

    const targetUrl = app.externalUrl || 'https://google.com';
    window.open(targetUrl, '_blank');

    setToastMessage(`Redirecting to ${app.name}... Perform the task to earn.`);
    
    setTimeout(() => {
      claimTask(task.id, task.reward);
      setToastMessage(`Success: Task "${task.title}" initiated. ₹${(task.reward * 80).toFixed(0)} credited to your wallet!`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 1500);
  };

  return (
    <main className="task-details-main">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-banner">
          <span>ℹ️</span> {toastMessage}
        </div>
      )}

      <div className="details-container">
        {/* Back navigation */}
        <div className="back-nav-row">
          <Link href="/offerwall" className="back-link-btn">
            ← Back to Offerwall
          </Link>
        </div>

        {/* Info Card header */}
        <div className="glass-card main-info-card">
          <div className="app-detail-header-row">
            <div className="header-left">
              <div className="app-category-badge">{app.category}</div>
              <h1 className="detail-app-title">{app.name}</h1>
              <div className="meta-stats-row">
                <span>Rating: <strong className="highlight-amber">★ {app.rating}</strong></span>
                <span>Category Difficulty: <strong>{app.difficulty}</strong></span>
              </div>
            </div>
            
            <div className="header-right">
              <span className="est-earning-lbl">Est. Payout</span>
              <strong className="est-earning-val">
                {app.earningRate.startsWith('$') ? '₹ ' + (parseFloat(app.earningRate.replace(/[^0-9.]/g, '')) * 80).toFixed(0) : app.earningRate}
              </strong>
            </div>
          </div>

          <p className="app-detail-desc">{app.longDescription || app.description}</p>

          {app.externalUrl && (
            <div className="external-flow-note">
              <span className="info-icon">ℹ️</span>
              <p>
                <strong>Important Note:</strong> Real downloads and tasks are completed on the official external application. Clicking <strong>Start Task</strong> redirects you directly to the target URL: <a href={app.externalUrl} target="_blank" rel="noopener noreferrer">{app.externalUrl} ↗</a>.
              </p>
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <div className="tasks-section-wrapper">
          <h2 className="section-title">Earning Tasks</h2>
          <div className="tasks-list-grid">
            {app.tasks && app.tasks.length > 0 ? (
              app.tasks.map((task) => {
                const isCompleted = completedTaskIds.includes(task.id);
                return (
                  <div key={task.id} className={`glass-card task-card-item ${isCompleted ? 'completed' : ''}`}>
                    <div className="task-card-content">
                      <div className="task-card-text">
                        <h4 className="task-card-title">{task.title}</h4>
                        <p className="task-card-desc">{task.description}</p>
                      </div>
                      <div className="task-card-action">
                        <span className="task-card-reward">+₹ {(task.reward * 80).toFixed(0)}</span>
                        <button
                          disabled={isCompleted}
                          onClick={() => handleStartTask(task)}
                          className={`task-action-btn ${isCompleted ? 'disabled' : ''}`}
                        >
                          {isCompleted ? 'Claimed' : 'Start Task ↗'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="glass-card empty-tasks-card">
                No tasks currently available for this campaign.
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .task-details-main {
          min-height: calc(100vh - 71px);
          background: var(--bg-dark);
          color: var(--text-primary);
          padding: 40px 24px;
        }

        .details-container {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .back-nav-row {
          display: flex;
          align-items: center;
        }

        .back-link-btn {
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: color 0.15s;
        }
        .back-link-btn:hover {
          color: var(--accent-indigo);
        }

        /* Info Card */
        .main-info-card {
          padding: 32px;
          border-radius: 16px;
        }

        .app-detail-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .detail-app-title {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 8px 0;
        }

        .app-category-badge {
          display: inline-block;
          font-size: 0.8rem;
          background: var(--border-color);
          padding: 4px 12px;
          border-radius: 6px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .meta-stats-row {
          display: flex;
          gap: 16px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .highlight-amber {
          color: var(--accent-amber);
        }

        .est-earning-lbl {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
          text-align: right;
        }

        .est-earning-val {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--accent-emerald);
          display: block;
          margin-top: 4px;
        }

        .app-detail-desc {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0 0 24px 0;
        }

        .external-flow-note {
          background: rgba(79, 70, 229, 0.08);
          border: 1px solid rgba(79, 70, 229, 0.15);
          padding: 16px;
          border-radius: 8px;
          display: flex;
          gap: 12px;
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .external-flow-note .info-icon {
          font-size: 1.25rem;
        }
        .external-flow-note a {
          color: var(--accent-indigo);
          text-decoration: underline;
        }

        /* Tasks section */
        .tasks-section-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 16px;
        }

        .section-title {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 800;
        }

        .tasks-list-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .task-card-item {
          padding: 24px;
          border-radius: 12px;
          transition: all 0.2s;
        }
        .task-card-item:hover {
          border-color: var(--border-hover);
        }
        .task-card-item.completed {
          opacity: 0.65;
        }

        .task-card-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .task-card-text {
          flex: 1;
        }

        .task-card-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .task-card-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .task-card-action {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .task-card-reward {
          font-family: var(--font-display);
          font-weight: 800;
          color: var(--accent-emerald);
          font-size: 1.25rem;
        }

        .task-action-btn {
          background: var(--accent-indigo);
          border: none;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .task-action-btn:hover {
          background: var(--accent-indigo-hover);
          transform: translateY(-1px);
        }
        .task-action-btn.disabled {
          background: var(--border-color);
          color: var(--text-muted);
          cursor: not-allowed;
          transform: none;
        }

        /* Toast */
        .toast-banner {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #1e293b;
          border: 1px solid var(--accent-indigo);
          padding: 16px 24px;
          border-radius: 8px;
          color: var(--text-primary);
          box-shadow: var(--shadow-lg);
          z-index: 2000;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9rem;
          max-width: 400px;
        }

        .glow-btn-purple {
          background: var(--accent-indigo);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: white !important;
          padding: 12px 24px;
          border-radius: 8px;
          font-family: var(--font-primary);
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          margin-top: 12px;
        }
      `}</style>
    </main>
  );
}
