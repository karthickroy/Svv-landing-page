'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { GalleryItem } from '@/types'

interface LightboxProps {
  items: GalleryItem[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function Lightbox({ items, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
  const current = items[currentIndex]

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  if (!current) return null

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col bg-brown/96 backdrop-blur-md"
        onClick={onClose}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-5" onClick={(e) => e.stopPropagation()}>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[.28em] text-gold">
              {currentIndex + 1} / {items.length}
            </p>
            <p className="mt-1 font-display text-xl uppercase text-cream">{current.title}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[.2em] text-beige/50">
              {current.year}
            </span>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center border border-gold/30 text-beige/70 hover:border-gold hover:text-cream"
              aria-label="Close lightbox"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Image */}
        <motion.div
          key={current._id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-1 items-center justify-center px-16"
          onClick={(e) => e.stopPropagation()}
        >
          {current.mediaType === 'video' ? (
            <video
              src={current.mediaUrl}
              controls
              autoPlay
              className="max-h-full max-w-full object-contain"
              style={{ maxHeight: 'calc(100vh - 200px)' }}
            />
          ) : (
            <img
              src={current.mediaUrl}
              alt={current.title}
              className="max-h-full max-w-full object-contain"
              style={{ maxHeight: 'calc(100vh - 200px)' }}
            />
          )}
        </motion.div>

        {/* Prev/Next */}
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center border border-gold/30 text-cream hover:border-gold hover:text-gold disabled:opacity-30"
          disabled={items.length <= 1}
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center border border-gold/30 text-cream hover:border-gold hover:text-gold disabled:opacity-30"
          disabled={items.length <= 1}
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>

        {/* Bottom info */}
        {(current.description || current.category) && (
          <div className="border-t border-gold/15 px-6 py-5" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto max-w-2xl">
              {current.description && (
                <p className="text-sm leading-relaxed text-beige/70">{current.description}</p>
              )}
              <div className="mt-3 flex gap-6">
                {current.category && (
                  <span className="font-mono text-[9px] uppercase tracking-[.2em] text-gold/60">
                    {current.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
