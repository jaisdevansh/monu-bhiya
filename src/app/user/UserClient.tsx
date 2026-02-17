'use client';

import { useActionState, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ShoppingBag, Clock, LogOut, ArrowRight, Package, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import styles from '../admin/admin.module.css'; // Reusing admin styles
import { getUserOrders } from '../admin/actions';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { loginUser, logoutUser } from '../actions/auth';
import { useFormStatus } from 'react-dom'; // Using React DOM hooks for server actions
import Image from 'next/image';

// Types
type Product = {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
    categoryId: number;
    isPopular: boolean;
    isAvailable: boolean;
};

type Order = {
    id: number;
    customerName: string;
    customerPhone: string;
    totalAmount: string;
    status: string;
    paymentMethod: string;
    createdAt: string;
    itemSummary?: string;
    items: any[];
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className={styles.confirmBtn} disabled={pending} style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '0.5rem', opacity: pending ? 0.7 : 1 }}>
            {pending ? 'Logging in...' : (
                <>
                    Access Dashboard <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                </>
            )}
        </button>
    );
}

export default function UserDashboardClient({ initialProducts, initialCategories, storeSettings, initialSession }: any) {
    const { addItem } = useCart();
    const { showToast } = useToast();
    const [userPhone, setUserPhone] = useState<string | null>(initialSession);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'orders'>('overview');

    // Server Action State for Login
    // Note: We use a wrapper to handle the form submission and toast

    useEffect(() => {
        if (initialSession) {
            setUserPhone(initialSession);
            fetchOrders(initialSession);
        }
    }, [initialSession]);

    const fetchOrders = async (phone: string) => {
        setIsLoading(true);
        try {
            const data: any = await getUserOrders(phone);
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders');
        }
        setIsLoading(false);
    };

    const handleLoginAction = async (prevState: any, formData: FormData) => {
        const result = await loginUser(prevState, formData);
        if (result?.errors) {
            showToast(result.errors.phone?.[0] || 'Invalid input', 'error');
            return result;
        }
        // If success, redirect happens in server action
    };

    const [loginState, loginAction] = useActionState(handleLoginAction, null);

    const handleLogout = async () => {
        await logoutUser();
        setUserPhone(null);
        showToast('Logged out successfully', 'success');
    };

    if (!userPhone) {
        return (
            <div className={styles.adminContainer} style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    padding: '2.5rem',
                    background: 'rgba(24, 24, 27, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    width: '100%',
                    maxWidth: '400px',
                    backdropFilter: 'blur(10px)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
                    <h2 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Welcome Back</h2>
                    <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>Enter your phone number to access your dashboard.</p>
                    <form action={loginAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter Phone Number (10 digits)"
                            required
                            style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#fff',
                                outline: 'none',
                                fontSize: '1rem'
                            }}
                        />
                        {loginState?.message && <p className="text-red-500 text-sm">{loginState.message}</p>}
                        <SubmitButton />
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.adminContainer}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    MONU CHAI <span style={{ fontSize: '0.7rem', background: '#F59E0B', color: '#000', padding: '0.1rem 0.4rem', borderRadius: '4px', marginLeft: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>User</span>
                </div>

                <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontSize: '0.75rem', color: '#a1a1aa', marginBottom: '0.25rem' }}>Logged in as</p>
                    <p style={{ color: '#fff', fontWeight: 600 }}>{userPhone}</p>
                </div>

                <nav className={styles.nav}>
                    <NavItem
                        icon={LayoutDashboard}
                        label="Overview"
                        active={activeTab === 'overview'}
                        onClick={() => setActiveTab('overview')}
                    />
                    <NavItem
                        icon={ShoppingBag}
                        label="Menu"
                        active={activeTab === 'menu'}
                        onClick={() => setActiveTab('menu')}
                    />
                    <NavItem
                        icon={Clock}
                        label="My Orders"
                        active={activeTab === 'orders'}
                        onClick={() => setActiveTab('orders')}
                    />
                </nav>
                <div style={{ marginTop: 'auto' }}>
                    <form action={handleLogout}>
                        <button className={styles.navItem} type="submit" style={{ color: '#ef4444', width: '100%', cursor: 'pointer' }}>
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </form>
                    <Link href="/" className={styles.navItem} style={{ marginTop: '0.5rem', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                        Back to Home
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{ height: '100%' }}
                    >
                        {activeTab === 'overview' && (
                            <OverviewView userPhone={userPhone} orders={orders} onNavigate={setActiveTab} />
                        )}
                        {activeTab === 'menu' && (
                            <MenuView products={initialProducts} addItem={addItem} />
                        )}
                        {activeTab === 'orders' && (
                            <MyOrdersView orders={orders} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}

function NavItem({ icon: Icon, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`${styles.navItem} ${active ? styles.activeNav : ''}`}
        >
            <Icon size={20} />
            <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
        </button>
    );
}

function OverviewView({ userPhone, orders, onNavigate }: any) {
    // Determine active orders (server should define what active means, but client filtering is okay for display)
    const activeOrder = orders.find((o: Order) => ['pending', 'preparing'].includes(o.status));
    const recentOrders = orders.slice(0, 3);
    const totalSpent = orders.reduce((acc: number, curr: Order) => acc + Number(curr.totalAmount), 0);

    return (
        <div style={{ width: '100%', padding: '0 0.5rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>Good Day! 👋</h2>
                    <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>Welcome to your personal dashboard</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className={styles.card} style={{ padding: '1.5rem', background: '#27272a', borderRadius: '12px', border: '1px solid #3f3f46' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Active Orders</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff' }}>{activeOrder ? '1' : '0'}</h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: activeOrder ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', color: activeOrder ? '#10b981' : '#a1a1aa' }}>
                            <ShoppingBag size={20} />
                        </div>
                    </div>
                </div>

                <div className={styles.card} style={{ padding: '1.5rem', background: '#27272a', borderRadius: '12px', border: '1px solid #3f3f46' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Orders</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff' }}>{orders.length}</h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', color: '#F59E0B' }}>
                            <Package size={20} />
                        </div>
                    </div>
                </div>

                <div className={styles.card} style={{ padding: '1.5rem', background: '#27272a', borderRadius: '12px', border: '1px solid #3f3f46' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Spent</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff' }}>₹{totalSpent}</h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '8px', color: '#ec4899' }}>
                            <TrendingUp size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Order Card */}
            {activeOrder && (
                <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Current Order Status</h3>
                        <span style={{ background: '#F59E0B', color: '#000', padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                            {activeOrder.status}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Order ID</p>
                            <p style={{ color: '#fff', fontWeight: 600 }}>#{activeOrder.id}</p>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Items</p>
                            <p style={{ color: '#fff' }}>{activeOrder.items?.length || 0} items</p>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Total</p>
                            <p style={{ color: '#fff', fontWeight: 600 }}>₹{activeOrder.totalAmount}</p>
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: activeOrder.status === 'preparing' ? '60%' : '30%' }}
                            style={{ height: '100%', background: '#F59E0B' }}
                        />
                    </div>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#F59E0B', textAlign: 'right' }}>
                        {activeOrder.status === 'preparing' ? 'Your order is being prepared...' : 'We have received your order!'}
                    </p>
                </div>
            )}

            {/* Recent Orders */}
            <div className={styles.card} style={{ padding: '1.5rem', background: '#27272a', borderRadius: '12px', border: '1px solid #3f3f46' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Recent Orders</h3>
                    <button onClick={() => onNavigate('orders')} style={{ background: 'transparent', border: 'none', color: '#F59E0B', cursor: 'pointer', fontSize: '0.9rem' }}>View All</button>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: '#a1a1aa', borderBottom: '1px solid #3f3f46' }}>
                                <th style={{ padding: '1rem' }}>Order ID</th>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Total</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order: any) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid #3f3f46' }} className={styles.tableRow}>
                                    <td style={{ padding: '1rem', color: '#a1a1aa' }}>#{order.id}</td>
                                    <td style={{ padding: '1rem', color: '#fff' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>₹{order.totalAmount}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem',
                                            background: order.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: order.status === 'completed' ? '#10b981' : '#F59E0B'
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#a1a1aa' }}>No orders yet. Start ordering from the Menu!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function MenuView({ products, addItem }: any) {
    return (
        <div style={{ width: '100%' }}>
            <h2 className={styles.sectionTitle}>Menu</h2>
            <div className={styles.productsGrid}>
                {products.map((p: Product) => (
                    <div key={p.id} className={styles.productCard}>
                        <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden' }}>
                            <Image
                                src={p.image.startsWith('http') ? p.image : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/fetch/f_auto,q_auto,w_400/${p.image}`}
                                alt={p.name}
                                fill
                                className={styles.productImage}
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                        <div className={styles.productInfo}>
                            <h3 className={styles.productName}>{p.name}</h3>
                            <p className={styles.productPrice}>₹{p.price}</p>
                            <button
                                onClick={() => addItem({ id: p.id.toString(), name: p.name, price: Number(p.price), image: p.image })}
                                className={styles.actionBtn}
                                style={{ width: '100%', marginTop: '0.75rem', borderColor: '#F59E0B', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <ShoppingBag size={16} /> Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MyOrdersView({ orders }: any) {
    return (
        <div style={{ width: '100%' }}>
            <h2 className={styles.sectionTitle}>My Orders</h2>
            <div className={styles.tableContainer}>
                <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', color: '#a1a1aa', borderBottom: '1px solid #3f3f46' }}>
                            <th style={{ padding: '1rem' }}>Order ID</th>
                            <th style={{ padding: '1rem' }}>Items</th>
                            <th style={{ padding: '1rem' }}>Total</th>
                            <th style={{ padding: '1rem' }}>Date</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order: any) => (
                            <tr key={order.id} style={{ borderBottom: '1px solid #3f3f46' }} className={styles.tableRow}>
                                <td style={{ padding: '1rem', color: '#a1a1aa' }}>#{order.id}</td>
                                <td style={{ padding: '1rem', color: '#a1a1aa' }}>
                                    {order.items?.map((i: any) => `${i.productName} x${i.quantity}`).join(', ').substring(0, 50)}...
                                </td>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>₹{order.totalAmount}</td>
                                <td style={{ padding: '1rem', color: '#a1a1aa' }}>{new Date(order.createdAt).toLocaleString()}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem',
                                        background: order.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        color: order.status === 'completed' ? '#10b981' : '#F59E0B'
                                    }}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
