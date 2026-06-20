"use client";

import React, { useState, useEffect } from 'react';

const INITIAL_BLOGS = [
  { id: 'blog-1', title: 'How to Maximize Daily Earnings on EarnByApps', author: 'Admin Team', date: '14 Jun 2026', views: 342 },
  { id: 'blog-2', title: 'Best High-Paying Mobile Games for June 2026', author: 'Admin Team', date: '10 Jun 2026', views: 890 }
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('eb_admin_blogs');
    if (saved) {
      setBlogs(JSON.parse(saved));
    }
  }, []);

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle || !newBlogContent) return;
    const updated = [{
      id: `blog-${Date.now()}`,
      title: newBlogTitle,
      author: 'Admin Team',
      date: '15 Jun 2026',
      views: 0
    }, ...blogs];
    setBlogs(updated);
    localStorage.setItem('eb_admin_blogs', JSON.stringify(updated));
    setNewBlogTitle('');
    setNewBlogContent('');
  };

  return (
    <div className="admin-content-card">
      <div className="card-header-section">
        <h2 className="card-heading">Articles & Guides Editor</h2>
        <p className="card-subheading">Compose tutorial content to improve earner conversion rates.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        <form onSubmit={handleCreateBlog} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label>Article Title *</label>
            <input 
              type="text" 
              value={newBlogTitle} 
              onChange={(e) => setNewBlogTitle(e.target.value)} 
              placeholder="e.g. 5 Apps yielding passive ₹100 every single hour"
              required
              style={{ padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px' }}
            />
          </div>
          <div className="form-group">
            <label>Content Layout (HTML / Markdown supported) *</label>
            <textarea 
              value={newBlogContent} 
              onChange={(e) => setNewBlogContent(e.target.value)}
              placeholder="Write educational guidelines here..."
              rows={5}
              required
              style={{ padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px' }}
            />
          </div>
          <button type="submit" className="glow-btn-purple" style={{ padding: '10px' }}>Publish Tutorial Article</button>
        </form>

        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Published Articles ({blogs.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {blogs.map(b => (
              <div key={b.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <strong style={{ fontSize: '0.85rem', display: 'block' }}>{b.title}</strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.date} • {b.views} views</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
