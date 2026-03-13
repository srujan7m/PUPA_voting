import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'PUPA Makers Movement',
  description: 'Scan. Explore. Vote for the best innovation.',
  icons: {
    icon: '/simha-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased" style={{ fontFamily: "'DM Sans', sans-serif", background: 'var(--cream)', color: 'var(--stone-800)' }}>
        <Navbar />
        <main>{children}</main>
        <footer className="py-8 mt-16" style={{ borderTop: '1px solid var(--stone-200)' }}>
          <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center gap-3">
            <Image src="/simha-logo.png" alt="OurSimha" width={64} height={64} style={{ objectFit: 'contain' }} />
            <p className="text-sm" style={{ color: 'var(--stone-500)' }}>Powered by <span className="font-semibold" style={{ color: 'var(--stone-800)' }}>PUPA Makers Movement</span></p>
          </div>
        </footer>
      </body>
    </html>
  )
}
