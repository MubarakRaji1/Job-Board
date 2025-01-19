import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, Building2, Users, ArrowRight, Star, Globe, Shield } from 'lucide-react';

export default function Home() {
  const featuredCompanies = [
    {
      name: 'TechCorp',
      logo: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=128&h=128&fit=crop',
      industry: 'Technology',
      openPositions: 12,
      rating: 4.8,
    },
    {
      name: 'DesignHub',
      logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=128&h=128&fit=crop',
      industry: 'Design',
      openPositions: 8,
      rating: 4.9,
    },
    {
      name: 'FinanceFlow',
      logo: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=128&h=128&fit=crop',
      industry: 'Finance',
      openPositions: 15,
      rating: 4.7,
    },
    {
      name: 'HealthPlus',
      logo: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=128&h=128&fit=crop',
      industry: 'Healthcare',
      openPositions: 20,
      rating: 4.6,
    },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-20 px-4 rounded-3xl mx-4">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Your Dream Career <br />Starts Here
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Connect with top employers and discover opportunities that match your skills and aspirations.
          </p>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            MADE WITH ❤️ BY MUBARAK RAJI
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/jobs"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 group"
            >
              Browse Jobs
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Post a Job
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-white/5 rounded-3xl backdrop-blur-sm"></div>
      </section>

      {/* Stats Section */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-blue-100">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-xl text-blue-600">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">10,000+</h3>
                <p className="text-gray-600">Active Jobs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-blue-100">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-xl text-blue-600">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">1,500+</h3>
                <p className="text-gray-600">Companies</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-blue-100">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-xl text-blue-600">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">50,000+</h3>
                <p className="text-gray-600">Candidates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companies Section */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Companies</h2>
            <Link 
              to="/companies" 
              className="text-blue-600 font-semibold flex items-center gap-2 group"
            >
              View All
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCompanies.map((company) => (
              <div key={company.name} className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{company.name}</h3>
                    <p className="text-gray-600 text-sm">{company.industry}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-medium">{company.rating}</span>
                  </div>
                  <div className="text-blue-600 text-sm font-medium">
                    {company.openPositions} open positions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg shadow-blue-100">
              <div className="p-4 bg-blue-100 rounded-xl text-blue-600 w-fit mb-6">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Global Reach</h3>
              <p className="text-gray-600">
                Connect with employers and opportunities worldwide through our extensive network.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg shadow-blue-100">
              <div className="p-4 bg-blue-100 rounded-xl text-blue-600 w-fit mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Verified Companies</h3>
              <p className="text-gray-600">
                All companies are thoroughly vetted to ensure legitimate opportunities.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg shadow-blue-100">
              <div className="p-4 bg-blue-100 rounded-xl text-blue-600 w-fit mb-6">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Career Growth</h3>
              <p className="text-gray-600">
                Find opportunities that align with your career goals and aspirations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
