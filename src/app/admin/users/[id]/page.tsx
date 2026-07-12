"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { countries } from '../../../../data/countries';
import { useApp } from '../../../../context/AppContext';

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  upi: string;
  country: string;
  tasksDone: number;
  lastLogin: string;
  role: string;
  balance: number;
}

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const { submissions } = useApp();

  const [selectedUser, setSelectedUser] = useState<RegisteredUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedUser(data);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const userSubmissions = useMemo(() => {
    if (!selectedUser) return [];
    return submissions.filter(sub => sub.userEmail.toLowerCase() === selectedUser.email.toLowerCase());
  }, [selectedUser, submissions]);

  const getCountryFlag = (countryName: string) => {
    const matched = countries.find(c => c.name.toLowerCase() === (countryName || '').toLowerCase());
    return matched ? matched.flag : '🏳️';
  };

  const renderPaymentDetails = (upi: string) => {
    if (!upi || upi === 'N/A') return 'N/A';
    try {
      if (upi.trim().startsWith('{')) {
        const parsed = JSON.parse(upi);
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
            {Object.entries(parsed).map(([key, val]) => {
              const formattedKey = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase());
              return (
                <div key={key} style={{ fontSize: '0.82rem', lineHeight: '1.2' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '0.74rem' }}>{formattedKey}: </span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{String(val)}</span>
                </div>
              );
            })}
          </div>
        );
      }
    } catch (e) {
      // Ignore parsing error
    }
    return upi;
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>Loading user details...</p>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>User Not Found</h2>
        <button 
          onClick={() => window.close()} 
          className="glow-btn-cyan" 
          style={{ padding: '10px 20px', fontSize: '0.9rem' }}
        >
          Close Tab
        </button>
      </div>
    );
  }

  return (
    <div className="user-detail-layout" style={{ width: '100%', padding: '24px 0' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={() => window.close()} 
          style={{
            background: 'transparent',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--text-primary)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          ← Close Tab
        </button>
        <span className="app-cat-badge" style={{ padding: '6px 12px', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
          {selectedUser.role}
        </span>
      </div>

      <div className="inspector-content-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '32px', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>User Profile Card</h2>
          <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent-emerald)' }}>₹{selectedUser.balance.toFixed(2)}</span>
        </div>

        <div className="meta-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <div>
            <span className="meta-lbl" style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.03em', marginBottom: '4px' }}>Full Name</span>
            <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{selectedUser.name}</strong>
          </div>
          <div>
            <span className="meta-lbl" style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.03em', marginBottom: '4px' }}>Email Address</span>
            <strong style={{ fontSize: '1rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>{selectedUser.email}</strong>
          </div>
          <div>
            <span className="meta-lbl" style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.03em', marginBottom: '4px' }}>Phone Number</span>
            <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{selectedUser.phone}</strong>
          </div>
          <div>
            <span className="meta-lbl" style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.03em', marginBottom: '4px' }}>Country</span>
            <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{getCountryFlag(selectedUser.country)} {selectedUser.country}</strong>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <span className="meta-lbl" style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.03em', marginBottom: '4px' }}>UPI ID / Details</span>
            <div style={{ wordBreak: 'break-all' }}>
              {renderPaymentDetails(selectedUser.upi)}
            </div>
          </div>
          <div>
            <span className="meta-lbl" style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.03em', marginBottom: '4px' }}>Tasks Completed</span>
            <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{selectedUser.tasksDone} Tasks</strong>
          </div>
          <div>
            <span className="meta-lbl" style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.03em', marginBottom: '4px' }}>Last Active Login</span>
            <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{selectedUser.lastLogin}</strong>
          </div>
        </div>

        {/* Task History Panel */}
        <div className="inspector-field" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
          <span className="meta-lbl" style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.03em', marginBottom: '14px' }}>Task Completion History ({userSubmissions.length})</span>
          <div className="tasks-scroll-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {userSubmissions.length > 0 ? (
              userSubmissions.map((sub) => (
                <div key={sub.id} className="task-sub-card" style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{sub.appName}</strong>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.88rem' }}>+₹{sub.reward.toFixed(2)}</span>
                  </div>
                  <p style={{ margin: '6px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    Proof: {sub.proof}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub.time}</span>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      background: 
                        sub.status === 'Pending' ? 'rgba(245,158,11,0.12)' : 
                        sub.status === 'Paid' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                      color: 
                        sub.status === 'Pending' ? '#f59e0b' : 
                        sub.status === 'Paid' ? 'var(--accent-emerald)' : '#ef4444'
                    }}>{sub.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>No task history found for this user.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
