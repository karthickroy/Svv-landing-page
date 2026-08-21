'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle } from 'lucide-react'

interface DeleteConfirmProps {
  itemTitle: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function DeleteConfirm({ itemTitle, onConfirm, onCancel, isLoading }: DeleteConfirmProps) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-brown/80 px-5 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md border border-gold/30 bg-cream p-8 text-brown shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-brown/40 hover:text-brown"
          aria-label="Cancel"
        >
          <X size={18} />
        </button>

        <div className="flex h-12 w-12 items-center justify-center border border-red-300 bg-red-50">
          <AlertTriangle size={22} className="text-red-500" />
        </div>

        <h2 className="mt-5 font-display text-2xl uppercase tracking-tight">Delete Memory</h2>
        <p className="mt-3 text-sm leading-relaxed text-brown/70">
          Are you sure you want to delete{' '}
          <span className="font-medium text-brown">"{itemTitle}"</span>? This will permanently
          remove the media from both the gallery and Cloudinary. This action cannot be undone.
        </p>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 border border-brown/20 px-4 py-3 font-mono text-[10px] uppercase tracking-[.18em] text-brown/70 transition-colors hover:border-brown hover:text-brown disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 px-4 py-3 font-mono text-[10px] uppercase tracking-[.18em] text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

interface DeleteButtonWithConfirmProps {
  itemTitle: string
  onDelete: () => Promise<void>
}

export function DeleteButtonWithConfirm({ itemTitle, onDelete }: DeleteButtonWithConfirmProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleConfirm() {
    setIsLoading(true)
    await onDelete()
    setIsLoading(false)
    setShowConfirm(false)
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="font-mono text-[9px] uppercase tracking-[.15em] text-red-400 transition-colors hover:text-red-300"
      >
        Delete
      </button>

      <AnimatePresence>
        {showConfirm && (
          <DeleteConfirm
            itemTitle={itemTitle}
            onConfirm={handleConfirm}
            onCancel={() => setShowConfirm(false)}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </>
  )
}
