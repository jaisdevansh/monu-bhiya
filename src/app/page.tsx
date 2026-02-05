import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import HomeClient from './HomeClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Monu Chai & Food Court | Authentic Taste',
  description: 'Fresh Chai, crispy Samosas, and delicious snacks served hot. Order online now.',
};

// Force dynamic because we are fetching from DB
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Parallel fetch for categories and products
  const [allCategories, allProducts] = await Promise.all([
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
      .leftJoin(categories, eq(products.categoryId, categories.id))
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
    <HomeClient products={formattedProducts} categories={allCategories} />
  );
}
