"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { EarningApp, EARNING_APPS, AppTask } from '../data/apps';

export type UserRole = 'guest' | 'user' | 'admin';
export type AppTheme = 'light' | 'dark';

export interface PartnershipLead {
  id: string;
  partnerName: string;
  partnerEmail: string;
  appName: string;
  category: 'Gaming' | 'Surveys' | 'App Testing' | 'Passive' | 'App Install & Sign Up' | 'LinkedIn Followers' | 'Google Maps Reviews' | 'Telegram Members' | 'WhatsApp Members' | 'Instagram Followers' | 'Facebook Page Followers' | 'Youtube Subscribers' | 'Trustpilot Reviews' | 'Justdial Reviews' | 'Play Store Reviews' | 'Custom Task';
  platforms: ('iOS' | 'Android' | 'Web')[];
  earningRate: string;
  averageEarningsPerDay: number;
  description: string;
  longDescription: string;
  tags: string[];
  actionText: string;
  externalUrl?: string;
  suggestedTasks: AppTask[];
  status: 'New' | 'Contacted' | 'Converted' | 'Declined';
  createdAt: string;
  targetCompletions: number;
  costPerCompletion: number;
  totalBudget: number;
  targetCountry?: string;
  currency?: string;
  currencySymbol?: string;
}

interface AppContextType {
  userRole: UserRole;
  apps: EarningApp[];
  pendingApps: EarningApp[];
  partnershipLeads: PartnershipLead[];
  walletBalance: number;
  completedTaskIds: string[];
  theme: AppTheme;
  login: (role: UserRole) => void;
  logout: () => void;
  submitOffer: (app: Omit<EarningApp, 'id' | 'rating' | 'reviewsCount' | 'difficulty'>) => void;
  approveOffer: (id: string, updatedApp?: EarningApp) => void;
  rejectOffer: (id: string) => void;
  submitPartnershipLead: (lead: Omit<PartnershipLead, 'id' | 'status' | 'createdAt' | 'partnerName' | 'partnerEmail'>) => void;
  updateLeadStatus: (id: string, status: PartnershipLead['status']) => void;
  claimTask: (taskId: string, reward: number) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_LEADS: PartnershipLead[] = [
  {
    id: 'lead-1',
    partnerName: 'Alice Partner',
    partnerEmail: 'alice@partner.com',
    appName: 'Mistplay Partner Campaign',
    category: 'Gaming',
    platforms: ['Android'],
    earningRate: '$0.50 / action',
    averageEarningsPerDay: 0.5,
    description: 'Play and earn units by running mobile games.',
    longDescription: 'A custom campaign suggested by Alice for testing mobile games on Android devices.',
    tags: ['Android Only', 'Gaming'],
    actionText: 'Open Mistplay Partner Campaign',
    suggestedTasks: [
      { id: 'lead-task-1', title: 'Complete first 15 mins play', description: 'Install Coin Master and play for 15 minutes.', reward: 1.20 }
    ],
    status: 'New',
    createdAt: '15 Jun 2026',
    targetCompletions: 2000,
    costPerCompletion: 0.50,
    totalBudget: 1000
  }
];

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [apps, setApps] = useState<EarningApp[]>([]);
  const [pendingApps, setPendingApps] = useState<EarningApp[]>([]);
  const [partnershipLeads, setPartnershipLeads] = useState<PartnershipLead[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(124.50);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [theme, setTheme] = useState<AppTheme>('dark');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const storedRole = localStorage.getItem('eb_role') as UserRole;
      const storedApps = localStorage.getItem('eb_apps');
      const storedPending = localStorage.getItem('eb_pending');
      const storedLeads = localStorage.getItem('eb_leads');
      const storedWallet = localStorage.getItem('eb_wallet');
      const storedCompleted = localStorage.getItem('eb_completed');
      const storedTheme = localStorage.getItem('eb_theme') as AppTheme;

      if (storedRole) setUserRole(storedRole);
      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        setTheme('dark');
      }
      
