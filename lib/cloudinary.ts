import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

export const UPLOAD_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER || 'svv-memories'

/** Upload a Buffer to Cloudinary and return the result */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string
    resource_type?: 'image' | 'video' | 'raw' | 'auto'
    public_id?: string
  } = {}
) {
  return new Promise<{
    secure_url: string
    public_id: string
    resource_type: string
    thumbnail_url?: string
    duration?: number
    width?: number
    height?: number
  }>((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder ?? UPLOAD_FOLDER,
      resource_type: options.resource_type ?? 'auto' as const,
      ...(options.public_id && { public_id: options.public_id }),
    }

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error)
        if (!result) return reject(new Error('Upload failed: no result returned'))
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
          thumbnail_url:
            result.resource_type === 'video'
              ? cloudinary.url(result.public_id, {
                  resource_type: 'video',
                  format: 'jpg',
                  transformation: [{ width: 400, height: 300, crop: 'fill' }],
                })
              : cloudinary.url(result.public_id, {
                  transformation: [{ width: 400, height: 300, crop: 'fill', quality: 'auto' }],
                }),
          duration: (result as any).duration,
          width: result.width,
          height: result.height,
        })
      }
    )

    stream.end(buffer)
  })
}

/** Delete an asset from Cloudinary by its public_id */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' = 'image'
) {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}
