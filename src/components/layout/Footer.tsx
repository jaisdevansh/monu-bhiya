import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Phone } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer({ settings }: { settings?: any }) {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.contentGrid}>
                    {/* Brand */}
                    <div className={styles.brandColumn}>
                        <h3 className="text-gradient">{settings?.storeName || 'Monu Chai'}</h3>
                        <p style={{ opacity: 0.8, maxWidth: '300px' }}>
                            {settings?.description || 'Serving the best chai and snacks in town since 2010. Taste the tradition with a modern twist.'}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.linkColumn}>
                        <h4>Quick Links</h4>
                        <ul className={styles.linkList}>
                            <li className={styles.linkItem}><Link href="/">Home</Link></li>
                            <li className={styles.linkItem}><Link href="/menu">Menu</Link></li>
                            <li className={styles.linkItem}><Link href="/about">About Us</Link></li>
                            <li className={styles.linkItem}><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className={styles.linkColumn}>
                        <h4>Visit Us</h4>
                        <ul className={styles.contactList}>
                            <li className={styles.contactItem}>
                                <MapPin className={styles.icon} size={20} />
                                <span style={{ whiteSpace: 'pre-line' }}>{settings?.address || '123 Chai Street, Food Court Area,\nCity Center, India'}</span>
                            </li>
                            <li className={styles.contactItem}>
                                <Phone className={styles.icon} size={20} />
                                <span>{settings?.phone || '+91 98765 43210'}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottomBar}>
                    <p>© {new Date().getFullYear()} {settings?.storeName || 'Monu Chai'} & Food Court. All rights reserved.</p>
                    <div className={styles.socialLinks}>
                        <Link href="#" aria-label="Instagram"><Instagram size={20} /></Link>
                        <Link href="#" aria-label="Facebook"><Facebook size={20} /></Link>
                        <Link href="#" aria-label="Twitter"><Twitter size={20} /></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
