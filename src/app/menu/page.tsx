import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import MenuClient from './MenuClient';
import { Metadata } from 'next';
import { getStoreSettings } from '@/app/admin/actions';

export const metadata: Metadata = {
    title: 'Menu | Monu Chai',
    description: 'Explore our delicious menu.',
};

// Force dynamic because we are fetching from DB (or use revalidate)
export const dynamic = 'force-dynamic';

export default async function MenuPage() {
    // Parallel fetch for categories, products, and settings
    const [allCategories, allProducts, settings] = await Promise.all([
        db.select().from(categories),
        db.select({
            id: products.id,
            name: products.name,
            description: products.description,
            price: products.price,
            image: products.image,
            categoryId: products.categoryId,
            categorySlug: categories.slug,
        })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id)),
        getStoreSettings()
    ]);

    // Map result to cleaner objects if needed, but the join above gives us what we need
    const formattedProducts = allProducts.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        categorySlug: p.categorySlug || 'others',
    }));

    return (
        <MenuClient initialProducts={formattedProducts} categories={allCategories} settings={settings} />
    );
}
