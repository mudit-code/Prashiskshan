import Navbar from './Navbar';
import Footer from './Footer';
import styles from './Layout.module.css';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
