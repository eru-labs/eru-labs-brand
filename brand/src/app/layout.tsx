// File: src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { DataProvider } from '@/components/providers/data-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Eru Labs - AI Research Lab',
  description: 'Advancing AI through open research. Specializing in multi-agent systems, emergent behaviors, and production-informed AI research.',
  keywords: ['AI research', 'multi-agent systems', 'machine learning', 'open source', 'artificial intelligence'],
  authors: [{ name: 'Eru Labs' }],
  openGraph: {
    title: 'Eru Labs - AI Research Lab',
    description: 'Advancing AI through open research',
    url: 'https://erulabs.ai',
    siteName: 'Eru Labs',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eru Labs - AI Research Lab',
    description: 'Advancing AI through open research',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen flex flex-col`}>
        <DataProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </DataProvider>
      </body>
    </html>
  );
}