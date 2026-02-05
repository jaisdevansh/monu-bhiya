'use client';

import { useState, useTransition } from 'react';
import styles from './admin.module.css';
import { updateOrderStatus } from './actions';
import { LayoutDashboard, ShoppingBag, Settings, LogOut, Loader2 } from 'lucide-react';

type Order = {
    id: number;
    customerName: string;
    totalAmount: string;
    status: string;
    itemSummary: string;
    createdAt: Date | null;
};

type AdminDashboardClientProps = {
    initialOrders: Order[];
    stats: {
        totalOrders: number;
        revenue: number;
        pendingCount: number;
    };
};

export default function AdminDashboardClient({ initialOrders, stats }: AdminDashboardClientProps) {
    const [isPending, startTransition] = useTransition();

    const handleStatusToggle = (orderId: number, currentStatus: string) => {
        const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';

        startTransition(async () => {
            await updateOrderStatus(orderId, newStatus);
        });
    };

    return (
        <div>
            <div className={styles.header}>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="text-sm opacity-60">Welcome back, Admin</div>
            </div>

            <div className={styles.statGrid}>
                <div className={`${styles.statCard} ${styles.cardOrders}`}>
                    <div className={styles.statLabel}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6' }} />
                        Total Orders
                    </div>
                    <div className={styles.statValue}>{stats.totalOrders}</div>
                </div>
                <div className={`${styles.statCard} ${styles.cardRevenue}`}>
                    <div className={styles.statLabel}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                        Total Revenue
                    </div>
                    <div className={styles.statValue}>₹{stats.revenue}</div>
                </div>
                <div className={`${styles.statCard} ${styles.cardPending}`}>
                    <div className={styles.statLabel}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
                        Pending Orders
                    </div>
                    <div className={styles.statValue} style={{ color: '#F59E0B' }}>
                        {stats.pendingCount}
                    </div>
                </div>
            </div>

            <h2 className={styles.sectionTitle}>
                Recent Orders
                <span style={{ fontSize: '0.9rem', color: '#a1a1aa', fontWeight: 400 }}>Live Feed</span>
            </h2>
            <div className={styles.ordersTableContainer} style={{ opacity: isPending ? 0.7 : 1, transition: 'opacity 0.2s' }}>
                <table className={styles.ordersTable}>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initialOrders.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', color: '#666', padding: '3rem' }}>No orders found</td>
                            </tr>
                        ) : initialOrders.map((order) => (
                            <tr key={order.id}>
                                <td style={{ fontFamily: 'monospace', color: '#a1a1aa' }}>#{order.id.toString().padStart(4, '0')}</td>
                                <td>
                                    <div style={{ fontWeight: 600, color: '#fff' }}>{order.customerName}</div>
                                </td>
                                <td style={{ color: '#a1a1aa', maxWidth: '300px' }}>{order.itemSummary}</td>
                                <td style={{ fontWeight: 600, color: '#fff' }}>₹{order.totalAmount}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${order.status === 'pending' ? styles.statusPending : styles.statusCompleted}`}>
                                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }}></span>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className={`${styles.actionBtn} ${order.status === 'completed' ? styles.undo : ''}`}
                                        onClick={() => handleStatusToggle(order.id, order.status)}
                                        disabled={isPending}
                                        style={{ opacity: isPending ? 0.5 : 1 }}
                                    >
                                        {isPending ? <Loader2 className="animate-spin" size={14} /> : (order.status === 'pending' ? 'Mark Done' : 'Undo')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
