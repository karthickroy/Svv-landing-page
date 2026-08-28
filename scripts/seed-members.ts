import 'dotenv/config'
import mongoose from 'mongoose'
import Member from '../models/Member'
import { SVV_MEMBERS } from '../lib/svv-members-data'

async function seedMembers() {
  console.log('\n🪔  SVV Group Members MongoDB Seed Script\n')

  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set in .env.local')
    process.exit(1)
  }

  console.log('📡 Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected to MongoDB')

  console.log('⚠️ Clearing previous members collection...')
  await Member.deleteMany({})

  console.log(`🌱 Seeding ${SVV_MEMBERS.length} SVV members into MongoDB in exact user order...`)

  const membersToInsert = SVV_MEMBERS.map((m, idx) => ({
    name: m.name,
    role: "SVV Group Member",
    category: "SVV Group Member",
    joinedYear: 1999,
    badge: "Member since 1999",
    avatarColor: m.avatarColor,
    order: idx,
  }))

  const inserted = await Member.insertMany(membersToInsert)
  console.log(`✅ Successfully seeded ${inserted.length} members to MongoDB in exact sequence!`)

  await mongoose.disconnect()
  console.log('🎉 Done!\n')
}

seedMembers().catch((err) => {
  console.error('❌ Seed members failed:', err)
  process.exit(1)
})
