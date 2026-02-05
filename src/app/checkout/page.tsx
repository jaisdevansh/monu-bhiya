'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Check, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

// Real DB Order Placement
const placeOrder = async (orderDetails: any) => {
    const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails),
    });

    if (!res.ok) {
        throw new Error('Failed to place order');
    }

    return await res.json();
};

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const router = useRouter();

    const [step, setStep] = useState<'details' | 'otp' | 'success'>('details');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const [otp, setOtp] = useState('');
    const [emailOtp, setEmailOtp] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDetailsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;

        setLoading(true);
        setEmailOtp(null);

        try {
            // Generate 6-digit OTP
            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

            // Send OTP via Email API
            const res = await fetch('/api/otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp: generatedOtp }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to send email');

            setEmailOtp(generatedOtp);
            setStep('otp');
        } catch (error: any) {
            console.error(error);
            alert('Failed to send Email OTP. Please check your email address or try again later. Error: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (otp === emailOtp) {
                // User signed in successfully.
                await placeOrder({ ...formData, items, total });
                clearCart();
                setStep('success');
            } else {
                throw new Error("Invalid OTP. Please check your email and try again.");
            }
        } catch (e: any) {
            console.error(e);
            alert('Verification Failed: ' + (e.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0 && step === 'details') {
        return (
            <div className="container py-12 text-center">
                <h2>Your cart is empty</h2>
                <Link href="/menu" className="btn btn-primary mt-4">
                    Go to Menu
                </Link>
            </div>
        );
    }

    return (
        <div className={`container ${styles.checkoutContainer}`}>

            {step === 'details' && (
                <>
                    <Link href="/menu" className="inline-flex items-center text-sm mb-6 opacity-60 hover:opacity-100">
                        <ArrowLeft size={16} className="mr-1" /> Back to Menu
                    </Link>
                    <h1 className={styles.title}>Checkout</h1>
                    <form className={styles.form} onSubmit={handleDetailsSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className={styles.input}
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Monu Bhai"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="email">Email Address (For Verification)</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className={styles.input}
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="yourname@gmail.com"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="phone">Mobile Number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                required
                                pattern="[0-9]{10}"
                                className={styles.input}
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="9876543210"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="address">Delivery Address (within Food Court)</label>
                            <textarea
                                id="address"
                                name="address"
                                required
                                className={styles.input}
                                value={formData.address}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Table No. 5, Near Fountain..."
                            />
                        </div>

                        <div className={styles.summary}>
                            <div className={styles.summaryRow}>
                                <span>Items ({items.reduce((a, b) => a + b.quantity, 0)})</span>
                                <span>₹{total}</span>
                            </div>
                            <div className={`${styles.summaryRow} ${styles.total}`}>
                                <span>Total to Pay</span>
                                <span>₹{total}</span>
                            </div>
                        </div>

                        <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Send Email OTP'}
                        </button>
                    </form>
                </>
            )}

            {step === 'otp' && (
                <div className={styles.verificationContainer}>
                    <h2 className="text-xl font-bold mb-4">Verify Email Address</h2>
                    <p className="mb-6 opacity-70">Enter the OTP sent to {formData.email}</p>
                    <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            maxLength={6}
                            className={`${styles.input} ${styles.otpInput}`}
                            placeholder="Enter 6-digit code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            required
                        />
                        <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Confirm Order'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep('details')}
                            className="text-sm underline opacity-60 mt-2"
                        >
                            Change Email
                        </button>
                    </form>
                </div>
            )}

            {step === 'success' && (
                <div className={styles.successMessage}>
                    <div className={styles.checkmark}>
                        <Check size={40} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Order Received!</h1>
                    <p className="opacity-80 mb-8 max-w-sm mx-auto">
                        Thank you, {formData.name}. We have verified your email and received your order.
                    </p>
                    <Link href="/" className="btn btn-secondary">
                        Back to Home
                    </Link>
                </div>
            )}
        </div>
    );
}

// Global Types not needed anymore for this implementation as we removed Recaptcha logic from this file
