export interface ReferralSlot {
  id: string;
  userEmail: string;
  referralUrl: string;
  limit: number;
  completedCount: number;
}

export interface EarningApp {
  id: string;
  name: string;
  category: 'Gaming' | 'Surveys' | 'App Testing' | 'Passive' | 'App Install & Sign Up' | 'LinkedIn Followers' | 'Google Maps Reviews' | 'Telegram Members' | 'WhatsApp Members' | 'Instagram Followers' | 'Facebook Page Followers' | 'Youtube Subscribers' | 'Trustpilot Reviews' | 'Justdial Reviews' | 'Play Store Reviews' | 'Custom Task';
  platforms: ('iOS' | 'Android' | 'Web')[];
  earningRate: string; // e.g., "$12.50/hr"
  averageEarningsPerDay: number; // for calculator, e.g. 15
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  reviewsCount: number;
  description: string;
  longDescription: string;
  tags: string[];
  logoUrl?: string;
  actionText: string;
  externalUrl?: string;
  targetCountry?: string;
  currency?: string;
  currencySymbol?: string;
  targetCompletions?: number;
  videoUrl?: string;
  referralPool?: ReferralSlot[];
  reward: number; // Single reward amount
  assignedEmail?: string;
  isActive?: boolean;
  referralCode?: string;
}

export const EARNING_APPS: EarningApp[] = [
  {
    id: 'swagbucks',
    name: 'Swagbucks',
    category: 'Surveys',
    platforms: ['iOS', 'Android', 'Web'],
    earningRate: '$5.00 / completion',
    averageEarningsPerDay: 15.0,
    difficulty: 'Easy',
    rating: 4.6,
    reviewsCount: 18240,
    description: 'Earn points (SB) for completing the Gold survey profile, then redeem for cash.',
    longDescription: 'Swagbucks is one of the oldest and most trusted reward programs on the web. Complete your Gold demographics profile to earn instant SB cash. Earning methods are diverse, ensuring there is always a way to make a few dollars in your spare time.',
    tags: ['Popular', 'Low Payout Minimum', 'Diverse Tasks'],
    actionText: 'Start Surveying',
    reward: 5.00
  },
  {
    id: 'mistplay',
    name: 'Mistplay',
    category: 'Gaming',
    platforms: ['Android'],
    earningRate: '$8.50 / completion',
    averageEarningsPerDay: 8.5,
    difficulty: 'Easy',
    rating: 4.5,
    reviewsCount: 320100,
    description: 'Play new mobile games and earn units that can be redeemed for premium rewards like gift cards.',
    longDescription: 'Mistplay is the ultimate loyalty program for mobile gamers. The app recommends new games based on your preferences. Install the launcher and play for 15 minutes to claim your reward.',
    tags: ['Android Only', 'Fun', 'High Engagement'],
    actionText: 'Play & Earn',
    reward: 8.50
  },
  {
    id: 'usertesting',
    name: 'UserTesting',
    category: 'App Testing',
    platforms: ['iOS', 'Android', 'Web'],
    earningRate: '$10.00 / test',
    averageEarningsPerDay: 30.0,
    difficulty: 'Medium',
    rating: 4.8,
    reviewsCount: 8400,
    description: 'Test websites and apps, speak your thoughts aloud, and get paid for helping companies improve user experience.',
    longDescription: 'UserTesting connects top brands with everyday users to get feedback on websites, apps, and prototype products. A typical test takes 20 minutes and pays $10 via PayPal. Requires a decent microphone and clear spoken English.',
    tags: ['High Paying', 'Professional', 'PayPal Cash'],
    actionText: 'Apply as Tester',
    reward: 10.00
  },
  {
    id: 'honeygain',
    name: 'Honeygain',
    category: 'Passive',
    platforms: ['iOS', 'Android', 'Web'],
    earningRate: '$2.50 / completion',
    averageEarningsPerDay: 1.2,
    difficulty: 'Easy',
    rating: 4.2,
    reviewsCount: 14900,
    description: 'Earn passive income by sharing your unused internet bandwidth with data scientists and businesses.',
    longDescription: 'Honeygain is a passive income app that allows you to monetize your unused internet connection. Simply install the daemon, keep it running, and share your first 10GB of data to complete.',
    tags: ['100% Passive', 'Background App', 'Crypto Payout Option'],
    actionText: 'Share Bandwidth',
    reward: 2.50
  },
  {
    id: 'freecash',
    name: 'Freecash',
    category: 'Gaming',
    platforms: ['iOS', 'Android', 'Web'],
    earningRate: '$22.00 / signup',
    averageEarningsPerDay: 22.0,
    difficulty: 'Medium',
    rating: 4.7,
    reviewsCount: 65400,
    description: 'Play games, take surveys, and complete the high-value signup offer to receive instant credit.',
    longDescription: 'Freecash offers instant payouts via PayPal, Bitcoin, Stake, and gift cards. Complete the Monopoly Go board completion task to claim the full reward.',
    tags: ['Instant Payout', 'Daily Leaderboard', 'High Earning Potential'],
    actionText: 'Earn Freecash',
    reward: 22.00
  },
  {
    id: 'primeopinion',
    name: 'Prime Opinion',
    category: 'Surveys',
    platforms: ['iOS', 'Android', 'Web'],
    earningRate: '$12.00 / survey',
    averageEarningsPerDay: 12.0,
    difficulty: 'Easy',
    rating: 4.6,
    reviewsCount: 34100,
    description: 'A pure survey platform known for high-paying surveys, live stats, and a very low withdrawal limit.',
    longDescription: 'Prime Opinion focuses entirely on delivering the best survey-taking experience. Finish the onboarding profile survey and claim your welcome bonus instantly.',
    tags: ['Low Payout Minimum', 'Instant Rewards', 'Level System'],
    actionText: 'Join Prime Opinion',
    reward: 12.00
  }
];

export const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'Gaming':
    case 'Gaming (Game Installs & Levels)':
      return '🎮';
    case 'Surveys':
    case 'Surveys (Demographics Opinion)':
      return '📋';
    case 'App Testing':
    case 'App Testing (User Feedback)':
      return '🧪';
    case 'Passive':
    case 'Passive Income (Idle Bandwidth)':
      return '💸';
    case 'App Install & Sign Up':
      return '📲';
    case 'LinkedIn Followers':
      return '👔';
    case 'Google Maps Reviews':
      return '📍';
    case 'Telegram Members':
      return '✈️';
    case 'WhatsApp Members':
      return '💬';
    case 'Instagram Followers':
      return '📸';
    case 'Facebook Page Followers':
      return '👍';
    case 'Youtube Subscribers':
      return '▶️';
    case 'Trustpilot Reviews':
      return '⭐';
    case 'Justdial Reviews':
      return '📞';
    case 'Play Store Reviews':
      return '🤖';
    case 'Custom Task':
      return '⚙️';
    default:
      return '📝';
  }
};
