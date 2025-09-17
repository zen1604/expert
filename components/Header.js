// components/Header.js
'use client'; 

import Link from 'next/link';
import Image from 'next/image'; // 1. Import the Image component
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

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
                {/* 2. Replace the text logo with the Image component */}
                <Link href="/" className="logo">
                    <Image
                        src="/logo.jpg"      // The path to your logo in the public folder
                        alt="l'eXpert Logo"  // Important for accessibility
                        width={150}          // IMPORTANT: Change to your logo's actual width
                        height={40}          // IMPORTANT: Change to your logo's actual height
                        priority             // Tells Next.js to load the logo first
                    />
                </Link>
                <nav className="nav-menu">
                    <Link href="/properties" className={pathname === '/properties' ? 'active' : ''}>Properties</Link>
                    <Link href="/about" className={pathname === '/about' ? 'active' : ''}>About</Link>
                    <Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>Contact</Link>
                </nav>
                <div className="header-controls">
                    <a href="tel:438-527-2765" className="phone-number">438-527-2765</a>
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
