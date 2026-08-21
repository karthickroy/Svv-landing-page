import { NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'

export async function POST() {
  try {
    await clearAuthCookie()
    return NextResponse.json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    console.error('[AUTH LOGOUT ERROR]', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
