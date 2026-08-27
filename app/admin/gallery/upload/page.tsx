import { PageHeader } from '@/components/admin/page-header'
import { MultiUploadForm } from '@/components/admin/multi-upload-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Upload Media — SVV Admin' }

export default function UploadPage() {
  return (
    <div>
      <PageHeader
        title="Upload Media"
        description="Select multiple images and videos at once to upload to Cloudinary and assign to any year collection."
      />
      <div className="px-6 py-10 lg:px-10 max-w-5xl mx-auto">
        <MultiUploadForm />
      </div>
    </div>
  )
}
