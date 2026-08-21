import { PageHeader } from '@/components/admin/page-header'
import { MediaGrid } from '@/components/admin/media-grid'
import Link from 'next/link'
import { Upload } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Gallery — SVV Admin' }

export default function AdminGalleryPage() {
  return (
    <div>
      <PageHeader
        title="Gallery"
        description="Manage all uploaded images and videos."
        action={
          <Link
            href="/admin/gallery/upload"
            className="flex items-center gap-2 bg-gold px-5 py-3 font-mono text-[10px] uppercase tracking-[.2em] text-brown hover:bg-gold-dark"
          >
            <Upload size={14} />
            Upload
          </Link>
        }
      />
      <div className="px-6 py-8 lg:px-10">
        <MediaGrid />
      </div>
    </div>
  )
}
