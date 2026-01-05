import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel - AyTiX',
  description: 'AyTiX Admin Panel',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
