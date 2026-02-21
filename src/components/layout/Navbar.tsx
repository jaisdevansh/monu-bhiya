'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './Navbar.module.css';

export default function Navbar({ settings }: { settings?: any }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { openCart, items } = useCart();

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Hide navbar on admin routes
    if (pathname.startsWith('/admin')) return null;

    return (
        <>
            <header
                className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
            >
                <div className={`container ${styles.navContainer}`}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo}>
                        {settings?.logoUrl ? (
                            <img src={settings.logoUrl} alt={settings?.storeName || 'Store Logo'} style={{ height: '40px', objectFit: 'contain' }} />
                        ) : (
                            <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {settings?.storeName || 'Monu Chai'}
                            </span>
                        )}
                    </Link>

                    {/* Desktop Nav */}
                    <nav className={styles.desktopNav}>
                        <Link href="/about" className={styles.navLink}>
                            About
                        </Link>
                        <Link href="/contact" className={styles.navLink}>
                            Contact
                        </Link>
                        <Link href="/menu" className={`btn btn-primary ${styles.shopBtn}`}>
                            Order Now
                        </Link>
                        <button
                            className={styles.cartBtn}
                            onClick={openCart}
                            aria-label="Open cart"
                        >
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className={styles.badge}>{cartCount}</span>
                            )}
                        </button>
                    </nav>

                    {/* Mobile Toggle */}
                    <button
                        className={styles.mobileToggle}
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={24} />
                    </button>

                    {/* Mobile Cart Toggle (Visible on mobile next to menu) */}
                    <button
                        className={`${styles.cartBtn} ${styles.mobileCartBtn}`}
                        onClick={openCart}
                        aria-label="Open cart"
                    >
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span className={styles.badge}>{cartCount}</span>
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={styles.overlay}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className={styles.mobileMenu}
                        >
                            <div className={styles.menuHeader}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Menu</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={styles.closeBtn}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <nav className={styles.mobileNav}>
                                <Link href="/" className={styles.navLink}>
                                    Home
                                </Link>
                                <Link href="/menu" className={styles.navLink}>
                                    Menu
                                </Link>
                                <Link href="/about" className={styles.navLink}>
                                    About
                                </Link>
                                <Link href="/contact" className={styles.navLink}>
                                    Contact
                                </Link>
                            </nav>

                            <div className={styles.mobileFooter}>
                                <Link href="/menu" className="btn btn-primary" style={{ width: '100%' }}>
                                    Order Now
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
