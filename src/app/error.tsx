'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            padding: '2rem',
            textAlign: 'center',
            background: '#0a0a0a',
            color: '#fff'
        }}>
            <h2 style={{ color: '#F2B705' }}>Kuch Gadbad Ho Gayi! ☕</h2>
            <p style={{ margin: '1rem 0', opacity: 0.8 }}>
                {error.message || 'Server-side error occurred. Please check database connection.'}
            </p>
            {error.digest && (
                <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Error ID: {error.digest}</p>
            )}
            <button
                onClick={() => reset()}
                style={{
                    padding: '10px 20px',
                    background: '#F2B705',
                    color: '#000',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                Try Again
            </button>
        </div>
    );
}
