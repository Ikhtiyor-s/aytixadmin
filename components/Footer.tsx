'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface FooterData {
  social_links: Array<{
    id: number
    platform: string
    link_url: string
    icon?: string
    is_active: boolean
  }>
  contacts: Array<{
    id: number
    contact_type: string
    value: string
    link_url?: string
    is_active: boolean
  }>
}

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null)

  useEffect(() => {
    // Fetch footer data from API
    fetch('http://127.0.0.1:8000/api/v1/footer/public')
      .then(res => res.json())
      .then(data => setFooterData(data))
      .catch(err => console.error('Error loading footer data:', err))
  }, [])

  // Get social link icon
  const getSocialIcon = (platform: string) => {
    const icons: Record<string, string> = {
      telegram: '📱',
      instagram: '📷',
      facebook: '👥',
      youtube: '▶️',
      tiktok: '🎵',
      linkedin: '💼',
      twitter: '🐦',
      whatsapp: '💬'
    }
    return icons[platform.toLowerCase()] || '🔗'
  }

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 min-h-[100px] py-6">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and Copyright */}
          <div className="flex items-center gap-4">
            <img
              src="/aytix_logo.png"
              alt="AyTix Logo"
              className="h-10 w-auto md:h-[72px] brightness-0 invert"
            />
            <p className="text-sm">© 2024 AyTix. Barcha huquqlar himoyalangan.</p>
          </div>

          {/* Social Links */}
          {footerData && footerData.social_links && footerData.social_links.length > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Ijtimoiy tarmoqlar:</span>
              <div className="flex items-center gap-3">
                {footerData.social_links
                  .filter(link => link.is_active)
                  .map(link => (
                    <a
                      key={link.id}
                      href={link.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-indigo-400 transition-colors text-xl"
                      title={link.platform}
                    >
                      {getSocialIcon(link.platform)}
                    </a>
                  ))}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link href="/marketplace" className="hover:text-indigo-400 transition-colors">
              Bosh sahifa
            </Link>
            {footerData && footerData.contacts && footerData.contacts.length > 0 && (
              footerData.contacts
                .filter(c => c.is_active && c.contact_type === 'telegram')
                .slice(0, 1)
                .map(contact => (
                  <a
                    key={contact.id}
                    href={contact.link_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Adminga murojaat
                  </a>
                ))
            )}
            <Link href="/contact" className="hover:text-indigo-400 transition-colors">
              Aloqa
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

