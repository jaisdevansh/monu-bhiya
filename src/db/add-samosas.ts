
import { categories, products } from './schema';
import * as dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Load env vars for standalone execution
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing');
}

const sql = neon(process.env.DATABASE_URL);
const dbInstance = drizzle(sql);

async function main() {
    console.log('Adding Special Snacks...');

    // 1. Create "Special Snacks" Category
    const [specialSnacks] = await dbInstance.insert(categories).values({
        name: 'Special Snacks',
        slug: 'special-snacks',
        description: 'Quick bites & Value meals'
    }).returning({ id: categories.id });

    console.log('Category created:', specialSnacks.id);

    // 2. Add Samosa Products
    await dbInstance.insert(products).values([
        {
            name: 'Samosa + Chutney',
            description: 'Quick snack served with chutney (limited).',
            price: '10.00',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=500', // Samosa Image
            categoryId: specialSnacks.id,
            isAvailable: true,
            badgeText: 'Best with Chai ☕'
        },
        {
            name: 'Samosa + Sabzi + Chutney',
            description: 'Served with sabzi and chutney (limited).',
            price: '20.00',
            image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=500', // Plate Image
            categoryId: specialSnacks.id,
            isAvailable: true,
            badgeText: 'Value Meal 🌟'
        }
    ]);

    console.log('Special Snacks added successfully!');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
