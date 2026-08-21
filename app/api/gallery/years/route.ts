import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Gallery from '@/models/Gallery'

// ─── GET /api/gallery/years ──────────────────────────────────────────────────
// Public — returns distinct years from gallery for dynamic filter tabs
export async function GET() {
  try {
    await connectDB()

    const years = await Gallery.distinct('year')
    const sorted = years.sort((a: number, b: number) => b - a) // newest first

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
