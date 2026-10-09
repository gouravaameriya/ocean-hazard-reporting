-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Users Table
CREATE TABLE users (
    id UUID REFERENCES auth.users PRIMARY KEY,
    full_name TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'citizen', -- citizen, analyst, admin
    phone_number TEXT,
    trust_score FLOAT DEFAULT 0.5,      -- Incremental base score (0.0 to 1.0)
    predicted_reliability FLOAT,        -- Scikit-learn model output
    verified_count INT DEFAULT 0,
    false_alarm_count INT DEFAULT 0,
    reward_points INT DEFAULT 0,
    language VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Hazard Reports Table
CREATE TABLE hazard_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    hazard_type VARCHAR(50) NOT NULL,
    description TEXT,
    location GEOMETRY(Point, 4326),
    media_url TEXT,
    enhanced_media_url TEXT,
    audio_transcript TEXT,
    climate_probability FLOAT,
    community_confirmations INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- pending, verified, false_alarm
    is_offline_report BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX hazard_reports_geo_idx ON hazard_reports USING GIST (location);

-- 3. Social Media Feeds Table
CREATE TABLE social_media_feeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_platform VARCHAR(20) NOT NULL,
    username VARCHAR(100),
    post_text TEXT NOT NULL,
    sentiment VARCHAR(20),                -- Neutral, Alert, Panic
    extracted_location TEXT,
    location GEOMETRY(Point, 4326),
    hazard_category VARCHAR(50),
    engagement_metrics JSONB,
    post_created_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX social_media_geo_idx ON social_media_feeds USING GIST (location);
