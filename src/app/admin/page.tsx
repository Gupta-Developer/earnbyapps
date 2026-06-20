"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

// Mock registered users data matching the screenshot
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

const COUNTRY_CURRENCIES: Record<string, { currency: string; symbol: string }> = {
  'Global': { currency: 'USD', symbol: '$' },
  'India': { currency: 'INR', symbol: '₹' },
  'United States': { currency: 'USD', symbol: '$' },
  'United Kingdom': { currency: 'GBP', symbol: '£' },
  'Europe': { currency: 'EUR', symbol: '€' }
};

export default function AdminDashboard() {
  const { userRole, pendingApps, apps, approveOffer, rejectOffer, submitOffer, partnershipLeads, updateLeadStatus } = useApp();
  
  // Tab control
  const [activeTab, setActiveTab] = useState<string>('Overview');
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const handleToggleCollapse = () => {
    const newVal = !isCollapsed;
    setIsCollapsed(newVal);
    localStorage.setItem('admin-sidebar-collapsed', String(newVal));
  };
  
  // User search/filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');

  // Moderation state
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Admin Task Builder States
  const [adminTasks, setAdminTasks] = useState<{ id: string; title: string; description: string; reward: number }[]>([]);
  const [adminTaskTitle, setAdminTaskTitle] = useState('');
  const [adminTaskDesc, setAdminTaskDesc] = useState('');
  const [adminTaskReward, setAdminTaskReward] = useState<number>(0.25);

  // New states for B2B sub-pages
  const [deactivatedIds, setDeactivatedIds] = useState<string[]>([]);
  const [payoutRequests, setPayoutRequests] = useState([
    { id: 'payout-1', name: 'Test User', email: 'user@example.com', amount: 500, upi: 'user@bank', status: 'Pending', date: '15 Jun 2026' },
    { id: 'payout-2', name: 'Kunal Kumar', email: 'kunal@gmail.com', amount: 150, upi: 'kunal@okaxis', status: 'Pending', date: '14 Jun 2026' },
    { id: 'payout-3', name: 'Rohan Mehta', email: 'rohan@ybl', amount: 1200, upi: 'rohan@okicici', status: 'Processed', date: '12 Jun 2026' }
  ]);

  const [userSubmissions, setUserSubmissions] = useState([
    { id: 'sub-1', name: 'Test User', appName: 'Swagbucks', taskTitle: 'Complete Daily Poll', reward: 0.25, time: '10 mins ago', status: 'Pending' },
    { id: 'sub-2', name: 'Raj Patel', appName: 'Mistplay', taskTitle: 'Reach Level 10', reward: 4.50, time: '1 hour ago', status: 'Pending' },
    { id: 'sub-3', name: 'Sonia Sharma', appName: 'Prime Opinion', taskTitle: 'Demographics Survey', reward: 1.20, time: '4 hours ago', status: 'Approved' },
    { id: 'sub-4', name: 'Amit Verma', appName: 'Honeygain', taskTitle: 'Share 1GB Bandwidth', reward: 0.50, time: '1 day ago', status: 'Approved' }
  ]);

  const [supportTickets, setSupportTickets] = useState([
    { id: 'ticket-1', sender: 'Alice Partner', email: 'alice@partner.com', subject: 'Mistplay Budget Exhausted', message: 'Hello, I want to add another ₹50,000 to my Mistplay campaign. How do I transfer the funds?', status: 'Open', date: '15 Jun 2026' },
    { id: 'ticket-2', sender: 'DevStudio Inc', email: 'dev@studio.com', subject: 'Postback API Key Reset', message: 'Can you provide the webhook URL format for campaign conversions or reset our production API credential keys?', status: 'Open', date: '14 Jun 2026' },
    { id: 'ticket-3', sender: 'Swagbucks B2B', email: 'ads@swagbucks.com', subject: 'Campaign Renewal Success', message: 'The integration looks perfect. We have renewed the placement for next month.', status: 'Resolved', date: '10 Jun 2026' }
  ]);

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  const [banners, setBanners] = useState([
    { id: 'banner-1', title: '100 Free Campaign Credits for New Partners!', link: '/partner/create-campaign', status: 'Active', image: '🎁' },
    { id: 'banner-2', title: 'Top Earner League: Win ₹5,000 Daily!', link: '/offerwall', status: 'Active', image: '🏆' },
    { id: 'banner-3', title: 'Passive Earnings: Try Honeygain Now', link: '/offerwall', status: 'Draft', image: '🐝' }
  ]);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerLink, setNewBannerLink] = useState('');

  const [blogs, setBlogs] = useState([
    { id: 'blog-1', title: 'How to Maximize Daily Earnings on EarnByApps', author: 'Admin Team', date: '14 Jun 2026', views: 342 },
    { id: 'blog-2', title: 'Best High-Paying Mobile Games for June 2026', author: 'Admin Team', date: '10 Jun 2026', views: 890 }
  ]);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');

  const [paymentSettings, setPaymentSettings] = useState({
    upiEnabled: true,
    payPalEnabled: true,
    stripeEnabled: false,
    cryptoEnabled: false,
    minWithdrawal: 50
  });

  // Direct campaign creator form states (for admins to skip approval)
  const [adminAppName, setAdminAppName] = useState('');
  const [adminAppCategory, setAdminAppCategory] = useState<'Gaming' | 'Surveys' | 'App Testing' | 'Passive' | 'App Install & Sign Up' | 'LinkedIn Followers' | 'Google Maps Reviews' | 'Telegram Members' | 'WhatsApp Members' | 'Instagram Followers' | 'Facebook Page Followers' | 'Youtube Subscribers' | 'Trustpilot Reviews' | 'Justdial Reviews' | 'Play Store Reviews' | 'Custom Task'>('Gaming');
  const [adminAppPlatforms, setAdminAppPlatforms] = useState<('iOS' | 'Android' | 'Web')[]>([]);
  const [adminAppUrl, setAdminAppUrl] = useState('');
  const [adminAppRate, setAdminAppRate] = useState('0.50');
  const [adminAppDesc, setAdminAppDesc] = useState('');
  const [adminAppLongDesc, setAdminAppLongDesc] = useState('');
  const [adminAppSuccess, setAdminAppSuccess] = useState(false);
  const [adminAppCountry, setAdminAppCountry] = useState('Global');

  const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    'App Install & Sign Up': 'Get Genuine Users On Your App from India. High Value Users',
    'LinkedIn Followers': 'Get Genuine Active LinkedIn Followers from India',
    'Google Maps Reviews': 'Get 5 Star Reviews On Your GMB Profile (⚠️Facing Dropping)',
    'Telegram Members': 'Get Real Active Indian Telegram Users On Your Telegram Channel',
    'WhatsApp Members': 'Get Real Active Indian WhatsApp Users On Your WhatsApp Channel',
    'Instagram Followers': 'Get Real Active Indian Followers On Your Profile',
    'Facebook Page Followers': 'Get Page Likes & Real Followers from India',
    'Youtube Subscribers': 'Get Genuine Youtube Subscribers from India',
    'Trustpilot Reviews': 'Get 5 Star Reviews On Your Business\'s Trustpilot Profile',
    'Justdial Reviews': 'Get 5 Star Reviews On Your Business\'s Justdial Profile',
    'Play Store Reviews': 'Get 5 Star Positive Reviews On Your App',
    'Custom Task': 'Get Your Gigs Completed With Our Platform Users',
    'Gaming': 'Complete in-game actions, download and play to earn.',
    'Surveys': 'Share your feedback, answer daily opinion polls to earn.',
    'App Testing': 'Test beta versions of apps and write UI feedback reviews.',
    'Passive': 'Earn passive income in the background automatically.'
  };

  // Filter users list based on search/filters
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

  // Action Handlers
  const handleProcessPayout = (id: string) => {
    setPayoutRequests(prev => prev.map(p => p.id === id ? { ...p, status: 'Processed' } : p));
  };

  const handleModerateSubmission = (id: string, action: 'Approved' | 'Rejected') => {
    setUserSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: action } : s));
  };

  const handleResolveTicket = (id: string) => {
    setSupportTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
    setSelectedTicketId(null);
    setTicketReplyText('');
  };

  const handleToggleBanner = (id: string) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'Active' ? 'Draft' : 'Active' } : b));
  };

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle || !newBannerLink) return;
    setBanners(prev => [...prev, {
      id: `banner-${Date.now()}`,
      title: newBannerTitle,
      link: newBannerLink,
      status: 'Active',
      image: '✨'
    }]);
    setNewBannerTitle('');
    setNewBannerLink('');
  };

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle || !newBlogContent) return;
    setBlogs(prev => [{
      id: `blog-${Date.now()}`,
      title: newBlogTitle,
      author: 'Admin Team',
      date: '15 Jun 2026',
      views: 0
    }, ...prev]);
    setNewBlogTitle('');
    setNewBlogContent('');
  };

  const handleAdminAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminTaskTitle) return;
    const newTask = {
      id: `task-admin-${Date.now()}-${adminTasks.length}`,
      title: adminTaskTitle,
      description: adminTaskDesc,
      reward: adminTaskReward
    };
    setAdminTasks([...adminTasks, newTask]);
    setAdminTaskTitle('');
    setAdminTaskDesc('');
    setAdminTaskReward(0.25);
  };

  const handleAdminRemoveTask = (id: string) => {
    setAdminTasks(adminTasks.filter(t => t.id !== id));
  };

  const handleDirectAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminAppName || !adminAppUrl || adminAppPlatforms.length === 0 || !adminAppDesc) {
      alert('Please fill out all required fields.');
      return;
    }

    const costNum = parseFloat(adminAppRate) || 0.50;
    const symbol = COUNTRY_CURRENCIES[adminAppCountry]?.symbol || '$';
    const rateString = `${symbol}${costNum.toFixed(2)} / action`;

    submitOffer({
      name: adminAppName,
      category: adminAppCategory,
      platforms: adminAppPlatforms,
      earningRate: rateString,
      averageEarningsPerDay: costNum,
      description: adminAppDesc,
      longDescription: adminAppLongDesc || adminAppDesc,
      tags: ['Admin direct', 'Promoted'],
      actionText: `Launch ${adminAppName}`,
      externalUrl: adminAppUrl,
      tasks: adminTasks.length > 0 ? adminTasks : [
        { id: `task-admin-${Date.now()}`, title: 'Complete registration', description: 'Download and create verified account.', reward: costNum }
      ],
      targetCountry: adminAppCountry,
      currency: COUNTRY_CURRENCIES[adminAppCountry]?.currency || 'USD',
      currencySymbol: symbol
    });

    setAdminAppSuccess(true);
  };

  const handleResetAdminCampaign = () => {
    setAdminAppName('');
    setAdminAppCategory('Gaming');
    setAdminAppPlatforms([]);
    setAdminAppUrl('');
    setAdminAppRate('0.50');
    setAdminAppDesc('');
    setAdminAppLongDesc('');
    setAdminTasks([]);
    setAdminAppSuccess(false);
    setAdminAppCountry('Global');
  };

  const toggleAdminPlatform = (plat: 'iOS' | 'Android' | 'Web') => {
    if (adminAppPlatforms.includes(plat)) {
      setAdminAppPlatforms(adminAppPlatforms.filter(p => p !== plat));
    } else {
      setAdminAppPlatforms([...adminAppPlatforms, plat]);
    }
  };

  // Filter apps list to exclude deactivated campaigns
  const activeAppsList = useMemo(() => {
    return apps.filter(app => !deactivatedIds.includes(app.id));
  }, [apps, deactivatedIds]);

  const handleToggleDeactivate = (id: string) => {
    if (deactivatedIds.includes(id)) {
      setDeactivatedIds(prev => prev.filter(x => x !== id));
    } else {
      setDeactivatedIds(prev => [...prev, id]);
    }
  };

  // Restrict access if not Admin
  if (userRole !== 'admin') {
    return (
      <main className="admin-denied-container">
        <div className="glass-card restriction-card">
          <span className="restriction-icon">🔒</span>
          <h2>Access Denied</h2>
          <p>You must select the <strong>Administrator</strong> role from the top-right account menu to access this moderation dashboard.</p>
        </div>
        <style>{`
          .admin-denied-container {
            max-width: 800px;
            margin: 80px auto;
            padding: 0 24px;
            display: flex;
            justify-content: center;
          }
          .restriction-card {
            padding: 48px;
            text-align: center;
            max-width: 500px;
          }
          .restriction-icon {
            font-size: 3rem;
            display: block;
            margin-bottom: 20px;
          }
          .restriction-card h2 {
            font-family: var(--font-display);
            font-size: 1.8rem;
            margin-bottom: 12px;
          }
          .restriction-card p {
            color: var(--text-secondary);
            line-height: 1.6;
          }
        `}</style>
      </main>
    );
  }

  const selectedLead = partnershipLeads.find(lead => lead.id === selectedLeadId);

  // Sidebar Menu items list matching mockup
  const menuItems = [
    { id: 'Overview', label: 'Overview', icon: '🏠' },
    { id: 'Analytics', label: 'Analytics', icon: '📊' },
    { id: 'New Campaign', label: 'New Campaign', icon: '➕' },
    { id: 'All Campaigns', label: 'All Campaigns', icon: '📁' },
    { id: 'New Leads for Partnership', label: 'New Leads for Partnership', icon: '📝' },
    { id: 'All Submissions', label: 'All Submissions', icon: '✔️' },
    { id: 'Manage Users', label: 'Manage Users', icon: '👤' },
    { id: 'Wallet', label: 'Wallet', icon: '💼' },
    { id: 'Partner Support', label: 'Partner Support', icon: '💬' },
    { id: 'Manage Banners', label: 'Manage Banners', icon: '🖼️' },
    { id: 'Manage Blog', label: 'Manage Blog', icon: '📰' },
    { id: 'Manage Referrals', label: 'Manage Referrals', icon: '🔗' },
    { id: 'Payment Options', label: 'Payment Options', icon: '⚙' }
  ];

  return (
    <div className="admin-dashboard-root">
      
      {/* 2. Main Navigation Sidebar */}
      <aside className={`admin-nav-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!isCollapsed && (
            <>
              <span className="sidebar-badge-icon">🛡️</span>
              <span className="sidebar-badge-text">ADMIN</span>
            </>
          )}
          <button 
            className="sidebar-toggle-btn"
            onClick={handleToggleCollapse}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? "»" : "«"}
          </button>
        </div>
        <nav className="sidebar-menu-list">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`menu-item-btn ${activeTab === item.id ? 'active' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="menu-item-icon">{item.icon}</span>
              {!isCollapsed && <span className="menu-item-lbl">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* 3. Right Content Area */}
      <div className="admin-content-viewport">
        {/* Top Header Bar */}
        <header className="viewport-header-bar">
          <h1 className="active-tab-title">{activeTab}</h1>
          <div className="admin-profile-display">
            <span className="admin-avatar">👤</span>
            <span className="admin-profile-name">Hi, Admin User</span>
          </div>
        </header>

        {/* Content Tabs Switcher */}
        <div className="viewport-scrollable-content">
          
          {/* 1. OVERVIEW TAB VIEW */}
          {activeTab === 'Overview' && (
            <div className="admin-overview-grid">
              
              {/* Stats Block */}
              <div className="analytics-mock-grid" style={{ marginTop: 0 }}>
                <div className="analytics-mini-card">
                  <span className="mini-lbl">Active Users</span>
                  <strong className="mini-val">1,420</strong>
                  <span className="mini-change green-txt">▲ 12.3% this week</span>
                </div>
                <div className="analytics-mini-card">
                  <span className="mini-lbl">Live Directory Apps</span>
                  <strong className="mini-val">{activeAppsList.length}</strong>
                  <span className="mini-change">Running offers</span>
                </div>
                <div className="analytics-mini-card">
                  <span className="mini-lbl">Partnership Leads</span>
                  <strong className="mini-val">{partnershipLeads.filter(l => l.status === 'New').length}</strong>
                  <span className="mini-change">{partnershipLeads.filter(l => l.status === 'New').length > 0 ? '⚠️ New leads review' : '✓ Clean queue'}</span>
                </div>
                <div className="analytics-mini-card">
                  <span className="mini-lbl">UPI Withdrawal Queue</span>
                  <strong className="mini-val">{payoutRequests.filter(p => p.status === 'Pending').length}</strong>
                  <span className="mini-change">Awaiting transfer</span>
                </div>
              </div>

              {/* Overview Details Section */}
              <div className="overview-row-container" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
                
                {/* Recent Activities */}
                <div className="admin-content-card" style={{ padding: '24px' }}>
                  <h3 className="card-heading" style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Recent Platform Activity</h3>
                  <div className="activities-timeline" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="activity-item" style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                      <span style={{ fontSize: '1.2rem' }}>👤</span>
                      <div>
                        <p style={{ fontSize: '0.88rem', margin: 0 }}>Partner <strong>Alice Partner</strong> submitted new campaign <strong>'TestAppPro'</strong>.</p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>10 mins ago</span>
                      </div>
                    </div>
                    <div className="activity-item" style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                      <span style={{ fontSize: '1.2rem' }}>💸</span>
                      <div>
                        <p style={{ fontSize: '0.88rem', margin: 0 }}>User <strong>Test User</strong> requested a UPI payout of <strong>₹500.00</strong>.</p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>45 mins ago</span>
                      </div>
                    </div>
                    <div className="activity-item" style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                      <span style={{ fontSize: '1.2rem' }}>⚡</span>
                      <div>
                        <p style={{ fontSize: '0.88rem', margin: 0 }}>System auto-tracked completed task action: <strong>Swagbucks - Complete Profile</strong>.</p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item" style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '1.2rem' }}>🔑</span>
                      <div>
                        <p style={{ fontSize: '0.88rem', margin: 0 }}>Admin approved Prime Opinion campaign to live offerwall directory.</p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>5 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="admin-content-card" style={{ padding: '24px' }}>
                  <h3 className="card-heading" style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Quick Actions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button onClick={() => setActiveTab('New Leads for Partnership')} className="glow-btn-cyan" style={{ padding: '12px 16px', fontSize: '0.85rem', width: '100%', textAlign: 'left' }}>
                      ⏳ New Leads for Partnership ({partnershipLeads.filter(l => l.status === 'New').length})
                    </button>
                    <button onClick={() => setActiveTab('Wallet')} className="glow-btn-purple" style={{ padding: '12px 16px', fontSize: '0.85rem', width: '100%', textAlign: 'left' }}>
                      💸 Process User Withdrawals
                    </button>
                    <button onClick={() => setActiveTab('New Campaign')} className="menu-item-btn" style={{ padding: '12px 16px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', textAlign: 'left', width: '100%' }}>
                      ➕ Create New Direct Offer
                    </button>
                    <button onClick={() => setActiveTab('Manage Users')} className="menu-item-btn" style={{ padding: '12px 16px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', textAlign: 'left', width: '100%' }}>
                      👤 Inspect Registered Users
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 2. ANALYTICS TAB VIEW */}
          {activeTab === 'Analytics' && (
            <div className="admin-content-card">
              <div className="card-header-section">
                <h2 className="card-heading">Device & Category Distribution</h2>
                <p className="card-subheading">Active operational graphs sync in real-time from server telemetry data.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '24px' }}>
                {/* Platform usage */}
                <div className="glass-card" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Platforms Distribution</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                        <span>Android</span>
                        <strong>58% (823 users)</strong>
                      </div>
                      <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '58%', height: '100%', background: 'var(--accent-indigo)' }}></div>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                        <span>iOS</span>
                        <strong>31% (440 users)</strong>
                      </div>
                      <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '31%', height: '100%', background: 'var(--accent-emerald)' }}></div>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                        <span>Web Browsers</span>
                        <strong>11% (157 users)</strong>
                      </div>
                      <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '11%', height: '100%', background: 'var(--text-muted)' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category volume */}
                <div className="glass-card" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Category Conversion Rates</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ width: '100px', fontSize: '0.85rem' }}>Gaming:</span>
                      <div style={{ flex: 1, height: '14px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '75%', height: '100%', background: 'var(--accent-indigo)' }}></div>
                      </div>
                      <span style={{ fontSize: '0.85rem', width: '35px', textAlign: 'right' }}>75%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ width: '100px', fontSize: '0.85rem' }}>Surveys:</span>
                      <div style={{ flex: 1, height: '14px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '48%', height: '100%', background: 'var(--accent-indigo)' }}></div>
                      </div>
                      <span style={{ fontSize: '0.85rem', width: '35px', textAlign: 'right' }}>48%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ width: '100px', fontSize: '0.85rem' }}>App Testing:</span>
                      <div style={{ flex: 1, height: '14px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '32%', height: '100%', background: 'var(--accent-indigo)' }}></div>
                      </div>
                      <span style={{ fontSize: '0.85rem', width: '35px', textAlign: 'right' }}>32%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ width: '100px', fontSize: '0.85rem' }}>Passive:</span>
                      <div style={{ flex: 1, height: '14px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '92%', height: '100%', background: 'var(--accent-indigo)' }}></div>
                      </div>
                      <span style={{ fontSize: '0.85rem', width: '35px', textAlign: 'right' }}>92%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="placeholder-chart-block" style={{ marginTop: '24px' }}>
                <span>📈</span>
                <p>Telemetry stats synced. Hourly conversions averages look consistent for verified campaigns.</p>
              </div>
            </div>
          )}

          {/* 3. NEW CAMPAIGN TAB VIEW */}
          {activeTab === 'New Campaign' && (
            <div className="admin-content-card">
              {adminAppSuccess ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🎉</span>
                  <h3 className="card-heading" style={{ fontSize: '1.5rem' }}>Direct Campaign Configured!</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    The campaign for <strong>{adminAppName}</strong> has been configured. Moderate it under <strong>Per Campaign Submissions</strong> to publish it immediately onto the live Offerwall.
                  </p>
                  <button onClick={handleResetAdminCampaign} className="glow-btn-cyan">Create Another Offer</button>
                </div>
              ) : (
                <form onSubmit={handleDirectAddCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="card-header-section" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <h2 className="card-heading">Post New Direct Campaign</h2>
                    <p className="card-subheading">Configure system offers directly into the pending queue.</p>
                  </div>

                  <div className="form-group">
                    <label>Application Name *</label>
                    <input 
                      type="text" 
                      value={adminAppName} 
                      onChange={(e) => setAdminAppName(e.target.value)} 
                      placeholder="e.g. Swagbucks Direct, Prime Survey Extra"
                      required
                      style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '6px', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Category *</label>
                      <select 
                        value={adminAppCategory} 
                        onChange={(e) => {
                          const newCat = e.target.value as any;
                          setAdminAppCategory(newCat);
                          const autoDesc = CATEGORY_DESCRIPTIONS[newCat];
                          if (autoDesc) setAdminAppDesc(autoDesc);
                        }}
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '6px', color: 'var(--text-primary)', height: '40px' }}
                      >
                        <option value="App Install & Sign Up">App Install & Sign Up</option>
                        <option value="LinkedIn Followers">LinkedIn Followers</option>
                        <option value="Google Maps Reviews">Google Maps Reviews</option>
                        <option value="Telegram Members">Telegram Members</option>
                        <option value="WhatsApp Members">WhatsApp Members</option>
                        <option value="Instagram Followers">Instagram Followers</option>
                        <option value="Facebook Page Followers">Facebook Page Followers</option>
                        <option value="Youtube Subscribers">Youtube Subscribers</option>
                        <option value="Trustpilot Reviews">Trustpilot Reviews</option>
                        <option value="Justdial Reviews">Justdial Reviews</option>
                        <option value="Play Store Reviews">Play Store Reviews</option>
                        <option value="Custom Task">Custom Task</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Surveys">Surveys</option>
                        <option value="App Testing">App Testing</option>
                        <option value="Passive">Passive</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Payout Per Action ({COUNTRY_CURRENCIES[adminAppCountry]?.currency || 'USD'} {COUNTRY_CURRENCIES[adminAppCountry]?.symbol || '$'}) *</label>
                      <input 
                        type="number" 
                        step="0.05"
                        value={adminAppRate} 
                        onChange={(e) => setAdminAppRate(e.target.value)}
                        required
                        style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '6px', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>App Redirect Target Link *</label>
                    <input 
                      type="url" 
                      value={adminAppUrl} 
                      onChange={(e) => setAdminAppUrl(e.target.value)} 
                      placeholder="https://example.com"
                      required
                      style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '6px', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Platforms *</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {['iOS', 'Android', 'Web'].map(plat => (
                        <button
                          type="button"
                          key={plat}
                          onClick={() => toggleAdminPlatform(plat as any)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            background: adminAppPlatforms.includes(plat as any) ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                            color: adminAppPlatforms.includes(plat as any) ? 'var(--accent-indigo)' : 'var(--text-secondary)',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          {plat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Target Country *</label>
                    <select 
                      value={adminAppCountry} 
                      onChange={(e) => setAdminAppCountry(e.target.value)}
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '6px', color: 'var(--text-primary)', height: '40px' }}
                    >
                      {Object.keys(COUNTRY_CURRENCIES).map(country => (
                        <option key={country} value={country}>{country} ({COUNTRY_CURRENCIES[country].currency} - {COUNTRY_CURRENCIES[country].symbol})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Short Description *</label>
                    <input 
                      type="text" 
                      value={adminAppDesc} 
                      onChange={(e) => setAdminAppDesc(e.target.value)}
                      placeholder="e.g. Install and signup to get reward"
                      required
                      style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '6px', color: 'var(--text-primary)' }}
                    />
                  </div>

                  {/* ADMIN TASK LIST BUILDER */}
                  <div className="form-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '20px' }}>
                    <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', marginBottom: '8px', color: 'var(--accent-indigo)' }}>Configure Active Actions/Tasks</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Define direct sub-tasks earners will complete to get rewards.</p>

                    <div className="added-tasks-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                      {adminTasks.length > 0 ? (
                        adminTasks.map((task, idx) => (
                          <div key={task.id} className="task-preview-chip" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '6px' }}>
                            <div>
                              <strong style={{ fontSize: '0.88rem' }}>{idx + 1}. {task.title}</strong>
                              <span style={{ marginLeft: '8px', color: 'var(--accent-emerald)', fontWeight: 'bold', fontSize: '0.85rem' }}>+{COUNTRY_CURRENCIES[adminAppCountry]?.symbol || '$'}{task.reward.toFixed(2)}</span>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>{task.description}</p>
                            </div>
                            <button type="button" onClick={() => handleAdminRemoveTask(task.id)} className="remove-task-btn" style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>
                          </div>
                        ))
                      ) : (
                        <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-muted)' }}>No actions added yet. Add at least one task action below.</p>
                      )}
                    </div>

                    <div className="glass-card task-builder-subform" style={{ padding: '16px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-color)', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem' }}>Add Live Campaign Action</h4>
                      <div className="form-group">
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Action Title</label>
                        <input 
                          type="text" 
                          value={adminTaskTitle} 
                          onChange={(e) => setAdminTaskTitle(e.target.value)}
                          placeholder="e.g. Download and play for 10 minutes"
                          style={{ padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                        />
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                        <div className="form-group">
                          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Action Description</label>
                          <input 
                            type="text" 
                            value={adminTaskDesc} 
                            onChange={(e) => setAdminTaskDesc(e.target.value)}
                            placeholder="e.g. Accounts must be unique."
                            style={{ padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Reward ({COUNTRY_CURRENCIES[adminAppCountry]?.currency || 'USD'} {COUNTRY_CURRENCIES[adminAppCountry]?.symbol || '$'})</label>
                          <input 
                            type="number" 
                            step="0.05"
                            value={adminTaskReward} 
                            onChange={(e) => setAdminTaskReward(parseFloat(e.target.value) || 0)}
                            style={{ padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                          />
                        </div>
                      </div>

                      <button type="button" onClick={handleAdminAddTask} className="glow-btn-cyan" style={{ padding: '6px 12px', fontSize: '0.8rem', alignSelf: 'flex-start' }}>
                        + Add Action
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="glow-btn-cyan" style={{ padding: '12px 24px', width: '100%', marginTop: '20px' }}>
                    Publish Campaign to Offerwall
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 4. ALL CAMPAIGNS TAB VIEW */}
          {activeTab === 'All Campaigns' && (
            <div className="admin-content-card">
              <div className="card-header-section">
                <h2 className="card-heading">Earning Apps Directory Manager</h2>
                <p className="card-subheading">Enable/disable or modify active campaigns currently published on the Offerwall.</p>
              </div>

              <div className="table-responsive-container">
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>Earning App</th>
                      <th>Category</th>
                      <th>Platform</th>
                      <th>Earning Rate</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apps.map((app) => {
                      const isDeactivated = deactivatedIds.includes(app.id);
                      return (
                        <tr key={app.id}>
                          <td>
                            <strong style={{ display: 'block' }}>{app.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rating: {app.rating} ★ ({app.reviewsCount} reviews)</span>
                          </td>
                          <td>
                            <span className="app-cat-badge">{app.category}</span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.8rem' }}>{app.platforms.join(', ')}</span>
                          </td>
                          <td style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
                            {app.earningRate}
                          </td>
                          <td>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 'bold',
                              background: isDeactivated ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                              color: isDeactivated ? '#ef4444' : 'var(--accent-emerald)'
                            }}>
                              {isDeactivated ? 'Paused' : 'Active'}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleToggleDeactivate(app.id)}
                              style={{
                                background: isDeactivated ? 'var(--accent-emerald)' : 'transparent',
                                border: '1px solid ' + (isDeactivated ? 'transparent' : 'var(--border-color)'),
                                color: isDeactivated ? 'black' : 'var(--text-primary)',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                              }}
                            >
                              {isDeactivated ? 'Resume' : 'Pause'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. NEW LEADS FOR PARTNERSHIP TAB VIEW */}
          {activeTab === 'New Leads for Partnership' && (
            <div className="admin-moderation-layout">
              <div className="submissions-panel">
                <div className="card-header-section">
                  <h2 className="card-heading">Partnership Leads ({partnershipLeads.length})</h2>
                  <p className="card-subheading">Review proposed campaigns submitted by standard users for partnership.</p>
                </div>

                <div className="pending-moderation-list">
                  {partnershipLeads.length > 0 ? (
                    partnershipLeads.map((lead) => (
                      <div 
                        key={lead.id}
                        onClick={() => setSelectedLeadId(lead.id)}
                        className={`pending-item-card ${selectedLeadId === lead.id ? 'active' : ''}`}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ display: 'block', fontSize: '1rem' }}>{lead.appName}</strong>
                            <span className="app-cat-badge">{lead.category}</span>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: 'bold',
                              marginLeft: '8px',
                              background: 
                                lead.status === 'New' ? 'rgba(245,158,11,0.1)' : 
                                lead.status === 'Contacted' ? 'rgba(59,130,246,0.1)' :
                                lead.status === 'Converted' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                              color: 
                                lead.status === 'New' ? '#f59e0b' : 
                                lead.status === 'Contacted' ? '#3b82f6' :
                                lead.status === 'Converted' ? 'var(--accent-emerald)' : '#ef4444'
                            }}>{lead.status}</span>
                          </div>
                          <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>{lead.earningRate}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-pending-banner">
                      <span>✓</span>
                      <p>All clean! There are no partnership leads registered.</p>
                    </div>
                  )}
                </div>

                <h2 className="card-heading" style={{ marginTop: '36px', fontSize: '1.2rem' }}>Active Live Campaigns ({apps.length})</h2>
                <div className="active-list-container">
                  {apps.map((app) => (
                    <div key={app.id} className="active-campaign-row">
                      <div>
                        <strong>{app.name}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '8px' }}>({app.category})</span>
                      </div>
                      <span style={{ color: 'var(--accent-emerald)', fontSize: '0.9rem', fontWeight: 600 }}>{app.earningRate}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inspector panel */}
              <div className="inspector-panel">
                {selectedLead ? (
                  <div className="glass-card inspector-content-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 className="inspector-title" style={{ margin: 0 }}>Lead Parameters</h3>
                      <span style={{
                        fontSize: '0.78rem',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        background: 
                          selectedLead.status === 'New' ? 'rgba(245,158,11,0.1)' : 
                          selectedLead.status === 'Contacted' ? 'rgba(59,130,246,0.1)' :
                          selectedLead.status === 'Converted' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: 
                          selectedLead.status === 'New' ? '#f59e0b' : 
                          selectedLead.status === 'Contacted' ? '#3b82f6' :
                          selectedLead.status === 'Converted' ? 'var(--accent-emerald)' : '#ef4444'
                      }}>{selectedLead.status}</span>
                    </div>
                    
                    <div className="meta-details-grid">
                      <div>
                        <span className="meta-lbl">App Name</span>
                        <strong className="meta-val">{selectedLead.appName}</strong>
                      </div>
                      <div>
                        <span className="meta-lbl">Category</span>
                        <strong className="meta-val">{selectedLead.category}</strong>
                      </div>
                      <div>
                        <span className="meta-lbl">Earning Metric</span>
                        <strong className="meta-val">{selectedLead.earningRate}</strong>
                      </div>
                      <div>
                        <span className="meta-lbl">Platforms</span>
                        <strong className="meta-val">{selectedLead.platforms.join(', ')}</strong>
                      </div>
                      <div>
                        <span className="meta-lbl">Partner Name</span>
                        <strong className="meta-val">{selectedLead.partnerName}</strong>
                      </div>
                      <div>
                        <span className="meta-lbl">Partner Email</span>
                        <strong className="meta-val">{selectedLead.partnerEmail}</strong>
                      </div>
                      <div>
                        <span className="meta-lbl">Target Completions</span>
                        <strong className="meta-val">{selectedLead.targetCompletions.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="meta-lbl">Budget Sizing</span>
                        <strong className="meta-val" style={{ color: 'var(--accent-emerald)' }}>${selectedLead.totalBudget.toFixed(2)}</strong>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <span className="meta-lbl">Redirect Link</span>
                        <a href={selectedLead.externalUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-indigo)', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                          {selectedLead.externalUrl} ↗
                        </a>
                      </div>
                    </div>

                    <div className="inspector-field">
                      <span className="meta-lbl">Short Description</span>
                      <p className="field-text">{selectedLead.description}</p>
                    </div>

                    <div className="inspector-field">
                      <span className="meta-lbl">Detailed Overview</span>
                      <p className="field-text" style={{ whiteSpace: 'pre-wrap' }}>{selectedLead.longDescription}</p>
                    </div>

                    <div className="inspector-field">
                      <span className="meta-lbl">Suggested Tasks ({selectedLead.suggestedTasks?.length || 0})</span>
                      <div className="tasks-scroll-list">
                        {selectedLead.suggestedTasks && selectedLead.suggestedTasks.length > 0 ? (
                          selectedLead.suggestedTasks.map((task, idx) => (
                            <div key={task.id} className="task-sub-card">
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.85rem' }}>
                                <span>{idx + 1}. {task.title}</span>
                                <span style={{ color: 'var(--accent-emerald)' }}>+${task.reward.toFixed(2)}</span>
                              </div>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{task.description}</p>
                            </div>
                          ))
                        ) : (
                          <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-muted)' }}>No suggested tasks.</p>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                      <a 
                        href={`mailto:${selectedLead.partnerEmail}?subject=Partnership Proposal for ${selectedLead.appName}`}
                        className="glow-btn-purple"
                        style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600 }}
                      >
                        📧 Connect with Partner
                      </a>
                      <div className="inspector-action-buttons" style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => updateLeadStatus(selectedLead.id, 'Contacted')}
                          className="glow-btn-cyan"
                          style={{ flex: 1, padding: '10px' }}
                        >
                          Mark Contacted
                        </button>
                        <button 
                          onClick={() => updateLeadStatus(selectedLead.id, 'Converted')}
                          className="glow-btn-cyan"
                          style={{ flex: 1, padding: '10px', background: 'var(--accent-emerald)', color: 'black' }}
                        >
                          Mark Converted
                        </button>
                        <button 
                          onClick={() => updateLeadStatus(selectedLead.id, 'Declined')}
                          className="reject-moderation-btn"
                          style={{ padding: '10px' }}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="glass-card empty-inspector-banner">
                    <span>🔍</span>
                    <p>Select a partnership lead to view contact details, suggested tasks, and manage outreach status.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. ALL SUBMISSIONS TAB VIEW */}
          {activeTab === 'All Submissions' && (
            <div className="admin-content-card">
              <div className="card-header-section">
                <h2 className="card-heading">Earner Task Completions Ledger</h2>
                <p className="card-subheading">Moderation workspace for task proof claims. Approve payouts or reject fraudulent completions.</p>
              </div>

              <div className="table-responsive-container">
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Task / App</th>
                      <th>Reward Payout</th>
                      <th>Time Sent</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userSubmissions.map((sub) => (
                      <tr key={sub.id}>
                        <td>
                          <strong>{sub.name}</strong>
                        </td>
                        <td>
                          <div>{sub.taskTitle}</div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>App: {sub.appName}</span>
                        </td>
                        <td style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
                          ${sub.reward.toFixed(2)}
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8rem' }}>{sub.time}</span>
                        </td>
                        <td>
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 'bold',
                            background: sub.status === 'Pending' ? 'rgba(245,158,11,0.1)' : sub.status === 'Approved' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                            color: sub.status === 'Pending' ? '#f59e0b' : sub.status === 'Approved' ? 'var(--accent-emerald)' : '#ef4444'
                          }}>
                            {sub.status}
                          </span>
                        </td>
                        <td>
                          {sub.status === 'Pending' ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => handleModerateSubmission(sub.id, 'Approved')} className="glow-btn-cyan" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                                Approve
                              </button>
                              <button onClick={() => handleModerateSubmission(sub.id, 'Rejected')} className="reject-moderation-btn" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Moderated</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. MANAGE USERS TAB VIEW */}
          {activeTab === 'Manage Users' && (
            <div className="admin-content-card">
              <div className="card-header-section">
                <h2 className="card-heading">User Management</h2>
                <p className="card-subheading">A list of all registered users. Click a row to open their details in a new tab.</p>
              </div>

              {/* Search & Filter row */}
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

              {/* Table list */}
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
          )}

          {/* 8. WALLET TAB VIEW */}
          {activeTab === 'Wallet' && (
            <div className="admin-content-card">
              <div className="card-header-section">
                <h2 className="card-heading">Payment Withdrawal Requests</h2>
                <p className="card-subheading">Process active money withdrawal transactions requested by platform earners.</p>
              </div>

              <div className="analytics-mock-grid" style={{ marginTop: 0 }}>
                <div className="analytics-mini-card">
                  <span className="mini-lbl">Total Disbursed Payouts</span>
                  <strong className="mini-val">₹3,84,000</strong>
                  <span className="mini-change green-txt">✓ UPI auto-gateway</span>
                </div>
                <div className="analytics-mini-card">
                  <span className="mini-lbl">Pending Withdrawal Claims</span>
                  <strong className="mini-val">₹650</strong>
                  <span className="mini-change">2 earners waiting</span>
                </div>
              </div>

              <div className="table-responsive-container">
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>Earner Profile</th>
                      <th>UPI ID / Details</th>
                      <th>Amount</th>
                      <th>Request Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payoutRequests.map((req) => (
                      <tr key={req.id}>
                        <td>
                          <strong>{req.name}</strong>
                          <span style={{ fontSize: '0.78rem', display: 'block', color: 'var(--text-muted)' }}>{req.email}</span>
                        </td>
                        <td>
                          <code style={{ fontSize: '0.85rem', color: 'var(--accent-indigo)' }}>{req.upi}</code>
                        </td>
                        <td style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                          ₹{req.amount}
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8rem' }}>{req.date}</span>
                        </td>
                        <td>
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 'bold',
                            background: req.status === 'Pending' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                            color: req.status === 'Pending' ? '#f59e0b' : 'var(--accent-emerald)'
                          }}>
                            {req.status}
                          </span>
                        </td>
                        <td>
                          {req.status === 'Pending' ? (
                            <button
                              onClick={() => handleProcessPayout(req.id)}
                              className="glow-btn-cyan"
                              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                            >
                              Process Auto-UPI
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>✓ Sent</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 9. PARTNER SUPPORT TAB VIEW */}
          {activeTab === 'Partner Support' && (
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
                      style={{ padding: '12px' }}
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
          )}

          {/* 10. MANAGE BANNERS VIEW */}
          {activeTab === 'Manage Banners' && (
            <div className="admin-content-card">
              <div className="card-header-section">
                <h2 className="card-heading">Homepage Promotional Slider</h2>
                <p className="card-subheading">Configure ad banners shown to earners.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {banners.map(b => (
                    <div key={b.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
                      <span style={{ fontSize: '2rem' }}>{b.image}</span>
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '0.95rem' }}>{b.title}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent-indigo)', marginTop: '2px' }}>Link: {b.link}</div>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: b.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                        color: b.status === 'Active' ? 'var(--accent-emerald)' : 'var(--text-muted)'
                      }}>{b.status}</span>
                      <button onClick={() => handleToggleBanner(b.id)} style={{ padding: '6px 12px', fontSize: '0.78rem', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}>
                        Toggle State
                      </button>
                    </div>
                  ))}
                </div>

                <div className="glass-card" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Insert Slider Ad</h3>
                  <form onSubmit={handleAddBanner} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="form-group">
                      <label>Ad Campaign Headline</label>
                      <input 
                        type="text" 
                        value={newBannerTitle} 
                        onChange={(e) => setNewBannerTitle(e.target.value)} 
                        placeholder="e.g. Freecash Giveaway Campaign"
                        required
                        style={{ padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px' }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Redirect Path</label>
                      <input 
                        type="text" 
                        value={newBannerLink} 
                        onChange={(e) => setNewBannerLink(e.target.value)} 
                        placeholder="/offerwall"
                        required
                        style={{ padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px' }}
                      />
                    </div>
                    <button type="submit" className="glow-btn-cyan" style={{ padding: '10px' }}>Create Active Placement</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* 11. MANAGE BLOG VIEW */}
          {activeTab === 'Manage Blog' && (
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
          )}

          {/* 12. MANAGE REFERRALS VIEW */}
          {activeTab === 'Manage Referrals' && (
            <div className="admin-content-card">
              <div className="card-header-section">
                <h2 className="card-heading">Referral System Parameters</h2>
                <p className="card-subheading">Configure bonus rates and commission scales for users inviting their friends.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="glass-card" style={{ padding: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Sign-up Referral Reward (₹ INR)</label>
                    <input 
                      type="number" 
                      defaultValue="10" 
                      style={{ padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', width: '100%' }}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Granted immediately to referrer when referee completes their first task.</span>
                  </div>

                  <div className="glass-card" style={{ padding: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Lifetime Commission Fee (%)</label>
                    <input 
                      type="number" 
                      defaultValue="5" 
                      style={{ padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', width: '100%' }}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Commission cut paid on all lifetime earner task points.</span>
                  </div>
                </div>

                <button onClick={() => alert('Referral rules updated successfully!')} className="glow-btn-cyan" style={{ padding: '12px' }}>
                  Save Rules Config
                </button>
              </div>
            </div>
          )}

          {/* 13. PAYMENT OPTIONS VIEW */}
          {activeTab === 'Payment Options' && (
            <div className="admin-content-card">
              <div className="card-header-section">
                <h2 className="card-heading">Gateway Provider Switcher</h2>
                <p className="card-subheading">Control active transaction options available for earners requesting withdrawals.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <div>
                      <strong style={{ display: 'block' }}>UPI Gateway (Direct Transfer)</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Highly popular for instant withdrawals in India.</span>
                    </div>
                    <button
                      onClick={() => setPaymentSettings(prev => ({ ...prev, upiEnabled: !prev.upiEnabled }))}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '4px',
                        background: paymentSettings.upiEnabled ? 'var(--accent-emerald)' : 'rgba(239,68,68,0.1)',
                        color: paymentSettings.upiEnabled ? 'black' : '#ef4444',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {paymentSettings.upiEnabled ? 'ACTIVE' : 'DISABLED'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <div>
                      <strong style={{ display: 'block' }}>PayPal Gateway</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Used for international currency disbursements.</span>
                    </div>
                    <button
                      onClick={() => setPaymentSettings(prev => ({ ...prev, payPalEnabled: !prev.payPalEnabled }))}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '4px',
                        background: paymentSettings.payPalEnabled ? 'var(--accent-emerald)' : 'rgba(239,68,68,0.1)',
                        color: paymentSettings.payPalEnabled ? 'black' : '#ef4444',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {paymentSettings.payPalEnabled ? 'ACTIVE' : 'DISABLED'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <div>
                      <strong style={{ display: 'block' }}>Stripe (Direct Bank Account Wire)</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Direct wire transfers for registered partners.</span>
                    </div>
                    <button
                      onClick={() => setPaymentSettings(prev => ({ ...prev, stripeEnabled: !prev.stripeEnabled }))}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '4px',
                        background: paymentSettings.stripeEnabled ? 'var(--accent-emerald)' : 'rgba(239,68,68,0.1)',
                        color: paymentSettings.stripeEnabled ? 'black' : '#ef4444',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {paymentSettings.stripeEnabled ? 'ACTIVE' : 'DISABLED'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <div>
                      <strong style={{ display: 'block' }}>Cryptocurrency Payments</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Disburse earnings via USDT or USDC tokens.</span>
                    </div>
                    <button
                      onClick={() => setPaymentSettings(prev => ({ ...prev, cryptoEnabled: !prev.cryptoEnabled }))}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '4px',
                        background: paymentSettings.cryptoEnabled ? 'var(--accent-emerald)' : 'rgba(239,68,68,0.1)',
                        color: paymentSettings.cryptoEnabled ? 'black' : '#ef4444',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {paymentSettings.cryptoEnabled ? 'ACTIVE' : 'DISABLED'}
                    </button>
                  </div>

                </div>

                <div className="glass-card" style={{ padding: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Minimum Withdrawal Threshold (₹ INR)</label>
                  <input 
                    type="number"
                    value={paymentSettings.minWithdrawal}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, minWithdrawal: parseInt(e.target.value) || 0 }))}
                    style={{ padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', width: '100px' }}
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        .admin-dashboard-root {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background: var(--bg-dark);
          color: var(--text-primary);
        }
        
        /* 1. Narrow Logo Rail */
        .admin-left-rail {
          width: 70px;
          background: #0b1220;
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 0;
          gap: 32px;
          flex-shrink: 0;
        }
        .rail-logo {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--accent-indigo);
          text-shadow: 0 0 10px rgba(79, 70, 229, 0.4);
        }
        .rail-icons {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .rail-icon-btn {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.2s;
          color: rgba(255,255,255,0.6);
        }
        .rail-icon-btn:hover, .rail-icon-btn.active {
          background: var(--accent-indigo);
          color: white;
          border-color: transparent;
        }

        /* 2. Main Navigation Sidebar */
        .admin-nav-sidebar {
          width: 260px;
          background: var(--bg-card);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          overflow-y: auto;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s, border-color 0.2s;
        }
        .admin-nav-sidebar.collapsed {
          width: 70px;
        }
        .sidebar-header {
          height: 69px !important;
          padding: 0 24px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 10px !important;
          border-bottom: 1px solid var(--border-color) !important;
          box-sizing: border-box !important;
        }
        .admin-nav-sidebar.collapsed .sidebar-header {
          padding: 0 !important;
          justify-content: center !important;
        }
        .sidebar-badge-icon {
          font-size: 1.25rem;
        }
        .sidebar-badge-text {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--text-primary);
        }
        .sidebar-toggle-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
          padding: 0;
          margin-left: auto;
        }
        .sidebar-toggle-btn:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
          border-color: var(--border-hover);
        }
        .admin-nav-sidebar.collapsed .sidebar-toggle-btn {
          margin-left: 0;
        }
        .sidebar-menu-list {
          padding: 16px 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .menu-item-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 10px 16px;
          border-radius: 8px;
          font-family: var(--font-primary);
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
          transition: all 0.2s;
        }
        .admin-nav-sidebar.collapsed .menu-item-btn {
          justify-content: center;
          padding: 10px 0;
        }
        .menu-item-btn:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }
        .menu-item-btn.active {
          background: rgba(79, 70, 229, 0.1);
          color: var(--accent-indigo);
          font-weight: 600;
        }
        .menu-item-icon {
          font-size: 1rem;
        }

        /* 3. Viewport Panel */
        .admin-content-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.02);
        }
        body.light-theme .admin-content-viewport {
          background: #f1f5f9;
        }
        .viewport-header-bar {
          background: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          padding: 16px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 69px !important;
          flex-shrink: 0;
          box-sizing: border-box !important;
          transition: background-color 0.2s, border-color 0.2s;
        }
        .active-tab-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .admin-profile-display {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .admin-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }
        .admin-profile-name {
          font-weight: 600;
          color: var(--text-primary);
        }
        .viewport-scrollable-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }

        /* 4. Table & User Management Card */
        .admin-content-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 32px;
          box-shadow: var(--shadow-md);
          transition: background-color 0.2s, border-color 0.2s;
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
        .user-filter-controls {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .search-input-wrapper {
          position: relative;
          flex: 1;
          min-width: 250px;
        }
        .search-input-wrapper .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .user-search-input {
          width: 100%;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border-color);
          padding: 10px 16px 10px 36px;
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 0.88rem;
          outline: none;
        }
        .user-search-input:focus {
          border-color: var(--accent-indigo);
        }
        .user-filter-select {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          padding: 10px 16px;
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 0.85rem;
          outline: none;
          cursor: pointer;
        }
        .user-filter-select:focus {
          border-color: var(--accent-indigo);
        }
        .table-responsive-container {
          width: 100%;
          overflow-x: auto;
        }
        .user-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.88rem;
        }
        .user-table th {
          border-bottom: 1px solid var(--border-color);
          padding: 12px 16px;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.72rem;
          letter-spacing: 0.05em;
        }
        .user-table td {
          border-bottom: 1px solid var(--border-color);
          padding: 16px;
          vertical-align: middle;
        }
        .user-table-row:hover {
          background: rgba(255,255,255,0.01);
        }
        body.light-theme .user-table-row:hover {
          background: rgba(0,0,0,0.01);
        }
        .user-avatar-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .user-icon-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          color: var(--text-secondary);
        }
        .user-name-display {
          display: block;
          color: var(--text-primary);
          font-weight: 600;
        }
        .user-email-display {
          display: block;
          font-size: 0.78rem;
          color: var(--text-secondary);
        }
        .user-id-display {
          display: block;
          font-size: 0.7rem;
          color: var(--text-muted);
          font-family: monospace;
          margin-top: 2px;
        }
        .phone-upi-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .phone-txt {
          font-weight: 500;
          color: var(--text-primary);
        }
        .upi-txt {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .country-badge {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .login-time-txt {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        /* 5. Moderation layout */
        .admin-moderation-layout {
          display: grid;
          grid-template-columns: 1fr 450px;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 1024px) {
          .admin-moderation-layout {
            grid-template-columns: 1fr;
          }
        }
        .submissions-panel {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 24px;
        }
        .pending-moderation-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }
        .pending-item-card {
          padding: 16px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pending-item-card:hover {
          background: var(--bg-card-hover);
        }
        .pending-item-card.active {
          border-color: var(--accent-indigo);
          background: rgba(79,70,229,0.05);
        }
        .app-cat-badge {
          display: inline-block;
          font-size: 0.7rem;
          background: var(--border-color);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--text-secondary);
          margin-top: 4px;
        }
        .empty-pending-banner {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
        }
        .empty-pending-banner span {
          font-size: 2rem;
          color: var(--accent-emerald);
          display: block;
          margin-bottom: 8px;
        }
        .active-campaign-row {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .active-campaign-row:last-of-type {
          border-bottom: none;
        }
        .inspector-panel {
          position: sticky;
          top: 0;
        }
        .inspector-content-card {
          padding: 24px;
        }
        .inspector-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 10px;
          margin-bottom: 16px;
        }
        .meta-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .inspector-field {
          margin-bottom: 16px;
        }
        .field-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .tasks-scroll-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 200px;
          overflow-y: auto;
          margin-top: 6px;
        }
        .task-sub-card {
          background: rgba(255,255,255,0.01);
          border: 1px solid var(--border-color);
          padding: 8px 10px;
          border-radius: 6px;
        }
        .inspector-action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        .reject-moderation-btn {
          background: transparent;
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .reject-moderation-btn:hover {
          background: rgba(239, 68, 68, 0.05);
          border-color: rgba(239, 68, 68, 0.4);
        }
        .empty-inspector-banner {
          text-align: center;
          padding: 60px 40px;
          color: var(--text-secondary);
        }
        .empty-inspector-banner span {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 12px;
        }

        /* 6. Analytics Overview block */
        .analytics-mock-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 24px;
          margin-bottom: 32px;
        }
        .analytics-mini-card {
          background: rgba(255,255,255,0.01);
          border: 1px solid var(--border-color);
          padding: 20px;
          border-radius: 8px;
        }
        .mini-lbl {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        .mini-val {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 700;
          display: block;
          margin: 6px 0;
          color: var(--text-primary);
        }
        .mini-change {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .green-txt {
          color: var(--accent-emerald) !important;
        }
        .placeholder-chart-block {
          background: rgba(255,255,255,0.01);
          border: 1px dashed var(--border-color);
          border-radius: 8px;
          padding: 80px 40px;
          text-align: center;
          color: var(--text-secondary);
        }
        .placeholder-chart-block span {
          font-size: 3rem;
          display: block;
          margin-bottom: 12px;
          opacity: 0.5;
        }
        
        @media (max-width: 768px) {
          .admin-left-rail {
            display: none;
          }
          .admin-nav-sidebar {
            width: 70px !important;
          }
          .admin-nav-sidebar .menu-item-lbl,
          .admin-nav-sidebar .sidebar-badge-text,
          .admin-nav-sidebar .sidebar-badge-icon {
            display: none !important;
          }
          .admin-nav-sidebar .sidebar-header {
            padding: 0 !important;
            justify-content: center !important;
          }
          .admin-nav-sidebar .menu-item-btn {
            justify-content: center !important;
            padding: 10px 0 !important;
          }
          .admin-nav-sidebar .sidebar-toggle-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
