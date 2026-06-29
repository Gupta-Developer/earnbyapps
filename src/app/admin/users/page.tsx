"use client";

import React, { useState, useMemo } from 'react';
import { countries } from '../../../data/countries';
import { useApp } from '../../../context/AppContext';

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  upi: string;
  country: string;
  tasksDone: number;
  lastLogin: string;
  role: string;
  balance: number;
}

const INITIAL_USERS: RegisteredUser[] = [
  {
    id: 'partner-id-1',
    name: 'Alice Partner',
    email: 'alice@partner.com',
    phone: '1122334455',
    upi: 'N/A',
    country: 'United States',
    tasksDone: 0,
    lastLogin: '30 Dec 2025, 11:51 AM',
    role: 'Partner',
    balance: 0.00
  },
  {
    id: 'mock-user-id',
    name: 'Test User',
    email: 'user@example.com',
    phone: '9876543210',
    upi: 'user@bank',
    country: 'India',
    tasksDone: 1,
    lastLogin: '01 Jan 2026, 11:51 AM',
    role: 'Earner',
    balance: 12.50
  },
  {
    id: 'admin-id-1',
    name: 'Admin User',
    email: 'admin@earnbyapps.com',
    phone: '5555555555',
    upi: 'admin@bank',
    country: 'India',
    tasksDone: 0,
    lastLogin: '01 Jan 2026, 11:51 AM',
    role: 'Admin',
    balance: 100.00
  }
];

