"use client";
 
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const words = ['growth', 'conversions', 'results', 'actions', 'leads'];
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
      setTypingSpeed(300);
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
        <p className="landing-hero-subtitle">
          Pay only for <span className="typing-text">{currentText}</span><span className="typing-cursor">|</span>
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
        .typing-text {
          color: var(--accent-indigo);
          font-weight: 700;
          border-bottom: 2px solid var(--accent-indigo-glow);
          padding-bottom: 2px;
        }
        .typing-cursor {
          color: var(--accent-indigo);
          font-weight: 300;
          animation: blink 0.75s step-end infinite;
          margin-left: 2px;
        }
        @keyframes blink {
          from, to { color: transparent }
          50% { color: var(--accent-indigo); }
        }
      `}</style>
    </main>
  );
}
