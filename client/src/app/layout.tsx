import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import NetworkHelper from '@/components/NetworkHelper'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GlobalBackground from '@/components/GlobalBackground'
import SmoothScroll from '@/components/SmoothScroll'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  appleWebApp: {
    title: 'SecureChain',
    statusBarStyle: 'default',
    capable: true,
  },
  title: {
    default: 'SecureChain | Distributed Provenance Network',
    template: '%s | SecureChain'
  },
  description: 'Industrial-grade blockchain infrastructure for seamless supply chain provenance, real-time asset tracking, and cryptographic verification.',
  keywords: ['blockchain', 'supply chain', 'provenance', 'logistics', 'smart contracts', 'web3', 'asset tracking', 'enterprise blockchain'],
  authors: [{ name: 'SecureChain Network' }],
  creator: 'SecureChain Network',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://securechain.network',
    siteName: 'SecureChain Distributed Ledger',
    title: 'SecureChain | Immutable Supply Chain Integrity',
    description: 'Transform your supply chain with cryptographic certainty. Track, verify, and authenticate industrial assets on a decentralized protocol.',
    images: [
      {
        url: 'https://securechain.network/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SecureChain Network Interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SecureChain | Next-Gen Supply Chain Protocol',
    description: 'Cryptographically verify your product journey from raw material to retail.',
    images: ['https://securechain.network/twitter-card.jpg'],
    creator: '@securechain',
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
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${manrope.variable}`}>
      <body className="font-manrope antialiased text-slate-900 bg-slate-50 relative">
        <SmoothScroll>
          <GlobalBackground />
          <NetworkHelper />
          <Navbar />
          <main className="min-h-screen relative z-0">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}


