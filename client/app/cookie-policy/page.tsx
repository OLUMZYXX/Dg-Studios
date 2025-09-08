'use client'
import React from 'react'
import { motion } from 'framer-motion'

export default function CookiePolicy() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-900 font-body'>
      <motion.div
        className='max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-16 md:py-20'
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
          className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300'
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
