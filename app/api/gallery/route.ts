import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Gallery, { GalleryCategory } from '@/models/Gallery'
import { verifyAuth } from '@/lib/auth'
import { uploadToCloudinary } from '@/lib/cloudinary'

// ─── GET /api/gallery ────────────────────────────────────────────────────────
// Public. Supports: ?year=2024, ?type=image|video, ?featured=true, ?page=1, ?limit=20, ?sort=newest
export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
    const type = searchParams.get('type')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const sort = searchParams.get('sort') || 'newest'

    // Build query
    const query: Record<string, unknown> = {}
    if (year && year !== 'all') query.year = parseInt(year)
    if (type && type !== 'all') query.mediaType = type
    if (featured === 'true') query.featured = true

    const sortOrder = sort === 'oldest' ? 1 : -1

    const [items, total] = await Promise.all([
      Gallery.find(query)
        .sort({ year: sortOrder, createdAt: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Gallery.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      message: 'Gallery items fetched successfully',
      data: items,
      total,
      page,
      limit,
    })
  } catch (error) {
    console.error('[GALLERY GET ERROR]', error)
    return NextResponse.json(
      { success: false, message: 'Unable to load gallery items. Please try again.' },
      { status: 500 }
    )
  }
}

// ─── POST /api/gallery ───────────────────────────────────────────────────────
// Protected (admin). Accepts multipart/form-data with file + metadata.
export async function POST(request: Request) {
  try {
    // Verify admin auth
    const payload = await verifyAuth()
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string
    const description = formData.get('description') as string | undefined
    const year = parseInt(formData.get('year') as string)
    const category = (formData.get('category') as GalleryCategory) || 'Celebration'
    const mediaType = formData.get('mediaType') as string
    const featured = formData.get('featured') === 'true'

    // Validate required fields
    if (!file || !title || !year || !category || !mediaType) {
      return NextResponse.json(
        { success: false, message: 'File, title, year, category, and media type are required' },
        { status: 400 }
      )
    }

    // File type validation
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Allowed: JPG, PNG, WEBP, MP4, WEBM, MOV' },
        { status: 400 }
      )
    }

    // File size validation: 50MB for videos, 10MB for images
    const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      const maxMB = maxSize / (1024 * 1024)
      return NextResponse.json(
        { success: false, message: `File too large. Maximum size is ${maxMB}MB` },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const cloudResult = await uploadToCloudinary(buffer, {
      resource_type: file.type.startsWith('video/') ? 'video' : 'image',
    })

    await connectDB()

    // Save to MongoDB
    const galleryItem = await Gallery.create({
      title: title.trim(),
      description: description?.trim(),
      year,
      category: category as GalleryCategory,
      mediaType: file.type.startsWith('video/') ? 'video' : 'image',
      mediaUrl: cloudResult.secure_url,
      cloudinaryPublicId: cloudResult.public_id,
      thumbnailUrl: cloudResult.thumbnail_url,
      featured,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Memory uploaded successfully',
        data: galleryItem,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[GALLERY POST ERROR]', error)
    return NextResponse.json(
      { success: false, message: 'Unable to upload gallery item. Please try again.' },
      { status: 500 }
    )
  }
}
