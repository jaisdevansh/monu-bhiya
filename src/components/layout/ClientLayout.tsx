'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import CartSheet from '../cart/CartSheet';

export default function ClientLayout({ children, settings }: { children: React.ReactNode, settings: any }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar settings={settings} />
            <CartSheet />
            <main style={{ minHeight: '100vh', paddingTop: '80px' }}>
                {children}
            </main>
            <Footer settings={settings} />
        </>
    );
}
