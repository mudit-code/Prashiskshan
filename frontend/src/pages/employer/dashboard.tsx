import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaBriefcase,
  FaUsers,
  FaFileAlt,
  FaChartLine,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEye,
  FaDownload,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaBook,
  FaSpinner
} from 'react-icons/fa';
import { internshipsAPI, applicationsAPI, logbooksAPI } from '../../lib/api';
import withAuth from '../../components/withAuth';

const EmployerDashboard = ({ userId, role }: { userId: string; role: string }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'postings' | 'applicants' | 'logbooks'>('overview');
  const [loading, setLoading] = useState(true);
  const [postings, setPostings] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedInternship]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'postings' || activeTab === 'overview') {
        const data = await internshipsAPI.getCompanyInternships();
        setPostings(data);
      } else if (activeTab === 'applicants' && selectedInternship) {
        const data = await internshipsAPI.getInternshipApplications(selectedInternship);
        setApplicants(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: number, status: string) => {
    try {
      await applicationsAPI.updateStatus(applicationId, status);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  // Calculate stats
  const stats = {
    activePostings: postings.length,
    totalApplications: applicants.length,
    pendingReview: applicants.filter(app => app.status === 'Pending').length,
    accepted: applicants.filter(app => app.status === 'Accepted').length,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Employer Dashboard</h1>
              <p className="text-purple-100">Manage your internships and find the best talent</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <button className="btn-primary bg-white text-purple-600 hover:bg-gray-100">
                <FaPlus /> Post New Internship
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Active Postings', value: stats.activePostings, icon: FaBriefcase, color: 'blue' },
            { label: 'Total Applications', value: stats.totalApplications, icon: FaUsers, color: 'purple' },
            { label: 'Pending Review', value: stats.pendingReview, icon: FaClock, color: 'yellow' },
            { label: 'Accepted', value: stats.accepted, icon: FaCheckCircle, color: 'green' },
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
                { id: 'postings', label: 'My Postings', icon: FaBriefcase },
                { id: 'applicants', label: 'Applicants', icon: FaUsers },
                { id: 'logbooks', label: 'Logbooks', icon: FaBook },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
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
                    <FaPlus /> Post New Internship
                  </button>
                  <button className="w-full btn-secondary text-left flex items-center gap-3">
                    <FaFileAlt /> Review Pending Applications
                  </button>
                  <button className="w-full btn-secondary text-left flex items-center gap-3">
                    <FaBook /> Audit Student Logbooks
                  </button>
                </div>
              </div>
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: '5 new applications received', time: '2 hours ago' },
                    { action: 'John Doe accepted internship', time: '5 hours ago' },
                    { action: 'New internship posted', time: '1 day ago' },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
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

          {/* Postings Tab */}
          {activeTab === 'postings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Internship Postings</h2>
                <button className="btn-primary">
                  <FaPlus /> Post New Internship
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <FaSpinner className="animate-spin text-4xl text-purple-600" />
                </div>
              ) : (
                <div className="space-y-4">
                  {postings.length === 0 ? (
                    <div className="card text-center py-12">
                      <p className="text-gray-600 mb-4">No internships posted yet</p>
                      <button className="btn-primary">
                        <FaPlus /> Post Your First Internship
                      </button>
                    </div>
                  ) : (
                    postings.map((posting, idx) => (
                      <motion.div
                        key={posting.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="card hover:shadow-xl transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{posting.title}</h3>
                            <p className="text-gray-600 mb-3">{posting.description}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <FaClock /> Posted {formatDate(posting.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedInternship(posting.id);
                                setActiveTab('applicants');
                              }}
                              className="btn-primary"
                            >
                              <FaEye /> View Applications
                            </button>
                            <button className="btn-secondary">
                              <FaEdit /> Edit
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Applicants Tab */}
          {activeTab === 'applicants' && (
            <div>
              {/* Search and Filter */}
              <div className="card mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search applicants..."
                      className="input-field pl-10"
                    />
                  </div>
                  <button className="btn-secondary flex items-center gap-2">
                    <FaFilter /> Filter
                  </button>
                </div>
              </div>

              {/* Internship Selection */}
              {activeTab === 'applicants' && (
                <div className="card mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Internship to View Applications
                  </label>
                  <select
                    value={selectedInternship || ''}
                    onChange={(e) => setSelectedInternship(Number(e.target.value))}
                    className="input-field"
                  >
                    <option value="">Select an internship...</option>
                    {postings.map((posting) => (
                      <option key={posting.id} value={posting.id}>
                        {posting.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Applicants List */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <FaSpinner className="animate-spin text-4xl text-purple-600" />
                </div>
              ) : (
                <div className="space-y-4">
                  {applicants.length === 0 ? (
                    <div className="card text-center py-12">
                      <p className="text-gray-600">
                        {selectedInternship ? 'No applications for this internship yet' : 'Select an internship to view applications'}
                      </p>
                    </div>
                  ) : (
                    applicants.map((applicant, idx) => (
                      <motion.div
                        key={applicant.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="card"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">{applicant.student?.name || 'N/A'}</h3>
                                <p className="text-gray-600">{applicant.student?.email || 'N/A'}</p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  applicant.status === 'Accepted'
                                    ? 'bg-green-100 text-green-700'
                                    : applicant.status === 'Rejected'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {applicant.status}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-2 font-medium">{applicant.internship?.title || 'N/A'}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                              <span>Applied: {formatDate(applicant.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button className="btn-primary">
                              <FaEye /> View Profile
                            </button>
                            {applicant.status === 'Pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdateApplicationStatus(applicant.id, 'Accepted')}
                                  className="flex-1 btn-secondary text-green-600 border-green-600 hover:bg-green-50"
                                >
                                  <FaCheckCircle /> Accept
                                </button>
                                <button
                                  onClick={() => handleUpdateApplicationStatus(applicant.id, 'Rejected')}
                                  className="flex-1 btn-secondary text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  <FaTimesCircle /> Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Logbooks Tab */}
          {activeTab === 'logbooks' && (
            <div>
              <div className="card mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Student Logbooks</h3>
                <p className="text-gray-600 mb-4">
                  Review and audit student logbooks for their internship activities.
                </p>
                <div className="space-y-4">
                  {[
                    { student: 'John Doe', internship: 'Software Development Intern', entries: 45, lastEntry: '2024-01-20' },
                    { student: 'Jane Smith', internship: 'Data Science Intern', entries: 38, lastEntry: '2024-01-19' },
                  ].map((logbook, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{logbook.student}</h4>
                          <p className="text-sm text-gray-600">{logbook.internship}</p>
                        </div>
                        <button className="btn-primary">
                          <FaEye /> Review
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{logbook.entries} entries</span>
                        <span>•</span>
                        <span>Last entry: {logbook.lastEntry}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Generate Reports</h3>
                <p className="text-gray-600 mb-4">
                  Generate comprehensive reports of student activities.
                </p>
                <button className="btn-primary">
                  <FaDownload /> Generate Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(EmployerDashboard, ['Company']);
