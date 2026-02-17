'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAdmin } from '@/app/actions/admin-auth';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import styles from '../admin.module.css';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                border: 'none',
                color: '#18181b', // Dark text for contrast on orange
                fontWeight: 700,
                fontSize: '1rem',
                cursor: pending ? 'not-allowed' : 'pointer',
                opacity: pending ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '1rem',
                transition: 'transform 0.2s'
            }}
        >
            {pending ? 'Verifying...' : (
                <>
                    Access Dashboard <ArrowRight size={18} />
                </>
            )}
        </button>
    );
}

export default function AdminLoginPage() {
    const [state, formAction] = useActionState(loginAdmin, null);

    return (
        <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100vw',
            overflow: 'hidden',
            backgroundColor: '#000'
        }}>
            {/* Background Image with Parallax-like fix */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'url("https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=2074")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 0
            }} />

            {/* Dark Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9))',
                backdropFilter: 'blur(4px)',
                zIndex: 1
            }} />

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    maxWidth: '420px',
                    margin: '1rem',
                    padding: '3rem 2rem',
                    background: 'rgba(24, 24, 27, 0.75)', // Zinc-900 with opacity
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                {/* Icon */}
                <div style={{
                    width: '72px',
                    height: '72px',
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    color: '#F59E0B',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)'
                }}>
                    <Lock size={32} strokeWidth={2.5} />
                </div>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{
                        color: '#fff',
                        fontSize: '2rem',
                        fontWeight: 800,
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.02em'
                    }}>
                        Admin Portal
                    </h1>
                    <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>
                        Enter your secure access key to manage the store.
                    </p>
                </div>

                {/* Form */}
                <form action={formAction} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{
                            color: '#e4e4e7',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            marginLeft: '0.25rem'
                        }}>
                            Access Key
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="Enter password..."
                            style={{
                                width: '100%',
                                padding: '1rem 1.25rem',
                                borderRadius: '12px',
                                background: 'rgba(0, 0, 0, 0.3)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#fff',
                                outline: 'none',
                                fontSize: '1rem',
                                transition: 'all 0.2s',
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#F59E0B';
                                e.target.style.background = 'rgba(0, 0, 0, 0.5)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.background = 'rgba(0, 0, 0, 0.3)';
                            }}
                        />
                    </div>

                    {state?.message && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                color: '#fca5a5',
                                fontSize: '0.9rem',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                textAlign: 'center'
                            }}
                        >
                            {state.message}
                        </motion.div>
                    )}

                    <SubmitButton />
                </form>

                {/* Footer link */}
                <div style={{ marginTop: '2rem' }}>
                    <a href="/" style={{ color: '#71717a', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#a1a1aa'} onMouseOut={(e) => e.currentTarget.style.color = '#71717a'}>
                        ← Return to Website
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
