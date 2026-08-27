import { PageHeader } from '@/components/admin/page-header'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Settings — SVV Admin' }

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your SVV admin portal settings."
      />
      <div className="px-6 py-10 lg:px-10">
        <div className="max-w-2xl space-y-6">
          <div className="border border-gold/20 bg-brown-light p-8">
            <h2 className="font-display text-xl uppercase text-cream">About SVV Archive</h2>
            <div className="my-5 h-px bg-gold/15" />
            <dl className="space-y-4">
              {[
                ['Project', 'Sree Veera Vigneshwar Memory Archive'],
                ['Celebration', 'Vinayagar Chathurthi'],
                ['Founded', '1999'],
                ['Years', '27+ years of celebrations'],
                ['Location', 'Pernambut, Tamil Nadu'],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-6">
                  <dt className="w-32 shrink-0 font-mono text-[10px] uppercase tracking-[.18em] text-beige/40">
                    {label}
                  </dt>
                  <dd className="text-sm text-cream/80">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="border border-gold/20 bg-brown-light p-8">
            <h2 className="font-display text-xl uppercase text-cream">Technical</h2>
            <div className="my-5 h-px bg-gold/15" />
            <dl className="space-y-4">
              {[
                ['Stack', 'Next.js 16 · MongoDB · Cloudinary'],
                ['Auth', 'JWT (HTTP-only cookie)'],
                ['Storage', 'Cloudinary (images & videos)'],
                ['Database', 'MongoDB (metadata)'],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-6">
                  <dt className="w-32 shrink-0 font-mono text-[10px] uppercase tracking-[.18em] text-beige/40">
                    {label}
                  </dt>
                  <dd className="text-sm text-cream/80">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
