import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import ClientLayout from '@/components/layout/ClientLayout';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import './globals.css';
import { getStoreSettings } from '@/app/admin/actions';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Best Tea & Snacks Shop on NH-24 Ghaziabad | Fresh Chai',
  description: 'Looking for the best tea shop on NH-24 in Ghaziabad? Visit us for fresh kadak chai, samosa, snacks & quick highway refreshments. Easy parking & fast service.',
  keywords: [
    'best tea shop on NH-24 Ghaziabad',
    'chai near me Ghaziabad',
    'highway tea shop NH-24',
    'snacks near Delhi Meerut Expressway',
    'tea stall near NH-24',
    'road trip tea stop Ghaziabad',
    'breakfast stop NH-24',
    'samosa near Ghaziabad highway',
    'family tea stop on NH-24',
    'evening chai Ghaziabad'
  ],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://monuchai.com',
  },
  other: {
    'geo.region': 'IN-UP',
    'geo.placename': 'Ghaziabad',
    'geo.position': '28.6692;77.4538',
    'ICBM': '28.6692, 77.4538',
  },
  openGraph: {
    title: 'Best Tea & Snacks Shop on NH-24 Ghaziabad',
    description: 'Fresh chai, samosa & snacks on NH-24 Ghaziabad. Perfect highway tea stop.',
    type: 'website',
    url: 'https://monuchai.com',
    images: ['https://monuchai.com/tea-shop-nh24-ghaziabad.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Tea Shop on NH-24 Ghaziabad',
    description: 'Highway chai & snacks stop on Delhi Meerut Expressway.',
    images: ['https://monuchai.com/tea-shop-nh24-ghaziabad.jpg'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getStoreSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "name": settings?.storeName || "Monu Chai",
        "image": "https://monuchai.com/tea-shop-nh24-ghaziabad.jpg",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": settings?.address || "Exact Location on NH-24",
          "addressLocality": "Ghaziabad",
          "addressRegion": "Uttar Pradesh",
          "postalCode": "201001",
          "addressCountry": "IN"
        },
        "telephone": settings?.phone || "+918888888888",
        "openingHours": "Mo-Su 06:00-23:00",
        "priceRange": "₹",
        "servesCuisine": "Tea, Snacks",
        "areaServed": "Ghaziabad",
        "url": "https://monuchai.com"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Where is the best tea shop on NH-24 in Ghaziabad?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Monu Chai is located directly on NH-24 in Ghaziabad, serving fresh kadak chai and hot snacks daily for highway travelers and local residents."
            }
          },
          {
            "@type": "Question",
            "name": "Is there a tea stall open near Delhi Meerut Expressway?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our shop is conveniently located near the Delhi Meerut Expressway providing quick and fresh refreshments like tea and samosas."
            }
          },
          {
            "@type": "Question",
            "name": "Do you provide parking for highway travelers?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely! We offer easy and ample parking space right in front of the tea shop so you can comfortably stop, rest, and enjoy your meal."
            }
          },
          {
            "@type": "Question",
            "name": "Is your tea shop open late night on NH-24?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we are open until 11:00 PM (23:00) every day of the week to serve late-night cravings for tea and snacks to all highway drivers and families."
            }
          }
        ]
      }
    ]
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
              <ClientLayout settings={settings}>
                {children}
              </ClientLayout>
            </CartProvider>
          </ToastProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
