"use client";

import React, { useState, useMemo } from 'react';

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  upi: string;
  country: string;
  tasksDone: number;
  lastLogin: string;
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
    lastLogin: '30 Dec 2025, 11:51 AM'
  },
  {
    id: 'mock-user-id',
    name: 'Test User',
    email: 'user@example.com',
    phone: '9876543210',
    upi: 'user@bank',
    country: 'India',
    tasksDone: 1,
    lastLogin: '01 Jan 2026, 11:51 AM'
  },
  {
    id: 'admin-id-1',
    name: 'Admin User',
    email: 'admin@earnbyapps.com',
    phone: '5555555555',
    upi: 'admin@bank',
    country: 'India',
    tasksDone: 0,
    lastLogin: '01 Jan 2026, 11:51 AM'
  }
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');

  const filteredUsers = useMemo(() => {
    return INITIAL_USERS.filter(user => {
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
  }, [searchQuery, selectedCountry]);

  return (
    <div className="admin-content-card">
      <div className="card-header-section">
        <h2 className="card-heading">User Management</h2>
        <p className="card-subheading">A list of all registered users. Click a row to open their details in a new tab.</p>
      </div>

      <div className="user-filter-controls">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search by ID, name, email, phone, or UPI..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="user-search-input"
          />
        </div>
        
        <select 
          value={selectedCountry} 
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="user-filter-select"
        >
          <option value="All Countries">All Countries</option>
          <option value="India">India</option>
          <option value="United States">United States</option>
        </select>

        <select className="user-filter-select">
          <option>Newest First</option>
          <option>Oldest First</option>
        </select>
      </div>

      <div className="table-responsive-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Phone / UPI</th>
              <th>Country</th>
              <th style={{ textAlign: 'center' }}>Tasks Done</th>
              <th>Last Login</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="user-table-row">
                  <td>
                    <div className="user-avatar-cell">
                      <div className="user-icon-avatar">👤</div>
                      <div>
                        <strong className="user-name-display">{user.name}</strong>
                        <span className="user-email-display">{user.email}</span>
                        <span className="user-id-display">{user.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="phone-upi-cell">
                      <span className="phone-txt">{user.phone}</span>
                      <span className="upi-txt">{user.upi}</span>
                    </div>
                  </td>
                  <td>
                    <span className="country-badge">{user.country}</span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {user.tasksDone}
                  </td>
                  <td>
                    <span className="login-time-txt">{user.lastLogin}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No users found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
