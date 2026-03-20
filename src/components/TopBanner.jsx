import { useTranslation } from '../hooks/useTranslation'

const TopBanner = () => {
  const { t } = useTranslation()
  const message = t('topBanner.message')

  const CroissantIcon = ({ className }) => (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
      focusable="false"
    >
      <path
        d="M50.6 21.6c-3.7-6.9-11.7-11-20.1-10.2-9.8 1-17.4 8.4-18.5 18.1-.8 7 2 13.8 7.2 18 .9.7 1 2 .2 2.9-1.7 1.8-4.5 2.1-6.5.7-5.5-3.9-9-10.5-9-17.8C4 17.6 16.4 5.7 31.8 6.7c10.5.7 19.8 7 24.3 16.6 1.6 3.4-.8 7.2-4.6 7.3-2.1.1-4-1.1-4.9-3z"
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d="M52.2 29.2c-2.3-4.7-7.8-7.6-13.8-7.1-6.9.6-12.3 5.8-13 12.7-.6 5.2 1.7 10.1 5.7 12.9 3.7 2.6 8.5 3 12.5 1 2.1-1.1 4.7-.4 6 1.5l.1.2c1.6 2.5.7 5.8-2 7.2-6.3 3.4-13.9 3.2-20.1-.6-6.9-4.2-10.9-12.1-10-20.2 1.1-9.8 9.1-17.6 18.9-18.6 8.8-.9 17.1 3.4 20.8 10.8 1.1 2.3.2 5.1-2.1 6.2-2.2 1-4.9.1-6-2z"
        fill="currentColor"
        opacity="0.65"
      />
      <path
        d="M26.5 28.6c2.4 1.3 4.9 2 7.5 2 5.7 0 10.6-3.2 14.3-8.1.4-.5 1.1-.7 1.7-.4.6.3.9 1 .7 1.6-2 6.3-6.8 11.3-12.9 12.6-4.4.9-8.9-.1-12.7-2.4-.7-.4-1-1.2-.7-2 .3-.7 1.1-1 1.9-.7z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  )

  return (
    <div className="fixed top-20 left-0 right-0 z-[95] overflow-hidden bg-rage-black/95 border-b border-rage-yellow/20 backdrop-blur-md">
      <div className="relative h-9 sm:h-10 flex items-center">
        <div className="marquee-track">
          <div className="marquee-content">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="px-8 font-crashcourse uppercase tracking-widest text-rage-yellow text-xs sm:text-sm whitespace-nowrap inline-flex items-center gap-2"
              >
                <CroissantIcon className="w-4 h-4 sm:w-5 sm:h-5 text-rage-yellow/90" />
                {message}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBanner

