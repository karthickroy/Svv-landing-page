'use client'

import { useState, useEffect, useCallback, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Images,
  Film,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  Play,
  Pencil,
  X,
  Eye,
  Star,
  SlidersHorizontal,
  Upload,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/admin/page-header'
import { MultiUploadForm } from '@/components/admin/multi-upload-form'
import { EditForm } from '@/components/admin/edit-form'
import type { GalleryItem, YearCollection } from '@/types'

export default function YearCollectionDetailPage({
  params,
}: {
  params: Promise<{ year: string }>
}) {
  const { year: yearParam } = use(params)
  const yearNum = parseInt(yearParam)

  const router = useRouter()

  const [collection, setCollection] = useState<{
    year: number
    title: string
    description: string
    imageCount: number
    videoCount: number
    totalCount: number
    images: GalleryItem[]
    videos: GalleryItem[]
    items: GalleryItem[]
  } | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'images' | 'videos' | 'add'>('images')

  // Selection & Bulk delete state
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeletingBulk, setIsDeletingBulk] = useState(false)

  // Single Item preview/edit modal
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null)

  const fetchCollection = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/years/${yearParam}`)
      const data = await res.json()
      if (data.success) {
        setCollection(data.data)
      } else {
        toast.error('Failed to load collection details')
      }
    } catch {
      toast.error('Unable to fetch year collection detail')
    } finally {
      setIsLoading(false)
    }
  }, [yearParam])

  useEffect(() => {
    fetchCollection()
  }, [fetchCollection])

  const itemsToDisplay =
    activeTab === 'images'
      ? collection?.images || []
      : activeTab === 'videos'
      ? collection?.videos || []
      : []

  // Checkbox toggle helpers
  const toggleSelectAll = () => {
    if (selectedIds.length === itemsToDisplay.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(itemsToDisplay.map((i) => i._id))
    }
  }

  const toggleSelectId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  // Handle single deletion
  const handleDeleteSingle = async (item: GalleryItem) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return

    try {
      const res = await fetch(`/api/gallery/${item._id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success('Media deleted from Cloudinary & Database')
        setSelectedIds((prev) => prev.filter((id) => id !== item._id))
        fetchCollection()
      } else {
        toast.error(data.message || 'Delete failed')
      }
    } catch {
      toast.error('Delete request failed')
    }
  }

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (
      !confirm(
        `Are you sure you want to delete ${selectedIds.length} selected media item(s)? They will be removed from Cloudinary and the database.`
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
        toast.success(`Deleted ${data.deletedCount} media items!`)
        setSelectedIds([])
        fetchCollection()
      } else {
        toast.error(data.message || 'Batch delete failed')
      }
    } catch {
      toast.error('Error executing batch delete')
    } finally {
      setIsDeletingBulk(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={`Year ${yearNum} Collection`}
        description={collection?.title || `Management portal for Year ${yearNum}`}
        action={
          <div className="flex flex-wrap sm:flex-nowrap gap-2.5 sm:gap-3 w-full sm:w-auto">
            <Link
              href="/admin/collections"
              className="flex-1 sm:flex-none justify-center flex items-center gap-2 border border-gold/30 px-3.5 sm:px-4 py-2.5 font-mono text-[10px] uppercase tracking-[.15em] sm:tracking-[.2em] text-cream hover:bg-brown-light"
            >
              <ArrowLeft size={14} /> Back to Collections
            </Link>
            <button
              onClick={() => setActiveTab('add')}
              className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-gold px-4 sm:px-5 py-2.5 font-mono text-[10px] uppercase tracking-[.15em] sm:tracking-[.2em] text-brown hover:bg-gold-dark"
            >
              <Plus size={14} /> Add Media
            </button>
          </div>
        }
      />

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        {/* Collection stats summary */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gold/20 bg-brown-light p-4 sm:p-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[.2em] text-gold">
              Collection Overview
            </span>
            <h2 className="font-display text-2xl sm:text-3xl uppercase text-cream mt-1">
              {collection?.title || `Celebration ${yearNum}`}
            </h2>
            {collection?.description && (
              <p className="mt-1 text-xs sm:text-sm text-beige/70">{collection.description}</p>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 border-t sm:border-t-0 border-gold/15 pt-4 sm:pt-0">
            <div className="text-center">
              <span className="block font-display text-2xl sm:text-3xl text-gold">
                {collection?.imageCount || 0}
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[.15em] text-beige/50">
                Images
              </span>
            </div>
            <div className="h-8 sm:h-10 w-px bg-gold/20" />
            <div className="text-center">
              <span className="block font-display text-2xl sm:text-3xl text-gold">
                {collection?.videoCount || 0}
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[.15em] text-beige/50">
                Videos
              </span>
            </div>
            <div className="h-8 sm:h-10 w-px bg-gold/20" />
            <div className="text-center">
              <span className="block font-display text-2xl sm:text-3xl text-cream">
                {collection?.totalCount || 0}
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[.15em] text-beige/50">
                Total Assets
              </span>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gold/20 pb-4">
          <div className="flex flex-wrap gap-2.5 sm:gap-4">
            <button
              onClick={() => {
                setActiveTab('images')
                setSelectedIds([])
              }}
              className={`flex items-center gap-2 border-b-2 pb-3 font-mono text-xs uppercase tracking-[.18em] transition-colors ${
                activeTab === 'images'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-beige/50 hover:text-cream'
              }`}
            >
              <Images size={15} /> Images ({collection?.imageCount || 0})
            </button>

            <button
              onClick={() => {
                setActiveTab('videos')
                setSelectedIds([])
              }}
              className={`flex items-center gap-2 border-b-2 pb-3 font-mono text-xs uppercase tracking-[.18em] transition-colors ${
                activeTab === 'videos'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-beige/50 hover:text-cream'
              }`}
            >
              <Film size={15} /> Videos ({collection?.videoCount || 0})
            </button>

            <button
              onClick={() => {
                setActiveTab('add')
                setSelectedIds([])
              }}
              className={`flex items-center gap-2 border-b-2 pb-3 font-mono text-xs uppercase tracking-[.18em] transition-colors ${
                activeTab === 'add'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-beige/50 hover:text-cream'
              }`}
            >
              <Plus size={15} /> Upload Media to Year {yearNum}
            </button>
          </div>

          {/* Bulk actions (if on images or videos tab) */}
          {activeTab !== 'add' && itemsToDisplay.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-1.5 border border-gold/20 bg-brown px-3 py-1.5 font-mono text-[10px] uppercase text-beige/80 hover:text-gold"
              >
                {selectedIds.length === itemsToDisplay.length ? (
                  <>
                    <CheckSquare size={13} className="text-gold" /> Deselect All
                  </>
                ) : (
                  <>
                    <Square size={13} /> Select All ({itemsToDisplay.length})
                  </>
                )}
              </button>

              {selectedIds.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  disabled={isDeletingBulk}
                  className="flex items-center gap-1.5 bg-red-600 px-3 py-1.5 font-mono text-[10px] uppercase text-cream hover:bg-red-700 disabled:opacity-50"
                >
                  <Trash2 size={13} /> Delete Selected ({selectedIds.length})
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'add' ? (
          <div className="border border-gold/20 bg-brown-light p-6">
            <h3 className="mb-6 font-display text-2xl uppercase text-cream">
              Add Images & Videos to Year {yearNum}
            </h3>
            <MultiUploadForm
              initialYear={yearNum}
              onSuccess={() => {
                fetchCollection()
                setActiveTab('images')
              }}
            />
          </div>
        ) : isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse bg-brown-light" />
            ))}
          </div>
        ) : itemsToDisplay.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-gold/15 bg-brown-light text-center">
            {activeTab === 'images' ? (
              <Images size={40} className="text-gold/30" />
            ) : (
              <Film size={40} className="text-gold/30" />
            )}
            <p className="mt-4 font-display text-2xl uppercase text-cream/50">
              No {activeTab} in Year {yearNum}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[.18em] text-beige/35">
              Upload multiple {activeTab} to build this collection
            </p>
            <button
              onClick={() => setActiveTab('add')}
              className="mt-6 flex items-center gap-2 bg-gold px-5 py-3 font-mono text-[10px] uppercase tracking-[.2em] text-brown hover:bg-gold-dark"
            >
              <Plus size={14} /> Add {activeTab === 'images' ? 'Images' : 'Videos'} Now
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {itemsToDisplay.map((item, i) => {
              const isSelected = selectedIds.includes(item._id)

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`group relative border transition-all bg-brown-light overflow-hidden ${
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

                  {/* Thumbnail / Video Preview */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-brown">
                    <img
                      src={item.thumbnailUrl || item.mediaUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Play Video Button overlay */}
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

                    {/* Overlay controls on hover */}
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
                        onClick={() => setEditingItem(item)}
                        className="flex h-9 w-9 items-center justify-center border border-cream/40 text-cream hover:border-gold hover:text-gold"
                        title="Edit Details"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>

                    {/* Featured Tag */}
                    {item.featured && (
                      <div className="absolute right-2 top-2 z-10 flex items-center gap-1 bg-gold px-2 py-0.5 font-mono text-[8px] uppercase tracking-[.1em] text-brown font-bold">
                        <Star size={9} fill="currentColor" /> Featured
                      </div>
                    )}
                  </div>

                  {/* Card Details */}
                  <div className="p-3">
                    <p className="truncate font-display text-sm uppercase text-cream">
                      {item.title}
                    </p>
                    <div className="mt-1 flex items-center justify-between font-mono text-[9px]">
                      <span className="text-gold">{item.category}</span>
                      <span className="text-beige/40">Year {item.year}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex border-t border-gold/10">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="flex-1 py-2 text-center font-mono text-[9px] uppercase tracking-[.15em] text-beige/60 hover:bg-brown hover:text-gold"
                    >
                      Edit
                    </button>
                    <div className="w-px bg-gold/10" />
                    <button
                      onClick={() => handleDeleteSingle(item)}
                      className="flex-1 py-2 text-center font-mono text-[9px] uppercase tracking-[.15em] text-red-400 hover:bg-brown hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Video Preview Modal */}
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

        {/* Edit Details Drawer/Modal */}
        {editingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brown/80 backdrop-blur-sm p-4"
          >
            <div className="w-full max-w-lg border border-gold/30 bg-brown p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setEditingItem(null)}
                className="absolute right-4 top-4 text-beige/50 hover:text-cream"
              >
                <X size={18} />
              </button>
              <h3 className="font-display text-2xl uppercase text-cream mb-4">
                Edit {editingItem.mediaType === 'video' ? 'Video' : 'Image'} Details
              </h3>
              <EditForm
                item={editingItem}
                onSuccess={() => {
                  setEditingItem(null)
                  fetchCollection()
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
