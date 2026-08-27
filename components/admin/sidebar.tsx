'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  CalendarRange,
  Images,
  Upload,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/collections', label: 'Collections', icon: CalendarRange },
  { href: '/admin/gallery', label: 'Gallery', icon: Images },
  { href: '/admin/gallery/upload', label: 'Upload Media', icon: Upload },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string
  label: string
  icon: React.ElementType
  active: boolean
  onClick?: () => void
}) {
  const router = useRouter()
  return (
    <button
      onClick={() => {
        router.push(href)
        onClick?.()
      }}
      className={`group flex w-full items-center gap-3 px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[.18em] transition-all ${
        active
          ? 'bg-gold text-brown'
          : 'text-beige/60 hover:bg-brown-light hover:text-cream'
      }`}
    >
      <Icon size={15} className={active ? 'text-brown' : 'text-gold/60 group-hover:text-gold'} />
      {label}
      {active && <ChevronRight size={12} className="ml-auto" />}
    </button>
  )
}

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="flex h-full flex-col border-r border-gold/15 bg-brown">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-gold/15 px-6 py-6">
        <div>
          <div className="font-display text-2xl tracking-[.18em] text-cream">
            SVV<span className="text-gold">.</span>
          </div>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[.2em] text-beige/40">
            Admin Portal
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-beige/50 hover:text-cream lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4" aria-label="Admin navigation">
        <p className="mb-2 px-4 font-mono text-[8px] uppercase tracking-[.25em] text-beige/30">
          Management
        </p>
        {navLinks.map((link) => (
          <NavLink
            key={link.href}
            {...link}
            active={isActive(link.href)}
            onClick={onClose}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gold/15 p-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 bg-brown-light font-display text-sm text-gold">
            A
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[.15em] text-cream">Admin</p>
            <p className="font-mono text-[8px] tracking-[.1em] text-beige/40">
              Sree Veera Vigneshwar
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 px-4 py-3 font-mono text-[10px] uppercase tracking-[.18em] text-beige/50 transition-colors hover:bg-brown-light hover:text-gold"
        >
          <LogOut size={14} className="group-hover:text-gold" />
          Logout
        </button>
      </div>
    </div>
  )
}

export function AdminMobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center border border-gold/30 bg-brown text-cream lg:hidden"
        aria-label="Open admin menu"
      >
        <Menu size={18} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-brown/60 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
            >
              <AdminSidebar onClose={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
