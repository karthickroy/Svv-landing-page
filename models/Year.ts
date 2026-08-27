import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IYear extends Document {
  year: number
  title?: string
  description?: string
  coverImageUrl?: string
  createdAt: Date
  updatedAt: Date
}

const YearSchema = new Schema<IYear>(
  {
    year: {
      type: Number,
      required: [true, 'Year is required'],
      unique: true,
      min: [1900, 'Year must be 1900 or later'],
      max: [2100, 'Year must be valid'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    coverImageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Index for year sorting
YearSchema.index({ year: -1 })

const Year: Model<IYear> =
  mongoose.models.Year || mongoose.model<IYear>('Year', YearSchema)

export default Year
