// ─── Gallery Types ──────────────────────────────────────────────────────────

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

export interface GalleryItem {
  _id: string
  title: string
  description?: string
  year: number
  category: GalleryCategory
  mediaType: MediaType
  mediaUrl: string
  cloudinaryPublicId: string
  thumbnailUrl?: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

// ─── API Response Types ─────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total?: number
  page?: number
  limit?: number
}

// ─── Auth Types ─────────────────────────────────────────────────────────────

export interface AdminUser {
  _id: string
  email: string
  role: 'admin' | 'superadmin'
  createdAt: string
}

// ─── Filter Types ───────────────────────────────────────────────────────────

export interface GalleryFilters {
  year?: number | 'all'
  mediaType?: MediaType | 'all'
  featured?: boolean
  search?: string
  page?: number
  limit?: number
  sort?: 'newest' | 'oldest'
}

// ─── Upload Types ───────────────────────────────────────────────────────────

export interface UploadFormData {
  title: string
  description?: string
  year: number
  category: GalleryCategory
  mediaType: MediaType
  featured: boolean
  file: File
}

export type EditFormData = Omit<UploadFormData, 'file' | 'mediaType'>
