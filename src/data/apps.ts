export interface AppTask {
  id: string;
  title: string;
  description: string;
  reward: number;
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
  tasks: AppTask[];
  targetCountry?: string;
  currency?: string;
  currencySymbol?: string;
  targetCompletions?: number;
  videoUrl?: string;
}

export const EARNING_APPS: EarningApp[] = [
  {
    id: 'swagbucks',
    name: 'Swagbucks',
    category: 'Surveys',
    platforms: ['iOS', 'Android', 'Web'],
    earningRate: '$5.00 - $25.00 / day',
    averageEarningsPerDay: 15.0,
    difficulty: 'Easy',
    rating: 4.6,
    reviewsCount: 18240,
    description: 'Earn points (SB) for searching the web, watching videos, and taking surveys, then redeem for gift cards or cash.',
    longDescription: 'Swagbucks is one of the oldest and most trusted reward programs on the web. Users earn SB points which can be redeemed for PayPal cash or gift cards to major retailers like Amazon, Walmart, and Starbucks. Earning methods are diverse, ensuring there is always a way to make a few dollars in your spare time.',
    tags: ['Popular', 'Low Payout Minimum', 'Diverse Tasks'],
    actionText: 'Start Surveying',
    tasks: [
      { id: 'sb-1', title: 'Complete Welcome Profile', description: 'Create an account and fill out your demographics profile.', reward: 1.00 },
      { id: 'sb-2', title: 'Take Daily Gold Survey', description: 'Complete the featured 15-minute consumer opinion survey.', reward: 2.50 },
      { id: 'sb-3', title: 'Install Swagbutton Extension', description: 'Add the cashback notifier helper extension to your browser.', reward: 1.50 }
    ]
  },
  {
    id: 'mistplay',
    name: 'Mistplay',
    category: 'Gaming',
    platforms: ['Android'],
    earningRate: '$3.00 - $12.00 / hr',
    averageEarningsPerDay: 8.5,
    difficulty: 'Easy',
    rating: 4.5,
    reviewsCount: 320100,
    description: 'Play new mobile games and earn units that can be redeemed for premium rewards like gift cards.',
    longDescription: 'Mistplay is the ultimate loyalty program for mobile gamers. The app recommends new games based on your preferences. As you play, you earn Units, which you can redeem for Amazon, Google Play, or PlayStation gift cards. The longer you play and the higher your in-game levels, the more you earn.',
    tags: ['Android Only', 'Fun', 'High Engagement'],
    actionText: 'Play & Earn',
    tasks: [
      { id: 'mp-1', title: 'Download & Play Coin Master', description: 'Install Coin Master via Mistplay and play for 15 minutes.', reward: 1.20 },
      { id: 'mp-2', title: 'Reach Level 10 in Raid Shadow Legends', description: 'Progress your account to level 10 inside the RPG game.', reward: 6.50 },
      { id: 'mp-3', title: 'Log In 3 Days consecutively', description: 'Open Mistplay and play any game for 5 minutes 3 days in a row.', reward: 0.80 }
    ]
  },
  {
    id: 'usertesting',
    name: 'UserTesting',
    category: 'App Testing',
    platforms: ['iOS', 'Android', 'Web'],
    earningRate: '$10.00 - $60.00 / test',
    averageEarningsPerDay: 30.0,
    difficulty: 'Medium',
    rating: 4.8,
    reviewsCount: 8400,
    description: 'Test websites and apps, speak your thoughts aloud, and get paid for helping companies improve user experience.',
    longDescription: 'UserTesting connects top brands with everyday users to get feedback on websites, apps, and prototype products. A typical test takes 20 minutes and pays $10 via PayPal. Live conversation tests pay upwards of $60 for an hour of your time. Requires a decent microphone and clear spoken English.',
    tags: ['High Paying', 'Professional', 'PayPal Cash'],
    actionText: 'Apply as Tester',
    tasks: [
      { id: 'ut-1', title: 'Pass Practice Audio Test', description: 'Submit a 3-minute practice test checking your audio and recording setup.', reward: 2.00 },
      { id: 'ut-2', title: 'Complete E-Commerce Checkout Test', description: 'Test a prototype retail website, trying to find a specific product.', reward: 10.00 },
      { id: 'ut-3', title: 'Participate in Live 30-min Interview', description: 'Join a live video call with a product designer to discuss a new finance app.', reward: 30.00 }
    ]
  },
  {
    id: 'honeygain',
    name: 'Honeygain',
    category: 'Passive',
    platforms: ['iOS', 'Android', 'Web'],
    earningRate: '$0.50 - $2.00 / day',
    averageEarningsPerDay: 1.2,
    difficulty: 'Easy',
    rating: 4.2,
    reviewsCount: 14900,
    description: 'Earn passive income by sharing your unused internet bandwidth with data scientists and businesses.',
    longDescription: 'Honeygain is a passive income app that allows you to monetize your unused internet connection. Simply install the app, keep it running in the background, and let it safely proxy web traffic for research purposes. Earning potential depends on your location, internet speed, and number of connected devices.',
    tags: ['100% Passive', 'Background App', 'Crypto Payout Option'],
    actionText: 'Share Bandwidth',
    tasks: [
      { id: 'hg-1', title: 'Install & Setup Daemon', description: 'Install Honeygain on your PC or mobile and enable background startup.', reward: 5.00 }, // Welcome bonus
      { id: 'hg-2', title: 'Share First 10GB of Data', description: 'Keep the app running until you have successfully shared 10GB of bandwidth.', reward: 2.50 },
      { id: 'hg-3', title: 'Refer a Friend', description: 'Have a friend sign up and share their first 1GB of data.', reward: 1.00 }
    ]
  },
  {
    id: 'freecash',
    name: 'Freecash',
    category: 'Gaming',
    platforms: ['iOS', 'Android', 'Web'],
    earningRate: '$10.00 - $40.00 / day',
    averageEarningsPerDay: 22.0,
    difficulty: 'Medium',
    rating: 4.7,
    reviewsCount: 65400,
    description: 'One of the fastest-growing rewards platforms where you can play games, take surveys, and complete signup offers.',
    longDescription: 'Freecash offers instant payouts via PayPal, Bitcoin, Stake, Litecoin, and various gift cards. It features an active chatroom, daily leaderboards, and partnerships with the highest-paying offerwalls in the industry. Users can earn significantly by playing mobile strategy games and completing high-value financial signups.',
    tags: ['Instant Payout', 'Daily Leaderboard', 'High Earning Potential'],
    actionText: 'Earn Freecash',
    tasks: [
      { id: 'fc-1', title: 'Claim Daily Free Case', description: 'Open your first free case to win a random coin prize.', reward: 0.25 },
      { id: 'fc-2', title: 'Complete Monopoly Go Offer', description: 'Install Monopoly Go and reach Board 26 within 14 days.', reward: 35.00 },
      { id: 'fc-3', title: 'Complete Survey on CPX Research', description: 'Find and finish a survey matching your profile.', reward: 1.80 }
    ]
  },
  {
    id: 'primeopinion',
    name: 'Prime Opinion',
    category: 'Surveys',
    platforms: ['iOS', 'Android', 'Web'],
    earningRate: '$4.00 - $20.00 / day',
    averageEarningsPerDay: 12.0,
    difficulty: 'Easy',
    rating: 4.6,
    reviewsCount: 34100,
    description: 'A pure survey platform known for high-paying surveys, live stats, and a very low withdrawal limit.',
    longDescription: 'Prime Opinion focuses entirely on delivering the best survey-taking experience. They offer customizable welcome bonuses, instant payouts, and clear reward metrics. The level-up system grants free bonus points and prize wheel spins as you complete more surveys.',
    tags: ['Low Payout Minimum', 'Instant Rewards', 'Level System'],
    actionText: 'Join Prime Opinion',
    tasks: [
      { id: 'po-1', title: 'Claim Welcome Bonus', description: 'Choose your welcome bonus tier and verify your email.', reward: 5.00 },
      { id: 'po-2', title: 'Reach Level 2', description: 'Earn your first 200 points by completing initial surveys.', reward: 1.00 },
      { id: 'po-3', title: 'Take a 100-Point Survey', description: 'Successfully finish any survey worth 100 points or more.', reward: 1.00 }
    ]
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
