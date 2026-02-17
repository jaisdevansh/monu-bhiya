'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import CartSheet from '../cart/CartSheet';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <CartSheet />
            <main style={{ minHeight: '100vh', paddingTop: '80px' }}>
                {children}
            </main>
            <Footer />
        </>
    );
}
