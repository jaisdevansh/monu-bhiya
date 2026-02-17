'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    Settings,
    LogOut,
    Package,
    TrendingUp,
    CheckCircle2,
    Eye,
    X,
    Trash2,
    ArrowUpRight,
    Upload,
    Check,
    Pencil,
    Save,
    Clock,
    CreditCard,
    User,
    Bell,
    Store,
    Search,
    Filter
} from 'lucide-react';
import { addProduct, uploadImage, updateOrderStatus, updateProduct, deleteProduct, getStoreSettings, updateStoreSettings } from './actions';
import { logoutAdmin } from '@/app/actions/admin-auth';
import styles from './admin.module.css';

type Order = {
    id: number;
    customerName: string;
    customerEmail: string | null;
    customerPhone: string;
    customerAddress: string;
    totalAmount: string;
    status: string;
    itemSummary: string;
    createdAt: Date | null;
    items: any[];
};

type Product = {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
    categoryId: number | null;
    isAvailable: boolean | null;
    createdAt?: Date | null;
};

type Category = {
    id: number;
    name: string;
    slug: string;
    createdAt?: Date | null;
};

type AdminDashboardClientProps = {
    initialOrders: Order[];
    initialProducts: Product[];
    initialCategories: Category[];
    initialStoreSettings: any;
    stats: {
        todayOrders: number;
        todayRevenue: number;
        pendingOrders: number;
        completedOrders: number;
        totalProducts: number;
    };
};

