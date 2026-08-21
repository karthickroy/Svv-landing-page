import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Gallery, { GalleryCategory } from '@/models/Gallery'
import { verifyAuth } from '@/lib/auth'
import { deleteFromCloudinary } from '@/lib/cloudinary'

// ─── GET /api/gallery/:id ────────────────────────────────────────────────────
// Public
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()

    const item = await Gallery.findById(id).lean()

    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Gallery item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Gallery item fetched', data: item })
  } catch (error) {
    console.error('[GALLERY GET ONE ERROR]', error)
    return NextResponse.json(
      { success: false, message: 'Unable to fetch gallery item' },
      { status: 500 }
    )
  }
}

// ─── PUT /api/gallery/:id ────────────────────────────────────────────────────
// Protected admin — metadata update only (no re-upload)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await verifyAuth()
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, description, year, category, featured } = body

    if (!title || !year || !category) {
      return NextResponse.json(
        { success: false, message: 'Title, year, and category are required' },
        { status: 400 }
      )
    }

    await connectDB()

    const updated = await Gallery.findByIdAndUpdate(
      id,
      { title: title.trim(), description: description?.trim(), year, category: category as GalleryCategory, featured },
      { new: true, runValidators: true }
    ).lean()

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Gallery item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Gallery item updated successfully',
      data: updated,
    })
  } catch (error) {
    console.error('[GALLERY PUT ERROR]', error)
    return NextResponse.json(
      { success: false, message: 'Unable to update gallery item' },
      { status: 500 }
    )
  }
}

// ─── DELETE /api/gallery/:id ─────────────────────────────────────────────────
// Protected admin — deletes from MongoDB AND Cloudinary
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await verifyAuth()
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    const item = await Gallery.findById(id)
    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Gallery item not found' },
        { status: 404 }
      )
    }

    // Delete from Cloudinary first (to avoid orphaned files)
    await deleteFromCloudinary(item.cloudinaryPublicId, item.mediaType)

    // Delete from MongoDB
    await Gallery.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'Memory deleted successfully',
    })
  } catch (error) {
    console.error('[GALLERY DELETE ERROR]', error)
    return NextResponse.json(
      { success: false, message: 'Unable to delete gallery item' },
      { status: 500 }
    )
  }
}
