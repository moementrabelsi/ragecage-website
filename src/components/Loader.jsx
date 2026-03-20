import { useTranslation } from '../hooks/useTranslation'

// Spinning logo loader with yellow ring
const Loader = ({ size = 120 }) => {
  const { t } = useTranslation()
  const ringSize = size + 24

  return (
    <div className="flex items-center justify-center">
      <div
        className="relative flex items-center justify-center"
        style={{ width: ringSize, height: ringSize }}
        aria-label={t('loader.loading')}
      >
        <div className="absolute inset-0 rounded-full border-4 border-rage-yellow/50 border-t-rage-yellow animate-spin" />
        <img
          src="/logo/rage-128.png"
          srcSet="/logo/rage-96.png 96w, /logo/rage-128.png 128w, /logo/rage-192.png 192w"
          sizes="120px"
          alt={t('loader.logoAlt')}
          className="rounded-full shadow-lg"
          loading="eager"
          decoding="async"
          style={{ width: size, height: size }}
        />
      </div>
    </div>
  )
}

export default Loader



