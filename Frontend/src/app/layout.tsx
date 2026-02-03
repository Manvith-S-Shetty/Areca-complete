import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Areca - Plant Assistant for Farmers',
  description: 'Mobile-first plant and crop assistant. Capture photos, queue offline uploads, and review results.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#10b981" />
      </head>
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
