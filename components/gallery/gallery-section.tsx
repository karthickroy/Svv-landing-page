'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Play, ImageIcon, Film } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { Lightbox } from './lightbox'
import type { GalleryItem } from '@/types'

// ─── Reveal animation wrapper (same as original svv-landing.tsx) ────────────
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const visible = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ─── Skeleton loader ─────────────────────────────────────────────────────────
function GallerySkeleton() {
  return (
    <div className="mt-16 columns-1 gap-5 sm:columns-2 lg:columns-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={`mb-5 break-inside-avoid animate-pulse bg-brown-light ${
            i % 3 === 0 ? 'aspect-[3/4]' : i % 3 === 1 ? 'aspect-[4/5]' : 'aspect-[2/3]'
          }`}
        />
      ))}
    </div>
  )
}

// ─── Year filter tab ─────────────────────────────────────────────────────────
function YearTab({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`relative font-mono text-[10px] uppercase tracking-[.2em] transition-colors ${
        active ? 'text-gold' : 'text-beige/50 hover:text-cream'
      }`}
    >
      {label}
      {active && (
        <motion.span
          layoutId="gallery-year-indicator"
          className="absolute -bottom-2 left-0 h-px w-full bg-gold"
        />
      )}
    </button>
  )
}

// ─── Main Gallery Section ─────────────────────────────────────────────────────
export function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [years, setYears] = useState<number[]>([])
  const [activeYear, setActiveYear] = useState<'all' | number>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Fetch available years
  useEffect(() => {
    fetch('/api/gallery/years')
      .then((r) => r.json())
      .then((d) => { if (d.success) setYears(d.data) })
      .catch(() => {})
  }, [])

  // Fetch gallery items when year filter changes
  useEffect(() => {
    setIsLoading(true)
    setError(false)
    const params = new URLSearchParams()
    if (activeYear !== 'all') params.set('year', String(activeYear))
    params.set('limit', '50')

    fetch(`/api/gallery?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setItems(d.data)
        else setError(true)
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false))
  }, [activeYear])

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const goPrev = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + items.length) % items.length : null)), [items.length])
  const goNext = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % items.length : null)), [items.length])

  return (
    <section id="gallery" className="section-shell bg-brown text-cream">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-gold">Gallery</p>
              <h2 className="mt-5 font-display text-5xl uppercase leading-[.92] lg:text-7xl">
                Our beautiful
                <br />
                memories
              </h2>
            </div>
            <p className="max-w-sm leading-relaxed text-beige/65">
              A collection of moments that have become memories and memories that continue to
              inspire us.
            </p>
          </div>
        </Reveal>

        {/* Year filter tabs */}
        {years.length > 0 && (
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap items-center gap-6 border-b border-gold/15 pb-5">
              <YearTab
                label="All"
                active={activeYear === 'all'}
                onClick={() => setActiveYear('all')}
              />
              {years.map((y) => (
                <YearTab
                  key={y}
                  label={String(y)}
                  active={activeYear === y}
                  onClick={() => setActiveYear(y)}
                />
              ))}
            </div>
          </Reveal>
        )}

        {/* Gallery grid */}
        {isLoading ? (
          <GallerySkeleton />
        ) : error ? (
          <div className="mt-16 flex flex-col items-center justify-center py-20 text-center">
            <p className="font-display text-2xl uppercase text-cream/50">
              Unable to load memories
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[.2em] text-beige/35">
              Please try again later
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center py-20 text-center">
            <ImageIcon size={40} className="text-gold/30" />
            <p className="mt-6 font-display text-2xl uppercase text-cream/50">
              No memories found
              {activeYear !== 'all' ? ` for ${activeYear}` : ''}
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[.2em] text-beige/35">
              {activeYear !== 'all'
                ? 'Try selecting a different year'
                : 'Check back soon for updates'}
            </p>
          </div>
        ) : (
          <div className="mt-16 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {items.map((item, i) => (
              <Reveal key={item._id} delay={(i % 3) * 0.08} className="mb-5 break-inside-avoid">
                <figure
                  className="group relative cursor-pointer overflow-hidden"
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={item.thumbnailUrl || item.mediaUrl}
                    alt={item.title}
                    loading="lazy"
                    className={`w-full object-cover grayscale-[15%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0 ${
                      i % 3 === 0
                        ? 'aspect-[3/4]'
                        : i % 3 === 1
                        ? 'aspect-[4/5]'
                        : 'aspect-[2/3]'
                    }`}
                  />

                  {/* Video play icon */}
                  {item.mediaType === 'video' && (
                    <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center bg-brown/80">
                      <Play size={14} className="text-gold" fill="currentColor" />
                    </div>
                  )}

                  {/* Hover caption */}
                  <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-brown/90 to-transparent px-5 pb-5 pt-16 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="font-mono text-[10px] tracking-[.2em] text-gold">
                      {item.year}
                    </span>
                    <p className="mt-1 font-display text-xl uppercase">{item.title}</p>
                    {item.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-beige/70">{item.description}</p>
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={items}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
