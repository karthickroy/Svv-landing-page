import mongoose, { Schema, Document, Model } from 'mongoose'

export type MediaType = 'image' | 'video'

export type GalleryCategory =
  | 'Celebration'
  | 'Pooja'
  | 'Family'
  | 'Procession'
  | 'Decoration'
  | 'Cultural'
  | 'Memories'
  | 'Other'

export interface IGallery extends Document {
  title: string
  description?: string
  year: number
  category: GalleryCategory
  mediaType: MediaType
  mediaUrl: string
  cloudinaryPublicId: string
  thumbnailUrl?: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const GallerySchema = new Schema<IGallery>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1990, 'Year must be 1990 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    category: {
      type: String,
      enum: ['Celebration', 'Pooja', 'Family', 'Procession', 'Decoration', 'Cultural', 'Memories', 'Other'],
      default: 'Celebration',
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      required: [true, 'Media type is required'],
    },
    mediaUrl: {
      type: String,
      required: [true, 'Media URL is required'],
    },
    cloudinaryPublicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
    },
    thumbnailUrl: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for faster queries
GallerySchema.index({ year: -1 })
GallerySchema.index({ mediaType: 1 })
GallerySchema.index({ featured: 1 })
GallerySchema.index({ createdAt: -1 })

// Prevent model re-registration during hot reload
const Gallery: Model<IGallery> =
  mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema)

export default Gallery
