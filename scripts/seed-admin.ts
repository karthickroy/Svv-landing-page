#!/usr/bin/env tsx
/**
 * Admin Seed Script
 * Run: npm run seed:admin
 *
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from environment variables,
 * hashes the password with bcrypt, and creates the admin in MongoDB
 * if it does not already exist.
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

async function seedAdmin() {
  console.log('\n🪔  SVV Admin Seed Script\n')

  // Validate environment variables
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set in .env.local')
    process.exit(1)
  }
  if (!ADMIN_EMAIL) {
    console.error('❌ ADMIN_EMAIL is not set in .env.local')
    process.exit(1)
  }
  if (!ADMIN_PASSWORD) {
    console.error('❌ ADMIN_PASSWORD is not set in .env.local')
    process.exit(1)
  }
  if (ADMIN_PASSWORD.length < 8) {
    console.error('❌ ADMIN_PASSWORD must be at least 8 characters')
    process.exit(1)
  }

  // Connect to MongoDB
  console.log('📡 Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected to MongoDB')

  // Define Admin schema inline (avoid circular imports from Next.js models)
  const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'admin' },
  }, { timestamps: true })

  const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)

  // Check if admin already exists
  const existing = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() })
  if (existing) {
    console.log(`ℹ️  Admin already exists: ${ADMIN_EMAIL}`)
    await mongoose.disconnect()
    console.log('✅ Done — no changes made.\n')
    return
  }

  // Hash password
  console.log('🔐 Hashing password...')
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12)

  // Create admin
  await Admin.create({
    email: ADMIN_EMAIL.toLowerCase(),
    passwordHash,
    role: 'admin',
  })

  console.log(`\n✅ Admin created successfully!`)
  console.log(`   Email: ${ADMIN_EMAIL}`)
  console.log(`   Role:  admin`)
  console.log('\n🙏 You can now login at /admin/login\n')

  await mongoose.disconnect()
}

seedAdmin().catch((error) => {
  console.error('❌ Seed failed:', error)
  process.exit(1)
})
