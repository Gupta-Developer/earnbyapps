"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { EarningApp } from '../../data/apps';

export default function Offerwall() {
  const { apps } = useApp();

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filtered Apps list for feed
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      return selectedCategory === 'All' || app.category === selectedCategory;
    });
  }, [selectedCategory, apps]);

  // Helper to get styled SVG icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Gaming':
        return (
          <svg viewBox="0 0 24 24" className="svg-icon-offer"><path fill="var(--accent-indigo)" d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2Zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2Zm4.5 3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5Zm4-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5Z"/></svg>
        );
      case 'Surveys':
        return (
          <svg viewBox="0 0 24 24" className="svg-icon-offer"><path fill="var(--accent-teal)" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1Zm2 14H7v-2h7v2Zm3-4H7v-2h10v2Zm0-4H7V7h10v2Z"/></svg>
        );
      case 'App Testing':
        return (
          <svg viewBox="0 0 24 24" className="svg-icon-offer"><path fill="#3b82f6" d="M17 1.01 7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99ZM17 19H7V5h10v14Z"/></svg>
        );
      case 'Passive':
      default:
        return (
          <svg viewBox="0 0 24 24" className="svg-icon-offer"><path fill="#10b981" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96Z"/></svg>
        );
    }
  };

  return (
    <main className="app-main">

      {/* Main Container taking full space */}
      <section className="offerwall-dashboard-container">
        
        {/* Directory Feed */}
        <div className="directory-feed">
          
          {/* Category Dropdown */}
          <div className="category-select-container">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-dropdown"
            >
              <option value="All">All Categories</option>
              <option value="Gaming">Gaming</option>
              <option value="Surveys">Surveys</option>
              <option value="App Testing">App Testing</option>
              <option value="Passive">Passive</option>
            </select>
          </div>

          <div id="apps" className="feed-header">
            <h2 className="feed-title">
              {selectedCategory === 'All' ? 'All Earning Campaigns' : `${selectedCategory} Campaigns`}
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {filteredApps.length} active listings
            </span>
          </div>

          {/* Grid Container containing the premium styled cards - 3 in each row on desktop */}
          <div className="offers-grid-custom">
            {filteredApps.length > 0 ? (
              filteredApps.map((app, index) => (
                <Link 
                  key={app.id} 
                  href={`/offerwall/${app.id}`}
                  className="offer-task-card"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="offer-card-main">
                    {/* Left Icon with color-coded theme */}
                    <div className={`offer-icon-wrapper ${app.category.toLowerCase().replace(' ', '-')}`}>
                      {getCategoryIcon(app.category)}
                    </div>
                    
                    {/* Middle Info */}
                    <div className="offer-info-center">
                      <h4 className="offer-title">{app.name}</h4>
                      <p className="offer-desc">{app.description}</p>
                    </div>

                    {/* Right Payout Badge */}
                    <div className="offer-payout-pill">
                      <span className="payout-amount">
                        {app.earningRate.startsWith('$') ? '₹ ' + (parseFloat(app.earningRate.replace(/[^0-9.]/g, '')) * 80).toFixed(0) : app.earningRate}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer tags */}
                  <div className="offer-card-footer">
                    <div className="footer-left-tags">
                      <span className="offer-num-tag">Offer {index + 1}</span>
                      <span className="instant-paying-badge">Instant Paying</span>
                    </div>
                    <div className="likes-counter">
                      <span className="like-thumb">👍</span>
                      <span className="like-count">{(app.reviewsCount || 1200 + index * 350).toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', gridColumn: 'span 3' }}>
                No campaigns found matching your criteria.
              </div>
            )}
          </div>
        </div>

      </section>

      {/* CSS Stylesheet */}
      <style>{`
        .app-main {
          min-height: calc(100vh - 71px);
          background: var(--bg-dark);
          color: var(--text-primary);
          padding: 40px 0;
          display: flex;
          justify-content: center;
        }

        .offerwall-dashboard-container {
          width: 100%;
          max-width: 1400px;
          padding: 0 32px;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .offerwall-dashboard-container {
            padding: 0 16px;
          }
        }

        .directory-feed {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        /* Category Dropdown Container */
        .category-select-container {
          margin-bottom: 24px;
          max-width: 320px;
        }

        .category-dropdown {
          width: 100%;
          height: 48px;
          padding: 0 16px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          font-family: var(--font-primary);
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-primary);
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg fill='%239ca3af' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
          background-repeat: no-repeat;
          background-position: right 12px center;
          transition: border-color 0.15s;
        }

        .category-dropdown:focus {
          border-color: var(--accent-indigo);
        }

        .feed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
        }

        .feed-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        /* Custom 3-column grid stretching across full space */
        .offers-grid-custom {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          width: 100%;
        }

        @media (max-width: 1024px) {
          .offers-grid-custom {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 640px) {
          .offers-grid-custom {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        /* Mockup Styled Cards */
        .offer-task-card {
          background: var(--bg-card);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 220px; /* balanced card height */
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.22s, border-color 0.22s;
          box-sizing: border-box;
        }

        .offer-task-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg), 0 12px 20px -8px rgba(79, 70, 229, 0.12);
          border-color: var(--border-hover);
        }

        .offer-card-main {
          display: flex;
          align-items: flex-start; /* align top to handle variable text lengths */
          gap: 16px;
          width: 100%;
        }

        .offer-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* Branded background variations */
        .offer-icon-wrapper.gaming {
          background: rgba(79, 70, 229, 0.1);
        }
        .offer-icon-wrapper.surveys {
          background: rgba(13, 148, 136, 0.1);
        }
        .offer-icon-wrapper.app-testing {
          background: rgba(59, 130, 246, 0.1);
        }
        .offer-icon-wrapper.passive {
          background: rgba(16, 185, 129, 0.1);
        }

        .svg-icon-offer {
          width: 26px;
          height: 26px;
        }

        .offer-info-center {
          flex: 1;
          min-width: 0; /* allows text truncation/wrapping */
        }

        .offer-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .offer-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
        }

        .offer-payout-pill {
          background: rgba(16, 185, 129, 0.1);
          padding: 8px 14px;
          border-radius: 8px;
          font-weight: 800;
          color: var(--accent-emerald);
          font-size: 1.05rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(16, 185, 129, 0.2);
          flex-shrink: 0;
        }

        .offer-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border-color);
          padding-top: 14px;
          margin-top: 14px;
          width: 100%;
        }

        .footer-left-tags {
          display: flex;
          gap: 8px;
        }

        .offer-num-tag {
          font-size: 0.75rem;
          background: var(--border-color);
          color: var(--text-secondary);
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 600;
        }

        .instant-paying-badge {
          font-size: 0.75rem;
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 700;
        }

        .likes-counter {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
      `}</style>
    </main>
  );
}
