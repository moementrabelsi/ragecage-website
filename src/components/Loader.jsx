import { useTranslation } from '../hooks/useTranslation'
import logo from '../assets/logo/rage.png'

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
          src={logo}
          alt={t('loader.logoAlt')}
          className="rounded-full shadow-lg"
          style={{ width: size, height: size }}
        />
      </div>
    </div>
  )
}

export default Loader



