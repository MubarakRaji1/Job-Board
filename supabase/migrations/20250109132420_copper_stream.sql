/*
  # Fix profiles RLS policies

  1. Changes
    - Add policy to allow users to insert their own profile
    - Keep existing policies for select and update

  2. Security
    - Users can only create their own profile
    - Profile creation is restricted to authenticated users
*/

CREATE POLICY "Users can create their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);