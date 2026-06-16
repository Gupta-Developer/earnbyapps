"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { EarningApp, EARNING_APPS, AppTask } from '../data/apps';

export type UserRole = 'guest' | 'user' | 'admin';
export type AppTheme = 'light' | 'dark';

interface AppContextType {
  userRole: UserRole;
  apps: EarningApp[];
  pendingApps: EarningApp[];
  walletBalance: number;
  completedTaskIds: string[];
  theme: AppTheme;
  login: (role: UserRole) => void;
  logout: () => void;
  submitOffer: (app: Omit<EarningApp, 'id' | 'rating' | 'reviewsCount' | 'difficulty'>) => void;
  approveOffer: (id: string) => void;
  rejectOffer: (id: string) => void;
  claimTask: (taskId: string, reward: number) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [apps, setApps] = useState<EarningApp[]>([]);
  const [pendingApps, setPendingApps] = useState<EarningApp[]>([]);
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
      if (storedWallet) setWalletBalance(parseFloat(storedWallet));
      if (storedCompleted) setCompletedTaskIds(JSON.parse(storedCompleted));
    } catch (e) {
      console.error("Failed to load local storage state:", e);
      setApps(EARNING_APPS);
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
    setPendingApps(prev => [...prev, fullApp]);
  };

  const approveOffer = (id: string) => {
    const appToApprove = pendingApps.find(app => app.id === id);
    if (!appToApprove) return;

    setApps(prev => [...prev, appToApprove]);
    setPendingApps(prev => prev.filter(app => app.id !== id));
  };

  const rejectOffer = (id: string) => {
    setPendingApps(prev => prev.filter(app => app.id !== id));
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
      walletBalance,
      completedTaskIds,
      theme,
      login,
      logout,
      submitOffer,
      approveOffer,
      rejectOffer,
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
