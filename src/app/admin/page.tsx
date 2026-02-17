import { db } from '@/db';
import { orders, products, categories, storeSettings } from '@/db/schema';
import AdminDashboardClient from './AdminDashboardClient';
import { desc, gte } from 'drizzle-orm';
import { verifyAdmin } from '@/app/actions/admin-auth';
import { redirect } from 'next/navigation';

// Prevent caching to ensure live data
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    // Security Check
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        redirect('/admin/login');
    }

    // Fetch store settings
    const settingsResult = await db.select().from(storeSettings).limit(1);
    const currentSettings = settingsResult[0] || {
        storeOpen: true,
    };

    // Calculate start of today for filtering
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Fetch real orders from database using relations
    const realOrders = await db.query.orders.findMany({
        with: {
            items: true,
        },
        orderBy: [desc(orders.createdAt)],
        limit: 200,
    });

    const allProducts = await db.query.products.findMany({
        orderBy: [desc(products.createdAt)],
    });

    const allCategories = await db.query.categories.findMany({
        orderBy: [desc(categories.createdAt)],
    });

    // Calculate Statistics for Today
    const todayOrdersList = realOrders.filter(o => o.createdAt && o.createdAt >= startOfDay);
    const todayOrders = todayOrdersList.length;
    const todayRevenue = todayOrdersList.reduce((sum, order) => sum + Number(order.totalAmount), 0);

    const pendingOrders = realOrders.filter(o => o.status === 'pending').length;
    const completedOrders = realOrders.filter(o => o.status === 'completed').length;

    // Format orders for the client component
    const formattedOrders = realOrders.map(order => {
        const summary = order.items.map(i => `${i.productName} (${i.quantity})`).join(', ');
        return {
            ...order,
            itemSummary: summary.length > 50 ? summary.substring(0, 50) + '...' : summary,
        };
    });

    return (
        <AdminDashboardClient
            initialOrders={formattedOrders}
            initialProducts={allProducts}
            initialCategories={allCategories}
            initialStoreSettings={currentSettings}
            stats={{
                todayOrders,
                todayRevenue: Math.round(todayRevenue),
                pendingOrders,
                completedOrders,
                totalProducts: allProducts.length
            }}
        />
    );
}
