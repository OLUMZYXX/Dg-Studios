'use client'
import React from 'react'
import { motion, easeInOut } from 'framer-motion'

export default function CookiePolicy() {
  // Floating logo variants
  const floatingVariants = {
    float1: {
      x: [0, 30, -20, 0],
      y: [0, -40, 20, 0],
      rotate: [0, 10, -5, 0],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
    float2: {
      x: [0, -25, 35, 0],
      y: [0, 30, -25, 0],
      rotate: [0, -8, 12, 0],
      transition: {
        duration: 25,
        repeat: Infinity,
        ease: easeInOut,
        delay: 5,
      },
    },
    float3: {
      x: [0, 20, -30, 0],
      y: [0, -30, 35, 0],
      rotate: [0, 15, -10, 0],
      transition: {
        duration: 22,
        repeat: Infinity,
        ease: easeInOut,
        delay: 10,
      },
    },
    float4: {
      x: [0, -35, 15, 0],
      y: [0, 25, -35, 0],
      rotate: [0, -12, 8, 0],
      transition: {
        duration: 28,
        repeat: Infinity,
        ease: easeInOut,
        delay: 15,
      },
    },
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-900 font-body relative overflow-hidden'>
      {/* Floating DG Logos */}
      <motion.div
        className='absolute top-20 left-10 opacity-30 pointer-events-none select-none'
        variants={floatingVariants}
        animate='float1'
      >
        <div className='text-8xl font-bold text-gray-400'>DG</div>
      </motion.div>

      <motion.div
        className='absolute top-40 right-16 opacity-25 pointer-events-none select-none'
        variants={floatingVariants}
        animate='float2'
      >
        <div className='text-6xl font-bold text-gray-400'>DG</div>
      </motion.div>

      <motion.div
        className='absolute bottom-32 left-20 opacity-35 pointer-events-none select-none'
        variants={floatingVariants}
        animate='float3'
      >
        <div className='text-7xl font-bold text-gray-400'>DG</div>
      </motion.div>

      <motion.div
        className='absolute bottom-20 right-12 opacity-20 pointer-events-none select-none hidden sm:block'
        variants={floatingVariants}
        animate='float4'
      >
        <div className='text-5xl font-bold text-gray-400'>DG</div>
      </motion.div>

      <motion.div
        className='max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-16 md:py-20 relative z-10'
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.21, 1.11, 0.81, 0.99] }}
      >
        <div className='text-center mb-10 sm:mb-14 md:mb-16'>
          <h1 className='text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
            Cookie Policy
          </h1>
          <div className='w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full'></div>
        </div>
        <motion.div
          className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 hover:shadow-xl transition-all duration-300'
          whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
        >
          <p className='text-base sm:text-lg mb-4'>
            DG Studios uses cookies to enhance your experience. This policy
            explains how and why we use cookies.
          </p>
          <ul className='list-disc pl-6 space-y-2 text-gray-700 text-sm sm:text-base'>
            <li>
              Cookies help us analyze site usage and improve our services.
            </li>
            <li>
              You can disable cookies in your browser settings, but some
              features may not work.
            </li>
            <li>We do not use cookies to collect personal information.</li>
            <li>
              By using our site, you consent to our use of cookies as described.
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}
