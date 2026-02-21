'use server';

import { db } from '@/db';
import { orders, products, categories, storeSettings } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import cloudinary from '@/lib/cloudinary';
import { ProductSchema, CategorySchema } from '@/lib/validators';
import { z } from 'zod';
import { verifyAdmin } from '@/app/actions/admin-auth';
import { getSession } from '@/app/actions/auth'; // User session

// File Upload Security Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// --- ADMIN ACTIONS (Protected) ---

export async function uploadImage(formData: FormData) {
    if (!(await verifyAdmin())) {
        throw new Error('Unauthorized');
    }

    const file = formData.get('file') as File;

    if (!file) {
        throw new Error('No file uploaded');
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size exceeds 5MB limit');
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<{ url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                folder: 'monu-chai-products',
            },
            (error, result) => {
                if (error || !result) {
                    console.error('Cloudinary Upload Error:', error);
                    reject(new Error('Image upload failed'));
                } else {
                    resolve({ url: result.secure_url });
                }
            }
        );
        uploadStream.end(buffer);
    });
}

export async function updateOrderStatus(orderId: number, newStatus: string) {
    if (!(await verifyAdmin())) {
        return { success: false, error: 'Unauthorized' };
    }

    const StatusEnum = z.enum(['pending', 'preparing', 'ready', 'completed', 'cancelled']);
    const statusValidation = StatusEnum.safeParse(newStatus);

    if (!statusValidation.success) {
        return { success: false, error: 'Invalid order status' };
    }

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

export async function addProduct(data: { name: string; description: string; price: string; image: string; categoryId: number }) {
    if (!(await verifyAdmin())) {
        return { success: false, error: 'Unauthorized' };
    }

    const validation = ProductSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid input data', details: validation.error.flatten() };
    }

    try {
        await db.insert(products).values({
            name: data.name,
            description: data.description,
            price: data.price,
            image: data.image,
            categoryId: data.categoryId,
            isPopular: false,
            isAvailable: true,
        });
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to add product:', error);
        return { success: false, error: 'Failed to add product' };
    }
}

export async function updateProduct(id: number, data: { name: string; description: string; price: string; image: string; categoryId: number }) {
    if (!(await verifyAdmin())) {
        return { success: false, error: 'Unauthorized' };
    }

    const validation = ProductSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid input data', details: validation.error.flatten() };
    }

    try {
        await db.update(products)
            .set({
                name: data.name,
                description: data.description,
                price: data.price,
                image: data.image,
                categoryId: data.categoryId,
            })
            .where(eq(products.id, id));
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to update product:', error);
        return { success: false, error: 'Failed to update product' };
    }
}

export async function deleteProduct(id: number) {
    if (!(await verifyAdmin())) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        await db.delete(products).where(eq(products.id, id));
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete product:', error);
        return { success: false, error: 'Failed to delete product' };
    }
}

export async function addCategory(name: string, slug: string) {
    if (!(await verifyAdmin())) {
        return { success: false, error: 'Unauthorized' };
    }

    const validation = CategorySchema.safeParse({ name, slug });
    if (!validation.success) {
        const flattened = validation.error.flatten();
        return { success: false, error: flattened.fieldErrors.name?.[0] || flattened.fieldErrors.slug?.[0] || 'Invalid input' };
    }

    try {
        const existing = await db.select().from(categories).where(eq(categories.slug, slug));
        if (existing.length > 0) {
            return { success: false, error: 'Category slug already exists' };
        }

        await db.insert(categories).values({
            name,
            slug,
        });
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to add category:', error);
        return { success: false, error: 'Failed to add category' };
    }
}

export async function deleteCategory(id: number) {
    if (!(await verifyAdmin())) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        await db.delete(categories).where(eq(categories.id, id));
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete category:', error);
        return { success: false, error: 'Failed to delete category' };
    }
}

export async function updateStoreSettings(data: any) {
    if (!(await verifyAdmin())) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const updateData = { ...data };
        delete updateData.id;
        delete updateData.createdAt;

        const existing = await db.select().from(storeSettings).limit(1);
        if (existing.length > 0) {
            await db.update(storeSettings)
                .set(updateData)
                .where(eq(storeSettings.id, existing[0].id));
        } else {
            await db.insert(storeSettings).values(updateData);
        }

        // @ts-ignore
        revalidatePath('/admin', 'page');
        // @ts-ignore
        revalidatePath('/', 'page'); // page is default but helps TS
        // @ts-ignore
        revalidateTag('store-settings-tag');
        return { success: true };
    } catch (error) {
        console.error('Failed to update store settings:', error);
        return { success: false, error: 'Failed to update settings' };
    }
}

// --- PUBLIC READ Actions ---

export async function getCategories() {
    try {
        return await db.select().from(categories).orderBy(desc(categories.createdAt));
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
    }
}

export async function getProducts() {
    try {
        return await db.select().from(products).orderBy(desc(products.createdAt));
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
}

const getStoreSettingsCached = unstable_cache(
    async () => {
        try {
            const settings = await db.select().from(storeSettings).limit(1);
            if (settings.length === 0) {
                const defaultSettings = await db.insert(storeSettings).values({
                    storeName: 'Monu Chai',
                    timings: {
                        monday: { open: '09:00', close: '22:00', isClosed: false },
                        tuesday: { open: '09:00', close: '22:00', isClosed: false },
                        wednesday: { open: '09:00', close: '22:00', isClosed: false },
                        thursday: { open: '09:00', close: '22:00', isClosed: false },
                        friday: { open: '09:00', close: '22:00', isClosed: false },
                        saturday: { open: '09:00', close: '23:00', isClosed: false },
                        sunday: { open: '09:00', close: '23:00', isClosed: false },
                    }
                }).returning();
                return defaultSettings[0];
            }
            return settings[0];
        } catch (error) {
            console.error('Failed to fetch store settings:', error);
            return null;
        }
    },
    ['store-settings-cache-key'],
    { tags: ['store-settings-tag'] }
);

export async function getStoreSettings() {
    return await getStoreSettingsCached();
}

// --- USER PROTECTED ACTIONS ---

export async function getUserOrders(phone: string) {
    // 1. Validate Input
    if (!/^\d{10,15}$/.test(phone)) {
        return [];
    }

    // 2. Auth Check: Ensure the session phone matches the requested phone
    const sessionPhone = await getSession();
    if (!sessionPhone || sessionPhone !== phone) {
        // Return empty or error. Returning empty is safer to avoid leaking existence.
        return [];
    }

    try {
        const userOrders = await db.query.orders.findMany({
            where: eq(orders.customerPhone, phone),
            with: {
                items: true,
            },
            orderBy: [desc(orders.createdAt)],
        });
        return userOrders;
    } catch (error) {
        // console.error('Failed to fetch user orders:', error);
        return [];
    }
}
