'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000); // Auto dismiss after 3s
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px', // or left: '50%', transform: 'translateX(-50%)' for center
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    pointerEvents: 'none', // Allow clicks through container
                }}
            >
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast, onClose: () => void }) {
    const icons = {
        success: <CheckCircle size={20} color="#10b981" />, // Emerald
        error: <AlertCircle size={20} color="#ef4444" />,   // Red
        info: <Info size={20} color="#3b82f6" />            // Blue
    };

    const backgrounds = {
        success: 'rgba(16, 185, 129, 0.1)',
        error: 'rgba(239, 68, 68, 0.1)',
        info: 'rgba(59, 130, 246, 0.1)'
    };

    const borders = {
        success: 'rgba(16, 185, 129, 0.2)',
        error: 'rgba(239, 68, 68, 0.2)',
        info: 'rgba(59, 130, 246, 0.2)'
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            layout
            style={{
                pointerEvents: 'auto',
                minWidth: '300px',
                background: '#18181b', // Dark background
                backdropFilter: 'blur(10px)',
                border: `1px solid ${borders[toast.type]}`,
                padding: '12px 16px',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 500,
            }}
        >
            <div style={{
                padding: '8px',
                borderRadius: '50%',
                background: backgrounds[toast.type],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icons[toast.type]}
            </div>
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
                onClick={onClose}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#71717a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <X size={16} />
            </button>
        </motion.div>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
