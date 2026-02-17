import { db } from './src/db/index';
import { categories } from './src/db/schema';

async function test() {
    try {
        console.log('Testing DB connection...');
        const result = await db.select().from(categories).limit(1);
        console.log('Connection successful! Found categories:', result.length);
        process.exit(0);
    } catch (error) {
        console.error('DB Connection Failed:', error);
        process.exit(1);
    }
}

test();
