// components/Header.js
'use client'; // This component requires client-side interactivity

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Effect to handle scroll class
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Effect to handle theme persistence
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        const isDark = storedTheme === 'dark-mode';
        setIsDarkMode(isDark);
        document.body.classList.toggle('dark-mode', isDark);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.body.classList.toggle('dark-mode', newMode);
        localStorage.setItem('theme', newMode ? 'dark-mode' : 'light-mode');
    };

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <Link href="/" className="logo">l<span>e</span>Xpert</Link>
                <nav className="nav-menu">
                    <Link href="/" className="active">Properties</Link>
                    <Link href="#">About</Link>
                    <Link href="#">Contact</Link>
                    <Link href="#">Past Transactions</Link>
                </nav>
                <div className="header-controls">
                    <a href="tel:514-955-0000" className="phone-number">514-955-0000</a>
                    <div className="theme-switch-wrapper">
                        <label className="theme-switch">
                            <input 
                                type="checkbox" 
                                id="dark-mode-toggle" 
                                checked={isDarkMode} 
                                onChange={toggleDarkMode} 
                            />
                            <div className="slider">
                                <i className="fa-solid fa-moon"></i>
                                <i className="fa-solid fa-sun"></i>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </header>
    );
}