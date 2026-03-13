import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">
        {children}
      </main>
      <Footer />
    </>
  )
}
