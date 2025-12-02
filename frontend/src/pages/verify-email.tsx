import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { ContentSkeleton } from '../components/skeletons/ContentSkeleton';

const VerifyEmail = () => {
    const router = useRouter();
    const { token } = router.query;
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        console.log('VerifyEmail mounted, router.isReady:', router.isReady, 'token:', token);

        if (!router.isReady) return;

        const tokenStr = Array.isArray(token) ? token[0] : token;

        if (!tokenStr) {
            console.error('No token found');
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }

        const verify = async () => {
            try {
                console.log('Verifying token:', tokenStr);
                const response = await axios.get(`http://localhost:5000/auth/verify-email?token=${tokenStr}`);
                console.log('Verification success:', response.data);
                setStatus('success');
            } catch (error: any) {
                console.error('Verification failed:', error);
                setStatus('error');
                setMessage(error.response?.data?.error || 'Verification failed');
            }
        };

        verify();
    }, [router.isReady, token]);

    console.log('Current status:', status);

    if (status === 'verifying') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verifying Email</h2>
                        <p className="mt-2 text-sm text-gray-600">Please wait while we verify your email address...</p>
                    </div>
                    <div className="mt-8 space-y-6">
                        <ContentSkeleton lines={3} />
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div style={{ padding: '50px', textAlign: 'center', color: 'green' }}>
                <h1>Email Verified!</h1>
                <p>Your email has been successfully verified.</p>
                <Link href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>
            <h1>Verification Failed</h1>
            <p>{message}</p>
            <Link href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
                Back to Login
            </Link>
        </div>
    );
};

export default VerifyEmail;
