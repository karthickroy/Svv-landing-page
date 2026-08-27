import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Year from '@/models/Year'
import Gallery from '@/models/Gallery'
import { verifyAuth } from '@/lib/auth'

// ─── GET /api/years ─────────────────────────────────────────────────────────
// Public — returns all year collections with image and video counts
export async function GET() {
  try {
    await connectDB()

    // 1. Fetch explicitly registered Year documents
    const yearDocs = await Year.find().sort({ year: -1 }).lean()

    // 2. Fetch distinct years present in Gallery collection
    const galleryYears: number[] = await Gallery.distinct('year')

    // 3. Merge year lists (union)
    const yearSet = new Set<number>()
    yearDocs.forEach((y) => yearSet.add(y.year))
    galleryYears.forEach((y) => yearSet.add(y))

    const allYears = Array.from(yearSet).sort((a, b) => b - a)

    // 4. Calculate stats (images count, videos count) for each year
    const enriched = await Promise.all(
      allYears.map(async (yearNum) => {
        const yearDoc = yearDocs.find((y) => y.year === yearNum)

        const [imageCount, videoCount, firstMedia] = await Promise.all([
          Gallery.countDocuments({ year: yearNum, mediaType: 'image' }),
          Gallery.countDocuments({ year: yearNum, mediaType: 'video' }),
          Gallery.findOne({ year: yearNum }).sort({ createdAt: -1 }).lean(),
        ])

        return {
          _id: yearDoc?._id ? String(yearDoc._id) : undefined,
          year: yearNum,
          title: yearDoc?.title || `Celebration ${yearNum}`,
          description: yearDoc?.description || '',
          coverImageUrl: yearDoc?.coverImageUrl || firstMedia?.thumbnailUrl || firstMedia?.mediaUrl || '',
          imageCount,
          videoCount,
          totalCount: imageCount + videoCount,
          createdAt: yearDoc?.createdAt ? String(yearDoc.createdAt) : undefined,
          updatedAt: yearDoc?.updatedAt ? String(yearDoc.updatedAt) : undefined,
        }
      })
    )

    return NextResponse.json({
      success: true,
      message: 'Years retrieved successfully',
      data: enriched,
    })
  } catch (error) {
    console.error('[GET /api/years ERROR]', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch year collections' },
      { status: 500 }
    )
  }
}

// ─── POST /api/years ────────────────────────────────────────────────────────
// Protected (Admin) — create a new year collection
export async function POST(request: Request) {
  try {
    const payload = await verifyAuth()
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const yearNum = parseInt(body.year)
    const title = body.title?.trim()
    const description = body.description?.trim()
    const coverImageUrl = body.coverImageUrl?.trim()

    if (!yearNum || isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
      return NextResponse.json(
        { success: false, message: 'Valid year is required (between 1900 and 2100)' },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if year document already exists
    const existing = await Year.findOne({ year: yearNum })
    if (existing) {
      return NextResponse.json(
        { success: false, message: `Year ${yearNum} already exists` },
        { status: 400 }
      )
    }

    const newYearDoc = await Year.create({
      year: yearNum,
      title: title || `Celebration ${yearNum}`,
      description: description || '',
      coverImageUrl: coverImageUrl || '',
    })

    return NextResponse.json(
      {
        success: true,
        message: `Year collection ${yearNum} created successfully`,
        data: newYearDoc,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[POST /api/years ERROR]', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create year collection' },
      { status: 500 }
    )
  }
}
