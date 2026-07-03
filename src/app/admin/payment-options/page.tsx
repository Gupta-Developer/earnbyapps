"use client";

import React, { useState, useEffect } from 'react';
import { countries } from '../../../data/countries';

interface PaymentMethod {
  id: number;
  name: string;
  label: string;
  placeholder: string;
  targetCountry: string;
  isActive: boolean;
}

export default function PaymentOptionsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form fields
  const [newCountry, setNewCountry] = useState('Global');
  const [newName, setNewName] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newPlaceholder, setNewPlaceholder] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Search dropdown states
  const [countrySearch, setCountrySearch] = useState('Global');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Min withdrawal threshold
  const [minWithdrawal, setMinWithdrawal] = useState(50);

  useEffect(() => {
    // Load local storage threshold
    const saved = localStorage.getItem('eb_admin_payment_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.minWithdrawal !== undefined) setMinWithdrawal(parsed.minWithdrawal);
      } catch (e) {}
    }
    
    fetchMethods();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchMethods = async () => {
    try {
      const res = await fetch('/api/admin/payment-methods');
      if (res.ok) {
        const data = await res.json();
        setMethods(data);
      }
    } catch (err) {
      console.error('Failed to fetch payment methods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMinWithdrawalChange = (val: number) => {
    setMinWithdrawal(val);
    const saved = localStorage.getItem('eb_admin_payment_settings') || '{}';
    try {
      const parsed = JSON.parse(saved);
      parsed.minWithdrawal = val;
      localStorage.setItem('eb_admin_payment_settings', JSON.stringify(parsed));
    } catch (e) {
      localStorage.setItem('eb_admin_payment_settings', JSON.stringify({ minWithdrawal: val }));
    }
  };

  const handleToggleActive = async (method: PaymentMethod) => {
    try {
      const res = await fetch('/api/admin/payment-methods', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: method.id, isActive: !method.isActive })
      });
      if (res.ok) {
        fetchMethods();
      }
    } catch (err) {
      console.error('Failed to toggle active status:', err);
    }
  };

  const handleDeleteMethod = async (id: number) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;
    try {
      const res = await fetch(`/api/admin/payment-methods?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchMethods();
      }
    } catch (err) {
      console.error('Failed to delete payment method:', err);
    }
  };

  const handleAddMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newLabel.trim() || !newPlaceholder.trim()) {
      alert('Please fill out all fields.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          label: newLabel.trim(),
          placeholder: newPlaceholder.trim(),
          targetCountry: newCountry,
          isActive: true
        })
      });
      if (res.ok) {
        setNewName('');
        setNewLabel('');
        setNewPlaceholder('');
        setNewCountry('Global');
        setCountrySearch('Global');
        fetchMethods();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add payment method');
      }
    } catch (err) {
      console.error('Failed to add payment method:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter countries list by search text
  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className="admin-content-card">
      <div className="card-header-section">
        <h2 className="card-heading">Gateway Provider Switcher</h2>
        <p className="card-subheading">Control active payment methods per country available for earners requesting withdrawals.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Left column: Add Method and Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <form onSubmit={handleAddMethod} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>Add Payout Option</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }} ref={dropdownRef}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Target Country</label>
              <input 
                type="text"
                value={countrySearch}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setCountrySearch(e.target.value);
                  setIsDropdownOpen(true);
                }}
                placeholder="Search target country..."
                style={{ padding: '8px 12px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '0.85rem', width: '100%' }}
              />
              {isDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: '220px',
                  overflowY: 'auto',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  zIndex: 20,
                  marginTop: '4px',
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  {('global'.includes(countrySearch.toLowerCase()) || countrySearch === '') && (
                    <div 
                      onClick={() => {
                        setNewCountry('Global');
                        setCountrySearch('Global');
                        setIsDropdownOpen(false);
                      }}
                      style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-primary)', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      🌐 Global (Fallback)
                    </div>
                  )}
                  {filteredCountries.map(c => (
                    <div 
                      key={c.name}
                      onClick={() => {
                        setNewCountry(c.name);
                        setCountrySearch(`${c.flag} ${c.name}`);
                        setIsDropdownOpen(false);
                      }}
                      style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-primary)', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {c.flag} {c.name} ({c.code})
                    </div>
                  ))}
                  {filteredCountries.length === 0 && !'global'.includes(countrySearch.toLowerCase()) && (
                    <div style={{ padding: '8px 12px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      No countries match
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Method Key / ID</label>
              <input 
                type="text" 
                placeholder="e.g. UPI ID, PIX, PayPal Email"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{ padding: '8px 12px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Display Label</label>
              <input 
                type="text" 
                placeholder="e.g. 🇮🇳 UPI ID (GPay / BHIM)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                style={{ padding: '8px 12px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>User Input Placeholder</label>
              <input 
                type="text" 
                placeholder="e.g. e.g. name@okhdfcbank"
                value={newPlaceholder}
                onChange={(e) => setNewPlaceholder(e.target.value)}
                style={{ padding: '8px 12px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              style={{
                marginTop: '6px',
                padding: '10px',
                borderRadius: '6px',
                background: 'var(--accent-indigo, #6366f1)',
                color: 'white',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                opacity: submitting ? 0.6 : 1
              }}
            >
              {submitting ? 'ADDING...' : 'ADD METHOD'}
            </button>
          </form>

          {/* Min Withdrawal Settings */}
          <div className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
              Minimum Withdrawal Threshold (₹ INR)
            </label>
            <input 
              type="number"
              value={minWithdrawal}
              onChange={(e) => handleMinWithdrawalChange(parseInt(e.target.value) || 0)}
              style={{ padding: '8px 12px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', width: '100%' }}
            />
          </div>
        </div>

        {/* Right column: Current gateways list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>Configured Payout Methods</h3>
          
          {loading ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading payment methods...</div>
          ) : methods.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '20px', border: '1px dashed var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>No methods configured yet.</div>
          ) : (
            methods.map((method) => {
              const matchedCountryObj = countries.find(c => c.name === method.targetCountry);
              const flag = method.targetCountry === 'Global' ? '🌐' : (matchedCountryObj?.flag || '🏳️');

              return (
                <div key={method.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{method.name}</strong>
                      <span style={{ fontSize: '0.72rem', padding: '2px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {flag} {method.targetCountry}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{method.label}</span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Placeholder: <em>{method.placeholder}</em></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => handleToggleActive(method)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '4px',
                        background: method.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: method.isActive ? '#10b981' : '#ef4444',
                        fontWeight: 'bold',
                        border: '1px solid transparent',
                        borderColor: method.isActive ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                        cursor: 'pointer',
                        fontSize: '0.78rem'
                      }}
                    >
                      {method.isActive ? 'ACTIVE' : 'DISABLED'}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteMethod(method.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        background: 'rgba(255,255,255,0.02)',
                        color: '#ff4d4d',
                        border: '1px solid rgba(255,0,0,0.15)',
                        cursor: 'pointer',
                        fontSize: '0.78rem'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
