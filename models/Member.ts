import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IMember extends Document {
  name: string
  role: string
  category: string
  joinedYear: number
  badge: string
  phone: string
  location: string
  bio: string
  avatarColor: string
  order: number
  createdAt: Date
  updatedAt: Date
}

const MemberSchema = new Schema<IMember>(
  {
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true,
    },
    role: {
      type: String,
      default: 'SVV Group Member',
      trim: true,
    },
    category: {
      type: String,
      default: 'SVV Group Member',
      trim: true,
    },
    joinedYear: {
      type: Number,
      default: 1999,
    },
    badge: {
      type: String,
      default: 'Member since 1999',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      default: 'Pernambut, Tamil Nadu',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },
    avatarColor: {
      type: String,
      default: 'from-amber-600 to-yellow-500',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

const Member: Model<IMember> =
  mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema)

export default Member
