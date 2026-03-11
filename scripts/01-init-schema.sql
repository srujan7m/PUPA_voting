-- PUPA Makers Movement Voting System - Database Schema

-- Create voters table
CREATE TABLE IF NOT EXISTS voters (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  otp_code VARCHAR(6),
  otp_expires_at TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  team_name VARCHAR(255),
  team_number INT,
  team_members TEXT,
  demo_video_url VARCHAR(500),
  vote_count INT DEFAULT 0,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  voter_id INT NOT NULL REFERENCES voters(id) ON DELETE CASCADE,
  project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(voter_id, project_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_voters_phone ON voters(phone_number);
CREATE INDEX IF NOT EXISTS idx_voters_verified ON voters(is_verified);
CREATE INDEX IF NOT EXISTS idx_projects_vote_count ON projects(vote_count DESC);
CREATE INDEX IF NOT EXISTS idx_votes_voter_id ON votes(voter_id);
CREATE INDEX IF NOT EXISTS idx_votes_project_id ON votes(project_id);

-- Seed sample projects
INSERT INTO projects (name, description, category, team_name, team_number, team_members, image_url)
VALUES
  ('AI-Powered Logistics', 'Revolutionizing supply chain operations using machine learning algorithms to optimize routes, predict demand, and reduce costs by up to 40%.', 'AI/ML', 'Team Alpha', 1, 'Alice Johnson, Bob Smith, Carol Lee', '/api/placeholder?w=300&h=200'),
  ('Sustainable Water Filter', 'Affordable, portable water purification system using bio-sand and UV filtration for rural communities with no electricity access.', 'Sustainability', 'Team Beta', 2, 'David Okon, Eva Muller, Frank Chen', '/api/placeholder?w=300&h=200'),
  ('Smart Health Monitor', 'Wearable IoT device with AI-powered analytics for continuous health monitoring, early disease detection, and doctor alerts.', 'Healthcare', 'Team Gamma', 3, 'Grace Park, Henry Adeyemi, Irene Zhao', '/api/placeholder?w=300&h=200'),
  ('Urban Mobility App', 'Integrated multi-modal transport booking platform combining ride-sharing, public transit, and micro-mobility in one app.', 'Mobility', 'Team Delta', 4, 'James Wilson, Kelly Nguyen, Liam Brown', '/api/placeholder?w=300&h=200'),
  ('EdTech Platform', 'AI-assisted adaptive learning platform that personalizes curriculum based on student performance and learning style.', 'Education', 'Team Epsilon', 5, 'Mia Torres, Nathan Davis, Olivia Martin', '/api/placeholder?w=300&h=200'),
  ('Renewable Energy System', 'Affordable home-based solar energy storage solution with smart grid integration and mobile monitoring dashboard.', 'Energy', 'Team Zeta', 6, 'Paul Anderson, Quinn Taylor, Rachel Kim', '/api/placeholder?w=300&h=200'),
  ('Mental Health Bot', 'AI-powered chatbot providing 24/7 mental wellness support, mood tracking, and guided therapy exercises via messaging apps.', 'Healthcare', 'Team Eta', 7, 'Sam White, Tina Lopez, Uma Singh', '/api/placeholder?w=300&h=200'),
  ('Blockchain Supply Chain', 'Transparent, tamper-proof supply chain tracking system using blockchain to verify product authenticity and provenance.', 'Web3', 'Team Theta', 8, 'Victor Hall, Wendy Scott, Xavier Evans', '/api/placeholder?w=300&h=200')
ON CONFLICT DO NOTHING;
