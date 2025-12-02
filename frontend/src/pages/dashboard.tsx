import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../components/withAuth';
import FullScreenLoader from '../components/FullScreenLoader';

const Dashboard = ({ user }: any) => {
    const router = useRouter();

    useEffect(() => {
        if (user?.role?.name) {
            switch (user.role.name) {
                case 'Student':
                    router.replace('/student/dashboard');
                    break;
                case 'Company':
                    router.replace('/employer/dashboard');
                    break;
                case 'Admin':
                    router.replace('/admin/dashboard');
                    break;
                default:
                    console.error('Unknown role:', user.role.name);
                    break;
            }
        }
    }, [user]);

    return <FullScreenLoader />;
};

export default withAuth(Dashboard);
