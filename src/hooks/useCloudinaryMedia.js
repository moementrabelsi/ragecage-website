import { useEffect, useState } from 'react'

export function useCloudinaryMedia(folder, resourceType = 'image') {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!folder) return

    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)
        const baseUrl = import.meta.env.VITE_API_URL || ''
        const url = `${baseUrl.replace(/\/$/, '')}/api/media/${encodeURIComponent(
          folder
        )}?resourceType=${encodeURIComponent(resourceType)}`

        const res = await fetch(url)
        if (!res.ok) {
          throw new Error(`Failed to fetch media: ${res.status}`)
        }

        const data = await res.json()
        if (!cancelled) {
          setItems(data.items || [])
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('useCloudinaryMedia error:', err)
          setError(err)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [folder, resourceType])

  return { items, loading, error }
}

