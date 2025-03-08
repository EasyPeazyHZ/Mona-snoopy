/*
  # Create submissions table for wallet registrations

  1. New Tables
    - `submissions`
      - `id` (uuid, primary key)
      - `twitter_handle` (text)
      - `wallet_address` (text)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `submissions` table
    - Add policy for inserting new submissions
    - Add policy for admins to view all submissions
*/

CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  twitter_handle text NOT NULL,
  wallet_address text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert submissions"
  ON submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (true);