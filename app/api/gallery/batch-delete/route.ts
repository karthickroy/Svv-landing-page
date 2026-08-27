import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Gallery from '@/models/Gallery'
import { verifyAuth } from '@/lib/auth'
import { deleteFromCloudinary } from '@/lib/cloudinary'

// ─── POST /api/gallery/batch-delete ──────────────────────────────────────────
// Protected (Admin) — deletes multiple media items from Cloudinary and DB
export async function POST(request: Request) {
  try {
    const payload = await verifyAuth()
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { ids } = body as { ids: string[] }

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No media IDs provided for deletion' },
        { status: 400 }
      )
    }

    await connectDB()

    const items = await Gallery.find({ _id: { $in: ids } })

    let deletedCount = 0
    let failedCount = 0

    // Delete assets from Cloudinary
    for (const item of items) {
      if (item.cloudinaryPublicId) {
        try {
          await deleteFromCloudinary(item.cloudinaryPublicId, item.mediaType)
        } catch (err) {
          console.error(`Cloudinary deletion error for ${item.cloudinaryPublicId}:`, err)
        }
      }
    }

    // Delete records from MongoDB
    const deleteResult = await Gallery.deleteMany({ _id: { $in: ids } })
    deletedCount = deleteResult.deletedCount || 0

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedCount} media items`,
      deletedCount,
      failedCount,
    })
  } catch (error) {
    console.error('[BATCH DELETE ERROR]', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete media items' },
      { status: 500 }
    )
  }
}
