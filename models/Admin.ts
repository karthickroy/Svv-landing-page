import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAdmin extends Document {
  email: string
  passwordHash: string
  role: 'admin' | 'superadmin'
  createdAt: Date
  updatedAt: Date
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // Never return passwordHash in queries by default
    },
    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
)

// Prevent model re-registration during hot reload
const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema)

export default Admin
