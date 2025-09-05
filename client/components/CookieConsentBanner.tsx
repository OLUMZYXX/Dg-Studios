'use client'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

export default function CookieConsentBanner() {
  const [show, setShow] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!Cookies.get('cookie_consent')) {
      setShow(true)
      // Delay for smooth entrance animation
      setTimeout(() => setIsVisible(true), 100)
    }
  }, [])

  const handleAccept = () => {
    Cookies.set('cookie_consent', 'true', { expires: 365 })
    setIsVisible(false)
    setTimeout(() => setShow(false), 300) // Wait for exit animation
  }

  const handleDeny = () => {
    Cookies.set('cookie_consent', 'false', { expires: 365 })
    setIsVisible(false)
    setTimeout(() => setShow(false), 300) // Wait for exit animation
  }

  if (!show) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      {/* Backdrop blur overlay */}
      <div className='absolute inset-0 bg-black/20 backdrop-blur-sm' />

      {/* Main banner */}
      <div className='relative bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 gap-4'>
            {/* Content */}
            <div className='flex items-start gap-4 flex-1'>
              {/* Cookie icon */}
              <div className='flex-shrink-0 w-10 h-10 bg-black rounded-full flex items-center justify-center mt-1'>
                <svg
                  className='w-5 h-5 text-white'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h.01a1 1 0 100-2H7zm3-2a1 1 0 000 2h.01a1 1 0 100-2H10zm3 3a1 1 0 000 2h.01a1 1 0 100-2H13z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>

              <div className='flex-1 min-w-0'>
                <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                  Cookie Preferences
                </h3>
                <p className='text-sm text-gray-600 leading-relaxed'>
                  We use cookies to enhance your browsing experience, serve
                  personalized content, and analyze our traffic. Choose your
                  preferences below.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto'>
              <button
                onClick={handleDeny}
                className='group relative px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-sm active:scale-[0.98]'
              >
                <span className='relative z-10'>Decline</span>
              </button>

              <button
                onClick={handleAccept}
                className='group relative px-6 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-black/20 active:scale-[0.98] overflow-hidden'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-200' />
                <span className='relative z-10 flex items-center gap-2'>
                  Accept All
                  <svg
                    className='w-4 h-4 transition-transform group-hover:translate-x-0.5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className='h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent' />
        </div>
      </div>
    </div>
  )
}
