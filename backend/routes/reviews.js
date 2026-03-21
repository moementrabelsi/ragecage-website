import express from 'express'

const router = express.Router()

/**
 * Proxies Google Place Details (reviews) so the API key stays on the server.
 * Env: GOOGLE_PLACES_API_KEY, GOOGLE_PLACE_ID
 * Enable "Places API" in Google Cloud Console for this key.
 */
router.get('/reviews', async (req, res) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) {
    return res.status(503).json({
      ok: false,
      configured: false,
      reviews: [],
      message: 'Reviews API not configured',
    })
  }

  try {
    const params = new URLSearchParams({
      place_id: placeId,
      fields: 'name,rating,user_ratings_total,reviews,url',
      key: apiKey,
    })

    const url = `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`
    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== 'OK' || !data.result) {
      console.warn('[reviews] Google Places status:', data.status, data.error_message || '')
      return res.status(502).json({
        ok: false,
        configured: true,
        status: data.status,
        reviews: [],
        error: data.error_message || data.status,
      })
    }

    const { result } = data
    const reviews = (result.reviews || []).slice(0, 5).map((rev) => ({
      authorName: rev.author_name,
      rating: rev.rating,
      relativeTime: rev.relative_time_description,
      text: rev.text || '',
      profilePhotoUrl: rev.profile_photo_url || null,
    }))

    res.json({
      ok: true,
      configured: true,
      placeName: result.name,
      rating: result.rating,
      userRatingsTotal: result.user_ratings_total,
      mapsUrl: result.url || null,
      reviews,
    })
  } catch (err) {
    console.error('[reviews]', err)
    res.status(500).json({
      ok: false,
      configured: true,
      reviews: [],
      error: err.message,
    })
  }
})

export default router
