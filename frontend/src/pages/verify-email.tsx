import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

const VerifyEmail = () => {
    const router = useRouter();
    const { token } = router.query;
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) return;

        const verify = async () => {
            try {
                await axios.get(`http://localhost:5000/auth/verify-email?token=${token}`);
                setStatus('success');
            } catch (error: any) {
                setStatus('error');
                setMessage(error.response?.data?.error || 'Verification failed');
            }
        };

        verify();
    }, [token]);

    if (status === 'verifying') return <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-600">Verifying...</div>;

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                {status === 'success' ? (
                    <>
                        <h1 className="text-2xl font-bold text-green-600 mb-4">Email Verified!</h1>
                        <p className="text-gray-600 mb-6">Your email has been successfully verified.</p>
                        <Link href="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Go to Login
                        </Link>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h1>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <Link href="/login" className="text-blue-600 hover:underline">
                            Back to Login
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
