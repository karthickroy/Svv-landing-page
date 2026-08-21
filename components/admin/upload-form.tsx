'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, ImageIcon, Film, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const CATEGORIES = [
  'Celebration', 'Pooja', 'Family', 'Procession',
  'Decoration', 'Cultural', 'Memories', 'Other'
] as const

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: currentYear - 1998 }, (_, i) => currentYear - i)

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export function UploadForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [progress, setProgress] = useState(0)

  const [form, setForm] = useState({
    title: '',
    description: '',
    year: String(currentYear),
    category: 'Celebration',
    featured: false,
  })

  const handleFile = useCallback((f: File) => {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime'
    ]
    if (!allowedTypes.includes(f.type)) {
      toast.error('Invalid file type. Allowed: JPG, PNG, WEBP, MP4, WEBM, MOV')
      return
    }
    const maxSize = f.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (f.size > maxSize) {
      toast.error(`File too large. Max ${f.type.startsWith('video/') ? '50MB' : '10MB'}`)
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFile(dropped)
  }, [handleFile])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const removeFile = () => {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) { toast.error('Please select a file'); return }
    if (!form.title.trim()) { toast.error('Title is required'); return }

    setStatus('uploading')
    setProgress(0)

    // Simulate progress for UX (real progress needs XHR)
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15, 85))
    }, 300)

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('title', form.title.trim())
      fd.append('description', form.description.trim())
      fd.append('year', form.year)
      fd.append('category', form.category)
      fd.append('mediaType', file.type.startsWith('video/') ? 'video' : 'image')
      fd.append('featured', String(form.featured))

      const res = await fetch('/api/gallery', { method: 'POST', body: fd })
      const data = await res.json()

      clearInterval(progressInterval)
      setProgress(100)

      if (!res.ok) {
        setStatus('error')
        toast.error(data.message || 'Upload failed')
        return
      }

      setStatus('success')
      toast.success('Memory uploaded successfully! 🪔')
      setTimeout(() => router.push('/admin/gallery'), 1500)
    } catch {
      clearInterval(progressInterval)
      setStatus('error')
      toast.error('Upload failed. Please try again.')
    }
  }

  const isVideo = file?.type.startsWith('video/')

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8">
      {/* Drop Zone */}
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[.2em] text-beige/60">
          Media File *
        </p>
        {!file ? (
          <div
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center border-2 border-dashed px-8 py-16 transition-colors ${
              isDragging ? 'border-gold bg-gold/10' : 'border-gold/30 hover:border-gold/60'
            }`}
          >
            <Upload size={36} className="text-gold/50" />
            <p className="mt-4 font-display text-xl uppercase text-cream">Drag & drop here</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[.2em] text-beige/50">
              or click to browse
            </p>
            <p className="mt-4 font-mono text-[9px] tracking-[.1em] text-beige/35">
              Images: JPG, PNG, WEBP (max 10MB) · Videos: MP4, WEBM, MOV (max 50MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
              onChange={onFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative border border-gold/30 bg-brown-light">
            <button
              type="button"
              onClick={removeFile}
              className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center bg-brown text-cream hover:text-gold"
            >
              <X size={14} />
            </button>

            {isVideo ? (
              <div className="flex items-center gap-4 p-5">
                <div className="flex h-16 w-16 items-center justify-center border border-gold/30 bg-brown">
                  <Film size={28} className="text-gold" />
                </div>
                <div>
                  <p className="font-mono text-xs text-cream">{file.name}</p>
                  <p className="mt-1 font-mono text-[9px] text-beige/50">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB · Video
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={preview!}
                  alt="Preview"
                  className="max-h-72 w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brown/80 to-transparent p-4">
                  <p className="font-mono text-[9px] text-beige/70">{file.name}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fields */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Title */}
        <div className="sm:col-span-2">
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[.2em] text-beige/60">
            Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Vinayagar Chathurthi Celebration"
            maxLength={200}
            required
            className="w-full border border-gold/30 bg-brown-light px-4 py-3 font-sans text-cream placeholder-beige/30 focus:border-gold focus:outline-none"
          />
        </div>

        {/* Year */}
        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[.2em] text-beige/60">
            Celebration Year *
          </label>
          <select
            value={form.year}
            onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
            className="w-full border border-gold/30 bg-brown-light px-4 py-3 font-sans text-cream focus:border-gold focus:outline-none"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[.2em] text-beige/60">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="w-full border border-gold/30 bg-brown-light px-4 py-3 font-sans text-cream focus:border-gold focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[.2em] text-beige/60">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Add a memory description…"
            rows={3}
            maxLength={1000}
            className="w-full border border-gold/30 bg-brown-light px-4 py-3 font-sans text-cream placeholder-beige/30 focus:border-gold focus:outline-none"
          />
        </div>

        {/* Featured */}
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-center gap-3">
            <div
              onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
              className={`relative h-5 w-9 rounded-full border transition-colors ${
                form.featured ? 'border-gold bg-gold' : 'border-gold/30 bg-brown-light'
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-cream transition-transform ${
                  form.featured ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[.2em] text-beige/60">
              Featured Memory
            </span>
          </label>
          <p className="mt-1 font-mono text-[9px] text-beige/35">
            Featured memories appear in the homepage highlights section
          </p>
        </div>
      </div>

      {/* Progress */}
      <AnimatePresence>
        {status === 'uploading' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="border border-gold/20 bg-brown-light p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[.18em] text-beige/60">
                  Uploading to Cloudinary…
                </span>
                <span className="font-mono text-[10px] text-gold">{Math.round(progress)}%</span>
              </div>
              <div className="h-1 bg-brown">
                <motion.div
                  className="h-full bg-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 border border-green-600/30 bg-green-950/20 p-4"
          >
            <CheckCircle size={18} className="text-green-500" />
            <span className="font-mono text-[10px] uppercase tracking-[.18em] text-green-400">
              Memory uploaded successfully! Redirecting…
            </span>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 border border-red-600/30 bg-red-950/20 p-4"
          >
            <AlertCircle size={18} className="text-red-400" />
            <span className="font-mono text-[10px] uppercase tracking-[.18em] text-red-400">
              Upload failed. Please try again.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'uploading' || status === 'success' || !file}
        className="w-full bg-gold py-4 font-mono text-[11px] uppercase tracking-[.25em] text-brown transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'uploading' ? 'Uploading…' : 'Upload Memory'}
      </button>
    </form>
  )
}
