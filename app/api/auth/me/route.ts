import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Admin from '@/models/Admin'

export async function GET() {
  try {
    const payload = await verifyAuth()

    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()
    const admin = await Admin.findById(payload.sub)

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Authenticated',
      data: {
        _id: admin._id,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    })
  } catch (error) {
    console.error('[AUTH ME ERROR]', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
