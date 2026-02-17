'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { checkRateLimit } from '@/lib/ratelimit';
import { z } from 'zod';

const AdminLoginSchema = z.object({
    password: z.string().min(6),
});

export async function loginAdmin(prevState: any, formData: FormData) {
    const password = formData.get('password');
    const validated = AdminLoginSchema.safeParse({ password });

    if (!validated.success) {
        return { message: 'Invalid input' };
    }

    // Rate Limit Admin Login to prevent brute force
    // We use a fixed identifier for admin login attempts since there is only one admin (conceptually)
    // or use IP if possible. IP is best.
    // For now, key by "admin_login"
    const isAllowed = await checkRateLimit("admin_login");
    if (!isAllowed) {
        return { message: 'Too many attempts. Please try again later.' };
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        console.error('ADMIN_PASSWORD is not set in environment variables.');
        return { message: 'Server configuration error.' };
    }

    if (validated.data.password !== adminPassword) {
        return { message: 'Invalid password' };
    }

    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });

    redirect('/admin');
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    redirect('/admin/login');
}

export async function verifyAdmin() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session')?.value;
    return session === 'true';
}
