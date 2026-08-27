'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarRange,
  Plus,
  Images,
  Film,
  FolderOpen,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Upload,
} from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/admin/page-header'
import type { YearCollection } from '@/types'

export default function CollectionsPage() {
  const router = useRouter()
  const [collections, setCollections] = useState<YearCollection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingYear, setEditingYear] = useState<YearCollection | null>(null)
  const [deletingYear, setDeletingYear] = useState<YearCollection | null>(null)

  // Add/Edit Form State
  const [formYear, setFormYear] = useState(String(new Date().getFullYear()))
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchCollections = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/years')
      const data = await res.json()
      if (data.success) {
        setCollections(data.data)
      } else {
        toast.error('Failed to load collections')
      }
    } catch {
      toast.error('Unable to fetch year collections')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  // Handle Add Year
  const handleAddYear = async (e: React.FormEvent) => {
    e.preventDefault()
    const yearNum = parseInt(formYear)
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
      toast.error('Please enter a valid year')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/years', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: yearNum,
          title: formTitle.trim() || `Celebration ${yearNum}`,
          description: formDescription.trim(),
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast.success(`Year collection ${yearNum} created! 🪔`)
        setShowAddModal(false)
        setFormTitle('')
        setFormDescription('')
        fetchCollections()
      } else {
        toast.error(data.message || 'Failed to create collection')
      }
    } catch {
      toast.error('Error creating year collection')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Edit Year
  const handleEditYear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingYear) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/years/${editingYear.year}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle.trim(),
          description: formDescription.trim(),
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast.success(`Year ${editingYear.year} details updated!`)
        setEditingYear(null)
        fetchCollections()
      } else {
        toast.error(data.message || 'Failed to update details')
      }
    } catch {
      toast.error('Error updating collection')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Delete Year
  const handleDeleteYear = async () => {
    if (!deletingYear) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/years/${deletingYear.year}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast.success(`Year collection ${deletingYear.year} deleted!`)
        setDeletingYear(null)
        fetchCollections()
      } else {
        toast.error(data.message || 'Failed to delete collection')
      }
    } catch {
      toast.error('Error deleting collection')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Year Collections"
        description="Organize and manage year-wise digital image & video archives."
        action={
          <div className="flex gap-3">
            <button
              onClick={() => {
                setFormYear(String(new Date().getFullYear()))
                setFormTitle('')
                setFormDescription('')
                setShowAddModal(true)
              }}
              className="flex items-center gap-2 bg-gold px-5 py-3 font-mono text-[10px] uppercase tracking-[.2em] text-brown hover:bg-gold-dark"
            >
              <Plus size={14} />
              Add New Year
            </button>
            <Link
              href="/admin/gallery/upload"
              className="flex items-center gap-2 border border-gold/30 px-5 py-3 font-mono text-[10px] uppercase tracking-[.2em] text-gold hover:bg-brown-light"
            >
              <Upload size={14} />
              Upload Media
            </Link>
          </div>
        }
      />

      <div className="px-6 py-8 lg:px-10">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse bg-brown-light" />
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-gold/15 bg-brown-light text-center">
            <CalendarRange size={44} className="text-gold/30" />
            <p className="mt-5 font-display text-2xl uppercase text-cream/50">
              No Collections Found
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[.18em] text-beige/35">
              Create your first year collection to start grouping memories
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-6 inline-flex items-center gap-2 bg-gold px-6 py-3 font-mono text-[10px] uppercase tracking-[.2em] text-brown hover:bg-gold-dark"
            >
              <Plus size={14} />
              Add New Year Collection
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {collections.map((col) => (
              <div
                key={col.year}
                className="group relative flex flex-col justify-between border border-gold/20 bg-brown-light overflow-hidden transition-colors hover:border-gold/50"
              >
                {/* Cover Header */}
                <div className="relative h-44 overflow-hidden bg-brown">
                  {col.coverImageUrl ? (
                    <img
                      src={col.coverImageUrl}
                      alt={`Year ${col.year}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-brown-light">
                      <FolderOpen size={40} className="text-gold/25" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-brown via-brown/40 to-transparent" />

                  {/* Year Tag */}
                  <div className="absolute left-4 bottom-4">
                    <span className="font-display text-4xl uppercase text-cream">
                      {col.year}
                    </span>
                    <p className="font-mono text-[10px] uppercase tracking-[.15em] text-gold truncate max-w-[200px]">
                      {col.title || `Celebration ${col.year}`}
                    </p>
                  </div>

                  {/* Quick Edit/Delete Header Buttons */}
                  <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => {
                        setEditingYear(col)
                        setFormTitle(col.title || '')
                        setFormDescription(col.description || '')
                      }}
                      className="flex h-8 w-8 items-center justify-center border border-gold/40 bg-brown/80 text-cream hover:text-gold"
                      title="Edit Collection"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => setDeletingYear(col)}
                      className="flex h-8 w-8 items-center justify-center border border-gold/40 bg-brown/80 text-cream hover:text-red-400"
                      title="Delete Collection"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Content Stats */}
                <div className="p-4 space-y-3">
                  {col.description && (
                    <p className="line-clamp-2 text-xs text-beige/60">{col.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-2 border-t border-gold/10 pt-3">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-beige/70">
                      <Images size={13} className="text-gold" />
                      <span>{col.imageCount || 0} Images</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-beige/70">
                      <Film size={13} className="text-gold" />
                      <span>{col.videoCount || 0} Videos</span>
                    </div>
                  </div>
                </div>

                {/* Action Link */}
                <div className="border-t border-gold/15 bg-brown/40">
                  <Link
                    href={`/admin/collections/${col.year}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 font-mono text-[10px] uppercase tracking-[.2em] text-gold hover:bg-gold hover:text-brown transition-colors"
                  >
                    Manage Year {col.year} Collection →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Year Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brown/80 backdrop-blur-sm p-4"
          >
            <div className="w-full max-w-md border border-gold/30 bg-brown p-6 relative">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute right-4 top-4 text-beige/50 hover:text-cream"
              >
                <X size={18} />
              </button>

              <h3 className="font-display text-2xl uppercase text-cream">Add New Year Collection</h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[.15em] text-gold/70">
                Create a dynamic container for images & videos
              </p>

              <form onSubmit={handleAddYear} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase tracking-[.18em] text-beige/60">
                    Year Number *
                  </label>
                  <input
                    type="number"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    min={1900}
                    max={2100}
                    required
                    className="w-full border border-gold/30 bg-brown-light px-4 py-2.5 font-mono text-sm text-cream focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase tracking-[.18em] text-beige/60">
                    Collection Title
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder={`Celebration ${formYear}`}
                    className="w-full border border-gold/30 bg-brown-light px-4 py-2.5 font-sans text-sm text-cream placeholder-beige/30 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase tracking-[.18em] text-beige/60">
                    Description
                  </label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Memory highlights for this year…"
                    rows={3}
                    className="w-full border border-gold/30 bg-brown-light px-4 py-2.5 font-sans text-sm text-cream placeholder-beige/30 focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 border border-gold/30 py-3 font-mono text-[10px] uppercase tracking-[.18em] text-beige hover:bg-brown-light"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gold py-3 font-mono text-[10px] uppercase tracking-[.18em] text-brown hover:bg-gold-dark disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating…' : 'Create Year'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Edit Year Modal */}
        {editingYear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brown/80 backdrop-blur-sm p-4"
          >
            <div className="w-full max-w-md border border-gold/30 bg-brown p-6 relative">
              <button
                onClick={() => setEditingYear(null)}
                className="absolute right-4 top-4 text-beige/50 hover:text-cream"
              >
                <X size={18} />
              </button>

              <h3 className="font-display text-2xl uppercase text-cream">
                Edit Year {editingYear.year} Collection
              </h3>

              <form onSubmit={handleEditYear} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase tracking-[.18em] text-beige/60">
                    Collection Title
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                    className="w-full border border-gold/30 bg-brown-light px-4 py-2.5 font-sans text-sm text-cream focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase tracking-[.18em] text-beige/60">
                    Description
                  </label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={3}
                    className="w-full border border-gold/30 bg-brown-light px-4 py-2.5 font-sans text-sm text-cream focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingYear(null)}
                    className="flex-1 border border-gold/30 py-3 font-mono text-[10px] uppercase tracking-[.18em] text-beige hover:bg-brown-light"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gold py-3 font-mono text-[10px] uppercase tracking-[.18em] text-brown hover:bg-gold-dark disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingYear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brown/80 backdrop-blur-sm p-4"
          >
            <div className="w-full max-w-md border border-red-500/40 bg-brown p-6 text-center relative">
              <AlertTriangle size={36} className="mx-auto text-red-400" />
              <h3 className="mt-3 font-display text-2xl uppercase text-cream">
                Delete Year {deletingYear.year}?
              </h3>
              <p className="mt-2 text-xs text-beige/70">
                This will delete Year {deletingYear.year} and remove all associated media files from
                Cloudinary and the database. This action cannot be undone.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingYear(null)}
                  className="flex-1 border border-gold/30 py-3 font-mono text-[10px] uppercase tracking-[.18em] text-beige hover:bg-brown-light"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteYear}
                  disabled={isSubmitting}
                  className="flex-1 bg-red-600 py-3 font-mono text-[10px] uppercase tracking-[.18em] text-cream hover:bg-red-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Deleting…' : 'Delete All Media'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
