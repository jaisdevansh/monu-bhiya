
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Phone, MessageCircle, MapPin, Clock, Send, ShoppingBag, Instagram, Facebook, Twitter } from 'lucide-react';
import { ReactLenis } from 'lenis/react';
import styles from './contact.module.css';

// 3D Tilt Card (Simplified)
function TiltCard({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.div
            className={`${styles.card} ${className}`}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
        >
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>{children}</div>
        </motion.div>
    );
}

export default function ContactClient() {
    const [isOpen, setIsOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', address: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();
        if (hour >= 9 && hour < 22) setIsOpen(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setShowToast(true);
            setFormData({ name: '', email: '', mobile: '', address: '', message: '' });
            setTimeout(() => setShowToast(false), 3000);
        }, 1500);
    };

    return (
        <ReactLenis root>
            <div className={styles.pageContainer} ref={ref}>

                {/* Hero Title */}
                <div className={styles.heroSection}>
                    <motion.h1
                        className={styles.heading}
                        style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Let's Talk Chai <span style={{ color: '#fff' }}>& Stories</span>
                    </motion.h1>
                    <p className={styles.subText}>Have a question or craving? We're here.</p>
                </div>

                {/* Main Content: Split Layout */}
                <div className={styles.splitLayout}>

                    {/* LEFT COLUMN: Contact Info & Quick Actions */}
                    <div className={styles.leftColumn}>
                        <div className={styles.gridTwo}>
                            <TiltCard>
                                <div className={styles.iconWrapper}><Phone size={24} /></div>
                                <h3 className={styles.infoTitle} style={{ fontSize: '1rem', justifyContent: 'center' }}>Call Us</h3>
                                <a href="tel:+919876543210" className={styles.actionBtn}>Call Now</a>
                            </TiltCard>

                            <TiltCard>
                                <div className={styles.iconWrapper} style={{ color: '#4ade80' }}><MessageCircle size={24} /></div>
                                <h3 className={styles.infoTitle} style={{ fontSize: '1rem', justifyContent: 'center' }}>WhatsApp</h3>
                                <a href="https://wa.me/919876543210" className={styles.actionBtn} style={{ background: '#25D366', color: '#fff' }}>Chat</a>
                            </TiltCard>
                        </div>

                        {/* Info Blocks */}
                        <motion.div
                            className={styles.compactInfo}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <h3 className={styles.infoTitle}><MapPin size={20} /> Visit Us</h3>
                            <p className={styles.subText} style={{ fontSize: '0.95rem' }}>
                                Shop No. 123, Raj Nagar Extension,<br />Ghaziabad, UP - 201017
                            </p>
                            <p style={{ marginTop: '0.4rem', color: '#FFD54F', fontSize: '0.85rem' }}>Near City Park</p>
                        </motion.div>

                        <motion.div
                            className={styles.compactInfo}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <h3 className={styles.infoTitle}>
                                <Clock size={20} /> Hours
                                <span style={{
                                    marginLeft: 'auto',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    background: isOpen ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                                    color: isOpen ? '#4ade80' : '#f87171',
                                    fontSize: '0.8rem'
                                }}>
                                    {isOpen ? 'OPEN' : 'CLOSED'}
                                </span>
                            </h3>
                            <p className={styles.subText} style={{ fontSize: '0.95rem' }}>Mon - Sun: 09:00 AM - 10:00 PM</p>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: The Form (Prominent & Accessible) */}
                    <div className={styles.rightColumn}>
                        <motion.div
                            className={styles.formContainer}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className={styles.heading} style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Send a Message</h2>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className={styles.input}
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className={styles.input}
                                        placeholder="yourname@gmail.com"
                                    />
                                </div>
                                {formData.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && formData.mobile === process.env.NEXT_PUBLIC_ADMIN_PHONE && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mb-4"
                                    >
                                        <a
                                            href="/admin/login"
                                            className="block w-full text-center py-2 bg-zinc-800 text-amber-500 rounded font-bold border border-amber-500/50 hover:bg-zinc-700 transition-all"
                                        >
                                            Access Admin Dashboard 🔒
                                        </a>
                                    </motion.div>
                                )}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Mobile</label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            required
                                            className={styles.input}
                                            placeholder="+91..."
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className={styles.input}
                                            placeholder="Area / Colony"
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={styles.textarea}
                                        placeholder="Tell us about your order..."
                                    />
                                </div>
                                <motion.button
                                    type="submit"
                                    className={styles.submitBtn}
                                    disabled={isSubmitting}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={18} style={{ display: 'inline', marginLeft: '5px' }} />
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>

                </div>

                {/* Map Section */}
                <motion.div
                    className={styles.mapSection}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <div className={styles.mapContainer}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14002.59376918868!2d77.42068465!3d28.6702008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf1a201dbab6b%3A0xe549557223067784!2sRaj%20Nagar%20Extension%2C%20Ghaziabad%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                            className={styles.mapFrame}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Monu Chai Location"
                        ></iframe>
                    </div>
                </motion.div>

                {/* Bottom Section: Join the Tribe */}
                <motion.div
                    className={styles.bottomSection}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ margin: "-100px" }}
                >
                    <div className={styles.bottomContent}>
                        <h2 className={styles.bottomTitle}>
                            Brewing Stories, <br />
                            <span>One Cup at a Time.</span>
                        </h2>
                        <p className={styles.subText} style={{ maxWidth: '600px', margin: '0 auto' }}>
                            Join our inner circle for secret menu drops, chai tasting invites, and more. No spam, just warm vibes.
                        </p>

                        <form className={styles.newsletterParams} onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Your email address" className={styles.newsInput} />
                            <button type="submit" className={styles.newsBtn}>Join In</button>
                        </form>

                        <div className={styles.socialRow}>
                            <a href="#" className={styles.socialIcon} aria-label="Instagram"><Instagram size={24} /></a>
                            <a href="#" className={styles.socialIcon} aria-label="Facebook"><Facebook size={24} /></a>
                            <a href="#" className={styles.socialIcon} aria-label="Twitter"><Twitter size={24} /></a>
                        </div>
                    </div>
                </motion.div>

                <AnimatePresence>
                    {showToast && (
                        <motion.div
                            className={styles.toast}
                            initial={{ y: 50, x: '-50%', opacity: 0 }}
                            animate={{ y: 0, x: '-50%', opacity: 1 }}
                            exit={{ y: 50, x: '-50%', opacity: 0 }}
                        >
                            Message sent! 🚀
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ReactLenis >
    );
}
