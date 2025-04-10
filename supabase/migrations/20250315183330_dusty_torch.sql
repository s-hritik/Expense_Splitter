/*
  # Add groups functionality

  1. New Tables
    - `groups`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp with time zone)
      - `created_by` (uuid, references auth.users)
      - `members` (text array)

  2. Modify expenses table
    - Add `group_id` column to link expenses to groups

  3. Security
    - Enable RLS on `groups` table
    - Add policies for authenticated users to:
      - Read their groups (where they are a member)
      - Create new groups
*/

CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users NOT NULL,
  members text[] NOT NULL
);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read groups they are members of"
  ON groups
  FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by OR auth.uid()::text = ANY(members));

CREATE POLICY "Users can create groups"
  ON groups
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Add group_id to expenses table
ALTER TABLE expenses ADD COLUMN group_id uuid REFERENCES groups(id);

-- Update expenses policies to include group check
DROP POLICY IF EXISTS "Users can read own expenses" ON expenses;
CREATE POLICY "Users can read group expenses"
  ON expenses
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = expenses.group_id
      AND (groups.created_by = auth.uid() OR auth.uid()::text = ANY(groups.members))
    )
  );