'use client'

import { usePathname } from 'next/navigation'
import { AdminSidebar, AdminMobileNav } from '@/components/admin/sidebar'
import { Toaster } from 'sonner'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return (
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#351514',
              border: '1px solid rgba(201,162,39,0.3)',
              color: '#f5ebdd',
              fontFamily: 'var(--font-ibm-plex-mono)',
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            },
          }}
        />
        {children}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-brown text-cream">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#351514',
            border: '1px solid rgba(201,162,39,0.3)',
            color: '#f5ebdd',
            fontFamily: 'var(--font-ibm-plex-mono)',
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          },
        }}
      />

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <AdminSidebar />
      </div>

      {/* Mobile nav trigger */}
      <AdminMobileNav />

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
