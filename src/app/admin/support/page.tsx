"use client";

import React, { useState, useEffect } from 'react';

const INITIAL_TICKETS = [
  { id: 'ticket-1', sender: 'Alice Partner', email: 'alice@partner.com', subject: 'Mistplay Budget Exhausted', message: 'Hello, I want to add another ₹50,000 to my Mistplay campaign. How do I transfer the funds?', status: 'Open', date: '15 Jun 2026' },
  { id: 'ticket-2', sender: 'DevStudio Inc', email: 'dev@studio.com', subject: 'Postback API Key Reset', message: 'Can you provide the webhook URL format for campaign conversions or reset our production API credential keys?', status: 'Open', date: '14 Jun 2026' },
  { id: 'ticket-3', sender: 'Swagbucks B2B', email: 'ads@swagbucks.com', subject: 'Campaign Renewal Success', message: 'The integration looks perfect. We have renewed the placement for next month.', status: 'Resolved', date: '10 Jun 2026' }
];

export default function SupportPage() {
  const [supportTickets, setSupportTickets] = useState(INITIAL_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('eb_admin_tickets');
    if (saved) {
      setSupportTickets(JSON.parse(saved));
    }
  }, []);

  const handleResolveTicket = (id: string) => {
    const updated = supportTickets.map(t => t.id === id ? { ...t, status: 'Resolved' } : t);
    setSupportTickets(updated);
    localStorage.setItem('eb_admin_tickets', JSON.stringify(updated));
    setSelectedTicketId(null);
    setTicketReplyText('');
  };

  return (
    <div className="admin-content-card">
      <div className="card-header-section">
        <h2 className="card-heading">B2B Support Inbox</h2>
        <p className="card-subheading">Respond to questions from advertising partners and task developers.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {supportTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicketId(ticket.id)}
              className={`pending-item-card ${selectedTicketId === ticket.id ? 'active' : ''}`}
              style={{ padding: '12px', cursor: 'pointer' }}
            >
              <strong style={{ fontSize: '0.88rem', display: 'block' }}>{ticket.subject}</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From: {ticket.sender}</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{ticket.date}</span>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  fontWeight: 'bold',
                  background: ticket.status === 'Open' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                  color: ticket.status === 'Open' ? '#ef4444' : 'var(--accent-emerald)'
                }}>{ticket.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          {selectedTicketId ? (() => {
            const ticket = supportTickets.find(t => t.id === selectedTicketId);
            if (!ticket) return null;
            return (
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: '0 0 4px 0' }}>{ticket.subject}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>From: <strong>{ticket.sender}</strong> ({ticket.email})</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '6px' }}>
                  {ticket.message}
                </p>
                
                {ticket.status === 'Open' ? (
                  <div style={{ marginTop: '20px' }}>
                    <textarea
                      placeholder="Write a message response to partner..."
                      value={ticketReplyText}
                      onChange={(e) => setTicketReplyText(e.target.value)}
                      rows={3}
                      style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button onClick={() => handleResolveTicket(ticket.id)} className="glow-btn-cyan" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                        Send Response & Resolve
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontStyle: 'italic', color: 'var(--accent-emerald)', fontSize: '0.85rem', marginTop: '16px' }}>✓ This ticket has been marked as resolved.</p>
                )}
              </div>
            );
          })() : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
              Select a support ticket from the sidebar to inspect conversation threads and reply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
