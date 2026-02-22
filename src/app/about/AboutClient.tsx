
'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Utensils, Clock, Heart, DollarSign } from 'lucide-react';
import styles from './about.module.css';


// 3D Tilt Card Component
function TiltCard({ children, index }: { children: React.ReactNode, index: number }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set(clientX - left - width / 2);
        y.set(clientY - top - height / 2);
    }

    return (
        <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onMouseMove={onMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            style={{
                rotateX: useTransform(mouseY, [-300, 300], [5, -5]),
                rotateY: useTransform(mouseX, [-300, 300], [-5, 5]),
                transformStyle: "preserve-3d"
            }}
        >
            <div style={{ transform: "translateZ(30px)" }}>{children}</div>
        </motion.div>
    );
}

// Background Particles
function BackgroundParticles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className={styles.floatingShape}
                    style={{
                        width: Math.random() * 300 + 100,
                        height: Math.random() * 300 + 100,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        background: i % 2 === 0 ? '#FFC000' : '#461b0e',
                        opacity: 0.08,
                    }}
                    animate={{
                        y: [0, Math.random() * 100 - 50, 0],
                        x: [0, Math.random() * 100 - 50, 0],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 20 + Math.random() * 10,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
}


export default function AboutClient({ settings }: { settings?: any }) {
    const ref = useRef(null);
    return (
        <>
            <div className={styles.pageContainer} ref={ref}>
                {/* Ambient Background Glows */}
                <div className={styles.floatingBlur} style={{ top: '-10%', left: '-10%', width: '600px', height: '600px', background: '#FF6F00' }} />
                <div className={styles.floatingBlur} style={{ top: '40%', right: '-5%', width: '400px', height: '400px', background: '#5D4037' }} />
                <div className={styles.floatingBlur} style={{ bottom: '-10%', left: '20%', width: '500px', height: '500px', background: '#FF8F00' }} />

                {/* 1. HERO SECTION */}
                <section className={styles.heroSection}>
                    <motion.div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        >
                            <h1 className={styles.heading} style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}>
                                About Us
                            </h1>
                        </motion.div>

                        <div className={styles.divider} />

                        <motion.h2
                            className={styles.heading}
                            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: '#FFFFFF', fontWeight: 300 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            We are <span className="text-[#FFC000] font-bold">{settings?.storeName || 'Monu Chai'}</span> ☕
                        </motion.h2>

                        <motion.p
                            className={styles.subText}
                            style={{ maxWidth: '600px', margin: '2rem auto' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            More than just a cafe. We are a sanctuary for chai lovers, a hub for conversation, and the home of Ghaziabad's finest brews.
                        </motion.p>
                    </motion.div>
                </section>

                {/* 2. 3D CARDS SECTION */}
                <section className={styles.section}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center mb-12"
                    >
                        <h2 className={styles.heading} style={{ fontSize: '2.5rem' }}>The {settings?.storeName?.split(' ')[0] || 'Monu'} Difference</h2>
                    </motion.div>

                    <div className={styles.cardGrid}>
                        {[
                            { icon: <Utensils size={32} />, title: "Freshly Made", text: "Zero preservatives. We cook fresh batches every hour." },
                            { icon: <DollarSign size={32} />, title: "Pocket Friendly", text: "Premium taste at street-smart prices. Happiness for everyone." },
                            { icon: <Clock size={32} />, title: "Lightning Fast", text: "In a rush? We get your order ready before you can say 'Chai'." },
                            { icon: <Heart size={32} />, title: "Local Love", text: "Authentic spices, locally sourced milk, 100% Desi vibes." }
                        ].map((item, i) => (
                            <TiltCard key={i} index={i}>
                                <div className={styles.iconWrapper}>{item.icon}</div>
                                <h3 className={styles.heading} style={{ fontSize: '1.4rem', color: '#FFF' }}>{item.title}</h3>
                                <p className={styles.subText}>{item.text}</p>
                            </TiltCard>
                        ))}
                    </div>
                </section>

                {/* 3. OWNER REVEAL */}
                <div className={styles.ownerSection}>
                    <div className={styles.ownerBgStrip} />
                    <div className={styles.ownerGrid}>
                        <motion.div
                            initial={{ x: -100, opacity: 0, rotate: -20 }}
                            whileInView={{ x: 0, opacity: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", bounce: 0.4, duration: 1.5 }}
                            className={styles.imageCircle}
                        >
                            <Image
                                src="/images/owner.png"
                                alt={`${settings?.adminName || 'Monu'} - Founder`}
                                fill
                                className="object-cover"
                                style={{ borderRadius: '50%' }} // optimize fill
                            />
                            {/* Orbiting Badge */}
                            <motion.div
                                className="absolute -right-4 top-10 bg-[#FFC000] text-[#521F10] w-24 h-24 rounded-full flex items-center justify-center font-bold text-center text-sm shadow-lg border-4 border-[#521F10]"
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                            >
                                Since <br /> 2024
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="relative z-10"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-[#FFC000] text-sm uppercase tracking-widest font-bold mb-2">The Visionary</h2>
                            <h3 className="text-5xl font-black mb-6 leading-tight">Meet <br /> {settings?.adminName || 'Monu Bhaiya'}</h3>
                            <p className="text-xl leading-relaxed text-[#F3E9DA] opacity-90 italic">
                                "I didn't just want to sell tea. I wanted to build a place where every sip feels like home. Ghaziabad needed a spot that served world-class hygiene with street-class flavor."
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* 4. PROMISE LIST */}
                <section className={styles.section}>
                    <motion.div
                        className={styles.promiseCard}
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className={styles.heading} style={{ fontSize: '2rem', marginBottom: '2rem' }}>Our Golden Promise</h2>
                        <div className="space-y-4">
                            {['100% Fresh Ingredients Daily', 'No Frozen Food, Ever', 'Filtered Water for Chai', 'Smiles Free with Every Order'].map((item, i) => (
                                <motion.div
                                    key={i}
                                    className={styles.listItem}
                                    initial={{ x: -20, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <CheckCircle2 size={24} className={styles.checkIcon} />
                                    <span className="text-lg font-medium">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* FINAL CTA */}
                    <div style={{ textAlign: 'center', marginTop: '6rem' }}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href="/menu" className={styles.ctaBtn}>
                                Explore Menu <ArrowRight size={24} />
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
}
