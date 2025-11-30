import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
  FaSpinner,
  FaBookReader,
  FaChalkboardTeacher,
  FaVideo,
  FaCalendarAlt,

  FaSignOutAlt,
  FaUser,
  FaUserTimes,
  FaBuilding,
  FaMapMarkerAlt,
  FaMoneyBillWave
} from 'react-icons/fa';
import { internshipsAPI, applicationsAPI, logbooksAPI, authAPI, studentAPI } from '../../lib/api';
import withAuth from '../../components/withAuth';
import ProfileForm from '../../components/student/ProfileForm';
import ResumeView from '../../components/student/ResumeView';
import CollegeVerificationForm from '../../components/student/CollegeVerificationForm';
import axios from 'axios';

interface StudentDashboardProps {
  userId: string;
  role: string;
  user?: {
    id: number;
    name: string;
    email: string;
    collegeId?: number;
    role: {
      id: number;
      name: string;
    };
  };
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ userId, role, user }) => {
  const router = useRouter();
  const { tab } = router.query;
  const [activeTab, setActiveTab] = useState<'opportunities' | 'internships' | 'applications' | 'certificates' | 'logbook' | 'skills' | 'mentorship'>('opportunities');

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

  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [logbooks, setLogbooks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showResumeView, setShowResumeView] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleApply = async (internshipId: number) => {
    if (!resumeFile) {
      alert('Please upload your resume first');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('internshipId', internshipId.toString());
      formData.append('resume', resumeFile);

      await applicationsAPI.create(internshipId);
      alert('Application submitted successfully!');
      setApplyingId(null);
      setResumeFile(null);
      fetchData();
    } catch (error: any) {
      console.error('Application error:', error);
      alert(error.response?.data?.error || 'Failed to apply');
    }
  };


  const [internships, setInternships] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'opportunities') {
        const data = await internshipsAPI.getAll();
        setOpportunities(data);
      } else if (activeTab === 'internships') {
        const data = await internshipsAPI.getAll();
        setInternships(data);
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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/student/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (error) {
      console.log('Profile not found or error fetching');
    } finally {
      setProfileLoading(false);
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
                  <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Student Name'}</h2>
                  <p className="text-gray-600">{user?.email || 'student@example.com'}</p>
                  <p className="text-gray-600">Your profile is incomplete. Complete it to apply for internships.</p>
                </div>
                <button onClick={() => setShowProfileForm(true)} className="btn-primary">
                  Complete Profile
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Approval Status Banner */}
                {profile.approvalStatus === 'Pending' && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FaClock className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Your profile is pending approval from your college. You will be able to apply for internships once approved.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {profile.approvalStatus === 'Rejected' && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FaUserTimes className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">
                          Your profile was rejected by your college. Please contact your college admin for more details.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div onClick={() => setShowResumeView(true)} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition-shadow flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {profile.photoUrl ? (
                      <img src={`http://localhost:5000${profile.photoUrl}`} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <FaUser className="text-2xl text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{profile.firstName} {profile.lastName}</h3>
                    <p className="text-gray-600">Click to view your digital resume</p>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${profile.approvalStatus === 'Approved' ? 'bg-green-100 text-green-800' : profile.approvalStatus === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      Status: {profile.approvalStatus || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

        )}

        {/* Link College Section */}
        {!user?.collegeId && (
          <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-sm flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-blue-900">Link to a College</h3>
              <p className="text-blue-700">
                Link your account to a college to apply for credit-based internships and get certified.
              </p>
            </div>
            <button
              onClick={() => {
                if (!profile?.isCompleted) {
                  alert('Please complete your profile first.');
                  setShowProfileForm(true);
                  return;
                }
                setShowVerificationForm(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Link College
            </button>
          </div>
        )}

        <CollegeVerificationForm
          isOpen={showVerificationForm}
          onClose={() => setShowVerificationForm(false)}
          onSuccess={() => {
            alert('Verification request sent successfully! Please wait for approval.');
            window.location.reload();
          }}
        />

        {showProfileForm && (
          <ProfileForm
            initialData={profile}
            onComplete={() => {
              setShowProfileForm(false);
              fetchProfile();
            }}
            onSkip={() => setShowProfileForm(false)}
            user={user}
          />
        )}

        {showResumeView && profile && (
          <ResumeView
            profile={profile}
            onClose={() => setShowResumeView(false)}
            onEdit={() => {
              setShowResumeView(false);
              setShowProfileForm(true);
            }}
          />
        )}
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
                { id: 'skills', label: 'Skill Center', icon: FaBookReader },
                { id: 'mentorship', label: 'Mentorship', icon: FaChalkboardTeacher },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.id
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
                              className={`px-4 py-2 rounded-full text-sm font-semibold ${app.status === 'Accepted'
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

              {/* Internships Tab (New) */}
              {activeTab === 'internships' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">Available Internships</h2>
                  {loading ? (
                    <div className="text-center py-10">Loading...</div>
                  ) : internships.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No internships available at the moment.</div>
                  ) : (
                    <div className="grid gap-6">
                      {internships.map((internship) => (
                        <motion.div
                          key={internship.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {internship.postedBy?.companyProfile?.companyLogoUrl ? (
                                  <img
                                    src={internship.postedBy.companyProfile.companyLogoUrl}
                                    alt="Logo"
                                    className="w-10 h-10 rounded object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                                    <FaBuilding className="text-gray-400" />
                                  </div>
                                )}
                                <div>
                                  <h3 className="text-xl font-bold text-gray-800">{internship.title}</h3>
                                  <p className="text-sm text-gray-600">{internship.postedBy?.companyName}</p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                                <span className="flex items-center gap-1">
                                  <FaMapMarkerAlt /> {internship.workMode === 'Remote' ? 'Remote' : internship.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FaClock /> {internship.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FaMoneyBillWave /> {internship.stipendType === 'Paid' ? `₹${internship.stipendAmount}/mo` : internship.stipendType}
                                </span>
                              </div>

                              <div className="mt-3">
                                <p className="text-gray-700 line-clamp-2">{internship.description}</p>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-2">
                                {internship.skills.split(',').map((skill: string, idx: number) => (
                                  <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                                    {skill.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-col items-end justify-between min-w-[150px]">
                              <div className="text-sm text-gray-500">
                                Apply by {new Date(internship.applicationDeadline).toLocaleDateString()}
                              </div>

                              {applyingId === internship.id ? (
                                <div className="w-full mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume (PDF)</label>
                                  <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                  />
                                  <div className="flex gap-2 mt-3">
                                    <button
                                      onClick={() => setApplyingId(null)}
                                      className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleApply(internship.id)}
                                      className="flex-1 px-3 py-2 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
                                    >
                                      Submit
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setApplyingId(internship.id)}
                                  className="btn-primary w-full mt-4"
                                >
                                  Apply Now
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
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

              {/* Skills Tab */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500">
                    <h3 className="text-xl font-bold text-yellow-800 mb-2">Skill Readiness Program</h3>
                    <p className="text-yellow-700">Complete these modules to improve your internship chances.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { title: 'Professional Communication', progress: 80, total: 10, completed: 8 },
                      { title: 'Technical Interview Prep', progress: 40, total: 15, completed: 6 },
                      { title: 'Workplace Etiquette', progress: 0, total: 5, completed: 0 },
                      { title: 'Resume Building', progress: 100, total: 4, completed: 4 },
                    ].map((skill, idx) => (
                      <div key={idx} className="card">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-gray-800">{skill.title}</h4>
                          <span className="text-sm text-gray-500">{skill.completed}/{skill.total} Modules</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                          <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${skill.progress}%` }}></div>
                        </div>
                        <button className="btn-primary w-full text-sm">
                          {skill.progress === 100 ? 'Review' : skill.progress === 0 ? 'Start' : 'Continue'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mentorship Tab */}
              {activeTab === 'mentorship' && (
                <div className="space-y-6">
                  <div className="card">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">My Mentor</h3>
                    <div className="flex flex-col md:flex-row items-start gap-6">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                        <FaChalkboardTeacher className="text-4xl text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold">Dr. Sarah Johnson</h4>
                        <p className="text-gray-600 mb-2">Department of Computer Science</p>
                        <p className="text-sm text-gray-500 mb-4">
                          "I am here to guide you through your internship journey. Feel free to reach out for career advice or project help."
                        </p>
                        <div className="flex gap-3">
                          <button className="btn-primary flex items-center gap-2">
                            <FaVideo /> Schedule Meeting
                          </button>
                          <button className="btn-secondary flex items-center gap-2">
                            <FaCalendarAlt /> View Schedule
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Mentorship Sessions</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Internship Report Review</p>
                          <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Upcoming</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Career Guidance</p>
                          <p className="text-xs text-gray-500">Last Week</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div >
  );
};

export default withAuth(StudentDashboard, ['Student']);
