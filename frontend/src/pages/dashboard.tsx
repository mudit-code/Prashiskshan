import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../components/withAuth';
import { motion } from 'framer-motion';
import {
    FaUserGraduate,
    FaBuilding,
    FaUniversity,
    FaClipboardList,
    FaSearch,
    FaPlus,
    FaChartLine,
    FaBookReader,
    FaChalkboardTeacher,
    FaHandshake,
    FaStar,
    FaCheckDouble,
    FaChartBar,
    FaAward,
    FaSignOutAlt,
    FaUser
} from 'react-icons/fa';
import { authAPI } from '../lib/api';
import Link from 'next/link';
import ProfileForm from '../components/student/ProfileForm';
import CompanyProfileForm from '../components/company/CompanyProfileForm';
import ResumeView from '../components/student/ResumeView';
import axios from 'axios';

interface DashboardProps {
    user: {
        id: number;
        name: string;
        email: string;
        role: {
            id: number;
            name: string;
        };
        collegeName?: string;
        companyName?: string;
    };
}

const Dashboard = ({ user }: DashboardProps) => {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [showResumeView, setShowResumeView] = useState(false);

    useEffect(() => {
        if (user.role.name === 'Student' || user.role.name === 'Company') {
            fetchProfile();
        } else {
            setProfileLoading(false);
        }
    }, [user.role.name]);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            let endpoint = 'http://localhost:5000/api/student/profile';
            if (user.role.name === 'Company') {
                endpoint = 'http://localhost:5000/api/company/profile';
            }
            const res = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
        } catch (error) {
            console.log('Profile not found or error fetching');
        } finally {
            setProfileLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const renderStudentView = () => (
        <div className="space-y-8">
            {/* Profile Section */}
            {!profileLoading && (
                <div className="mb-8">
                    {!profile ? (
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Complete Your Profile</h3>
                                <p className="text-gray-600">Your profile is incomplete. Complete it to apply for internships.</p>
                            </div>
                            <button onClick={() => setShowProfileForm(true)} className="btn-primary">
                                Complete Profile
                            </button>
                        </div>
                    ) : (
                        <div onClick={() => setShowResumeView(true)} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition-shadow flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {profile.photoUrl ? (
                                    <img src={`http://localhost:5000${profile.photoUrl}`} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <FaUser className="text-2xl text-gray-400" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
                                <p className="text-gray-600">Click to view your digital resume</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-blue-50 border-l-4 border-blue-500">
                    <h3 className="text-xl font-bold text-blue-700 mb-2">Find Internships</h3>
                    <p className="text-blue-600 mb-4">Browse and apply for new opportunities.</p>
                    <Link href="/internships" className="btn-primary bg-blue-600 hover:bg-blue-700 text-white text-sm">
                        Browse Now
                    </Link>
                </div>
                <div className="card bg-green-50 border-l-4 border-green-500">
                    <h3 className="text-xl font-bold text-green-700 mb-2">My Applications</h3>
                    <p className="text-green-600 mb-4">Track status of your applications.</p>
                    <Link href="/applications" className="btn-primary bg-green-600 hover:bg-green-700 text-white text-sm">
                        View Status
                    </Link>
                </div>
                <div className="card bg-purple-50 border-l-4 border-purple-500">
                    <h3 className="text-xl font-bold text-purple-700 mb-2">Logbook</h3>
                    <p className="text-purple-600 mb-4">Update your daily internship log.</p>
                    <Link href="/logbooks" className="btn-primary bg-purple-600 hover:bg-purple-700 text-white text-sm">
                        Update Log
                    </Link>
                </div>
                {/* NEP Modules */}
                <div className="card bg-yellow-50 border-l-4 border-yellow-500">
                    <h3 className="text-xl font-bold text-yellow-700 mb-2">Skill Center</h3>
                    <p className="text-yellow-600 mb-4">Pre-internship training & readiness.</p>
                    <Link href="/student/skills" className="btn-primary bg-yellow-600 hover:bg-yellow-700 text-white text-sm">
                        Start Learning
                    </Link>
                </div>
                <div className="card bg-pink-50 border-l-4 border-pink-500">
                    <h3 className="text-xl font-bold text-pink-700 mb-2">Mentorship</h3>
                    <p className="text-pink-600 mb-4">Connect with faculty mentors.</p>
                    <Link href="/student/mentorship" className="btn-primary bg-pink-600 hover:bg-pink-700 text-white text-sm">
                        Find Mentor
                    </Link>
                </div>
                <div className="card bg-indigo-50 border-l-4 border-indigo-500">
                    <h3 className="text-xl font-bold text-indigo-700 mb-2">Credits & NEP</h3>
                    <p className="text-indigo-600 mb-4">Track academic credits & compliance.</p>
                    <Link href="/student/credits" className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white text-sm">
                        View Credits
                    </Link>
                </div>
            </div>

            <div className="card">
                <h2 className="text-2xl font-bold mb-4">Welcome back, {user.name}!</h2>
                <p className="text-gray-600">
                    You are logged in as a Student. {user.collegeName && `College: ${user.collegeName}`}
                </p>
            </div>
        </div>
    );

    const renderCompanyView = () => (
        <div className="space-y-8">
            {/* Profile Section */}
            {!profileLoading && (
                <div className="mb-8">
                    {!profile ? (
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Complete Company Profile</h3>
                                <p className="text-gray-600">Your profile is incomplete. Complete it to post internships and hire talent.</p>
                            </div>
                            <button onClick={() => setShowProfileForm(true)} className="btn-primary">
                                Complete Profile
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {profile.companyLogoUrl ? (
                                    <img src={`http://localhost:5000${profile.companyLogoUrl}`} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <FaBuilding className="text-2xl text-gray-400" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{profile.companyName}</h3>
                                <p className="text-gray-600">{profile.industrySector} • {profile.city}, {profile.country}</p>
                            </div>
                            <button onClick={() => setShowProfileForm(true)} className="ml-auto text-primary-600 hover:text-primary-800 font-medium">
                                Edit Profile
                            </button>
                        </div>
                    )}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-indigo-50 border-l-4 border-indigo-500">
                    <h3 className="text-xl font-bold text-indigo-700 mb-2">Post Internship</h3>
                    <p className="text-indigo-600 mb-4">Create a new internship opportunity.</p>
                    <Link href="/company/internships/new" className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white text-sm">
                        Post New
                    </Link>
                </div>
                <div className="card bg-orange-50 border-l-4 border-orange-500">
                    <h3 className="text-xl font-bold text-orange-700 mb-2">Manage Applications</h3>
                    <p className="text-orange-600 mb-4">Review and shortlist candidates.</p>
                    <Link href="/company/applications" className="btn-primary bg-orange-600 hover:bg-orange-700 text-white text-sm">
                        Review
                    </Link>
                </div>
                <div className="card bg-teal-50 border-l-4 border-teal-500">
                    <h3 className="text-xl font-bold text-teal-700 mb-2">Intern Logbooks</h3>
                    <p className="text-teal-600 mb-4">Monitor intern progress.</p>
                    <Link href="/company/logbooks" className="btn-primary bg-teal-600 hover:bg-teal-700 text-white text-sm">
                        Check Logs
                    </Link>
                </div>
                {/* NEP Modules */}
                <div className="card bg-cyan-50 border-l-4 border-cyan-500">
                    <h3 className="text-xl font-bold text-cyan-700 mb-2">Talent Scout</h3>
                    <p className="text-cyan-600 mb-4">Find students by skills.</p>
                    <Link href="/company/talent" className="btn-primary bg-cyan-600 hover:bg-cyan-700 text-white text-sm">
                        Search Talent
                    </Link>
                </div>
                <div className="card bg-rose-50 border-l-4 border-rose-500">
                    <h3 className="text-xl font-bold text-rose-700 mb-2">Intern Feedback</h3>
                    <p className="text-rose-600 mb-4">Rate and review interns.</p>
                    <Link href="/company/feedback" className="btn-primary bg-rose-600 hover:bg-rose-700 text-white text-sm">
                        Give Feedback
                    </Link>
                </div>
            </div>

            <div className="card">
                <h2 className="text-2xl font-bold mb-4">Employer Dashboard</h2>
                <p className="text-gray-600">
                    Welcome, {user.name}. {user.companyName && `Company: ${user.companyName}`}
                </p>
            </div>
        </div>
    );

    const renderAdminView = () => (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-red-50 border-l-4 border-red-500">
                    <h3 className="text-xl font-bold text-red-700 mb-2">Manage Students</h3>
                    <p className="text-red-600 mb-4">View and manage student records.</p>
                    <Link href="/admin/students" className="btn-primary bg-red-600 hover:bg-red-700 text-white text-sm">
                        Manage
                    </Link>
                </div>
                <div className="card bg-yellow-50 border-l-4 border-yellow-500">
                    <h3 className="text-xl font-bold text-yellow-700 mb-2">Verify Internships</h3>
                    <p className="text-yellow-600 mb-4">Approve posted internships.</p>
                    <Link href="/admin/internships" className="btn-primary bg-yellow-600 hover:bg-yellow-700 text-white text-sm">
                        Verify
                    </Link>
                </div>
                <div className="card bg-gray-50 border-l-4 border-gray-500">
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Reports</h3>
                    <p className="text-gray-600 mb-4">Generate college-wide reports.</p>
                    <Link href="/admin/reports" className="btn-primary bg-gray-600 hover:bg-gray-700 text-white text-sm">
                        Generate
                    </Link>
                </div>
                {/* NEP Modules */}
                <div className="card bg-emerald-50 border-l-4 border-emerald-500">
                    <h3 className="text-xl font-bold text-emerald-700 mb-2">Industry Partners</h3>
                    <p className="text-emerald-600 mb-4">Manage MoUs and tie-ups.</p>
                    <Link href="/admin/partners" className="btn-primary bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
                        Manage Partners
                    </Link>
                </div>
                <div className="card bg-violet-50 border-l-4 border-violet-500">
                    <h3 className="text-xl font-bold text-violet-700 mb-2">NEP Compliance</h3>
                    <p className="text-violet-600 mb-4">Verify credits and regulations.</p>
                    <Link href="/admin/compliance" className="btn-primary bg-violet-600 hover:bg-violet-700 text-white text-sm">
                        Check Status
                    </Link>
                </div>
                <div className="card bg-amber-50 border-l-4 border-amber-500">
                    <h3 className="text-xl font-bold text-amber-700 mb-2">Analytics</h3>
                    <p className="text-amber-600 mb-4">Placement and skill gap analysis.</p>
                    <Link href="/admin/analytics" className="btn-primary bg-amber-600 hover:bg-amber-700 text-white text-sm">
                        View Analytics
                    </Link>
                </div>
            </div>

            <div className="card">
                <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
                <p className="text-gray-600">
                    Welcome, {user.name}. {user.collegeName && `College: ${user.collegeName}`}
                </p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-primary-600 rounded-lg text-white">
                            {user.role.name === 'Student' && <FaUserGraduate className="text-2xl" />}
                            {user.role.name === 'Company' && <FaBuilding className="text-2xl" />}
                            {user.role.name === 'Admin' && <FaUniversity className="text-2xl" />}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-gray-600">{user.role.name} Portal</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <FaSignOutAlt /> Logout
                    </button>

                    {user.role.name === 'Student' && renderStudentView()}
                    {user.role.name === 'Company' && renderCompanyView()}
                    {user.role.name === 'Admin' && renderAdminView()}
                </motion.div>
            </div>

            {showProfileForm && user.role.name === 'Student' && (
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

            {showProfileForm && user.role.name === 'Company' && (
                <CompanyProfileForm
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
                    user={user}
                />
            )}
        </div>
    );
};

export default withAuth(Dashboard);
