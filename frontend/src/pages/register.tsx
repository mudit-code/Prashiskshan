import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaRocket,
  FaBuilding,
  FaUniversity,
  FaGraduationCap,
  FaSpinner
} from 'react-icons/fa';
import { authAPI, rolesAPI } from '../lib/api';

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: 1, // Default to Student
    collegeName: '',
    companyName: '',
    aisheCode: '',
    collegeWebsite: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    { id: 1, name: 'Student', label: 'Student', icon: FaGraduationCap },
    { id: 3, name: 'Admin', label: 'College Admin', icon: FaUniversity },
    { id: 2, name: 'Company', label: 'Employer', icon: FaBuilding },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.roleId === 2 && !formData.companyName.trim()) {
      setError('Company Name is required');
      return;
    }

    if (formData.roleId === 3) {
      if (!formData.collegeName.trim()) {
        setError('College Name is required');
        return;
      }
      if (!formData.aisheCode.trim() && !formData.collegeWebsite.trim()) {
        setError('Either AISHE Code or College Website is required');
        return;
      }
    }

    setLoading(true);

    try {
      const fullName = [formData.firstName, formData.middleName, formData.lastName]
        .filter(Boolean)
        .join(' ');

      await authAPI.register({
        email: formData.email,
        password: formData.password,
        name: fullName,
        roleId: formData.roleId,
        collegeName: formData.collegeName,
        companyName: formData.companyName,
        aisheCode: formData.aisheCode,
        collegeWebsite: formData.collegeWebsite,
      });

      // Show success message and redirect to login
      alert('Registration successful! Please verify your email before logging in.');
      router.push('/login');
    } catch (err: any) {
      console.error('Registration error:', err);
      let errorMessage = 'Registration failed. Please try again.';

      if (err.response) {
        // Server responded with a status code outside 2xx
        if (err.response.data && err.response.data.error) {
          if (typeof err.response.data.error === 'string') {
            errorMessage = err.response.data.error;
          } else if (Array.isArray(err.response.data.error)) {
            // Handle Zod array errors
            errorMessage = err.response.data.error.map((e: any) => e.message).join(', ');
          } else {
            errorMessage = JSON.stringify(err.response.data.error);
          }
        } else {
          errorMessage = `Server error: ${err.response.status}`;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request
        errorMessage = err.message;
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full mb-4">
            <FaRocket className="text-4xl text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Join Prashikshan and start your journey</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card"
        >
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Register As
              </label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, roleId: r.id })}
                    className={`py-4 px-4 rounded-lg font-medium transition-all flex flex-col items-center gap-2 ${formData.roleId === r.id
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    <r.icon className="text-2xl" />
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name Fields */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input-field"
                    placeholder="First Name"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                    className="input-field"
                    placeholder="Middle (Opt)"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="input-field"
                    placeholder="Last Name"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* College/Company Name (optional for now) */}
            {formData.roleId === 3 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="collegeName" className="block text-sm font-semibold text-gray-700 mb-2">
                    College Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUniversity className="text-gray-400" />
                    </div>
                    <input
                      id="collegeName"
                      type="text"
                      value={formData.collegeName}
                      onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                      className="input-field pl-10"
                      placeholder="Your College Name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="aisheCode" className="block text-sm font-semibold text-gray-700 mb-2">
                    AISHE Code <span className="text-xs font-normal text-gray-500">(Required if no Website)</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Find your college AISHE code here in the <a href="https://dashboard.aishe.gov.in/hedirectory/#/hedirectory/universityDetails/C/ALL" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">official portal</a>.
                  </p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUniversity className="text-gray-400" />
                    </div>
                    <input
                      id="aisheCode"
                      type="text"
                      value={formData.aisheCode}
                      onChange={(e) => setFormData({ ...formData, aisheCode: e.target.value })}
                      className="input-field pl-10"
                      placeholder="AISHE Code (e.g., C-12345)"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="collegeWebsite" className="block text-sm font-semibold text-gray-700 mb-2">
                    College Website <span className="text-xs font-normal text-gray-500">(Required if no AISHE Code)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUniversity className="text-gray-400" />
                    </div>
                    <input
                      id="collegeWebsite"
                      type="url"
                      value={formData.collegeWebsite}
                      onChange={(e) => setFormData({ ...formData, collegeWebsite: e.target.value })}
                      className="input-field pl-10"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.roleId === 2 && (
              <div>
                <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBuilding className="text-gray-400" />
                  </div>
                  <input
                    id="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="input-field pl-10"
                    placeholder="Your Company Name"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-10 pr-10"
                  placeholder="Create a password (min 8 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input-field pl-10 pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/guest/rules" className="text-primary-600 hover:text-primary-700 font-medium">
                  Terms and Conditions
                </Link>
                {' '}and{' '}
                <Link href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary py-3 text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Sign in instead →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
