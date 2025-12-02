import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface LoadingContextType {
    isLoading: boolean;
    targetUrl: string | null;
    setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    targetUrl: null,
    setLoading: () => { },
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setLoading] = useState(false);
    const [targetUrl, setTargetUrl] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const handleStart = (url: string) => {
            if (url !== router.asPath) {
                setTargetUrl(url);
                setLoading(true);
            }
        };

        const handleComplete = (url: string) => {
            if (url === router.asPath) {
                setLoading(false);
                setTargetUrl(null);
            }
            // Fallback to ensure loading stops
            setTimeout(() => {
                setLoading(false);
                setTargetUrl(null);
            }, 500);
        };

        const handleError = () => {
            setLoading(false);
            setTargetUrl(null);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleError);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleError);
        };
    }, [router]);

    return (
        <LoadingContext.Provider value={{ isLoading, targetUrl, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};
