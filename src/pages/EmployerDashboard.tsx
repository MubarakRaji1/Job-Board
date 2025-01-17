import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Briefcase, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface Job {
  id: string;
  title: string;
  status: string;
  created_at: string;
  _count: {
    applications: number;
  };
}

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0
  });

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salary_range: '',
    job_type: 'full-time',
  });

  useEffect(() => {
    if (user) {
      fetchJobs();
      fetchDashboardStats();
    }
  }, [user]);

  async function fetchDashboardStats() {
    try {
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('id, status')
        .eq('employer_id', user?.id);

      const { data: applicationsData } = await supabase
        .from('applications')
        .select('id')
        .in('job_id', jobsData?.map(job => job.id) || []);

      setStats({
        totalJobs: jobsData?.length || 0,
        activeJobs: jobsData?.filter(job => job.status === 'published').length || 0,
        totalApplications: applicationsData?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  async function fetchJobs() {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          applications (count)
        `)
        .eq('employer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchApplications(jobId: string) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          profiles:candidate_id (
            full_name,
            email,
            title
          )
        `)
        .eq('job_id', jobId);

      if (error) throw error;
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase.from('jobs').insert({
        ...formData,
        employer_id: user?.id,
      });

      if (error) throw error;
      setShowJobForm(false);
      setFormData({
        title: '',
        company: '',
        location: '',
        description: '',
        requirements: '',
        salary_range: '',
        job_type: 'full-time',
      });
      fetchJobs();
      fetchDashboardStats();
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job posting');
    }
  }

  async function handleDelete(jobId: string) {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        const { error } = await supabase
          .from('jobs')
          .delete()
          .eq('id', jobId);

        if (error) throw error;
        fetchJobs();
        fetchDashboardStats();
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job posting');
      }
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total Jobs</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalJobs}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Active Jobs</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeJobs}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total Applications</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalApplications}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Job Postings</h1>
        <button
          onClick={() => setShowJobForm(!showJobForm)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Post New Job
        </button>
      </div>

      {showJobForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Job Posting</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirements
              </label>
              <textarea
                required
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Range
                </label>
                <input
                  type="text"
                  value={formData.salary_range}
                  onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., $50,000 - $70,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type
                </label>
                <select
                  value={formData.job_type}
                  onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowJobForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Job Posting
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="border rounded-lg">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setSelectedJob(selectedJob === job.id ? null : job.id);
                    if (selectedJob !== job.id) {
                      fetchApplications(job.id);
                    }
                  }}
                >
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <div className="text-sm text-gray-600">
                      Posted {formatDistanceToNow(new Date(job.created_at))} ago •{' '}
                      {job._count.applications} applications
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(job.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        selectedJob === job.id ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>
                {selectedJob === job.id && (
                  <div className="border-t p-4">
                    <h4 className="font-medium mb-4">Applications</h4>
                    {applications.length === 0 ? (
                      <p className="text-gray-600">No applications yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {applications.map((application) => (
                          <div
                            key={application.id}
                            className="flex justify-between items-start p-4 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <div className="font-medium">
                                {application.profiles.full_name || application.profiles.email}
                              </div>
                              <div className="text-sm text-gray-600">
                                {application.profiles.title}
                              </div>
                              <div className="text-sm text-gray-600">
                                Applied {formatDistanceToNow(new Date(application.created_at))} ago
                              </div>
                            </div>
                            <div>
                              <span
                                className={`px-3 py-1 rounded-full text-sm ${
                                  application.status === 'accepted'
                                    ? 'bg-green-100 text-green-800'
                                    : application.status === 'rejected'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}