import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dynamic Form Builder',
  description:
    'Create custom forms by adding, removing, and reordering fields. Supports text, number, date, and dropdown fields',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
