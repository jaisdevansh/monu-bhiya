import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
    const sql = neon(process.env.DATABASE_URL!);
    try {
        console.log('Checking tables...');
        const result = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
        console.log('Tables found:', result.map(r => r.table_name));
    } catch (e) {
        console.error('Error checking tables:', e);
    }
}
check();
