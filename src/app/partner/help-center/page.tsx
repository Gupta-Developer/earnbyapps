"use client";

import React, { useState } from 'react';

export default function PartnerHelpCenter() {
  const [success, setSuccess] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const faqs = [
    { q: 'How long does campaign approval take?', a: 'Admins verify new campaigns within 12-24 hours. Once approved, the campaign goes live immediately on the dynamic earner Offerwall.' },
    { q: 'What is the postback API tracking configuration?', a: 'You can configure conversion postbacks via webhooks under your Campaign Actions tab. Senders can post back completions using custom transaction UUID identifiers.' },
    { q: 'How do I top up my campaign balance?', a: 'To increase target completion volume, open a support request below or email billing@earnbyapps.com with your campaign details.' }
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    setSuccess(true);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="partner-content-card">
      <div className="card-header-section">
        <h2 className="card-heading">B2B Partner Support Center</h2>
        <p className="card-subheading">Find answers to frequently asked integration questions or open a billing/support request.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', marginTop: '24px' }}>
        
        {/* FAQs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Frequently Asked Questions</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '16px' }}>
                <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--accent-indigo)' }}>Q: {faq.q}</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Request Form */}
        <div className="glass-card" style={{ padding: '24px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Open Ticket</h3>
          
          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>✉️</span>
              <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--accent-emerald)' }}>Ticket Opened Successfully!</strong>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Support staff will respond within 6 hours.</p>
              <button onClick={() => setSuccess(false)} className="menu-item-btn" style={{ margin: '16px auto 0', padding: '6px 12px', border: '1px solid var(--border-color)' }}>Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Subject *</label>
                <input 
                  type="text" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  placeholder="e.g. Budget top-up query" 
                  required
                  style={{ padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Message Detail *</label>
                <textarea 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Describe your inquiry details..." 
                  rows={4}
                  required
                  style={{ padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', width: '100%' }}
                />
              </div>

              <button type="submit" className="glow-btn-cyan" style={{ padding: '10px', width: '100%', marginTop: '6px' }}>
                Submit Request
              </button>
            </form>
          )}
        </div>

      </div>

      <style>{`
        .partner-content-card {
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
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
      `}</style>
    </div>
  );
}
