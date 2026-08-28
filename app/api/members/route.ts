import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Member from '@/models/Member'
import { SVV_MEMBERS } from '@/lib/svv-members-data'

export async function GET() {
  try {
    await connectDB()

    // Fetch members sorted by exact user sequence (order: 1)
    let members = await Member.find().sort({ order: 1 })

    // Auto-seed if database collection is empty
    if (members.length === 0) {
      console.log('[AUTO-SEED] Seeding members to MongoDB in exact sequence...')
      const membersToInsert = SVV_MEMBERS.map((m, idx) => ({
        name: m.name,
        role: m.role,
        category: m.category,
        joinedYear: m.joinedYear,
        badge: m.badge,
        avatarColor: m.avatarColor,
        order: idx,
      }))
      members = await Member.insertMany(membersToInsert)
    }

    return NextResponse.json({
      success: true,
      data: members,
    })
  } catch (error) {
    console.error('[API MEMBERS GET ERROR]', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch members from database' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()

    if (!body.name) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      )
    }

    const count = await Member.countDocuments()
    const newMember = await Member.create({
      ...body,
      order: body.order ?? count,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Member created successfully in database',
        data: newMember,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[API MEMBERS POST ERROR]', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create member in database' },
      { status: 500 }
    )
  }
}
