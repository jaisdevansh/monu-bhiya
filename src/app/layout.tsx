import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartSheet from '@/components/cart/CartSheet';
import { CartProvider } from '@/context/CartContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Monu Chai & Food Court | Best Chai & Snacks',
  description: 'Order online from Monu Chai & Food Court. Fresh snacks, premium chai, and combos delivered fast.',
  keywords: 'Chai, Snacks, Food Court, Online Ordering, Fast Food',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          <CartSheet />
          <main style={{ minHeight: '100vh', paddingTop: '80px' }}>
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
