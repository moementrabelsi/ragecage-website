function getCloudinaryBaseUrl(resourceType) {
  const imageBase = import.meta.env.VITE_CLOUDINARY_BASE_URL
  if (!imageBase) return null

  if (resourceType === 'image') return imageBase

  const explicitVideoBase = import.meta.env.VITE_CLOUDINARY_VIDEO_BASE_URL
  if (explicitVideoBase) return explicitVideoBase

  // Derive video base from image base when possible:
  // https://res.cloudinary.com/<cloud>/image/upload -> .../video/upload
  return imageBase.replace('/image/upload', '/video/upload')
}

function buildCloudinaryUrl(resourceType, publicId, { width, quality, format } = {}) {
  const base = getCloudinaryBaseUrl(resourceType)
  if (!base || !publicId) return null

  const cleanPublicId = String(publicId).replace(/^\/+/, '')
  const parts = []

  if (format) parts.push(`f_${format}`)
  if (quality) parts.push(`q_${quality}`)
  if (width) parts.push(`w_${width}`)

  const transformation = parts.join(',')
  return transformation ? `${base}/${transformation}/${cleanPublicId}` : `${base}/${cleanPublicId}`
}

export function cloudinaryImageUrl(publicId, { width, quality = 'auto', format = 'auto' } = {}) {
  return buildCloudinaryUrl('image', publicId, { width, quality, format })
}

export function cloudinaryVideoUrl(publicId, { width, quality = 'auto', format = 'mp4' } = {}) {
  return buildCloudinaryUrl('video', publicId, { width, quality, format })
}

