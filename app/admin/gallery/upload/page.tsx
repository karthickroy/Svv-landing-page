import { PageHeader } from '@/components/admin/page-header'
import { UploadForm } from '@/components/admin/upload-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Upload Memory — SVV Admin' }

export default function UploadPage() {
  return (
    <div>
      <PageHeader
        title="Upload Memory"
        description="Add a new photograph or video to the SVV memory archive."
      />
      <div className="px-6 py-10 lg:px-10">
        <UploadForm />
      </div>
    </div>
  )
}
