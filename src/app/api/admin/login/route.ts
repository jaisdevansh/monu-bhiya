import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { password } = await req.json();

        const adminSecret = process.env.ADMIN_SECRET_KEY;

        if (password === adminSecret) {
            // Success! Set cookie
            const response = NextResponse.json({ success: true });
            (await cookies()).set('admin_auth', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });
            return response;
        } else {
            return NextResponse.json({ success: false, error: 'Invalid Password' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
