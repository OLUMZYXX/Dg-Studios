'use client'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

export default function CookieConsentBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!Cookies.get('cookie_consent')) {
      setShow(true)
    }
  }, [])

  const handleAccept = () => {
    Cookies.set('cookie_consent', 'true', { expires: 365 })
    setShow(false)
  }

  const handleDeny = () => {
    Cookies.set('cookie_consent', 'false', { expires: 365 })
    setShow(false)
  }

  if (!show) return null

  return (
    <div className='fixed bottom-0 left-0 w-full bg-black text-white px-4 py-4 flex flex-col sm:flex-row items-center justify-between z-50 shadow-lg'>
      <span className='mb-2 sm:mb-0 text-sm'>
        This website uses cookies to enhance your experience. By continuing, you
        agree to our use of cookies.
      </span>
      <div className='flex gap-2'>
        <button
          onClick={handleAccept}
          className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer text-xs sm:text-sm'
        >
          Accept
        </button>
        <button
          onClick={handleDeny}
          className='bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer text-xs sm:text-sm'
        >
          Deny
        </button>
      </div>
    </div>
  )
}
