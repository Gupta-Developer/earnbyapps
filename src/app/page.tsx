"use client";
 
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const words = ['Actions', 'Results', 'Leads', 'Conversions', 'Growth'];
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const activeWord = words[wordIndex];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(activeWord.substring(0, currentText.length - 1));
        setTypingSpeed(75);
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText(activeWord.substring(0, currentText.length + 1));
        setTypingSpeed(150);
      }, typingSpeed);
    }

    if (!isDeleting && currentText === activeWord) {
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
      setTypingSpeed(1200); // 1.2s pause before typing the next word
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex]);

  return (
    <main className="landing-page-main">
      <div className="landing-content-container">
        
        {/* Capsule Badge */}
        <div className="hero-capsule">
          Powering User Acquisition
        </div>

        {/* Main Header title */}
        <h1 className="landing-hero-title">
          Your Growth Partner <span className="arrow">↓</span>
        </h1>

        {/* Hero description */}
        <div className="landing-hero-subtitle">
          <span className="static-part">Pay only for&nbsp;</span>
          <span className="dynamic-part">
            {currentText}
            <span className="typing-cursor"></span>
          </span>
        </div>
        <p className="landing-hero-tagline">
          Don't pay for impressions!
        </p>

        {/* Promo Credit card box */}
        <div className="promo-container-box">
          <h2 className="promo-header">
            100 Free Credits for 1st Campaign!
          </h2>
          <p className="promo-subheader">
            Easily set up your campaign & start getting conversions
          </p>

          <Link href="/partner/create-campaign" className="glow-btn-purple">
            Launch Your Campaign →
          </Link>
        </div>

      </div>

      <style>{`
        .landing-page-main {
          min-height: calc(100vh - 200px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
        }
        .landing-content-container {
          max-width: 800px;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .landing-hero-subtitle {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 700px;
          margin: 0 auto 8px;
          font-size: 1.25rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .landing-hero-tagline {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-bottom: 40px;
          font-weight: 500;
          opacity: 0.85;
          letter-spacing: 0.02em;
        }
        .static-part {
          flex: 1;
          text-align: right;
          white-space: nowrap;
        }
        .dynamic-part {
          flex: 1;
          text-align: left;
          color: var(--accent-indigo);
          font-weight: 700;
          position: relative;
          white-space: nowrap;
        }
        .typing-cursor {
          display: inline-block;
          width: 3px;
          height: 1.25rem;
          background-color: var(--accent-indigo);
          margin-left: 2px;
          vertical-align: text-bottom;
          animation: blink 0.75s step-end infinite;
        }
        @keyframes blink {
          from, to { background-color: transparent }
          50% { background-color: var(--accent-indigo); }
        }
      `}</style>
    </main>
  );
}
