'use client';

import { useState } from 'react';
import { LayoutDashboard, ShoppingBag, Settings, LogOut } from 'lucide-react';
import styles from './admin.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className={styles.adminContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>Monu Admin</div>

                <nav className={styles.nav}>
                    <div
                        className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.activeNav : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </div>
                    <div
                        className={`${styles.navItem} ${activeTab === 'orders' ? styles.activeNav : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <ShoppingBag size={20} />
                        Orders
                    </div>
                    <div
                        className={`${styles.navItem} ${activeTab === 'settings' ? styles.activeNav : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <Settings size={20} />
                        Settings
                    </div>
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <div className={styles.navItem}>
                        <LogOut size={20} />
                        Logout
                    </div>
                </div>
            </aside>

            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
