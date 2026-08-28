import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import Admin from '@/models/Admin'
import { signJWT, setAuthCookie } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = body.email?.trim()
    const password = body.password

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    await connectDB()

    // Auto-seed admin if no admin account exists in MongoDB yet
    const adminCount = await Admin.countDocuments()
    if (adminCount === 0) {
      const defaultEmail = (process.env.ADMIN_EMAIL || 'admin@svv.org').toLowerCase()
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin@123'
      const passwordHash = await bcrypt.hash(defaultPassword, 12)

      await Admin.create({
        email: defaultEmail,
        passwordHash,
        role: 'admin',
      })
      console.log(`[AUTO-SEED] Created initial admin user: ${defaultEmail}`)
    }

    // Find admin and include passwordHash (excluded by default)
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+passwordHash')

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await bcrypt.compare(password, admin.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create JWT
    const token = await signJWT({
      sub: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    })

    // Set HTTP-only cookie
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error('[AUTH LOGIN ERROR]', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
