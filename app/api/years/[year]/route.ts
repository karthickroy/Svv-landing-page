import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Year from '@/models/Year'
import Gallery from '@/models/Gallery'
import { verifyAuth } from '@/lib/auth'
import { deleteFromCloudinary } from '@/lib/cloudinary'

// ─── GET /api/years/[year] ──────────────────────────────────────────────────
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year: yearParam } = await params
    const yearNum = parseInt(yearParam)

    if (isNaN(yearNum)) {
      return NextResponse.json({ success: false, message: 'Invalid year' }, { status: 400 })
    }

    await connectDB()

    const yearDoc = await Year.findOne({ year: yearNum }).lean()
    const items = await Gallery.find({ year: yearNum }).sort({ createdAt: -1 }).lean()

    const images = items.filter((i) => i.mediaType === 'image')
    const videos = items.filter((i) => i.mediaType === 'video')

    return NextResponse.json({
      success: true,
      message: `Data for year ${yearNum} fetched successfully`,
      data: {
        year: yearNum,
        title: yearDoc?.title || `Celebration ${yearNum}`,
        description: yearDoc?.description || '',
        coverImageUrl: yearDoc?.coverImageUrl || items[0]?.thumbnailUrl || items[0]?.mediaUrl || '',
        imageCount: images.length,
        videoCount: videos.length,
        totalCount: items.length,
        images,
        videos,
        items,
      },
    })
  } catch (error) {
    console.error('[GET /api/years/[year] ERROR]', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch year collection detail' },
      { status: 500 }
    )
  }
}

// ─── PUT /api/years/[year] ──────────────────────────────────────────────────
// Protected (Admin) — update title, description, coverImageUrl
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const payload = await verifyAuth()
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { year: yearParam } = await params
    const yearNum = parseInt(yearParam)
    if (isNaN(yearNum)) {
      return NextResponse.json({ success: false, message: 'Invalid year' }, { status: 400 })
    }

    const body = await request.json()
    const { title, description, coverImageUrl } = body

    await connectDB()

    let yearDoc = await Year.findOne({ year: yearNum })
    if (!yearDoc) {
      // Create if it didn't exist in Year model previously
      yearDoc = await Year.create({
        year: yearNum,
        title: title?.trim() || `Celebration ${yearNum}`,
        description: description?.trim() || '',
        coverImageUrl: coverImageUrl?.trim() || '',
      })
    } else {
      yearDoc.title = title?.trim() ?? yearDoc.title
      yearDoc.description = description?.trim() ?? yearDoc.description
      yearDoc.coverImageUrl = coverImageUrl?.trim() ?? yearDoc.coverImageUrl
      await yearDoc.save()
    }

    return NextResponse.json({
      success: true,
      message: `Year collection ${yearNum} updated successfully`,
      data: yearDoc,
    })
  } catch (error) {
    console.error('[PUT /api/years/[year] ERROR]', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update year collection' },
      { status: 500 }
    )
  }
}

// ─── DELETE /api/years/[year] ───────────────────────────────────────────────
// Protected (Admin) — delete year collection and all associated Cloudinary media + DB records
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const payload = await verifyAuth()
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { year: yearParam } = await params
    const yearNum = parseInt(yearParam)
    if (isNaN(yearNum)) {
      return NextResponse.json({ success: false, message: 'Invalid year' }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const deleteMedia = searchParams.get('deleteMedia') !== 'false' // default true

    await connectDB()

    if (deleteMedia) {
      const items = await Gallery.find({ year: yearNum })
      for (const item of items) {
        if (item.cloudinaryPublicId) {
          try {
            await deleteFromCloudinary(item.cloudinaryPublicId, item.mediaType)
          } catch (err) {
            console.error(`Failed deleting Cloudinary asset ${item.cloudinaryPublicId}:`, err)
          }
        }
      }
      await Gallery.deleteMany({ year: yearNum })
    }

    await Year.findOneAndDelete({ year: yearNum })

    return NextResponse.json({
      success: true,
      message: `Year collection ${yearNum} and associated media deleted successfully`,
    })
  } catch (error) {
    console.error('[DELETE /api/years/[year] ERROR]', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete year collection' },
      { status: 500 }
    )
  }
}
