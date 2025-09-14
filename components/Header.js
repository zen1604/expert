// components/Header.js
'use client'; 

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname

export default function Header() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname(); // Get the current path

    // ... (keep the useEffect hooks for scroll and theme the same) ...
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                    {/* Dynamically set the 'active' class */}
                    <Link href="/properties" className={pathname === '/properties' ? 'active' : ''}>Properties</Link>
                    <Link href="/about" className={pathname === '/about' ? 'active' : ''}>About</Link>
                    <Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>Contact</Link>
                </nav>
                <div className="header-controls">
                    {/* ... (keep the phone number and theme switch the same) ... */}
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
