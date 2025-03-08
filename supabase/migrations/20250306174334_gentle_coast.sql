/*
  # Create submissions table for wallet and Twitter handle storage

  1. New Tables
    - `submissions`
      - `id` (uuid, primary key)
      - `twitter_handle` (text, not null)
      - `wallet_address` (text, not null)
      - `created_at` (timestamp with time zone, default: now())

  2. Security
    - Enable RLS on submissions table
    - Add policy for public inserts
    - Add policy for authenticated users to read all submissions
*/

CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  twitter_handle text NOT NULL,
  wallet_address text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow public inserts
CREATE POLICY "Allow public inserts" ON submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users to read all submissions
CREATE POLICY "Allow authenticated users to read all submissions" ON submissions
  FOR SELECT
  TO authenticated
  USING (true);