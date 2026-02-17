'use server';

import { cookies } from 'next/headers';
import { LoginSchema } from '@/lib/validators';
import { redirect } from 'next/navigation';
import { checkRateLimit } from '@/lib/ratelimit';

export async function loginUser(prevState: any, formData: FormData) {
    const phone = formData.get('phone');
    const validated = LoginSchema.safeParse({ phone });

    if (!validated.success) {
        return { message: 'Invalid phone number format', errors: validated.error.flatten().fieldErrors };
    }

    const { phone: validPhone } = validated.data;

    // Rate Limiting
    // Use IP address or phone number as identifier
    const cookieStore = await cookies();
    // In server actions, we don't have direct access to IP easily without headers trickery, 
    // but we can use the phone number to limit brute force on a specific account
    // OR we can rate limit broadly. Let's limit by phone number to prevent spam login attempts for one user.
    // Ideally we limit by IP to prevent one attacker targeting many accounts, but IP is hard to get reliably in Server Actions without middleware passing it.
    // For now, let's limit by phone number. 

    const isAllowed = await checkRateLimit(validPhone);
    if (!isAllowed) {
        return { message: 'Too many login attempts. Please try again later.' };
    }

    // Set secure, HTTP-only cookie
    // In production, secure: true is mandatory
    cookieStore.set('session_phone', validPhone, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
    });

    redirect('/user');
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete('session_phone');
    redirect('/');
}

export async function getSession() {
    const cookieStore = await cookies();
    const phone = cookieStore.get('session_phone')?.value;
    return phone || null;
}
