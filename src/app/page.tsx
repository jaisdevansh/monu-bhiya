import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import HomeClient from './HomeClient';
import { Metadata } from 'next';
import { getStoreSettings } from '@/app/admin/actions';

export const metadata: Metadata = {
  title: 'Monu Chai & Food Court | Authentic Taste',
  description: 'Fresh Chai, crispy Samosas, and delicious snacks served hot. Order online now.',
};

// ISR Cache: Revalidate every 60 seconds to ensure fresh data without compromising TTFB
export const revalidate = 60;

export default async function Home() {
  try {
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
        isPopular: products.isPopular,
        isAvailable: products.isAvailable,
      })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id)),
      getStoreSettings()
    ]);

    // Format products
    const formattedProducts = allProducts.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      categorySlug: p.categorySlug || 'others',
      isPopular: p.isPopular,
      isAvailable: p.isAvailable,
    }));

    return (
      <HomeClient products={formattedProducts} categories={allCategories} settings={settings} />
    );
  } catch (error: any) {
    console.error('Home Page Data Fetch Error:', error);

    // Return a fallback UI if DB fails, so the site doesn't crash completely
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center', background: '#000', color: '#fff' }}>
        <h2 style={{ color: '#F2B705' }}>Chai is brewing... ☕</h2>
        <p>Database se connect karne me dikkat ho rahi hai. Please check DATABASE_URL in Vercel Settings.</p>
        <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Error: {error.message || 'Unknown Error'}</p>
      </div>
    );
  }
}
