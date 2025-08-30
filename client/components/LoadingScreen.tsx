'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export default function LoadingScreen({
  onLoadingComplete,
}: LoadingScreenProps) {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // PURE TIMER-BASED LOADING - EXACTLY 3 SECONDS, NO DEPENDENCIES
    const loadingTimer = setTimeout(() => {
      onLoadingComplete()
    }, 3000) // Exactly 3 seconds

    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, 2700) // Start fade at 2.7 seconds

    return () => {
      clearTimeout(loadingTimer)
      clearTimeout(fadeTimer)
    }
  }, [onLoadingComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Enhanced blur backdrop for better text visibility */}
      <div className='absolute inset-0 bg-white/40 backdrop-blur-xl' />

      {/* Logo container */}
      <div className='relative z-10 flex flex-col items-center'>
        {/* DG Studio Logo */}
        <div className='mb-8'>
          <div className='flex items-center justify-center animate-pulse'>
            {/* DG Studio Text with enhanced visibility */}
            <div className='text-black font-heading font-bold'>
              <div className='text-5xl md:text-6xl tracking-tight drop-shadow-2xl text-black bg-white/60 px-6 py-2 rounded-2xl backdrop-blur-sm border border-white/30'>
                DG Studio
              </div>
            </div>
          </div>
        </div>

        {/* Loading dots with enhanced visibility */}
        <div className='flex space-x-3 bg-white/60 px-6 py-3 rounded-full backdrop-blur-sm border border-white/30'>
          <div
            className='w-4 h-4 bg-black rounded-full animate-bounce drop-shadow-lg'
            style={{ animationDelay: '0ms' }}
          />
          <div
            className='w-4 h-4 bg-black rounded-full animate-bounce drop-shadow-lg'
            style={{ animationDelay: '150ms' }}
          />
          <div
            className='w-4 h-4 bg-black rounded-full animate-bounce drop-shadow-lg'
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  )
}
