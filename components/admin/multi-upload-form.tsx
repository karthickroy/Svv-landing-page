'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  X,
  ImageIcon,
  Film,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import type { GalleryCategory, MultiUploadQueueItem } from '@/types'

const CATEGORIES: GalleryCategory[] = [
  'Celebration',
  'Pooja',
  'Family',
  'Procession',
  'Decoration',
  'Cultural',
  'Memories',
  'Other',
]

interface MultiUploadFormProps {
  initialYear?: number
  onSuccess?: () => void
}

export function MultiUploadForm({ initialYear, onSuccess }: MultiUploadFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [availableYears, setAvailableYears] = useState<number[]>([])
  const [selectedYear, setSelectedYear] = useState<string>(
    initialYear ? String(initialYear) : String(new Date().getFullYear())
  )
  const [defaultCategory, setDefaultCategory] = useState<GalleryCategory>('Celebration')
  const [isDragging, setIsDragging] = useState(false)
  const [queue, setQueue] = useState<MultiUploadQueueItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)

  // Fetch dynamic years
  useEffect(() => {
    fetch('/api/gallery/years')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const currentYear = new Date().getFullYear()
          const yearSet = new Set<number>([currentYear, ...data.data])
          const sorted = Array.from(yearSet).sort((a, b) => b - a)
          setAvailableYears(sorted)
        }
      })
      .catch(() => {
        const current = new Date().getFullYear()
        setAvailableYears(Array.from({ length: 25 }, (_, i) => current - i))
      })
  }, [])

  // Process selected files
  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime']

      const newItems: MultiUploadQueueItem[] = []

      Array.from(files).forEach((file) => {
        const isImage = allowedImageTypes.includes(file.type)
        const isVideo = allowedVideoTypes.includes(file.type)

        if (!isImage && !isVideo) {
          toast.error(`"${file.name}" has an unsupported format. (Allowed: JPG, PNG, WEBP, MP4, WEBM, MOV)`)
          return
        }

        const maxSize = isVideo ? 100 * 1024 * 1024 : 15 * 1024 * 1024
        if (file.size > maxSize) {
          toast.error(`"${file.name}" exceeds maximum allowed size of ${isVideo ? '100MB' : '15MB'}`)
          return
        }

        // Clean filename for fallback title
        const titleWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
        const formattedTitle = titleWithoutExt
          .replace(/[-_]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()

        newItems.push({
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          previewUrl: URL.createObjectURL(file),
          title: formattedTitle || 'Untitled Memory',
          description: '',
          category: defaultCategory,
          mediaType: isVideo ? 'video' : 'image',
          featured: false,
          status: 'idle',
          progress: 0,
        })
      })

      if (newItems.length > 0) {
        setQueue((prev) => [...prev, ...newItems])
        toast.success(`Added ${newItems.length} file(s) to upload queue`)
      }
    },
    [defaultCategory]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files?.length) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles]
  )

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files)
    }
  }

  const removeFromQueue = (id: string) => {
    setQueue((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl)
      return prev.filter((i) => i.id !== id)
    })
  }

  const updateQueueItem = (id: string, updates: Partial<MultiUploadQueueItem>) => {
    setQueue((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  // Upload all items in queue
  const handleUploadAll = async () => {
    if (queue.length === 0) {
      toast.error('Please select at least one image or video to upload')
      return
    }

    setIsUploading(true)
    setOverallProgress(0)

    let successCount = 0
    let failureCount = 0

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i]
      if (item.status === 'success') {
        successCount++
        continue
      }

      updateQueueItem(item.id, { status: 'uploading', progress: 10 })

      try {
        const formData = new FormData()
        formData.append('file', item.file)
        formData.append('title', item.title.trim() || 'Untitled Memory')
        formData.append('description', item.description.trim())
        formData.append('year', selectedYear)
        formData.append('category', item.category)
        formData.append('mediaType', item.mediaType)
        formData.append('featured', String(item.featured))

        // Fake upload progress ticks for smooth UX
        const progressTimer = setInterval(() => {
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id ? { ...q, progress: Math.min(q.progress + 15, 85) } : q
            )
          )
        }, 300)

        const res = await fetch('/api/gallery', {
          method: 'POST',
          body: formData,
        })

        clearInterval(progressTimer)

        const data = await res.json()

        if (res.ok && data.success) {
          updateQueueItem(item.id, { status: 'success', progress: 100 })
          successCount++
        } else {
          updateQueueItem(item.id, {
            status: 'error',
            progress: 0,
            errorMsg: data.message || 'Upload failed',
          })
          failureCount++
        }
      } catch {
        updateQueueItem(item.id, {
          status: 'error',
          progress: 0,
          errorMsg: 'Network or server error',
        })
        failureCount++
      }

      setOverallProgress(Math.round(((i + 1) / queue.length) * 100))
    }

    setIsUploading(false)

    if (failureCount === 0) {
      toast.success(`Successfully uploaded all ${successCount} media files! 🪔`)
      if (onSuccess) {
        onSuccess()
      } else {
        setTimeout(() => router.push(`/admin/gallery?year=${selectedYear}`), 1200)
      }
    } else {
      toast.warning(
        `Uploaded ${successCount} file(s), ${failureCount} failed. You can retry failed uploads.`
      )
    }
  }

  const imageCount = queue.filter((q) => q.mediaType === 'image').length
  const videoCount = queue.filter((q) => q.mediaType === 'video').length

  return (
    <div className="space-y-8">
      {/* Configuration bar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 border border-gold/20 bg-brown-light p-5">
        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[.2em] text-gold">
            Target Year Collection *
          </label>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={isUploading}
              className="w-full border border-gold/30 bg-brown px-4 py-2.5 font-mono text-xs text-cream focus:border-gold focus:outline-none"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[.2em] text-gold">
            Default Category
          </label>
          <select
            value={defaultCategory}
            onChange={(e) => {
              const cat = e.target.value as GalleryCategory
              setDefaultCategory(cat)
              setQueue((prev) => prev.map((q) => ({ ...q, category: cat })))
            }}
            disabled={isUploading}
            className="w-full border border-gold/30 bg-brown px-4 py-2.5 font-mono text-xs text-cream focus:border-gold focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <div className="font-mono text-[10px] tracking-[.15em] text-beige/60">
            Queue Summary: <span className="text-gold font-bold">{queue.length} files</span> (
            {imageCount} Images, {videoCount} Videos)
          </div>
        </div>
      </div>

      {/* Multiple File Drag & Drop Zone */}
      <div
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-10 transition-all ${
          isDragging
            ? 'border-gold bg-gold/15 scale-[0.99]'
            : 'border-gold/30 bg-brown/50 hover:border-gold/60 hover:bg-brown-light'
        }`}
      >
        <div className="flex gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-brown-light text-gold">
            <ImageIcon size={22} />
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-brown-light text-gold">
            <Film size={22} />
          </div>
        </div>
        <p className="mt-4 font-display text-2xl uppercase tracking-tight text-cream">
          Drag & Drop Multiple Images or Videos
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[.2em] text-gold/80">
          or click here to select multiple files
        </p>
        <p className="mt-3 font-mono text-[9px] tracking-[.12em] text-beige/40 text-center max-w-md">
          Select multiple JPG, PNG, WEBP images (up to 15MB each) & MP4, WEBM, MOV videos (up to 100MB each).
          Every file will be uploaded to Cloudinary & saved to Year {selectedYear}.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
          onChange={onFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      {/* Queue items list */}
      {queue.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gold/20 pb-3">
            <h3 className="font-display text-xl uppercase tracking-tight text-cream">
              Files Ready for Upload ({queue.length})
            </h3>
            <button
              type="button"
              onClick={() => setQueue([])}
              disabled={isUploading}
              className="font-mono text-[10px] uppercase tracking-[.18em] text-red-400 hover:text-red-300 disabled:opacity-50"
            >
              Clear All
            </button>
          </div>

          {/* Overall batch progress bar */}
          {isUploading && (
            <div className="border border-gold/30 bg-brown-light p-4">
              <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-cream">
                <span>Uploading batch to Cloudinary & Database…</span>
                <span className="text-gold font-bold">{overallProgress}%</span>
              </div>
              <div className="h-2 bg-brown overflow-hidden">
                <motion.div
                  className="h-full bg-gold"
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {queue.map((item, idx) => (
              <div
                key={item.id}
                className="relative flex flex-col justify-between border border-gold/20 bg-brown-light p-4"
              >
                {/* Header & Remove */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {item.mediaType === 'video' ? (
                      <span className="flex items-center gap-1 rounded bg-gold/20 px-2 py-0.5 font-mono text-[9px] uppercase text-gold shrink-0">
                        <Film size={11} /> Video
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded bg-beige/20 px-2 py-0.5 font-mono text-[9px] uppercase text-beige/80 shrink-0">
                        <ImageIcon size={11} /> Image
                      </span>
                    )}
                    <span className="font-mono text-[10px] text-beige/50 truncate">
                      #{(idx + 1).toString().padStart(2, '0')} · {(item.file.size / (1024 * 1024)).toFixed(1)}MB
                    </span>
                  </div>

                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => removeFromQueue(item.id)}
                      className="text-beige/40 hover:text-red-400 p-1"
                      title="Remove file"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Preview & Edit details */}
                <div className="grid grid-cols-3 gap-3 items-center">
                  <div className="relative aspect-video w-full overflow-hidden border border-gold/20 bg-brown">
                    {item.mediaType === 'video' ? (
                      <video
                        src={item.previewUrl}
                        className="h-full w-full object-cover"
                        muted
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={item.previewUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="col-span-2 space-y-2">
                    <input
                      type="text"
                      value={item.title}
                      disabled={isUploading}
                      onChange={(e) => updateQueueItem(item.id, { title: e.target.value })}
                      placeholder="Title"
                      className="w-full border border-gold/20 bg-brown px-3 py-1.5 font-sans text-xs text-cream focus:border-gold focus:outline-none"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={item.category}
                        disabled={isUploading}
                        onChange={(e) =>
                          updateQueueItem(item.id, { category: e.target.value as GalleryCategory })
                        }
                        className="w-full border border-gold/20 bg-brown px-2 py-1 font-mono text-[10px] text-cream focus:border-gold focus:outline-none"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>

                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.featured}
                          disabled={isUploading}
                          onChange={(e) => updateQueueItem(item.id, { featured: e.target.checked })}
                          className="accent-gold h-3.5 w-3.5"
                        />
                        <span className="font-mono text-[9px] uppercase text-gold">Featured</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-3">
                  <input
                    type="text"
                    value={item.description}
                    disabled={isUploading}
                    onChange={(e) => updateQueueItem(item.id, { description: e.target.value })}
                    placeholder="Optional description…"
                    className="w-full border border-gold/15 bg-brown px-3 py-1 font-sans text-[11px] text-beige/80 placeholder-beige/30 focus:border-gold focus:outline-none"
                  />
                </div>

                {/* Status indicator */}
                {item.status !== 'idle' && (
                  <div className="mt-3 border-t border-gold/10 pt-2">
                    {item.status === 'uploading' && (
                      <div className="flex items-center justify-between font-mono text-[9px] text-gold">
                        <span>Uploading to Cloudinary…</span>
                        <span>{item.progress}%</span>
                      </div>
                    )}
                    {item.status === 'success' && (
                      <div className="flex items-center gap-1.5 font-mono text-[9px] text-green-400">
                        <CheckCircle size={12} /> Uploaded & saved to Year {selectedYear}
                      </div>
                    )}
                    {item.status === 'error' && (
                      <div className="flex items-center gap-1.5 font-mono text-[9px] text-red-400">
                        <AlertCircle size={12} /> {item.errorMsg || 'Upload failed'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleUploadAll}
              disabled={isUploading || queue.length === 0}
              className="flex w-full items-center justify-center gap-2 bg-gold py-4 font-mono text-[11px] uppercase tracking-[.25em] text-brown transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload size={16} />
              {isUploading
                ? `Uploading ${queue.length} items (${overallProgress}%)…`
                : `Upload All ${queue.length} Media Files to Year ${selectedYear}`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
