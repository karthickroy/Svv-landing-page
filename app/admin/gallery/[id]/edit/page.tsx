import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/db'
import Gallery from '@/models/Gallery'
import { PageHeader } from '@/components/admin/page-header'
import { EditForm } from '@/components/admin/edit-form'
import type { GalleryItem } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit Memory — SVV Admin' }
export const dynamic = 'force-dynamic'

export default async function EditGalleryItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  await connectDB()
  const item = await Gallery.findById(id).lean()

  if (!item) notFound()

  return (
    <div>
      <PageHeader
        title="Edit Memory"
        description="Update the metadata for this gallery item."
      />
      <div className="px-6 py-10 lg:px-10">
        <EditForm item={JSON.parse(JSON.stringify(item)) as GalleryItem} />
      </div>
    </div>
  )
}
