'use server';

import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(orderId: number, newStatus: string) {
    try {
        await db.update(orders)
            .set({ status: newStatus })
            .where(eq(orders.id, orderId));

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to update order status:', error);
        return { success: false, error: 'Failed to update status' };
    }
}
