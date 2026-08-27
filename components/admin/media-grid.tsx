'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Film,
  ImageIcon,
  Star,
  Pencil,
  Eye,
  SlidersHorizontal,
  Trash2,
  CheckSquare,
  Square,
  Play,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { DeleteButtonWithConfirm } from './delete-confirm'
import type { GalleryItem } from '@/types'

export function MediaGrid() {
  const router = useRouter()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [years, setYears] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Selection & Bulk delete
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeletingBulk, setIsDeletingBulk] = useState(false)
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null)

  const [filters, setFilters] = useState({
    year: 'all',
    type: 'all',
    search: '',
    sort: 'newest',
  })

  const fetchItems = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.year !== 'all') params.set('year', filters.year)
      if (filters.type !== 'all') params.set('type', filters.type)
      params.set('sort', filters.sort)
      params.set('limit', '100')

      const res = await fetch(`/api/gallery?${params}`)
      const data = await res.json()
      if (data.success) {
        let filtered = data.data as GalleryItem[]
        if (filters.search) {
          const q = filters.search.toLowerCase()
          filtered = filtered.filter(
            (i) => i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
          )
        }
        setItems(filtered)
      }
    } catch {
      toast.error('Failed to load gallery items')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  useEffect(() => {
    fetch('/api/gallery/years')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setYears(d.data)
      })
  }, [])

  async function handleDelete(id: string) {
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (res.ok) {
      toast.success('Memory deleted successfully')
      setItems((prev) => prev.filter((i) => i._id !== id))
      setSelectedIds((prev) => prev.filter((i) => i !== id))
    } else {
      toast.error(data.message || 'Delete failed')
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(items.map((i) => i._id))
    }
  }

  const toggleSelectId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (
      !confirm(
        `Are you sure you want to delete ${selectedIds.length} media item(s)? They will be removed from Cloudinary and the database.`
      )
    )
      return

    setIsDeletingBulk(true)
    try {
      const res = await fetch('/api/gallery/batch-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success(`Deleted ${data.deletedCount} items from Cloudinary & Database!`)
        setItems((prev) => prev.filter((i) => !selectedIds.includes(i._id)))
        setSelectedIds([])
      } else {
        toast.error(data.message || 'Batch delete failed')
      }
    } catch {
      toast.error('Error carrying out bulk deletion')
    } finally {
      setIsDeletingBulk(false)
    }
  }

  return (
    <div>
      {/* Filters & Bulk controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-beige/40" />
            <input
              type="text"
              placeholder="Search memories…"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="w-full border border-gold/20 bg-brown-light py-2 pl-9 pr-4 font-mono text-[11px] text-cream placeholder-beige/30 focus:border-gold focus:outline-none"
            />
          </div>

          {/* Year filter */}
          <select
            value={filters.year}
            onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))}
            className="border border-gold/20 bg-brown-light px-4 py-2 font-mono text-[11px] text-cream focus:border-gold focus:outline-none"
          >
            <option value="all">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                Year {y}
              </option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={filters.type}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
            className="border border-gold/20 bg-brown-light px-4 py-2 font-mono text-[11px] text-cream focus:border-gold focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
            className="border border-gold/20 bg-brown-light px-4 py-2 font-mono text-[11px] text-cream focus:border-gold focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Selection / Bulk Actions */}
        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-1.5 border border-gold/20 bg-brown px-3 py-2 font-mono text-[10px] uppercase text-beige/80 hover:text-gold"
            >
              {selectedIds.length === items.length ? (
                <>
                  <CheckSquare size={14} className="text-gold" /> Deselect All
                </>
              ) : (
                <>
                  <Square size={14} /> Select All
                </>
              )}
            </button>

            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={isDeletingBulk}
                className="flex items-center gap-1.5 bg-red-600 px-4 py-2 font-mono text-[10px] uppercase text-cream hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 size={14} /> Delete Selected ({selectedIds.length})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="mb-5 font-mono text-[10px] uppercase tracking-[.18em] text-beige/40">
        {isLoading ? 'Loading…' : `${items.length} memories found`}
      </p>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse bg-brown-light" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-gold/15 bg-brown-light">
          <SlidersHorizontal size={40} className="text-gold/30" />
          <p className="mt-6 font-display text-2xl uppercase text-cream/50">No memories found</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[.18em] text-beige/30">
            Try adjusting your filters or upload new media
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, i) => {
            const isSelected = selectedIds.includes(item._id)

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`group relative border transition-colors bg-brown-light overflow-hidden ${
                  isSelected ? 'border-gold ring-1 ring-gold' : 'border-gold/15'
                }`}
              >
                {/* Selection Checkbox */}
                <div
                  onClick={() => toggleSelectId(item._id)}
                  className="absolute left-3 top-3 z-20 flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-gold/40 bg-brown/90 text-cream transition-transform group-hover:scale-105"
                >
                  {isSelected ? (
                    <CheckSquare size={16} className="text-gold" />
                  ) : (
                    <Square size={16} className="text-beige/40" />
                  )}
                </div>

                {/* Thumbnail */}
                <div className="relative aspect-[3/4] overflow-hidden bg-brown">
                  <img
                    src={item.thumbnailUrl || item.mediaUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Play icon overlay for videos */}
                  {item.mediaType === 'video' && (
                    <button
                      onClick={() => setPreviewVideoUrl(item.mediaUrl)}
                      className="absolute inset-0 flex items-center justify-center bg-brown/40 transition-colors group-hover:bg-brown/60"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/80 bg-brown/80 text-gold hover:scale-110 transition-transform">
                        <Play size={20} className="ml-0.5" fill="currentColor" />
                      </div>
                    </button>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-brown/80 opacity-0 transition-opacity group-hover:opacity-100">
                    {item.mediaType === 'video' ? (
                      <button
                        onClick={() => setPreviewVideoUrl(item.mediaUrl)}
                        className="flex h-9 w-9 items-center justify-center border border-cream/40 text-cream hover:border-gold hover:text-gold"
                        title="Play Video"
                      >
                        <Play size={14} fill="currentColor" />
                      </button>
                    ) : (
                      <button
                        onClick={() => window.open(item.mediaUrl, '_blank')}
                        className="flex h-9 w-9 items-center justify-center border border-cream/40 text-cream hover:border-gold hover:text-gold"
                        title="View Full Size"
                      >
                        <Eye size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => router.push(`/admin/gallery/${item._id}/edit`)}
                      className="flex h-9 w-9 items-center justify-center border border-cream/40 text-cream hover:border-gold hover:text-gold"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="absolute right-2 top-2 flex gap-1 z-10">
                    {item.mediaType === 'video' ? (
                      <span className="flex items-center gap-1 bg-brown/90 px-2 py-1 font-mono text-[8px] uppercase tracking-[.1em] text-gold border border-gold/30">
                        <Film size={9} /> Video
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-brown/90 px-2 py-1 font-mono text-[8px] uppercase tracking-[.1em] text-beige/70 border border-gold/20">
                        <ImageIcon size={9} /> Image
                      </span>
                    )}
                    {item.featured && (
                      <span className="flex items-center gap-1 bg-gold px-2 py-1 font-mono text-[8px] uppercase tracking-[.1em] text-brown font-bold">
                        <Star size={9} fill="currentColor" /> Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="truncate font-display text-sm uppercase text-cream">{item.title}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-mono text-[9px] tracking-[.12em] text-gold">
                      Year {item.year}
                    </span>
                    <span className="font-mono text-[9px] tracking-[.1em] text-beige/40">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex border-t border-gold/10">
                  <button
                    onClick={() => router.push(`/admin/gallery/${item._id}/edit`)}
                    className="flex-1 py-2 text-center font-mono text-[9px] uppercase tracking-[.15em] text-beige/50 transition-colors hover:bg-brown hover:text-gold"
                  >
                    Edit
                  </button>
                  <div className="w-px bg-gold/10" />
                  <div className="flex-1 py-2 text-center">
                    <DeleteButtonWithConfirm
                      itemTitle={item.title}
                      onDelete={() => handleDelete(item._id)}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Video Preview Lightbox Modal */}
      <AnimatePresence>
        {previewVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brown/95 backdrop-blur-md p-4"
            onClick={() => setPreviewVideoUrl(null)}
          >
            <div
              className="relative max-w-4xl w-full border border-gold/30 bg-brown p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center border border-gold/30 text-cream hover:text-gold"
              >
                <X size={18} />
              </button>
              <video src={previewVideoUrl} controls autoPlay className="w-full max-h-[80vh]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
