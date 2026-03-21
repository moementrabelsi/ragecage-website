import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { FaStar, FaExternalLinkAlt } from 'react-icons/fa'
import { useTranslation } from '../hooks/useTranslation'

const API_BASE = import.meta.env.VITE_API_URL || ''

function StarRow({ rating, className = '', iconSize = 14 }) {
  const full = Math.round(rating)
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar
          key={i}
          className={i <= full ? 'text-rage-yellow' : 'text-gray-600'}
          size={iconSize}
        />
      ))}
    </div>
  )
}

const ReviewsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const { t } = useTranslation()
  const [state, setState] = useState({
    loading: true,
    data: null,
    error: null,
  })

  useEffect(() => {
    if (!isInView) return

    let cancelled = false
    const base = API_BASE.replace(/\/$/, '')
    const url = `${base}/api/reviews`

    ;(async () => {
      try {
        const res = await fetch(url)
        const json = await res.json()
        if (cancelled) return
        setState({ loading: false, data: json, error: null })
      } catch (e) {
        if (cancelled) return
        setState({ loading: false, data: null, error: e.message })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isInView])

  const fallbackMapsUrl = import.meta.env.VITE_GOOGLE_MAPS_LISTING_URL || ''
  const reviews = (state.data?.reviews || []).slice(0, 5)
  const showSummary =
    state.data?.ok && (state.data.rating != null || reviews.length > 0)
  const mapsUrl = state.data?.mapsUrl || fallbackMapsUrl

  return (
    <div
      ref={ref}
      className="relative bg-gradient-to-b from-rage-black via-gray-950 to-gray-900 py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8"
      aria-labelledby="reviews-heading"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(254,174,17,0.08)_0%,transparent_50%)]" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2
            id="reviews-heading"
            className="font-rage text-3xl text-rage-heading sm:text-4xl md:text-5xl"
          >
            <span className="text-rage-yellow">{t('reviews.titlePart1')}</span>
            <span className="text-white"> {t('reviews.titlePart2')}</span>
          </h2>
          <div className="mx-auto mt-4 h-1 w-24 bg-rage-yellow" />
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-400 sm:text-base">
            {t('reviews.subtitle')}
          </p>
        </motion.div>

        {state.loading && (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-rage-yellow border-t-transparent" />
          </div>
        )}

        {!state.loading && state.error && (
          <p className="text-center text-gray-400">{t('reviews.loadError')}</p>
        )}

        {!state.loading && !state.error && state.data && !state.data.configured && (
          <div className="rounded-xl border border-rage-yellow/20 bg-gray-900/60 p-8 text-center backdrop-blur-sm">
            <p className="text-gray-300">{t('reviews.notConfigured')}</p>
            {fallbackMapsUrl ? (
              <a
                href={fallbackMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-rage-yellow hover:underline"
              >
                {t('reviews.viewOnGoogle')} <FaExternalLinkAlt className="text-sm" />
              </a>
            ) : null}
          </div>
        )}

        {!state.loading && state.data?.configured && !state.data?.ok && (
          <p className="text-center text-gray-400">
            {state.data?.error ? `${t('reviews.apiError')}: ${state.data.error}` : t('reviews.noReviews')}
          </p>
        )}

        {!state.loading && showSummary && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.45 }}
              className="mb-10 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-6"
            >
              {state.data.rating != null && (
                <div className="flex items-center gap-3">
                  <span className="font-rage text-4xl text-rage-yellow md:text-5xl">
                    {state.data.rating.toFixed(1)}
                  </span>
                  <div>
                    <StarRow rating={state.data.rating} iconSize={20} />
                    {state.data.userRatingsTotal != null && (
                      <p className="mt-1 text-xs text-gray-400">
                        {t('reviews.basedOn', {
                          count: state.data.userRatingsTotal,
                        })}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-rage-yellow/40 bg-rage-yellow/10 px-5 py-2.5 text-sm font-semibold text-rage-yellow transition-colors hover:bg-rage-yellow/20"
                >
                  {t('reviews.viewOnGoogle')} <FaExternalLinkAlt />
                </a>
              )}
            </motion.div>

            {reviews.length > 0 && (
              <ul
                className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory touch-pan-x overscroll-x-contain scrollbar-hide md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pb-0 md:snap-none lg:grid-cols-3"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {reviews.map((rev, idx) => (
                  <motion.li
                    key={`${rev.authorName}-${idx}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.08 * idx, duration: 0.4 }}
                    className="flex w-[min(92vw,24rem)] min-w-[min(92vw,24rem)] max-w-[min(92vw,24rem)] shrink-0 snap-center flex-col rounded-xl border border-rage-yellow/15 bg-gray-900/80 p-3 shadow-lg backdrop-blur-sm md:w-auto md:min-w-0 md:max-w-none md:p-4"
                  >
                    <div className="mb-2 flex items-start gap-2.5">
                      {rev.profilePhotoUrl ? (
                        <img
                          src={rev.profilePhotoUrl}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-full object-cover"
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rage-yellow/20 text-sm font-bold text-rage-yellow">
                          {(rev.authorName || '?').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-white">
                          {rev.authorName}
                        </p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2">
                          <StarRow rating={rev.rating} />
                          <span className="text-xs text-gray-500">
                            {rev.relativeTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-snug text-gray-300 line-clamp-6">
                      {rev.text?.trim() ? rev.text : '—'}
                    </p>
                  </motion.li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ReviewsSection
