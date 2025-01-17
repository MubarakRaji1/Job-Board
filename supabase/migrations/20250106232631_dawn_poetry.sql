/*
  # Initial Job Board Schema

  1. New Tables
    - `profiles`
      - User profiles for both employers and job seekers
      - Stores basic user information and role (employer/candidate)
    - `jobs`
      - Job listings posted by employers
      - Contains job details, requirements, and status
    - `applications`
      - Job applications submitted by candidates
      - Links candidates to jobs with application status
    
  2. Security
    - Enable RLS on all tables
    - Add policies for proper data access control
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text CHECK (role IN ('employer', 'candidate')) NOT NULL,
  company_name text,
  title text,
  bio text,
  resume_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  requirements text NOT NULL,
  salary_range text,
  job_type text NOT NULL,
  status text CHECK (status IN ('draft', 'published', 'closed')) DEFAULT 'published',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  candidate_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  cover_letter text,
  resume_url text NOT NULL,
  status text CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Jobs policies
CREATE POLICY "Published jobs are viewable by everyone"
  ON jobs FOR SELECT
  USING (status = 'published');

CREATE POLICY "Employers can manage their jobs"
  ON jobs FOR ALL
  USING (auth.uid() = employer_id);

-- Applications policies
CREATE POLICY "Candidates can view their applications"
  ON applications FOR SELECT
  USING (auth.uid() = candidate_id);

CREATE POLICY "Employers can view applications for their jobs"
  ON applications FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM jobs
    WHERE jobs.id = applications.job_id
    AND jobs.employer_id = auth.uid()
  ));

CREATE POLICY "Candidates can create applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = candidate_id);

-- Create indexes
CREATE INDEX jobs_employer_id_idx ON jobs(employer_id);
CREATE INDEX applications_job_id_idx ON applications(job_id);
CREATE INDEX applications_candidate_id_idx ON applications(candidate_id);