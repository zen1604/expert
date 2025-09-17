// components/Footer.js
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerContent}>
                    <div className={styles.footerBrand}>
                        <Link href="/" className="logo">
                            <Image
                                className="logo-image" // This class enables the filter
                                src="/logo.jpg"        // Using your JPG file
                                alt="l'eXpert Logo"
                                width={150}            // Change to your logo's actual width
                                height={40}            // Change to your logo's actual height
                            />
                        </Link>
                        <p className={styles.footerSlogan}>Your expert in commercial real estate.</p>
                    </div>
                    <div className={styles.footerLinks}>
                        <h4>Navigation</h4>
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/properties">Properties</Link></li>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>
                    <div className={styles.footerContact}>
                        <h4>Contact Info</h4>
                        <p><i className="fa-solid fa-phone"></i> 514-955-0000</p>
                        <p><i className="fa-solid fa-envelope"></i> contact@lexpert.com</p>
                        <p><i className="fa-solid fa-location-dot"></i> Montreal, QC, Canada</p>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <p>&copy; {currentYear} l'eXpert. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
