'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Invalid credentials')
        return
      }

      window.location.href = '/admin'
    } catch {
      setError('Unable to connect. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brown px-5">
      {/* Background pattern */}
      <div className="pattern pointer-events-none absolute inset-0 opacity-20" />
      <div className="hero-wash pointer-events-none absolute inset-0" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="border border-gold/25 bg-brown-light p-10">
          {/* Logo */}
          <div className="mb-10 text-center">
            <div className="font-display text-5xl tracking-[.18em] text-cream">
              SVV<span className="text-gold">.</span>
            </div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[.3em] text-beige/50">
              Sree Veera Vigneshwar
            </p>
            <div className="my-6 h-px bg-gold/20" />
            <p className="font-display text-2xl uppercase tracking-wide text-cream">
              Admin Portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 border border-red-500/30 bg-red-950/20 px-4 py-3"
              >
                <AlertCircle size={15} className="shrink-0 text-red-400" />
                <p className="font-mono text-[10px] uppercase tracking-[.15em] text-red-400">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-mono text-[10px] uppercase tracking-[.22em] text-beige/50"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="admin@svv.org"
                className="w-full border border-gold/25 bg-brown px-4 py-3 font-sans text-cream placeholder-beige/25 focus:border-gold focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block font-mono text-[10px] uppercase tracking-[.22em] text-beige/50"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••••••"
                  className="w-full border border-gold/25 bg-brown px-4 py-3 pr-12 font-sans text-cream placeholder-beige/25 focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-beige/40 hover:text-cream"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full bg-gold py-4 font-mono text-[11px] uppercase tracking-[.28em] text-brown transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center font-mono text-[9px] uppercase tracking-[.2em] text-beige/30">
            Protected · SVV Memory Archive
          </p>
        </div>
      </motion.div>
    </div>
  )
}