      if (storedApps) {
        setApps(JSON.parse(storedApps));
      } else {
        setApps(EARNING_APPS);
        localStorage.setItem('eb_apps', JSON.stringify(EARNING_APPS));
      }

      if (storedPending) setPendingApps(JSON.parse(storedPending));
      
      if (storedLeads) {
        setPartnershipLeads(JSON.parse(storedLeads));
      } else {
        setPartnershipLeads(INITIAL_LEADS);
        localStorage.setItem('eb_leads', JSON.stringify(INITIAL_LEADS));
      }

      if (storedWallet) setWalletBalance(parseFloat(storedWallet));
      if (storedCompleted) setCompletedTaskIds(JSON.parse(storedCompleted));
    } catch (e) {
      console.error("Failed to load local storage state:", e);
      setApps(EARNING_APPS);
      setPartnershipLeads(INITIAL_LEADS);
    }
    setIsInitialized(true);
  }, []);

  // Sync theme changes to body class
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    }
    if (isInitialized) {
      localStorage.setItem('eb_theme', theme);
    }
  }, [theme, isInitialized]);

  // Sync state changes to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('eb_role', userRole);
  }, [userRole, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('eb_apps', JSON.stringify(apps));
  }, [apps, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('eb_pending', JSON.stringify(pendingApps));
  }, [pendingApps, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('eb_leads', JSON.stringify(partnershipLeads));
  }, [partnershipLeads, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('eb_wallet', walletBalance.toString());
  }, [walletBalance, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('eb_completed', JSON.stringify(completedTaskIds));
  }, [completedTaskIds, isInitialized]);

  const login = (role: UserRole) => {
    setUserRole(role);
  };

  const logout = () => {
    setUserRole('guest');
  };

  const submitOffer = (newApp: Omit<EarningApp, 'id' | 'rating' | 'reviewsCount' | 'difficulty'>) => {
    const fullApp: EarningApp = {
      ...newApp,
      id: `custom-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      difficulty: 'Easy'
    };
    // Live admin offers bypass approval directly to active directory, or can go to pending. Let's make it direct for admin since admin is adding it.
    // Wait, the page says: "Once verified and approved by an administrator..."
    // Since only admins can create tasks and campaigns now, when admin creates an offer it should go straight to active apps.
    // Let's make it go to apps state.
    setApps(prev => [...prev, fullApp]);
  };

  const approveOffer = (id: string, updatedApp?: EarningApp) => {
    const appToApprove = updatedApp || pendingApps.find(app => app.id === id);
    if (!appToApprove) return;

    setApps(prev => {
      if (prev.some(app => app.id === appToApprove.id)) return prev;
      return [...prev, appToApprove];
    });
    setPendingApps(prev => prev.filter(app => app.id !== id));
  };

  const rejectOffer = (id: string) => {
    setPendingApps(prev => prev.filter(app => app.id !== id));
  };

  const submitPartnershipLead = (lead: Omit<PartnershipLead, 'id' | 'status' | 'createdAt' | 'partnerName' | 'partnerEmail'>) => {
    const fullLead: PartnershipLead = {
      ...lead,
      id: `lead-${Date.now()}`,
      partnerName: 'Alice Partner', // Simple default name
      partnerEmail: 'alice@partner.com', // Simple default email
      status: 'New',
      createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    setPartnershipLeads(prev => [...prev, fullLead]);
  };

  const updateLeadStatus = (id: string, status: PartnershipLead['status']) => {
    setPartnershipLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status } : lead));
  };

  const claimTask = (taskId: string, reward: number) => {
    if (completedTaskIds.includes(taskId)) return;
    setCompletedTaskIds(prev => [...prev, taskId]);
    setWalletBalance(prev => parseFloat((prev + reward).toFixed(2)));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <AppContext.Provider value={{
      userRole,
      apps,
      pendingApps,
      partnershipLeads,
      walletBalance,
      completedTaskIds,
      theme,
      login,
      logout,
      submitOffer,
      approveOffer,
      rejectOffer,
      submitPartnershipLead,
      updateLeadStatus,
      claimTask,
      toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
}
