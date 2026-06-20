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

        {/* Support Channels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Direct Contact Channels</h3>
          
          {/* WhatsApp Card */}
          <div className="contact-card whatsapp-highlight">
            <div className="fastest-badge">⚡ FASTEST WAY</div>
            <div className="contact-header">
              <span className="contact-icon">💬</span>
              <div>
                <h4>WhatsApp Support</h4>
                <p className="contact-status">Online • Instant Replies</p>
              </div>
            </div>
            <p className="contact-desc">
              Connect directly with our partner success team for instant campaign updates, wallet top-ups, or integration help.
            </p>
            <a 
              href="https://wa.me/mocknumber" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="whatsapp-btn text-center"
              style={{ textDecoration: 'none' }}
              onClick={(e) => {
                e.preventDefault();
                alert('Opening WhatsApp chat with EarnByApps Partner Support...');
              }}
            >
              Chat on WhatsApp
            </a>
          </div>

          {/* Email Card */}
          <div className="contact-card email-card">
            <div className="contact-header">
              <span className="contact-icon">✉️</span>
              <div>
                <h4>Email Support</h4>
                <p className="contact-status">Replies in 4-6 hours</p>
              </div>
            </div>
            <p className="contact-desc">
              For complex API postback integration verification, contract billing requests, or documentation feedback.
            </p>
            <a 
              href="mailto:partners@earnbyapps.com?subject=B2B Partner Support Query" 
              className="email-btn text-center"
              style={{ textDecoration: 'none' }}
            >
              Send Email Request
            </a>
          </div>
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
        
        .contact-card {
          position: relative;
          padding: 24px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: border-color 0.2s;
        }
        .contact-card:hover {
          border-color: var(--border-hover);
        }
        
        .whatsapp-highlight {
          border: 1px solid rgba(16, 185, 129, 0.3);
          background: rgba(16, 185, 129, 0.02);
        }
        .whatsapp-highlight:hover {
          border-color: rgba(16, 185, 129, 0.6);
        }
        
        .fastest-badge {
          position: absolute;
          top: -10px;
          right: 16px;
          background: var(--accent-emerald);
          color: #0b1220;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }
        
        .contact-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .contact-icon {
          font-size: 1.5rem;
        }
        
        .contact-header h4 {
          margin: 0;
          font-size: 0.95rem;
          color: var(--text-primary);
        }
        
        .contact-status {
          margin: 2px 0 0 0;
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        
        .contact-desc {
          margin: 0;
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        
        .whatsapp-btn {
          background: var(--accent-emerald);
          color: #0b1220;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: opacity 0.2s;
        }
        .whatsapp-btn:hover {
          opacity: 0.9;
        }
        
        .email-btn {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s, border-color 0.2s;
        }
        .email-btn:hover {
          background: var(--bg-card-hover);
          border-color: var(--border-hover);
        }
        .text-center {
          text-align: center;
        }
      `}</style>
    </div>
  );
}
