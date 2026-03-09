import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

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
      <body className="min-h-screen antialiased" style={{ fontFamily: "'DM Sans', sans-serif", background: 'var(--cream)', color: 'var(--stone-800)' }}>
        <Navbar />
        <main>{children}</main>
        <footer className="py-8 mt-16" style={{ borderTop: '1px solid var(--stone-200)' }}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm" style={{ color: 'var(--stone-500)' }}>Powered by <span className="font-semibold" style={{ color: 'var(--stone-800)' }}>PUPA Innovation Expo</span></p>
          </div>
        </footer>
      </body>
    </html>
  )
}
