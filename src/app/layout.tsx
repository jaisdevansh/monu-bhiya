import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import ClientLayout from '@/components/layout/ClientLayout';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Highway Chai & Chinese Point Ghaziabad | Best Chai on NH24',
  description: 'Best chai, samosa and Chinese food shop in Ghaziabad highway NH24. Fresh snacks, premium chai, and combos delivered fast.',
  keywords: [
    'chai in Ghaziabad',
    'chai near NH24',
    'best samosa Ghaziabad',
    'Chinese food Ghaziabad highway',
    'tea stall near me',
    'highway chai',
    'food near nh24'
  ],
  openGraph: {
    title: 'Highway Chai & Chinese Point Ghaziabad',
    description: 'Best chai and snacks on NH24 Highway Ghaziabad.',
    images: [
      {
        url: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_1200/shop`,
        width: 1200,
        height: 630,
        alt: 'Highway Chai Shop Front',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Highway Chai & Chinese Point Ghaziabad',
    description: 'Best chai and snacks on NH24 Highway Ghaziabad.',
    images: [`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_1200/shop`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Highway Chai & Chinese Point Ghaziabad",
    "image": `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_1200/shop`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ghaziabad",
      "addressRegion": "UP",
      "addressCountry": "India",
      "streetAddress": "NH24 Highway"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "28.6692",
      "longitude": "77.4538"
    },
    "url": "https://monuchai.com",
    "telephone": "+919876543210",
    "servesCuisine": "Indian, Chinese, Street Food",
    "priceRange": "₹"
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <SmoothScrollProvider>
          <ToastProvider>
            <CartProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
            </CartProvider>
          </ToastProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
