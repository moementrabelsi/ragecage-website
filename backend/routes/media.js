import express from 'express'
import cloudinary from 'cloudinary'

const router = express.Router()

const ensureCloudinaryConfigured = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary server credentials are not configured')
  }

  // Configure on first use (and re-use afterwards)
  cloudinary.v2.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  })
}

router.get('/media/:folder', async (req, res) => {
  try {
    ensureCloudinaryConfigured()

    const { folder } = req.params
    const { resourceType = 'image' } = req.query

    // Fetch all assets under the given folder (including subfolders)
    const expression = `folder:${folder}/* AND resource_type:${resourceType}`

    const result = await cloudinary.v2.search
      .expression(expression)
      .sort_by('public_id', 'asc')
      .max_results(50)
      .execute()

    const items = result.resources.map((r) => ({
      publicId: r.public_id,
      secureUrl: r.secure_url,
      resourceType: r.resource_type,
    }))

    res.json({ items })
  } catch (error) {
    console.error('Error fetching Cloudinary media:', error)
    res.status(500).json({ error: 'Failed to fetch media' })
  }
})

export default router

