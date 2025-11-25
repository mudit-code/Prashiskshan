import React from 'react';
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
    FaChartLine
} from 'react-icons/fa';
import Link from 'next/link';

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

    const renderStudentView = () => (
        <div className="space-y-8">
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

                    {user.role.name === 'Student' && renderStudentView()}
                    {user.role.name === 'Company' && renderCompanyView()}
                    {user.role.name === 'Admin' && renderAdminView()}
                </motion.div>
            </div>
        </div>
    );
};

export default withAuth(Dashboard);
