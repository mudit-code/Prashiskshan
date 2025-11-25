import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaBriefcase,
  FaFileAlt,
  FaCertificate,
  FaSearch,
  FaClock,
  FaCheckCircle,
  FaEye,
  FaDownload,
  FaBook,
  FaGraduationCap,
  FaAward,
  FaSpinner
} from 'react-icons/fa';
import { internshipsAPI, applicationsAPI, logbooksAPI } from '../../lib/api';
import withAuth from '../../components/withAuth';

const StudentDashboard = ({ userId, role }: { userId: string; role: string }) => {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'applications' | 'certificates' | 'logbook'>('opportunities');
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [logbooks, setLogbooks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'opportunities') {
        const data = await internshipsAPI.getAll();
        setOpportunities(data);
      } else if (activeTab === 'applications') {
        const data = await applicationsAPI.getMyApplications();
        setApplications(data);
      } else if (activeTab === 'logbook') {
        const data = await logbooksAPI.getAll();
        setLogbooks(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter(opp =>
    opp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const stats = {
    totalApplications: applications.length,
    activeInternships: applications.filter(app => app.status === 'Accepted').length,
    completedInternships: applications.filter(app => app.status === 'Completed').length,
    totalCredits: 0, // This would need to come from credits API
  };

  // Mock certificates (would need credits API)
  const certificates: any[] = [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Student Dashboard</h1>
              <p className="text-primary-100">Welcome back! Here's your overview</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-primary-200">Total Credits Earned</p>
                <p className="text-3xl font-bold">{stats.totalCredits}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Applications', value: stats.totalApplications, icon: FaFileAlt, color: 'blue' },
            { label: 'Active Internships', value: stats.activeInternships, icon: FaBriefcase, color: 'green' },
            { label: 'Completed', value: stats.completedInternships, icon: FaCheckCircle, color: 'purple' },
            { label: 'Total Credits', value: stats.totalCredits, icon: FaGraduationCap, color: 'orange' },
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
            <nav className="flex -mb-px">
              {[
                { id: 'opportunities', label: 'Opportunities', icon: FaSearch },
                { id: 'applications', label: 'My Applications', icon: FaFileAlt },
                { id: 'certificates', label: 'Certificates', icon: FaCertificate },
                { id: 'logbook', label: 'Logbook', icon: FaBook },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
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
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-4xl text-primary-600" />
            </div>
          ) : (
            <>
              {/* Opportunities Tab */}
              {activeTab === 'opportunities' && (
                <div>
                  {/* Search */}
                  <div className="card mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search internships..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="input-field pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Opportunities List */}
                  <div className="space-y-4">
                    {filteredOpportunities.length === 0 ? (
                      <div className="card text-center py-12">
                        <p className="text-gray-600">No internships found</p>
                      </div>
                    ) : (
                      filteredOpportunities.map((opp, idx) => (
                        <motion.div
                          key={opp.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          className="card hover:shadow-xl transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{opp.title}</h3>
                              <p className="text-gray-600 mb-3">{opp.description}</p>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <FaClock /> Posted {formatDate(opp.createdAt)}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Link
                                href={`/apply?id=${opp.id}`}
                                className="btn-primary whitespace-nowrap"
                              >
                                Apply Now
                              </Link>
                              <button className="btn-secondary">
                                <FaEye />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Applications Tab */}
              {activeTab === 'applications' && (
                <div className="space-y-4">
                  {applications.length === 0 ? (
                    <div className="card text-center py-12">
                      <p className="text-gray-600">No applications yet</p>
                    </div>
                  ) : (
                    applications.map((app, idx) => (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="card"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{app.internship?.title || 'N/A'}</h3>
                            <p className="text-sm text-gray-500">Applied on {formatDate(app.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                app.status === 'Accepted'
                                  ? 'bg-green-100 text-green-700'
                                  : app.status === 'Rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {app.status}
                            </span>
                            <button className="btn-secondary">
                              <FaEye /> View
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {/* Certificates Tab */}
              {activeTab === 'certificates' && (
                <div className="space-y-4">
                  {certificates.length === 0 ? (
                    <div className="card text-center py-12">
                      <p className="text-gray-600">No certificates yet</p>
                    </div>
                  ) : (
                    certificates.map((cert, idx) => (
                      <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="card"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FaCertificate className="text-3xl text-primary-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{cert.title}</h3>
                              <p className="text-gray-600 mb-2">{cert.company}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-500">Completed: {cert.completionDate}</span>
                                <span className="flex items-center gap-1 text-primary-600 font-semibold">
                                  <FaAward /> {cert.credits} Credits
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="btn-primary">
                              <FaDownload /> Download
                            </button>
                            <button className="btn-secondary">
                              <FaEye /> View
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {/* Logbook Tab */}
              {activeTab === 'logbook' && (
                <div>
                  <div className="card mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">Auto-Generated Logbook</h3>
                      <Link href="/logbook" className="btn-primary">
                        <FaBook /> View Full Logbook
                      </Link>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Your logbook entries are automatically generated based on your internship activities.
                    </p>
                    {logbooks.length > 0 ? (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-2">Recent Entry</p>
                        <p className="text-gray-700">
                          <strong>Date:</strong> {formatDate(logbooks[0].date)} | <strong>Activity:</strong> {logbooks[0].entry}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-600">No logbook entries yet</p>
                      </div>
                    )}
                  </div>
                  <div className="card">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Generate Report</h3>
                    <p className="text-gray-600 mb-4">
                      Generate a comprehensive report of your internship activities.
                    </p>
                    <button className="btn-primary">
                      <FaDownload /> Generate Report
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(StudentDashboard, ['Student']);
