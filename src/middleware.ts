import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Custom Content-Security-Policy
    // Note: 'unsafe-inline' is needed for some libraries like Framer Motion or Next.js development features often require it.
    // We allow Cloudinary, Unsplash, and Avataaars images as per requests.
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; img-src 'self' https://res.cloudinary.com https://images.unsplash.com https://plus.unsplash.com https://avataaars.io data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    );

    return response;
}

export const config = {
    matcher: '/:path*',
};
