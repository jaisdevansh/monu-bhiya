import { db } from '@/db';
import { orders } from '@/db/schema';
import AdminDashboardClient from './AdminDashboardClient';
import { desc } from 'drizzle-orm';

// Prevent caching to ensure live data
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    // Fetch real orders from database using relations
    const realOrders = await db.query.orders.findMany({
        with: {
            items: true,
        },
        orderBy: [desc(orders.createdAt)],
        limit: 50,
    });

    // Calculate Statistics
    const totalOrders = realOrders.length;
    const pendingCount = realOrders.filter(o => o.status === 'pending').length;
    // Sum total amount (ensure to handle potential string/decimal parsing)
    const revenue = realOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

    // Format orders for the client component
    const formattedOrders = realOrders.map(order => {
        // Summarize items for the list
        const summary = order.items.map(i => `${i.productName} (${i.quantity})`).join(', ');

        return {
            id: order.id,
            customerName: order.customerName,
            totalAmount: order.totalAmount,
            status: order.status,
            itemSummary: summary.length > 50 ? summary.substring(0, 50) + '...' : summary,
            createdAt: order.createdAt,
        };
    });

    return (
        <AdminDashboardClient
            initialOrders={formattedOrders}
            stats={{
                totalOrders,
                pendingCount,
                revenue: Math.round(revenue) // Round for display
            }}
        />
    );
}
