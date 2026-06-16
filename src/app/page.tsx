"use client";

import React from 'react';
import Link from 'next/link';

export default function Home() {
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
          Incentivize genuine users to install your app, complete key actions, and boost your growth.
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
      `}</style>
    </main>
  );
}
