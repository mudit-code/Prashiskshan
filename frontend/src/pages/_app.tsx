import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';

import { LoadingProvider } from '../components/GlobalLoader';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LoadingProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </LoadingProvider>
  );
}

import { useLoading } from '../components/GlobalLoader';
import AboutSkeleton from '../components/skeletons/AboutSkeleton';
import PageSkeleton from '../components/skeletons/PageSkeleton';
import FullScreenLoader from '../components/FullScreenLoader';
import { RegisterSkeleton } from '../components/skeletons/RegisterSkeleton';
import { LoginSkeleton } from '../components/skeletons/LoginSkeleton';

const AppContent = ({ Component, pageProps }: { Component: any, pageProps: any }) => {
  const { isLoading, targetUrl } = useLoading();

  if (isLoading) {
    if (targetUrl?.includes('/about')) {
      return (
        <Layout>
          <AboutSkeleton />
        </Layout>
      );
    }

    if (targetUrl?.includes('dashboard')) {
      return <FullScreenLoader />;
    }

    if (targetUrl?.includes('/register')) {
      return (
        <Layout>
          <RegisterSkeleton />
        </Layout>
      );
    }

    if (targetUrl?.includes('/login')) {
      return (
        <Layout>
          <LoginSkeleton />
        </Layout>
      );
    }

    // Add more specific skeletons here if needed
    return (
      <Layout>
        <PageSkeleton />
      </Layout>
    );
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
