import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  FaUsers,
  FaGraduationCap,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaEye,
  FaDownload,
  FaFileAlt,
  FaUniversity,
  FaUserCheck,
  FaUserTimes,
  FaAward,
  FaHandshake,
  FaCheckDouble,
  FaChartBar,
  FaSignOutAlt
} from 'react-icons/fa';
import { authAPI } from '../../lib/api';
import CollegeProfileForm from '../../components/college/CollegeProfileForm';
import axios from 'axios';

const AdminDashboard = () => {
  const router = useRouter();
  const { tab } = router.query;
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'applications' | 'reports' | 'partners' | 'compliance' | 'analytics'>('overview');

  useEffect(() => {
    if (tab && typeof tab === 'string') {
      setActiveTab(tab as any);
    }
  }, [tab]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/college/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (error) {
      console.log('Profile not found or error fetching');
    } finally {
      setProfileLoading(false);
    }
  };

  // Mock data
  const stats = {
    totalStudents: 450,
    activeInternships: 120,
    pendingApplications: 35,
    completedInternships: 280,
  };

  const students = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      course: 'B.Tech CSE',
      year: '3rd Year',
      activeInternships: 1,
      completedInternships: 2,
      credits: 6,
      status: 'active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      course: 'B.Tech ECE',
      year: '4th Year',
      activeInternships: 0,
      completedInternships: 3,
      credits: 9,
      status: 'active',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      course: 'B.Tech ME',
      year: '2nd Year',
      activeInternships: 1,
      completedInternships: 0,
      credits: 0,
      status: 'active',
    },
  ];

  const pendingApplications = [
    {
      id: 1,
      studentName: 'John Doe',
      internship: 'Software Development Intern',
      company: 'Tech Corp',
      appliedDate: '2024-01-15',
      studentCredits: 6,
    },
    {
      id: 2,
      studentName: 'Alice Brown',
      internship: 'Data Science Intern',
      company: 'Data Analytics Inc',
      appliedDate: '2024-01-14',
      studentCredits: 3,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">College Admin Dashboard</h1>
              <p className="text-green-100">Manage your students and track their progress</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-green-200">Total Students</p>
                <p className="text-3xl font-bold">{stats.totalStudents}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        {!profileLoading && (
          <div className="mb-8">
            {!profile ? (
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Complete College Profile</h3>
                  <p className="text-gray-600">Your college profile is incomplete. Complete it to manage students and internships.</p>
                </div>
                <button onClick={() => setShowProfileForm(true)} className="btn-primary">
                  Complete Profile
                </button>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <FaUniversity className="text-2xl text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{profile.collegeName}</h3>
                  <p className="text-gray-600">{profile.city}, {profile.state}</p>
                </div>
                <button onClick={() => setShowProfileForm(true)} className="ml-auto text-primary-600 hover:text-primary-800 font-medium">
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        )}

        {showProfileForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-10">
            <div className="relative w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
              <button
                onClick={() => setShowProfileForm(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
              >
                Close
              </button>
              <CollegeProfileForm onSkip={() => setShowProfileForm(false)} />
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Students', value: stats.totalStudents, icon: FaUsers, color: 'blue' },
            { label: 'Active Internships', value: stats.activeInternships, icon: FaClock, color: 'yellow' },
            { label: 'Pending Applications', value: stats.pendingApplications, icon: FaFileAlt, color: 'orange' },
            { label: 'Completed', value: stats.completedInternships, icon: FaCheckCircle, color: 'green' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center`}>
                  <stat.icon className={`text-2xl text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: FaChartLine },
                { id: 'students', label: 'Students', icon: FaUsers },
                { id: 'applications', label: 'Pending Applications', icon: FaFileAlt },
                { id: 'reports', label: 'Reports', icon: FaDownload },
                { id: 'partners', label: 'Industry Partners', icon: FaHandshake },
                { id: 'compliance', label: 'NEP Compliance', icon: FaCheckDouble },
                { id: 'analytics', label: 'Analytics', icon: FaChartBar },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <tab.icon />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full btn-primary text-left flex items-center gap-3">
                    <FaUserCheck /> Approve Pending Applications
                  </button>
                  <button className="w-full btn-secondary text-left flex items-center gap-3">
                    <FaDownload /> Generate College Report
                  </button>
                  <button className="w-full btn-secondary text-left flex items-center gap-3">
                    <FaAward /> Verify Certificates
                  </button>
                </div>
              </div>
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'John Doe completed internship', time: '2 hours ago' },
                    { action: '5 new applications received', time: '5 hours ago' },
                    { action: 'Alice Brown earned 3 credits', time: '1 day ago' },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-gray-700">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div>
              {/* Search and Filter */}
              <div className="card mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="input-field pl-10"
                    />
                  </div>
                  <button className="btn-secondary flex items-center gap-2">
                    <FaFilter /> Filter
                  </button>
                </div>
              </div>

              {/* Students Table */}
              <div className="card overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.course}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.activeInternships}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.completedInternships}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {student.credits}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900 mr-3">
                            <FaEye />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <FaDownload />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              {pendingApplications.map((app, idx) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="card"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{app.internship}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="font-semibold">{app.studentName}</span>
                        <span>•</span>
                        <span>{app.company}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FaAward /> {app.studentCredits} Credits
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Applied on {app.appliedDate}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-primary">
                        <FaCheckCircle /> Approve
                      </button>
                      <button className="btn-secondary">
                        <FaEye /> Review
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Generate Reports</h3>
                <div className="space-y-3">
                  <button className="w-full btn-primary text-left">
                    All Students Report
                  </button>
                  <button className="w-full btn-secondary text-left">
                    Internship Statistics
                  </button>
                  <button className="w-full btn-secondary text-left">
                    Credits Summary
                  </button>
                </div>
              </div>
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Downloads</h3>
                <div className="space-y-3">
                  <button className="w-full btn-secondary text-left flex items-center justify-between">
                    <span>Monthly Report - January 2024</span>
                    <FaDownload />
                  </button>
                  <button className="w-full btn-secondary text-left flex items-center justify-between">
                    <span>Student Performance Report</span>
                    <FaDownload />
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* Partners Tab */}
          {activeTab === 'partners' && (
            <div className="space-y-6">
              <div className="card flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Industry Partnerships</h3>
                  <p className="text-gray-600">Manage MoUs and active collaborations.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                  <FaHandshake /> Add New Partner
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'Tech Corp', type: 'IT Services', interns: 12, status: 'Active', expiry: '2025-12-31' },
                  { name: 'Green Energy Ltd', type: 'Renewable Energy', interns: 5, status: 'Active', expiry: '2025-06-30' },
                  { name: 'City Hospital', type: 'Healthcare', interns: 8, status: 'Pending Renewal', expiry: '2024-12-31' },
                ].map((partner, idx) => (
                  <div key={idx} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{partner.name}</h4>
                        <p className="text-sm text-gray-500">{partner.type}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${partner.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {partner.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Active Interns: {partner.interns}</span>
                      <span>MoU Expires: {partner.expiry}</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="btn-secondary text-xs w-full">View Details</button>
                      <button className="btn-secondary text-xs w-full">Renew MoU</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="card bg-violet-50 border-l-4 border-violet-500">
                <h3 className="text-xl font-bold text-violet-800 mb-2">NEP 2020 Compliance Status</h3>
                <p className="text-violet-700">Overall Compliance Score: 85%</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Internship Credits', status: 'Compliant', desc: 'All internships are credit-based.' },
                  { label: 'Faculty Mentorship', status: 'Partial', desc: '80% students have assigned mentors.' },
                  { label: 'Digital Logbooks', status: 'Compliant', desc: '100% adoption of digital logs.' },
                ].map((item, idx) => (
                  <div key={idx} className="card">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCheckDouble className="text-violet-600" />
                      <h4 className="font-bold text-gray-900">{item.label}</h4>
                    </div>
                    <p className={`text-sm font-semibold mb-2 ${item.status === 'Compliant' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {item.status}
                    </p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Internship Placements by Sector</h3>
                  <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                    [Pie Chart Placeholder: IT 40%, Core Eng 30%, Management 20%, Others 10%]
                  </div>
                </div>
                <div className="card">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Skill Gap Analysis</h3>
                  <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                    [Bar Chart Placeholder: Communication (High Gap), Technical (Medium Gap)]
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
