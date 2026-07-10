-- SQL Schema for EarnByApps Database Setup
-- You can run this in your Neon.tech SQL Editor console directly!

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    gender VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    role VARCHAR(50) DEFAULT 'user', -- 'user' or 'admin'
    balance NUMERIC(10, 2) DEFAULT 0.00,
    payment_method VARCHAR(100),
    payment_details TEXT,
    origin_app_id VARCHAR(100) DEFAULT 'main',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id VARCHAR(255) PRIMARY KEY, -- e.g. 'groww', 'swagbucks'
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    platforms VARCHAR(255) NOT NULL, -- e.g. 'iOS,Android,Web'
    earning_rate VARCHAR(255),
    reward NUMERIC(10, 2) NOT NULL DEFAULT 5.00,
    description TEXT,
    long_description TEXT,
    tags VARCHAR(255), -- e.g. 'Popular,Fast Payout'
    external_url TEXT,
    target_country VARCHAR(100) DEFAULT 'Global',
    currency VARCHAR(10) DEFAULT 'USD',
    currency_symbol VARCHAR(10) DEFAULT '$',
    target_completions INTEGER DEFAULT 1000,
    video_url TEXT,
    logo_url TEXT,
    referral_code VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Referral Slots Table (For rotating pool links)
CREATE TABLE IF NOT EXISTS referral_slots (
    id VARCHAR(255) PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    referral_url TEXT NOT NULL,
    limit_count INTEGER NOT NULL DEFAULT 5,
    completed_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Task Submissions Ledger Table
CREATE TABLE IF NOT EXISTS submissions (
    id VARCHAR(255) PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    app_name VARCHAR(255) NOT NULL,
    app_id VARCHAR(255) NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    reward NUMERIC(10, 2) NOT NULL,
    proof TEXT NOT NULL,
    proof_type VARCHAR(50) DEFAULT 'text', -- 'text', 'image', 'video'
    proof_url TEXT,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    verifier_email VARCHAR(255) NOT NULL, -- 'admin' or user's email
    verification_type VARCHAR(50) DEFAULT 'admin', -- 'admin' or 'creator'
    referral_slot_id VARCHAR(255),
    origin_app_id VARCHAR(100) DEFAULT 'main',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Admin User
INSERT INTO users (email, full_name, role, balance)
VALUES ('admin@earnbyapps.com', 'System Admin', 'admin', 100.00)
ON CONFLICT (email) DO NOTHING;

-- Seed Initial Earning Campaigns
INSERT INTO campaigns (id, name, category, platforms, earning_rate, reward, description, long_description, tags, external_url)
VALUES 
('swagbucks', 'Swagbucks', 'Surveys', 'iOS,Android,Web', '$5.00 / completion', 5.00, 'Earn SB points for completing the Gold survey profile.', 'Complete demographics profile survey to redeem SB rewards.', 'Popular,Low Payout', 'https://swagbucks.com'),
('mistplay', 'Mistplay', 'Gaming', 'Android', '$8.50 / completion', 8.50, 'Play new mobile games and earn units.', 'Install games and reach the specified in-game achievements.', 'Android Only,Fun', 'https://mistplay.com'),
('usertesting', 'UserTesting', 'App Testing', 'iOS,Android,Web', '$10.00 / test', 10.00, 'Test websites and apps and get paid for feedback.', 'Speak thoughts aloud during website reviews.', 'High Paying,PayPal', 'https://usertesting.com')
ON CONFLICT (id) DO NOTHING;
