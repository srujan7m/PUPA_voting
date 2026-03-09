import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PUPA Innovation Expo',
  description: 'Scan. Explore. Vote for the best innovation.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#E8DCCB] text-[#3B2A25] min-h-screen antialiased`}>
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-[#D6C7B4] py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-[#6B5B55] text-sm">Powered by <span className="text-[#4A2C24] font-semibold">PUPA Innovation Expo</span></p>
          </div>
        </footer>
      </body>
    </html>
  )
}
