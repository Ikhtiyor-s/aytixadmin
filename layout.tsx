import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'A full-stack marketplace application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