export default function AdminDashboardClient({ initialOrders, initialProducts, initialCategories, initialStoreSettings, stats }: AdminDashboardClientProps) {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'settings'>('dashboard');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [storeOpen, setStoreOpen] = useState(initialStoreSettings?.storeOpen ?? true);

    const handleStoreToggle = async (checked: boolean) => {
        setStoreOpen(checked);
        try {
            await updateStoreSettings({ ...initialStoreSettings, storeOpen: checked });
        } catch (error) {
            console.error('Failed to toggle store status', error);
            setStoreOpen(!checked); // Revert on error
        }
    };

    return (
        <div className={styles.adminContainer}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                {/* Logo */}
                <div className={styles.brand}>
                    MONU CHAI
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    <NavItem
                        icon={LayoutDashboard}
                        label="Overview"
                        active={activeTab === 'dashboard'}
                        onClick={() => setActiveTab('dashboard')}
                    />
                    <NavItem
                        icon={ShoppingBag}
                        label="Orders"
                        active={activeTab === 'orders'}
                        onClick={() => setActiveTab('orders')}
                        badge={stats.pendingOrders}
                    />
                    <NavItem
                        icon={Package}
                        label="Products"
                        active={activeTab === 'products'}
                        onClick={() => setActiveTab('products')}
                    />
                    <NavItem
                        icon={Settings}
                        label="Settings"
                        active={activeTab === 'settings'}
                        onClick={() => setActiveTab('settings')}
                    />
                </nav>

                {/* Logout */}
                <div style={{ marginTop: 'auto' }}>
                    <form action={logoutAdmin}>
                        <button type="submit" className={styles.navItem} style={{ color: '#ef4444', border: 'none', background: 'transparent', width: '100%', cursor: 'pointer' }}>
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Header - Only show on non-dashboard tabs, or customized? 
                   The request defines "SECTION 1: HEADER" as part of the Overview page content specifically.
                   So I should probably remove the generic header from `mainContent` and let each view handle it?
                   Or just conditionalize it. The request says "This is the main landing page... SECTION 1: HEADER... Below greeting display today's date".
                   Current header has "Good Morning...".
                   I'll conditionally render the generic header only if NOT on dashboard, or modify the generic header to match. 
                   Actually, the generic header is fine, but the dashboard view has specific requirements.
                   Let's hide the generic header for 'dashboard' tab and implement the specific one inside `DashboardView`.
                */}
                {activeTab !== 'dashboard' && (
                    <header className={styles.header}>
                        <div>
                            <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
                                {activeTab === 'orders' && 'Orders Management'}
                                {activeTab === 'products' && 'Products Database'}
                                {activeTab === 'settings' && 'Settings'}
                            </h2>
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', fontSize: '0.75rem', color: '#fff'
                                }}>
                                    AD
                                </div>
                                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#fff' }}>Admin User</span>
                            </div>
                        </div>
                    </header>
                )}

                {/* Dynamic Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{ height: '100%' }}
                    >
                        {activeTab === 'dashboard' && (
                            <DashboardView
                                stats={stats}
                                orders={initialOrders}
                                onViewOrder={setSelectedOrder}
                                storeOpen={storeOpen}
                                onToggleStore={handleStoreToggle}
                                onNavigate={setActiveTab}
                                onAddProduct={() => { setActiveTab('products'); setIsProductModalOpen(true); }}
                            />
                        )}
                        {activeTab === 'orders' && <OrdersView orders={initialOrders} onViewOrder={setSelectedOrder} />}
                        {activeTab === 'products' && (
                            <ProductsView
                                products={initialProducts}
                                onAddProduct={() => {
                                    setSelectedProduct(null);
                                    setIsProductModalOpen(true);
                                }}
                                onEdit={(p: Product) => {
                                    setSelectedProduct(p);
                                    setIsProductModalOpen(true);
                                }}
                                onDelete={deleteProduct}
                            />
                        )}
                        {activeTab === 'settings' && <SettingsView categories={initialCategories} />}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Order Modal */}
            <AnimatePresence>
                {selectedOrder && <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
            </AnimatePresence>

            {/* Product Modal */}
            <AnimatePresence>
                {isProductModalOpen && (
                    <ProductModal
                        categories={initialCategories}
                        product={selectedProduct}
                        onClose={() => {
                            setIsProductModalOpen(false);
                            setSelectedProduct(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function NavItem({ icon: Icon, label, active, onClick, badge }: any) {
    return (
        <button
            onClick={onClick}
            className={`${styles.navItem} ${active ? styles.activeNav : ''}`}
        >
            <Icon size={20} />
            <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
            {badge > 0 && !active && (
                <span className={styles.statusBadge + ' ' + styles.statusPending} style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}>
                    {badge}
                </span>
            )}
        </button>
    );
}

function DashboardView({ stats, orders, onViewOrder, storeOpen, onToggleStore, onNavigate, onAddProduct }: any) {
    const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div style={{ width: '100%', padding: '0 0.5rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>Good Morning, Admin 👋</h2>
                    <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>{today}</p>
                </div>
                {/* Admin Profile Mini */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', fontSize: '0.75rem', color: '#fff'
                    }}>
                        AD
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#fff' }}>Admin User</span>
                </div>
            </div>

            {/* Stats Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className={styles.card} style={{ padding: '1.5rem', background: '#27272a', borderRadius: '12px', border: '1px solid #3f3f46' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Products</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff' }}>{stats.totalProducts}</h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '8px', color: '#ec4899' }}>
                            <Package size={20} />
                        </div>
                    </div>
                </div>

                <div className={styles.card} style={{ padding: '1.5rem', background: '#27272a', borderRadius: '12px', border: '1px solid #3f3f46' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Today's Orders</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff' }}>{stats.todayOrders}</h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', color: '#F59E0B' }}>
                            <ShoppingBag size={20} />
                        </div>
                    </div>
                </div>

                <div className={styles.card} style={{ padding: '1.5rem', background: '#27272a', borderRadius: '12px', border: '1px solid #3f3f46' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Today's Revenue</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff' }}>₹{stats.todayRevenue}</h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10b981' }}>
                            <TrendingUp size={20} />
                        </div>
                    </div>
                </div>

                <div className={styles.card} style={{ padding: '1.5rem', background: '#27272a', borderRadius: '12px', border: '1px solid #3f3f46' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Pending Orders</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff' }}>{stats.pendingOrders}</h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: '#3b82f6' }}>
                            <Clock size={20} />
                        </div>
                    </div>
                </div>

                <div className={styles.card} style={{ padding: '1.5rem', background: '#27272a', borderRadius: '12px', border: '1px solid #3f3f46' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Completed Orders</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff' }}>{stats.completedOrders}</h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', color: '#8b5cf6' }}>
                            <CheckCircle2 size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Store Status & Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className={styles.card} style={{ padding: '1.5rem', background: '#27272a', borderRadius: '12px', border: '1px solid #3f3f46' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Store size={20} className="text-emerald-500" /> Store Status
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#18181b', padding: '1rem', borderRadius: '8px' }}>
                        <span style={{ fontWeight: 600, color: storeOpen ? '#10b981' : '#ef4444' }}>
                            {storeOpen ? 'OPEN' : 'CLOSED'}
                        </span>
                        <label className={styles.toggle} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={storeOpen}
                                onChange={(e) => onToggleStore(e.target.checked)}
                                style={{ transform: 'scale(1.5)', margin: '0 0.5rem' }}
                            />
                        </label>
                    </div>
                </div>

                <div className={styles.card} style={{ padding: '1.5rem', background: '#27272a', borderRadius: '12px', border: '1px solid #3f3f46' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '1.5rem' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={onAddProduct}
                            className={styles.actionBtn}
                            style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', borderRadius: '8px', background: '#18181b', border: '1px solid #3f3f46' }}
                        >
                            <Package size={24} color="#F59E0B" />
                            <span>Add Product</span>
                        </button>
                        <button
                            onClick={() => onNavigate('settings')}
                            className={styles.actionBtn}
                            style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', borderRadius: '8px', background: '#18181b', border: '1px solid #3f3f46' }}
                        >
                            <Settings size={24} color="#10b981" />
                            <span>Add Category</span>
                        </button>
                        <button
                            onClick={() => onNavigate('orders')}
                            className={styles.actionBtn}
                            style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', borderRadius: '8px', background: '#18181b', border: '1px solid #3f3f46' }}
                        >
                            <ShoppingBag size={24} color="#3b82f6" />
                            <span>View Orders</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className={styles.card} style={{ padding: '1.5rem', background: '#27272a', borderRadius: '12px', border: '1px solid #3f3f46' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Recent Transactions</h3>
                    <button onClick={() => onNavigate('orders')} style={{ background: 'transparent', border: 'none', color: '#F59E0B', cursor: 'pointer', fontSize: '0.9rem' }}>View All</button>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: '#a1a1aa', borderBottom: '1px solid #3f3f46' }}>
                                <th style={{ padding: '1rem' }}>Order ID</th>
                                <th style={{ padding: '1rem' }}>Customer</th>
                                <th style={{ padding: '1rem' }}>Amount</th>
                                <th style={{ padding: '1rem' }}>Payment</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.slice(0, 5).map((order: any) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid #3f3f46' }} className={styles.tableRow}>
                                    <td style={{ padding: '1rem', color: '#a1a1aa' }}>#{order.id}</td>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{order.customerName}</td>
                                    <td style={{ padding: '1rem' }}>₹{order.totalAmount}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            background: order.paymentMethod === 'UPI' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: order.paymentMethod === 'UPI' ? '#10b981' : '#F59E0B'
                                        }}>
                                            {order.paymentMethod || 'COD'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className={`${styles.statusBadge} ${order.status === 'completed' ? styles.statusCompleted :
                                            order.status === 'confirmed' ? styles.statusConfirmed :
                                                styles.statusPending
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#a1a1aa', fontSize: '0.9rem' }}>
                                        {/* Simple time formatting since createdAt might be string or Date */}
                                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div style={{ paddingBottom: '2rem' }}></div>
        </div>
    );
}
function StatusBadge({ status }: { status: string }) {
    const s = status.toLowerCase();
    let colorClass = styles.statusPending;
    if (s === 'completed') colorClass = styles.statusCompleted;
    if (s === 'confirmed' || s === 'preparing') colorClass = styles.statusConfirmed; // Blue/Greenish
    if (s === 'cancelled') colorClass = styles.deleteBtn;

    // Custom styles for specific badges if class is not enough
    const style: any = {};
    if (s === 'preparing') {
        style.background = 'rgba(59, 130, 246, 0.1)';
        style.color = '#3b82f6';
    }

    return (
        <span className={`${styles.statusBadge} ${colorClass}`} style={style}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
            {s.charAt(0).toUpperCase() + s.slice(1)}
        </span>
    );
}



function OrdersView({ orders, onViewOrder }: any) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const { showToast } = useToast();
    const router = useRouter();

    const filteredOrders = orders.filter((order: any) => {
        const matchesSearch =
            order.id.toString().includes(searchTerm) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerPhone.includes(searchTerm);

        const matchesFilter = filterStatus === 'all' || order.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            showToast(`Order #${orderId} marked as ${newStatus}`, 'success');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        }
    };

    return (
        <div style={{ width: '100%', padding: '0 0.5rem' }}>
            {/* Section 1: Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 className={styles.sectionTitle} style={{ marginBottom: '0.25rem' }}>Orders</h2>
                    <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Manage and track all cafe orders</p>
                </div>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a1a1aa' }} />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            background: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px',
                            padding: '0.6rem 1rem 0.6rem 2.8rem', color: '#fff', width: '320px', outline: 'none'
                        }}
                    />
                </div>
            </div>

            {/* Section 2: Filter Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #3f3f46', paddingBottom: '0.5rem' }}>
                {['all', 'pending', 'completed', 'cancelled'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        style={{
                            background: 'transparent', border: 'none', padding: '0.5rem 1rem',
                            color: filterStatus === status ? '#F59E0B' : '#a1a1aa',
                            borderBottom: filterStatus === status ? '2px solid #F59E0B' : '2px solid transparent',
                            fontWeight: filterStatus === status ? 600 : 400, cursor: 'pointer', textTransform: 'capitalize'
                        }}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Section 3: Orders Table */}
            <div className={styles.tableContainer}>
                {filteredOrders.length > 0 ? (
                    <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: '#a1a1aa', borderBottom: '1px solid #3f3f46' }}>
                                <th style={{ padding: '1rem' }}>Order ID</th>
                                <th style={{ padding: '1rem' }}>Customer Info</th>
                                <th style={{ padding: '1rem' }}>Items</th>
                                <th style={{ padding: '1rem' }}>Amount</th>
                                <th style={{ padding: '1rem' }}>Payment</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Time</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order: any) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid #3f3f46' }} className={styles.tableRow}>
                                    <td style={{ padding: '1rem', color: '#a1a1aa' }}>#{order.id}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 500, color: '#fff' }}>{order.customerName}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>{order.customerPhone}</div>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#a1a1aa' }}>
                                        {order.items?.length || 0} items
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>₹{order.totalAmount}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <span style={{
                                                width: 'fit-content', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem',
                                                background: order.paymentMethod === 'UPI' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                color: order.paymentMethod === 'UPI' ? '#10b981' : '#F59E0B'
                                            }}>
                                                {order.paymentMethod || 'COD'}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                            style={{
                                                background: '#18181b', border: '1px solid #3f3f46', borderRadius: '6px',
                                                padding: '0.4rem', color: '#fff', fontSize: '0.85rem', outline: 'none'
                                            }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#a1a1aa', fontSize: '0.85rem' }}>
                                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={() => onViewOrder(order)}
                                            className={styles.actionBtn}
                                            style={{ padding: '0.4rem 0.8rem' }}
                                        >
                                            <Eye size={16} /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#a1a1aa' }}>
                        <ShoppingBag size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>No orders found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ProductsView({ products, onAddProduct, onEdit, onDelete }: any) {
    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            await onDelete(id);
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <div className={styles.sectionTitle}>
                <h3>Products Database</h3>
                <button
                    className={styles.confirmBtn}
                    onClick={onAddProduct}
                >
                    + Add Product
                </button>
            </div>

            <div className={styles.productsGrid}>
                {products.map((p: Product) => (
                    <div key={p.id} className={styles.productCard}>
                        <img src={p.image} className={styles.productImage} alt={p.name} />
                        <div className={styles.productInfo}>
                            <h3 className={styles.productName}>{p.name}</h3>
                            <p className={styles.productPrice}>₹{p.price}</p>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <button
                                    onClick={() => onEdit(p)}
                                    className={styles.actionBtn}
                                    style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', padding: '0.4rem' }}
                                >
                                    <Pencil size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    className={styles.deleteBtn}
                                    style={{ padding: '0.4rem' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SettingsView({ categories }: any) {
    const [settings, setSettings] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            const data = await getStoreSettings();
            if (data) {
                setSettings(data);
            }
            setIsLoading(false);
        };
        fetchSettings();
    }, []);

    const handleChange = (field: string, value: any) => {
        setSettings((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            try {
                const res = await uploadImage(formData);
                handleChange(field, res.url);
            } catch (error) {
                console.error('Upload failed', error);
                alert('Image upload failed');
            }
        }
    };

    const handleTimingChange = (day: string, field: string, value: any) => {
        setSettings((prev: any) => ({
            ...prev,
            timings: {
                ...prev.timings,
                [day]: {
                    ...prev.timings[day],
                    [field]: value
                }
            }
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const res = await updateStoreSettings(settings);
        setIsSaving(false);
        if (res.success) {
            alert('Settings saved successfully!');
        } else {
            alert('Failed to save settings.');
        }
    };

    if (isLoading) return <div style={{ color: '#fff', padding: '2rem' }}>Loading settings...</div>;
    if (!settings) return <div style={{ color: '#fff', padding: '2rem' }}>Failed to load settings.</div>;

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    return (
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
            <h2 className={styles.sectionTitle}>Settings & Configuration</h2>

            {/* Section 1: Store Settings */}
            <div className={styles.card} style={{ marginBottom: '2rem', background: '#27272a', padding: '1.5rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #3f3f46', paddingBottom: '1rem' }}>
                    <Store size={20} className="text-emerald-500" style={{ color: '#10b981' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Store Settings</h3>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>Store Name</label>
                        <input
                            type="text"
                            value={settings.storeName}
                            onChange={(e) => handleChange('storeName', e.target.value)}
                            className={styles.input}
                            style={{ width: '100%', padding: '0.75rem', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>Store Logo</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {settings.logoUrl && <img src={settings.logoUrl} alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />}
                            <label style={{ cursor: 'pointer', padding: '0.5rem 1rem', background: '#3f3f46', borderRadius: '6px', color: '#fff', fontSize: '0.9rem' }}>
                                Upload Logo
                                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'logoUrl')} />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>Description</label>
                        <textarea
                            value={settings.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            maxLength={300}
                            style={{ width: '100%', padding: '0.75rem', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', minHeight: '80px' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>Phone</label>
                            <input
                                type="text"
                                value={settings.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>Email</label>
                            <input
                                type="email"
                                value={settings.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>Address</label>
                        <textarea
                            value={settings.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', minHeight: '80px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>Google Maps Link</label>
                        <input
                            type="text"
                            value={settings.googleMapsLink}
                            onChange={(e) => handleChange('googleMapsLink', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff' }}
                        />
                    </div>
                </div>
            </div>

            {/* Section 2: Payment Settings */}
            <div className={styles.card} style={{ marginBottom: '2rem', background: '#27272a', padding: '1.5rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #3f3f46', paddingBottom: '1rem' }}>
                    <CreditCard size={20} className="text-emerald-500" style={{ color: '#10b981' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Payment Settings</h3>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={settings.codEnabled}
                                onChange={(e) => handleChange('codEnabled', e.target.checked)}
                                style={{ width: '18px', height: '18px' }}
                            />
                            Enable Cash on Delivery
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={settings.upiEnabled}
                                onChange={(e) => handleChange('upiEnabled', e.target.checked)}
                                style={{ width: '18px', height: '18px' }}
                            />
                            Enable UPI Payment
                        </label>
                    </div>

                    {settings.upiEnabled && (
                        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>UPI ID</label>
                                <input
                                    type="text"
                                    placeholder="chai@upi"
                                    value={settings.upiId}
                                    onChange={(e) => handleChange('upiId', e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>UPI QR Code</label>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    {settings.upiQrCodeUrl ? (
                                        <div style={{ position: 'relative' }}>
                                            <img src={settings.upiQrCodeUrl} alt="QR" style={{ width: '100px', height: '100px', borderRadius: '8px' }} />
                                            <button
                                                onClick={() => handleChange('upiQrCodeUrl', '')}
                                                style={{ position: 'absolute', top: -5, right: -5, background: '#ef4444', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                            >X</button>
                                        </div>
                                    ) : (
                                        <div style={{ width: '100px', height: '100px', borderRadius: '8px', border: '2px dashed #52525b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525b', background: '#18181b' }}>
                                            No QR
                                        </div>
                                    )}
                                    <label style={{ cursor: 'pointer', padding: '0.5rem 1rem', background: '#3f3f46', borderRadius: '6px', color: '#fff', fontSize: '0.9rem' }}>
                                        {settings.upiQrCodeUrl ? 'Replace QR' : 'Upload QR'}
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'upiQrCodeUrl')} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Section 3: Timings */}
            <div className={styles.card} style={{ marginBottom: '2rem', background: '#27272a', padding: '1.5rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #3f3f46', paddingBottom: '1rem' }}>
                    <Clock size={20} className="text-emerald-500" style={{ color: '#10b981' }} />
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Store Timings</h3>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: settings.storeOpen ? '#10b981' : '#ef4444', fontWeight: 500, cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={settings.storeOpen}
                                onChange={(e) => handleChange('storeOpen', e.target.checked)}
                                style={{ width: '18px', height: '18px' }}
                            />
                            {settings.storeOpen ? 'STORE OPEN' : 'STORE CLOSED'}
                        </label>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {days.map(day => (
                        <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#18181b', padding: '0.75rem', borderRadius: '8px' }}>
                            <span style={{ width: '100px', textTransform: 'capitalize', color: '#fff', fontWeight: 500 }}>{day}</span>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                    type="time"
                                    value={settings.timings[day]?.open || '09:00'}
                                    disabled={settings.timings[day]?.isClosed}
                                    onChange={(e) => handleTimingChange(day, 'open', e.target.value)}
                                    style={{ background: '#27272a', border: '1px solid #3f3f46', color: '#fff', padding: '0.25rem', borderRadius: '4px' }}
                                />
                                <span style={{ color: '#52525b' }}>to</span>
                                <input
                                    type="time"
                                    value={settings.timings[day]?.close || '22:00'}
                                    disabled={settings.timings[day]?.isClosed}
                                    onChange={(e) => handleTimingChange(day, 'close', e.target.value)}
                                    style={{ background: '#27272a', border: '1px solid #3f3f46', color: '#fff', padding: '0.25rem', borderRadius: '4px' }}
                                />
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: settings.timings[day]?.isClosed ? '#ef4444' : '#a1a1aa', fontSize: '0.85rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={settings.timings[day]?.isClosed || false}
                                    onChange={(e) => handleTimingChange(day, 'isClosed', e.target.checked)}
                                />
                                Closed
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 4: Admin Profile */}
            <div className={styles.card} style={{ marginBottom: '2rem', background: '#27272a', padding: '1.5rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #3f3f46', paddingBottom: '1rem' }}>
                    <User size={20} className="text-emerald-500" style={{ color: '#10b981' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Admin Profile</h3>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {settings.adminPhotoUrl ? (
                            <img src={settings.adminPhotoUrl} alt="Admin" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #3f3f46' }} />
                        ) : (
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa' }}>
                                <User size={40} />
                            </div>
                        )}
                        <div>
                            <label style={{ cursor: 'pointer', padding: '0.5rem 1rem', background: '#3f3f46', borderRadius: '6px', color: '#fff', fontSize: '0.9rem' }}>
                                Change Photo
                                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'adminPhotoUrl')} />
                            </label>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>Admin Name</label>
                            <input
                                type="text"
                                value={settings.adminName}
                                onChange={(e) => handleChange('adminName', e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>Admin Email</label>
                            <input
                                type="email"
                                value={settings.adminEmail}
                                onChange={(e) => handleChange('adminEmail', e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 5: Notifications */}
            <div className={styles.card} style={{ marginBottom: '2rem', background: '#27272a', padding: '1.5rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #3f3f46', paddingBottom: '1rem' }}>
                    <Bell size={20} className="text-emerald-500" style={{ color: '#10b981' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Notification Settings</h3>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#18181b', borderRadius: '8px' }}>
                        <span style={{ color: '#fff' }}>Order Notifications</span>
                        <input type="checkbox" checked={settings.orderNotifications} onChange={(e) => handleChange('orderNotifications', e.target.checked)} style={{ width: '18px', height: '18px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#18181b', borderRadius: '8px' }}>
                        <span style={{ color: '#fff' }}>Sound Notifications</span>
                        <input type="checkbox" checked={settings.soundNotifications} onChange={(e) => handleChange('soundNotifications', e.target.checked)} style={{ width: '18px', height: '18px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#18181b', borderRadius: '8px' }}>
                        <span style={{ color: '#fff' }}>Email Notifications</span>
                        <input type="checkbox" checked={settings.emailNotifications} onChange={(e) => handleChange('emailNotifications', e.target.checked)} style={{ width: '18px', height: '18px' }} />
                    </div>
                </div>
            </div>

            {/* Section 6: Save Button */}
            <div style={{ position: 'sticky', bottom: '2rem', zIndex: 10 }}>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                        cursor: isSaving ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        opacity: isSaving ? 0.8 : 1
                    }}
                >
                    {isSaving ? (
                        <>Saving Changes...</>
                    ) : (
                        <>
                            <Save size={20} /> Save Settings
                        </>
                    )}
                </button>
            </div>

        </div>
    );
}

function OrderModal({ order, onClose }: any) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={styles.modalContent}
            >
                <div className={styles.modalHeader}>
                    <div>
                        <h3 className={styles.modalTitle}>Order #{order.id.toString().padStart(4, '0')}</h3>
                        <p className={styles.modalSubtitle}>{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Date N/A'}</p>
                    </div>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.detailCard}>
                        <p className={styles.detailLabel}>Customer Details</p>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            <div className={styles.detailRow}>
                                <span style={{ color: '#a1a1aa' }}>Name:</span>
                                <span style={{ color: '#fff', fontWeight: 500 }}>{order.customerName}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span style={{ color: '#a1a1aa' }}>Phone:</span>
                                <span style={{ color: '#fff', userSelect: 'all' }}>{order.customerPhone}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span style={{ color: '#a1a1aa' }}>Address:</span>
                                <span style={{ color: '#fff' }}>{order.customerAddress}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.detailCard}>
                        <p className={styles.detailLabel}>Order Items</p>
                        <div className={styles.itemsList}>
                            {order.items.map((item: any, i: number) => (
                                <div key={i} className={styles.itemRow}>
                                    <div className={styles.itemInfo}>
                                        <span className={styles.itemQty}>{item.quantity}x</span>
                                        <span className={styles.itemName}>{item.productName}</span>
                                    </div>
                                    <span className={styles.itemPrice}>₹{parseFloat(item.price) * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>Total Amount</span>
                            <span className={styles.totalAmount}>₹{order.totalAmount}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button onClick={onClose} className={styles.cancelBtn}>
                        Close Detail
                    </button>
                    <button className={styles.confirmBtn}>
                        Mark as Complete
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}





function ProductModal({ categories, onClose, product }: { categories: Category[], onClose: () => void, product?: Product | null }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        categoryId: product?.categoryId || categories[0]?.id || 0
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let imageUrl = product?.image || '';

            if (imageFile) {
                const imageData = new FormData();
                imageData.append('file', imageFile);
                const uploadRes = await uploadImage(imageData);
                imageUrl = uploadRes.url;
            }

            if (!imageUrl) {
                alert('Please select an image or keep existing one');
                setIsLoading(false);
                return;
            }

            let res;
            if (product) {
                res = await updateProduct(product.id, {
                    ...formData,
                    image: imageUrl,
                    categoryId: Number(formData.categoryId)
                });
            } else {
                res = await addProduct({
                    ...formData,
                    image: imageUrl,
                    categoryId: Number(formData.categoryId)
                });
            }

            if (res.success) {
                onClose();
            } else {
                alert(`Failed to ${product ? 'update' : 'add'} product`);
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={styles.modalContent}
            >
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>{product ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.modalBody}>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}>Product Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: '#27272a',
                                    border: '1px solid #3f3f46',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}>Price (₹)</label>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: '#27272a',
                                    border: '1px solid #3f3f46',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}>Category</label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: '#27272a',
                                    border: '1px solid #3f3f46',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}>Product Image</label>
                            <div style={{
                                border: '2px dashed #3f3f46',
                                borderRadius: '8px',
                                padding: '1rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: imageFile ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                borderColor: imageFile ? '#10b981' : '#3f3f46',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                                onClick={() => document.getElementById('image-upload')?.click()}
                            >
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                    style={{ display: 'none' }}
                                />
                                {product?.image && !imageFile && (
                                    <img src={product.image} alt="Current" style={{ width: '60px', height: '60px', borderRadius: '8px', marginBottom: '0.5rem', objectFit: 'cover' }} />
                                )}
                                <Upload size={24} style={{ marginBottom: '0.5rem', color: imageFile ? '#10b981' : '#a1a1aa' }} />
                                <span style={{ color: imageFile ? '#10b981' : '#a1a1aa', fontSize: '0.9rem' }}>
                                    {imageFile ? imageFile.name : (product?.image ? 'Click to change image' : 'Click to upload image')}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}>Description</label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: '#27272a',
                                    border: '1px solid #3f3f46',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    minHeight: '100px'
                                }}
                            />
                        </div>
                    </div>

                    <div className={styles.modalFooter} style={{ marginTop: '2rem' }}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.confirmBtn} disabled={isLoading}>
                            {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
