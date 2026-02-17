import { db } from '@/db';
import { products, categories, storeSettings } from '@/db/schema';
import { desc } from 'drizzle-orm';
import UserDashboardClient from './UserClient';
import { getSession } from '../actions/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function UserDashboard() {
    const sessionPhone = await getSession();

    // Fetch products and categories for the "Menu" view
    const allProducts = await db.query.products.findMany({
        orderBy: [desc(products.createdAt)],
    });

    const allCategories = await db.query.categories.findMany({
        orderBy: [desc(categories.createdAt)],
    });

    const settingsResult = await db.select().from(storeSettings).limit(1);
    const storeStats = settingsResult[0] || {};

    return (
        <UserDashboardClient
            initialProducts={allProducts}
            initialCategories={allCategories}
            storeSettings={storeStats}
            initialSession={sessionPhone}
        />
    );
}
