import { connectDB } from '@/lib/db'
import Gallery from '@/models/Gallery'
import { PageHeader } from '@/components/admin/page-header'
import { StatCard } from '@/components/admin/stat-card'
import { Images, Film, Library, CalendarRange, Upload } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'SVV Admin Dashboard' }

export const dynamic = 'force-dynamic'

async function getStats() {
  try {
    await connectDB()
    const [total, images, videos, years, recent] = await Promise.all([
      Gallery.countDocuments(),
      Gallery.countDocuments({ mediaType: 'image' }),
      Gallery.countDocuments({ mediaType: 'video' }),
      Gallery.distinct('year'),
      Gallery.find().sort({ createdAt: -1 }).limit(5).lean(),
    ])
    return { total, images, videos, years: years.length, recent }
  } catch {
    return { total: 0, images: 0, videos: 0, years: 0, recent: [] }
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of the SVV memory archive."
        action={
          <Link
            href="/admin/gallery/upload"
            className="flex items-center gap-2 bg-gold px-5 py-3 font-mono text-[10px] uppercase tracking-[.2em] text-brown hover:bg-gold-dark"
          >
            <Upload size={14} />
            Upload Memory
          </Link>
        }
      />

      <div className="px-6 py-8 lg:px-10">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Memories" value={stats.total} icon={Library} />
          <StatCard label="Total Images" value={stats.images} icon={Images} />
          <StatCard label="Total Videos" value={stats.videos} icon={Film} />
          <StatCard label="Celebration Years" value={stats.years} icon={CalendarRange} />
        </div>

        {/* Recent uploads */}
        <div className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-2xl uppercase tracking-tight text-cream">
              Recent Uploads
            </h2>
            <Link
              href="/admin/gallery"
              className="font-mono text-[10px] uppercase tracking-[.2em] text-gold/70 hover:text-gold"
            >
              View all →
            </Link>
          </div>

          {stats.recent.length === 0 ? (
            <div className="border border-gold/15 bg-brown-light p-12 text-center">
              <Images size={36} className="mx-auto text-gold/30" />
              <p className="mt-5 font-display text-xl uppercase text-cream/50">No memories yet</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[.18em] text-beige/30">
                Upload your first memory to get started
              </p>
              <Link
                href="/admin/gallery/upload"
                className="mt-6 inline-flex items-center gap-2 border border-gold/30 px-5 py-3 font-mono text-[10px] uppercase tracking-[.2em] text-gold hover:bg-gold hover:text-brown"
              >
                <Upload size={13} />
                Upload Memory
              </Link>
            </div>
          ) : (
            <div className="border border-gold/15 bg-brown-light divide-y divide-gold/10">
              {(stats.recent as any[]).map((item: any) => (
                <div key={item._id} className="flex items-center gap-4 px-5 py-4">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden border border-gold/20">
                    <img
                      src={item.thumbnailUrl || item.mediaUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    {item.mediaType === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-brown/60">
                        <Film size={14} className="text-gold" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-display text-sm uppercase text-cream">{item.title}</p>
                    <p className="font-mono text-[9px] tracking-[.12em] text-beige/50">
                      {item.year} · {item.category}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-block px-2 py-1 font-mono text-[8px] uppercase tracking-[.1em] ${
                      item.mediaType === 'video'
                        ? 'border border-gold/30 text-gold'
                        : 'border border-beige/20 text-beige/50'
                    }`}>
                      {item.mediaType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/gallery/upload"
            className="group border border-gold/20 bg-brown-light p-6 transition-colors hover:border-gold/50"
          >
            <Upload size={22} className="text-gold/60 group-hover:text-gold" />
            <p className="mt-4 font-display text-xl uppercase text-cream">Upload Memory</p>
            <p className="mt-1 text-sm text-beige/50">Add a new image or video to the archive</p>
          </Link>
          <Link
            href="/admin/gallery"
            className="group border border-gold/20 bg-brown-light p-6 transition-colors hover:border-gold/50"
          >
            <Images size={22} className="text-gold/60 group-hover:text-gold" />
            <p className="mt-4 font-display text-xl uppercase text-cream">Manage Gallery</p>
            <p className="mt-1 text-sm text-beige/50">View, edit and delete memories</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