export default function UsersPage() {
  const { submissions } = useApp();
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Balance adjustment state
  const [adjustAmount, setAdjustAmount] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch real users:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery) ||
        user.upi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCountry = 
        selectedCountry === 'All Countries' || 
        user.country === selectedCountry;

      return matchesSearch && matchesCountry;
    });
  }, [users, searchQuery, selectedCountry]);

  const selectedUser = users.find(u => u.id === selectedUserId);
  const userSubmissions = useMemo(() => {
    if (!selectedUser) return [];
    return submissions.filter(sub => sub.userEmail.toLowerCase() === selectedUser.email.toLowerCase());
  }, [selectedUser, submissions]);

  const getCountryFlag = (countryName: string) => {
    const matched = countries.find(c => c.name.toLowerCase() === countryName.toLowerCase());
    return matched ? matched.flag : '🏳️';
  };

  const handleAdjustBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !adjustAmount) return;
    const amt = parseFloat(adjustAmount);
    if (isNaN(amt)) return;

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id, adjustAmount: amt })
      });
      if (res.ok) {
        alert(`Successfully adjusted balance of ${selectedUser.name} by $${amt.toFixed(2)}`);
        fetchUsers();
      } else {
        const errorData = await res.json();
        alert(`Error adjusting balance: ${errorData.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update balance in database');
    }
    setAdjustAmount('');
  };

  return (
    <div className="admin-moderation-layout">
      {/* List Panel */}
      <div className="submissions-panel">
        <div className="card-header-section" style={{ marginBottom: '20px' }}>
          <h2 className="card-heading">User Management ({filteredUsers.length})</h2>
          <p className="card-subheading">View registered earners, developers, and administrators.</p>
        </div>

        <div className="user-filter-controls" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Search by name, email, UPI ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.01)',
              border: '1px solid var(--border-color)',
              padding: '10px 14px',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <select 
            value={selectedCountry} 
            onChange={(e) => setSelectedCountry(e.target.value)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              padding: '10px 14px',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All Countries">All Countries</option>
            <option value="India">🇮🇳 India</option>
            <option value="United States">🇺🇸 United States</option>
          </select>
        </div>

        <div className="pending-moderation-list">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div 
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={`pending-item-card ${selectedUserId === user.id ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      color: 'black'
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)', display: 'block' }}>{user.name}</strong>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{user.email}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--accent-emerald)' }}>${user.balance.toFixed(2)}</span>
                    <span className="app-cat-badge">{user.role}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-pending-banner">
              <span style={{ fontSize: '2rem' }}>🔍</span>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem' }}>No users found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Inspector Panel */}
      <div className="inspector-panel">
        {selectedUser ? (
          <div className="inspector-content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <h3 className="inspector-title" style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold' }}>User profile card</h3>
              <span className="app-cat-badge" style={{ padding: '4px 10px', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 'bold' }}>{selectedUser.role}</span>
            </div>

            <div className="meta-details-grid">
              <div>
                <span className="meta-lbl">Full Name</span>
                <strong className="meta-val">{selectedUser.name}</strong>
              </div>
              <div>
                <span className="meta-lbl">Email Address</span>
                <strong className="meta-val" style={{ wordBreak: 'break-all' }}>{selectedUser.email}</strong>
              </div>
              <div>
                <span className="meta-lbl">Phone Number</span>
                <strong className="meta-val">{selectedUser.phone}</strong>
              </div>
              <div>
                <span className="meta-lbl">UPI ID / Details</span>
                <strong className="meta-val">{selectedUser.upi}</strong>
              </div>
              <div>
                <span className="meta-lbl">Country</span>
                <strong className="meta-val">{getCountryFlag(selectedUser.country)} {selectedUser.country}</strong>
              </div>
              <div>
                <span className="meta-lbl">Tasks Completed</span>
                <strong className="meta-val">{selectedUser.tasksDone} Tasks</strong>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span className="meta-lbl">Last Active Login</span>
                <strong className="meta-val">{selectedUser.lastLogin}</strong>
              </div>
            </div>

            <div className="inspector-field" style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '8px' }}>
              <span className="meta-lbl" style={{ marginBottom: '8px' }}>Adjust Account Balance</span>
              <form onSubmit={handleAdjustBalance} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="e.g. +10.00 or -5.00" 
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--border-color)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                  required
                />
                <button type="submit" className="glow-btn-cyan" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                  Update
                </button>
              </form>
            </div>

            {/* Task History Panel */}
            <div className="inspector-field" style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <span className="meta-lbl" style={{ marginBottom: '10px' }}>Task Completion History ({userSubmissions.length})</span>
              <div className="tasks-scroll-list" style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {userSubmissions.length > 0 ? (
                  userSubmissions.map((sub) => (
                    <div key={sub.id} className="task-sub-card" style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{sub.appName}</strong>
                        <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.8rem' }}>+${sub.reward.toFixed(2)}</span>
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        Proof: {sub.proof}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{sub.time}</span>
                        <span style={{
                          display: 'inline-block',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: 'bold',
                          background: 
                            sub.status === 'Pending' ? 'rgba(245,158,11,0.12)' : 
                            sub.status === 'Approved' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                          color: 
                            sub.status === 'Pending' ? '#f59e0b' : 
                            sub.status === 'Approved' ? 'var(--accent-emerald)' : '#ef4444'
                        }}>{sub.status}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>No task history found for this user.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-inspector-banner">
            <span style={{ fontSize: '2.5rem', opacity: 0.6 }}>👤</span>
            <h4 style={{ margin: '12px 0 6px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>Select User</h4>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '300px', lineHeight: 1.5 }}>
              Select a user from the list on the left to inspect profile metadata, country flags, task completion metrics, and adjust balance.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .admin-moderation-layout {
          display: grid;
          grid-template-columns: 1.2fr 1.8fr;
          gap: 24px;
          align-items: flex-start;
          width: 100%;
        }

        .submissions-panel {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 24px;
          box-shadow: var(--shadow-md);
        }

        .pending-moderation-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pending-item-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s;
          cursor: pointer;
        }

        .pending-item-card:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: var(--border-hover);
        }

        .pending-item-card.active {
          border-color: var(--accent-indigo);
          background: rgba(79, 70, 229, 0.04);
          box-shadow: 0 0 12px rgba(79, 70, 229, 0.15);
        }

        .app-cat-badge {
          display: inline-block;
          font-size: 0.7rem;
          background: var(--border-color);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--text-secondary);
        }

        .empty-pending-banner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px;
          border: 1px dashed var(--border-color);
          border-radius: 8px;
          color: var(--text-muted);
          text-align: center;
        }

        .inspector-panel {
          position: sticky;
          top: 24px;
        }

        .inspector-content-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 24px;
          box-shadow: var(--shadow-md);
        }

        .meta-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .meta-lbl {
          display: block;
          font-size: 0.72rem;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 600;
          letter-spacing: 0.03em;
          margin-bottom: 2px;
        }

        .meta-val {
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .inspector-field {
          margin-bottom: 18px;
        }

        .empty-inspector-banner {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 60px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          box-shadow: var(--shadow-md);
        }

        @media (max-width: 992px) {
          .admin-moderation-layout {
            grid-template-columns: 1fr;
          }
          .inspector-panel {
            position: relative;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
}
