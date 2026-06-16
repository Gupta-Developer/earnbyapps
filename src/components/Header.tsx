"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp, UserRole } from '../context/AppContext';

export default function Header() {
  const pathname = usePathname();
  const { userRole, login, logout, theme, toggleTheme } = useApp();
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);

  // Hide global navbar on dashboard pages ONLY IF the user has access to them.
  // If access is denied (wrong role), show the navbar so they can switch roles.
  const hasAdminAccess = pathname.startsWith('/admin') && userRole === 'admin';
  const hasPartnerAccess = pathname.startsWith('/partner') && userRole === 'user';
  if (hasAdminAccess || hasPartnerAccess) {
    return null;
  }

  const handleRoleChange = (role: UserRole) => {
    login(role);
    setShowAuthDropdown(false);
  };

  return (
    <header className="site-header">
      <div className="nav-container">
        <Link href="/" className="logo-wrapper">
          <span className="logo-icon">₹</span>
          <span className="logo-text">EarnByApps</span>
        </Link>
        
        <div className="header-actions">
          {/* Offerwall navigation button (Mockup style outline button) */}
          <Link 
            href="/offerwall" 
            className={`offerwall-btn ${pathname === '/offerwall' ? 'active' : ''}`}
          >
            Offerwall
          </Link>

          {/* Theme switcher */}
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* User role menu (Auth mockup) */}
          <div className="auth-menu-container">
            <button 
              className="role-selector-btn" 
              onClick={() => setShowAuthDropdown(!showAuthDropdown)}
            >
              <span>👤</span>
              <span className="role-text-lbl">{userRole}</span>
              <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>▼</span>
            </button>

            {showAuthDropdown && (
              <div className="glass-card auth-dropdown">
                <div className="dropdown-title">Moderator Simulator</div>
                <button 
                  onClick={() => handleRoleChange('guest')} 
                  className={`dropdown-item ${userRole === 'guest' ? 'active' : ''}`}
                >
                  Guest User
                </button>
                <button 
                  onClick={() => handleRoleChange('user')} 
                  className={`dropdown-item ${userRole === 'user' ? 'active' : ''}`}
                >
                  Standard User (Submit Apps)
                </button>
                <button 
                  onClick={() => handleRoleChange('admin')} 
                  className={`dropdown-item ${userRole === 'admin' ? 'active' : ''}`}
                >
                  Administrator (Approve Apps)
                </button>

                <div style={{ margin: '8px 0', borderTop: '1px solid var(--border-color)' }}></div>

                {userRole === 'user' && (
                  <Link href="/partner/create-campaign" onClick={() => setShowAuthDropdown(false)} className="dropdown-item link-item">
                    ➡️ Go to Partner Portal
                  </Link>
                )}

                {userRole === 'admin' && (
                  <Link href="/admin" onClick={() => setShowAuthDropdown(false)} className="dropdown-item link-item">
                    ➡️ Go to Admin Moderation
                  </Link>
                )}

                {userRole !== 'guest' && (
                  <button 
                    onClick={() => { logout(); setShowAuthDropdown(false); }} 
                    className="dropdown-item logout-btn"
                  >
                    Reset Session
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          transition: background-color 0.2s, border-color 0.2s;
        }
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
        }
        .logo-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          text-decoration: none;
          color: var(--text-primary);
        }
        .logo-icon {
          font-size: 1.5rem;
          color: var(--accent-indigo);
        }
        .logo-text {
          color: var(--text-primary);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .offerwall-btn {
          border: 1px solid var(--border-color);
          background: transparent;
          color: var(--text-primary);
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
        }
        .offerwall-btn:hover, .offerwall-btn.active {
          background: var(--bg-card-hover);
          border-color: var(--border-hover);
        }
        .auth-menu-container {
          position: relative;
        }
        .role-selector-btn {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 8px 12px;
          border-radius: 6px;
          font-family: var(--font-primary);
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .role-selector-btn:hover {
          border-color: var(--border-hover);
          background: var(--bg-card-hover);
        }
        .role-text-lbl {
          text-transform: capitalize;
        }
        .auth-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 250px;
          padding: 12px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          box-shadow: var(--shadow-premium);
          z-index: 110;
        }
        .dropdown-title {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .dropdown-item {
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          padding: 8px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          text-align: left;
          transition: all 0.2s;
          display: block;
          text-decoration: none;
        }
        .dropdown-item:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }
        .dropdown-item.active {
          background: rgba(79, 70, 229, 0.08);
          color: var(--accent-indigo);
          border-color: rgba(79, 70, 229, 0.15);
        }
        .link-item {
          color: var(--accent-indigo);
          font-weight: 600;
        }
        .logout-btn {
          margin-top: 4px;
          color: rgba(239, 68, 68, 0.8);
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.05);
          color: rgba(239, 68, 68, 1);
        }
        @media (max-width: 768px) {
          .nav-container {
            padding: 12px 16px;
          }
          .role-selector-btn .role-text-lbl {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
