'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { GalleryItem } from '@/types'

const CATEGORIES = [
  'Celebration', 'Pooja', 'Family', 'Procession',
  'Decoration', 'Cultural', 'Memories', 'Other'
] as const

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: currentYear - 1998 }, (_, i) => currentYear - i)

interface EditFormProps {
  item: GalleryItem
  onSuccess?: () => void
}

export function EditForm({ item, onSuccess }: EditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    title: item.title,
    description: item.description || '',
    year: String(item.year),
    category: item.category,
    featured: item.featured,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch(`/api/gallery/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          year: parseInt(form.year),
          category: form.category,
          featured: form.featured,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || 'Update failed')
        return
      }
      toast.success('Memory updated successfully')
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/admin/gallery')
        router.refresh()
      }
    } catch {
      toast.error('Update failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      {/* Preview */}
      <div className="border border-gold/20 bg-brown-light p-1">
        {item.mediaType === 'video' ? (
          <video
            src={item.mediaUrl}
            className="max-h-48 w-full object-cover"
            muted
            playsInline
          />
        ) : (
          <img
            src={item.thumbnailUrl || item.mediaUrl}
            alt={item.title}
            className="max-h-48 w-full object-cover"
          />
        )}
        <p className="mt-2 px-3 pb-3 font-mono text-[9px] uppercase tracking-[.15em] text-beige/40">
          Media cannot be changed — upload a new memory if needed
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="mb-2 block font-mono text-[10px] uppercase tracking-[.2em] text-beige/60">
          Title *
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
          maxLength={200}
          className="w-full border border-gold/30 bg-brown-light px-4 py-3 text-cream placeholder-beige/30 focus:border-gold focus:outline-none"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Year */}
        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[.2em] text-beige/60">
            Year *
          </label>
          <select
            value={form.year}
            onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
            className="w-full border border-gold/30 bg-brown-light px-4 py-3 text-cream focus:border-gold focus:outline-none"
          >
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[.2em] text-beige/60">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as any }))}
            className="w-full border border-gold/30 bg-brown-light px-4 py-3 text-cream focus:border-gold focus:outline-none"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block font-mono text-[10px] uppercase tracking-[.2em] text-beige/60">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={4}
          maxLength={1000}
          className="w-full border border-gold/30 bg-brown-light px-4 py-3 text-cream placeholder-beige/30 focus:border-gold focus:outline-none"
        />
      </div>

      {/* Featured toggle */}
      <div>
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
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 border border-gold/30 py-4 font-mono text-[10px] uppercase tracking-[.2em] text-beige/60 transition-colors hover:border-gold hover:text-cream"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gold py-4 font-mono text-[10px] uppercase tracking-[.2em] text-brown transition-colors hover:bg-gold-dark disabled:opacity-50"
        >
          {isLoading ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
