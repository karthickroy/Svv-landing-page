import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Gallery from '@/models/Gallery'
import Year from '@/models/Year'

// ─── GET /api/gallery/years ──────────────────────────────────────────────────
// Public — returns distinct sorted years from both Year model and Gallery items
export async function GET() {
  try {
    await connectDB()

    const [galleryYears, yearDocs] = await Promise.all([
      Gallery.distinct('year'),
      Year.distinct('year'),
    ])

    const yearSet = new Set<number>([...galleryYears, ...yearDocs])
    const sorted = Array.from(yearSet).sort((a: number, b: number) => b - a)

    return NextResponse.json({
      success: true,
      message: 'Years fetched successfully',
      data: sorted,
    })
  } catch (error) {
    console.error('[GALLERY YEARS ERROR]', error)
    return NextResponse.json(
      { success: false, message: 'Unable to fetch years' },
      { status: 500 }
    )
  }
}
