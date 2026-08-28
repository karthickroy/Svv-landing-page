'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Heart, Utensils, Sparkles, Copy, Check, QrCode, Eye } from 'lucide-react'

interface NoticeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NoticeModal({ isOpen, onClose }: NoticeModalProps) {
  const [copied, setCopied] = useState(false)
  const upiId = 'karthickviratism18-1@okhdfcbank'

  // Lock background page scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-brown/90 p-3 sm:p-6 backdrop-blur-md"
        role="presentation"
        onClick={onClose}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="notice-modal-title"
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl border border-gold/40 bg-brown text-cream shadow-2xl rounded-sm max-h-[85vh] sm:max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header Bar */}
          <div className="shrink-0 flex items-center justify-between border-b border-gold/20 bg-brown/95 px-5 py-4 backdrop-blur-md">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.25em] text-gold font-bold">
              <Sparkles size={14} className="animate-pulse" /> SVV 2026 Official Notice
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-brown-light/60 text-beige/70 transition-colors hover:border-gold hover:text-gold"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div
            className="flex-1 overflow-y-auto no-scrollbar overscroll-contain p-5 sm:p-8 space-y-6 sm:space-y-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Title & Banner */}
            <div>
              <p className="font-mono text-xs uppercase tracking-[.2em] text-gold font-semibold">
                Pernambut · 27th Year Celebration
              </p>
              <h2 id="notice-modal-title" className="mt-1 font-display text-3xl sm:text-4xl uppercase tracking-tight text-cream">
                Sri Vinayagar Chathurthi <br />
                <span className="text-gold">Grand Festival Notice 2026</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-beige/75">
                Organized by Sree Veera Vigneshwar Youth &amp; Devotees, Gangai Amman Temple, Pernambut.
              </p>
            </div>

            {/* FIRST SECTION: Official Invitation Notice Image */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[.2em] text-gold font-bold flex items-center gap-1.5">
                  <Calendar size={13} /> Official Festival Invitation Poster
                </span>
                <a
                  href="/svv-2026-notice.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] uppercase tracking-wider text-gold hover:underline flex items-center gap-1"
                >
                  <Eye size={12} /> View Full Image
                </a>
              </div>

              <div className="relative group overflow-hidden border-2 border-gold/30 bg-brown-light rounded-sm shadow-xl">
                <img
                  src="/svv-2026-notice.jpg"
                  alt="SVV 2026 Festival Notice Invitation Poster"
                  className="w-full h-auto object-contain max-h-[550px] transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>

            {/* SECOND SECTION: Event Highlights & Orphanage Food Service Content */}
            <div className="border border-gold/25 bg-brown-light/40 p-5 sm:p-6 space-y-6">
              <div>
                <h3 className="font-display text-2xl uppercase tracking-wide text-cream flex items-center gap-2">
                  <Sparkles size={18} className="text-gold" />
                  3-Day Festival Program &amp; Food Services
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-beige/80 leading-relaxed">
                  We are organizing a grand 3-day Vinayagar Chathurthi celebration filled with daily poojas, homam, cultural events, public Annadhanam (food service), and dedicated food donation for orphanage children.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {/* Day 1 */}
                <div className="flex flex-col justify-between border border-gold/20 bg-brown/80 p-4">
                  <div>
                    <div className="border-b border-gold/15 pb-2.5 mb-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs uppercase tracking-wider text-gold font-bold">
                          Day 1
                        </span>
                        <span className="rounded border border-gold/30 bg-gold/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gold font-semibold shrink-0">
                          Annadhanam
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-[10px] text-beige/60">
                        14.09.2026 · Monday
                      </p>
                    </div>

                    <h4 className="font-display text-lg uppercase text-cream">Grand Opening</h4>
                    <p className="mt-2 text-xs text-beige/75 leading-relaxed">
                      9.00 AM Mahaganapathi Homam &amp; Special Pooja. Public Annadhanam (food distribution) served for all devotees.
                    </p>
                  </div>
                </div>

                {/* Day 2 */}
                <div className="flex flex-col justify-between border border-gold/20 bg-brown/80 p-4">
                  <div>
                    <div className="border-b border-gold/15 pb-2.5 mb-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs uppercase tracking-wider text-gold font-bold">
                          Day 2
                        </span>
                        <span className="rounded border border-gold/30 bg-gold/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gold font-semibold shrink-0">
                          Orphanage Food
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-[10px] text-beige/60">
                        15.09.2026 · Tuesday
                      </p>
                    </div>

                    <h4 className="font-display text-lg uppercase text-cream">Thiruvillaku Pooja</h4>
                    <p className="mt-2 text-xs text-beige/75 leading-relaxed">
                      6.00 PM Special Pooja, Prasadam, and special Annadhanam &amp; food service for Orphanage Children.
                    </p>
                  </div>
                </div>

                {/* Day 3 */}
                <div className="flex flex-col justify-between border border-gold/20 bg-brown/80 p-4">
                  <div>
                    <div className="border-b border-gold/15 pb-2.5 mb-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs uppercase tracking-wider text-gold font-bold">
                          Day 3
                        </span>
                        <span className="rounded border border-gold/30 bg-gold/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gold font-semibold shrink-0">
                          Procession &amp; Food
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-[10px] text-beige/60">
                        16.09.2026 · Wednesday
                      </p>
                    </div>

                    <h4 className="font-display text-lg uppercase text-cream">Grand Immersion</h4>
                    <p className="mt-2 text-xs text-beige/75 leading-relaxed">
                      Special Pooja, Flower Garlands, Food Service for Orphanage Children &amp; Devotees, followed by Melathalam River Procession.
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Orphanage Food Highlight Box */}
              <div className="flex items-start gap-4 border border-gold/30 bg-gold/10 p-4 rounded-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-gold bg-gold/20 text-gold">
                  <Heart size={20} />
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
                    <Utensils size={13} /> Special Food Contribution for Orphanage Children
                  </h4>
                  <p className="mt-1 text-xs text-beige/85 leading-relaxed">
                    On Day 2 (15th Sept) and Day 3 (16th Sept), SVV Group is providing wholesome food and meal care for local orphanage children alongside general public Annadhanam.
                  </p>
                </div>
              </div>
            </div>

            {/* THIRD SECTION: UPI QR Code & Donation Support */}
            <div className="border border-gold/30 bg-brown-light p-5 sm:p-6 space-y-5 text-center">
              <div>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[.2em] text-gold font-bold">
                  <QrCode size={13} /> Support Devotional &amp; Food Services
                </span>
                <h3 className="mt-1 font-display text-2xl uppercase text-cream">
                  Scan QR Code to Contribute
                </h3>
                <p className="mt-1 text-xs text-beige/70 max-w-md mx-auto">
                  Your generous contributions help us organize food distribution (Annadhanam) and meals for orphanage children during the 3-day festival.
                </p>
              </div>

              {/* QR Image Display */}
              <div className="mx-auto max-w-[280px] border-2 border-gold/40 bg-white p-4 rounded-xl shadow-2xl">
                <img
                  src="/svv-2026-qr.png"
                  alt="UPI QR Code - Karthick T"
                  className="w-full h-auto object-contain rounded"
                />
              </div>

              {/* UPI ID & Details */}
              <div className="space-y-3 max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border border-gold/30 bg-brown p-3 font-mono text-xs">
                  <div className="text-left">
                    <span className="text-[9px] uppercase tracking-widest text-beige/50 block">UPI Account</span>
                    <span className="font-bold text-gold text-sm">Karthick T</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="flex items-center gap-1.5 border border-gold/40 bg-gold/15 px-3 py-1.5 text-[10px] uppercase tracking-wider text-gold hover:bg-gold hover:text-brown transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy UPI ID
                      </>
                    )}
                  </button>
                </div>

                <p className="font-mono text-[10px] tracking-wider text-beige/60">
                  UPI ID: <span className="text-gold font-semibold select-all">{upiId}</span>
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[.15em] text-beige/40">
                  Accepting Google Pay, PhonePe, Paytm, BHIM &amp; Banking UPI Apps
                </p>
              </div>
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="shrink-0 flex items-center justify-between border-t border-gold/20 bg-brown/95 px-5 py-4 backdrop-blur-md">
            <span className="font-mono text-[9px] uppercase tracking-widest text-beige/50">
              SVV 2026 Celebration · Pernambut
            </span>
            <button
              type="button"
              onClick={onClose}
              className="bg-gold px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-brown font-bold hover:bg-gold-dark transition-colors"
            >
              Close Notice
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
