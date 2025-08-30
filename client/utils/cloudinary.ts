import { Cloudinary } from '@cloudinary/url-gen'
import { fill } from '@cloudinary/url-gen/actions/resize'
// Extract cloud name from CLOUDINARY_URL
const getCloudName = () => {
  const cloudinaryUrl = process.env.CLOUDINARY_URL || ''
  const match = cloudinaryUrl.match(/cloudinary:\/\/.*@(.+)/)
  return match ? match[1] : 'drqkqdttn' // fallback to your cloud name
}

// Create a Cloudinary instance
export const cld = new Cloudinary({
  cloud: {
    cloudName: getCloudName(),
  },
})

// Upload function for client-side uploads
export const uploadImage = async (file: File, publicId?: string) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'dg_studio_uploads')

  if (publicId) {
    formData.append('public_id', publicId)
  }

  const cloudName = getCloudName()

  try {
    console.log(
      `Uploading to cloud: ${cloudName} with preset: dg_studio_uploads`
    )
    console.log(`File details: ${file.name} (${file.size} bytes, ${file.type})`)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Upload failed. Response:', data)
      throw new Error(
        data.error?.message ||
          `Upload failed: ${response.status} ${response.statusText}`
      )
    }

    console.log('Upload successful! Image URL:', data.secure_url)
    console.log('Public ID:', data.public_id)
    return data
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// Helper function to get optimized image URLs
export const getOptimizedImageUrl = (
  publicId: string,
  width?: number,
  height?: number
) => {
  const img = cld.image(publicId)

  if (width && height) {
    img.resize(fill().width(width).height(height))
  }

  return img.toURL()
}
