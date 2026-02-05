import { NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems } from '@/db/schema';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, address, items, total } = body;

        // Validation
        if (!name || !email || !phone || !items || items.length === 0) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Create Order
        const [newOrder] = await db.insert(orders).values({
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            customerAddress: address,
            totalAmount: total.toString(),
            status: 'pending',
        }).returning();

        // 2. Create Order Items
        const itemsToInsert = items.map((item: any) => ({
            orderId: newOrder.id,
            productId: Number(item.id), // Ensure ID is number if using serial
            productName: item.name,
            price: item.price.toString(),
            quantity: item.quantity,
        }));

        await db.insert(orderItems).values(itemsToInsert);

        return NextResponse.json({ success: true, orderId: newOrder.id });

    } catch (error) {
        console.error('Order creation failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
