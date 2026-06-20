"use client";

import React from 'react';

export default function PartnerPlatforms() {
  return (
    <div className="partner-content-card">
      <div className="card-header-section text-center">
        <h2 className="card-heading">Download EarnByApps Mobile</h2>
        <p className="card-subheading">Our platform is fully compatible across mobile systems. Earners can complete your campaigns directly from their smartphones.</p>
      </div>

      <div className="platforms-grid">
        {/* Android Card */}
        <div className="platform-card glass-card">
          <div className="platform-header">
            <span className="platform-icon android-brand">🤖</span>
            <div>
              <h3>Android App</h3>
              <p className="platform-release">v2.4.0 • Active</p>
            </div>
          </div>
          <p className="platform-desc">
            Get the verified Android app package directly from the Google Play Store or install the secure APK file. Compatible with all modern Android versions.
          </p>
          <div className="qr-container">
            <div className="mock-qr">
              {/* SVG representation of a QR code */}
              <svg viewBox="0 0 100 100" className="qr-svg">
                <rect width="100" height="100" fill="transparent" />
                <rect x="10" y="10" width="20" height="20" fill="var(--text-primary)" />
                <rect x="15" y="15" width="10" height="10" fill="var(--bg-card)" />
                <rect x="70" y="10" width="20" height="20" fill="var(--text-primary)" />
                <rect x="75" y="15" width="10" height="10" fill="var(--bg-card)" />
                <rect x="10" y="70" width="20" height="20" fill="var(--text-primary)" />
                <rect x="15" y="75" width="10" height="10" fill="var(--bg-card)" />
                {/* Random QR blocks */}
                <rect x="40" y="10" width="10" height="10" fill="var(--text-primary)" />
                <rect x="50" y="20" width="10" height="10" fill="var(--text-primary)" />
                <rect x="40" y="30" width="20" height="10" fill="var(--text-primary)" />
                <rect x="10" y="45" width="10" height="15" fill="var(--text-primary)" />
                <rect x="25" y="40" width="10" height="10" fill="var(--text-primary)" />
                <rect x="70" y="40" width="15" height="10" fill="var(--text-primary)" />
                <rect x="80" y="55" width="10" height="20" fill="var(--text-primary)" />
                <rect x="40" y="70" width="15" height="15" fill="var(--text-primary)" />
                <rect x="50" y="85" width="15" height="5" fill="var(--text-primary)" />
              </svg>
            </div>
            <div className="qr-text">
              <span className="scan-lbl">Scan to Download</span>
              <span className="scan-sub">Point your camera to get the link</span>
            </div>
          </div>
          <button onClick={() => alert('Redirecting to Google Play Store...')} className="glow-btn-cyan w-100 mt-auto">
            Get it on Google Play
          </button>
        </div>

        {/* iOS Card */}
        <div className="platform-card glass-card">
          <div className="platform-header">
            <span className="platform-icon iOS-brand">🍎</span>
            <div>
              <h3>App Store App</h3>
              <p className="platform-release">v2.3.8 • Active</p>
            </div>
          </div>
          <p className="platform-desc">
            Optimized for Apple devices. Install securely through the official iOS App Store. Designed with full keychain credentials mapping support.
          </p>
          <div className="qr-container">
            <div className="mock-qr">
              <svg viewBox="0 0 100 100" className="qr-svg">
                <rect width="100" height="100" fill="transparent" />
                <rect x="10" y="10" width="20" height="20" fill="var(--text-primary)" />
                <rect x="15" y="15" width="10" height="10" fill="var(--bg-card)" />
                <rect x="70" y="10" width="20" height="20" fill="var(--text-primary)" />
                <rect x="75" y="15" width="10" height="10" fill="var(--bg-card)" />
                <rect x="10" y="70" width="20" height="20" fill="var(--text-primary)" />
                <rect x="15" y="75" width="10" height="10" fill="var(--bg-card)" />
                {/* Random QR blocks */}
                <rect x="30" y="15" width="10" height="10" fill="var(--text-primary)" />
                <rect x="55" y="10" width="10" height="20" fill="var(--text-primary)" />
                <rect x="40" y="40" width="15" height="10" fill="var(--text-primary)" />
                <rect x="10" y="50" width="20" height="10" fill="var(--text-primary)" />
                <rect x="75" y="45" width="15" height="15" fill="var(--text-primary)" />
                <rect x="35" y="70" width="10" height="20" fill="var(--text-primary)" />
                <rect x="55" y="75" width="25" height="10" fill="var(--text-primary)" />
              </svg>
            </div>
            <div className="qr-text">
              <span className="scan-lbl">Scan to Download</span>
              <span className="scan-sub">Point your camera to get the link</span>
            </div>
          </div>
          <button onClick={() => alert('Redirecting to Apple App Store...')} className="glow-btn-purple w-100 mt-auto">
            Download on the App Store
          </button>
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
        .text-center {
          text-align: center;
        }
        .card-header-section {
          margin-bottom: 36px;
        }
        .card-heading {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        .card-subheading {
          font-size: 0.9rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.5;
        }
        
        .platforms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 28px;
          margin-top: 16px;
        }
        
        .platform-card {
          padding: 28px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-color);
          transition: transform 0.2s, border-color 0.2s;
        }
        .platform-card:hover {
          border-color: var(--border-hover);
          transform: translateY(-2px);
        }
        
        .platform-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .platform-icon {
          font-size: 2.2rem;
          width: 56px;
          height: 56px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.02);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
        }
        .android-brand {
          color: var(--accent-emerald);
          text-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
        }
        .iOS-brand {
          color: var(--text-primary);
        }
        
        .platform-header h3 {
          font-family: var(--font-display);
          font-size: 1.15rem;
          margin: 0 0 4px 0;
          color: var(--text-primary);
        }
        .platform-release {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin: 0;
        }
        
        .platform-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }
        
        .qr-container {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(0, 0, 0, 0.15);
          padding: 16px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }
        .mock-qr {
          width: 64px;
          height: 64px;
          padding: 4px;
          background: #fff;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qr-svg {
          width: 100%;
          height: 100%;
        }
        .qr-svg rect {
          fill: #0b1220;
        }
        .qr-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .scan-lbl {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .scan-sub {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        
        .w-100 {
          width: 100%;
        }
        .mt-auto {
          margin-top: auto;
        }
      `}</style>
    </div>
  );
}
