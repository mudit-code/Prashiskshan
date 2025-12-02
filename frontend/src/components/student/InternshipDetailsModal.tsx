import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaBuilding, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaCalendarAlt, FaBriefcase, FaGraduationCap, FaTools } from 'react-icons/fa';
import { API_URL } from '../../lib/api';

interface InternshipDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    internship: any;
    onApply?: (id: number, file?: File | null) => void;
    isApplying?: boolean;
    isApplied?: boolean;
}

const InternshipDetailsModal: React.FC<InternshipDetailsModalProps> = ({ isOpen, onClose, internship, onApply, isApplying, isApplied }) => {
    const [showApplyForm, setShowApplyForm] = React.useState(false);
    const [resumeFile, setResumeFile] = React.useState<File | null>(null);

    if (!isOpen || !internship) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const handleSubmit = () => {
        if (onApply) {
            onApply(internship.id, resumeFile);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-start z-10">
                        <div className="flex items-center gap-4">
                            {internship.postedBy?.companyProfile?.companyLogoUrl ? (
                                <img
                                    src={`${API_URL}${internship.postedBy.companyProfile.companyLogoUrl.startsWith('/') ? '' : '/'}${internship.postedBy.companyProfile.companyLogoUrl}`}
                                    alt="Logo"
                                    className="w-16 h-16 rounded-lg object-cover border"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center border">
                                    <FaBuilding className="text-3xl text-gray-400" />
                                </div>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{internship.title}</h2>
                                <p className="text-lg text-gray-600">{internship.postedBy?.companyName}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full">
                            <FaTimes size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Key Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Location</p>
                                    <p className="text-gray-900 font-medium">{internship.workMode === 'Remote' ? 'Remote' : internship.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                    <FaMoneyBillWave />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Stipend</p>
                                    <p className="text-gray-900 font-medium">
                                        {internship.stipendType === 'Paid' ? `₹${internship.stipendAmount}/month` : internship.stipendType}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                    <FaClock />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Duration</p>
                                    <p className="text-gray-900 font-medium">{internship.duration}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                    <FaCalendarAlt />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Apply By</p>
                                    <p className="text-gray-900 font-medium">{formatDate(internship.applicationDeadline)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <FaBriefcase className="text-primary-600" />
                                About the Internship
                            </h3>
                            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                                {internship.description}
                            </div>
                        </div>

                        {/* Skills */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <FaTools className="text-primary-600" />
                                Skills Required
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {internship.skills.split(',').map((skill: string, idx: number) => (
                                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {internship.perks && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Perks</h3>
                                    <p className="text-gray-700">{internship.perks}</p>
                                </div>
                            )}
                            {internship.eligibility && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <FaGraduationCap className="text-primary-600" />
                                        Eligibility
                                    </h3>
                                    <p className="text-gray-700">{internship.eligibility}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex flex-col md:flex-row justify-end gap-3 z-10">
                        {showApplyForm ? (
                            <div className="w-full flex flex-col md:flex-row gap-3 items-center">
                                <div className="flex-1 w-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resume (PDF)</label>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                    />
                                </div>
                                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                                    <button
                                        onClick={() => setShowApplyForm(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isApplying || !resumeFile}
                                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isApplying ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Close
                                </button>
                                {onApply && (
                                    <button
                                        onClick={() => setShowApplyForm(true)}
                                        disabled={isApplied}
                                        className={`px-6 py-2 rounded-lg transition-colors font-medium ${isApplied
                                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                            : 'bg-primary-600 text-white hover:bg-primary-700'
                                            }`}
                                    >
                                        {isApplied ? 'Applied' : 'Apply Now'}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default InternshipDetailsModal;


