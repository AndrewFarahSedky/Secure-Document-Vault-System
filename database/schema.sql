CREATE DATABASE secure_vault;

\c secure_vault;

CREATE TYPE user_role AS ENUM ('admin', 'manager', 'user');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255),
  role user_role DEFAULT 'user',
  oauth_provider VARCHAR(20),
  oauth_id VARCHAR(100),
  two_factor_secret VARCHAR(100),
  two_factor_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_name VARCHAR(255) NOT NULL,
  stored_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  encrypted BOOLEAN DEFAULT true,
  hash VARCHAR(64) NOT NULL,
  signature TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);