import React, { useState } from 'react';
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
  FaAward
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'applications' | 'reports'>('overview');

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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
