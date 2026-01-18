'use client';

import React from 'react';
import styles from './Header.module.css';
import { useHeader } from './Header.hook';

export const Header: React.FC = () => {
    const { isScrolled } = useHeader();

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.logo}>
                VisualBio
            </div>
            <nav className={styles.nav}>
                <a href="#" className={styles.navLink}>Home</a>
                <a href="#" className={styles.navLink}>Dashboard</a>
                <a href="#" className={styles.navLink}>Profile</a>
                <a href="#" className={styles.navLink}>Settings</a>
            </nav>
        </header>
    );
};
