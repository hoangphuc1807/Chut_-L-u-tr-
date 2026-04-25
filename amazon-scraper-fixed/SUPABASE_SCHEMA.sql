-- Amazon Scraper → Supabase Schema
-- Run this SQL in Supabase SQL Editor to set up tables

-- ============================================
-- 1. SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  keywords TEXT[],
  num_pages INTEGER,
  total_products INTEGER,
  valid_products INTEGER,
  invalid_products INTEGER
);

CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);

-- ============================================
-- 2. PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
  scraped_at TIMESTAMPTZ,
  keyword TEXT,
  asin TEXT,
  rank INTEGER,
  title TEXT,
  image TEXT,
  price TEXT,
  price_numeric NUMERIC(10,2),       -- Parsed numeric price
  sold TEXT,
  listing_date TEXT,
  store TEXT,
  seller TEXT,
  stars TEXT,
  stars_numeric NUMERIC(3,1),        -- Parsed numeric stars (e.g., 4.5)
  review_count TEXT,
  review_count_numeric INTEGER,      -- Parsed numeric review count
  detailed_seller TEXT,
  type TEXT CHECK (type IN ('Organic', 'Sponsored', 'N/A')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_session_id ON products(session_id);
CREATE INDEX IF NOT EXISTS idx_products_asin ON products(asin);
CREATE INDEX IF NOT EXISTS idx_products_keyword ON products(keyword);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price_numeric);
CREATE INDEX IF NOT EXISTS idx_products_stars ON products(stars_numeric);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- ============================================
-- 4. ROW LEVEL SECURITY (Optional, for multi-user)
-- ============================================
-- ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (optional)
-- CREATE POLICY "Allow authenticated users" ON sessions
--   USING (auth.uid() IS NOT NULL);

-- ============================================
-- 5. VERIFY TABLES CREATED
-- ============================================
-- Run this to check if tables exist:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public';
