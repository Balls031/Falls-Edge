-- Create the site_settings table for Falls Edge
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES ('hideOurHomesPage', 'false')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS (Row Level Security) but allow all operations for authenticated service role
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations (since this is admin-only via service role key)
CREATE POLICY "Allow all operations" ON site_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);
