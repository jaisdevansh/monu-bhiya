import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is missing!');
    throw new Error('DATABASE_URL is not defined in environment variables');
}

console.log('✅ DATABASE_URL found, initializing Neon connection...');
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
