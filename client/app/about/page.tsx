'use client'
import React from 'react'
import { motion, easeInOut } from 'framer-motion'

export default function AboutUs() {
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
        {/* Header Section */}
        <div className='text-center mb-10 sm:mb-14 md:mb-16'>
          <h1 className='text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
            About DG Studios
          </h1>
          <div className='w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full'></div>
        </div>

        {/* Content Section */}
        <div className='space-y-8'>
          <motion.div
            className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 hover:shadow-xl transition-all duration-300'
            whileHover={{
              scale: 1.02,
              boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            }}
          >
            <h2 className='text-xl sm:text-2xl font-semibold mb-4 text-gray-800'>
              Our Vision
            </h2>
            <p className='text-base sm:text-lg leading-relaxed text-gray-700'>
              DG Studios is a creative hub where visual storytelling comes to
              life. Specializing in photography, videography, and design, we are
              dedicated to transforming your ideas into powerful visuals that
              resonate.
            </p>
          </motion.div>

          <motion.div
            className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 hover:shadow-xl transition-all duration-300'
            whileHover={{
              scale: 1.02,
              boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            }}
          >
            <h2 className='text-xl sm:text-2xl font-semibold mb-4 text-gray-800'>
              Our Approach
            </h2>
            <p className='text-base sm:text-lg leading-relaxed text-gray-700'>
              Our team combines elegance and simplicity to convey our passion
              for creativity and craftsmanship. Whether it's capturing
              unforgettable moments, producing captivating videos, or creating
              stunning designs, we focus on delivering exceptional quality and
              personalized service for every project.
            </p>
          </motion.div>

          <motion.div
            className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 hover:shadow-xl transition-all duration-300'
            whileHover={{
              scale: 1.02,
              boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            }}
          >
            <h2 className='text-xl sm:text-2xl font-semibold mb-4 text-gray-800'>
              Our Commitment
            </h2>
            <p className='text-base sm:text-lg leading-relaxed text-gray-700'>
              Our goal is to help you communicate your message and vision
              through visuals that truly stand out. With years of experience and
              a commitment to excellence, DG Studios is your partner in creating
              lasting memories and impactful stories.
            </p>
          </motion.div>
        </div>

        {/* Services Preview */}
        <div className='mt-12 sm:mt-16 text-center'>
          <h3 className='text-2xl sm:text-3xl font-semibold mb-8 text-gray-800'>
            What We Do
          </h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
            <motion.div
              className='bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl p-6 hover:bg-white/90 transition-all duration-300'
              whileHover={{ scale: 1.03 }}
            >
              <div className='w-12 h-12 bg-gray-800 rounded-lg mx-auto mb-4 flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
              </div>
              <h4 className='text-lg sm:text-xl font-semibold mb-2 text-gray-800'>
                Photography
              </h4>
              <p className='text-gray-600 text-sm sm:text-base'>
                Capturing moments with artistic precision
              </p>
            </motion.div>

            <motion.div
              className='bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl p-6 hover:bg-white/90 transition-all duration-300'
              whileHover={{ scale: 1.03 }}
            >
              <div className='w-12 h-12 bg-gray-800 rounded-lg mx-auto mb-4 flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <h4 className='text-lg sm:text-xl font-semibold mb-2 text-gray-800'>
                Videography
              </h4>
              <p className='text-gray-600 text-sm sm:text-base'>
                Bringing stories to life through motion
              </p>
            </motion.div>

            <motion.div
              className='bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl p-6 hover:bg-white/90 transition-all duration-300'
              whileHover={{ scale: 1.03 }}
            >
              <div className='w-12 h-12 bg-gray-800 rounded-lg mx-auto mb-4 flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z'
                  />
                </svg>
              </div>
              <h4 className='text-lg sm:text-xl font-semibold mb-2 text-gray-800'>
                Design
              </h4>
              <p className='text-gray-600 text-sm sm:text-base'>
                Creating stunning visual experiences
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
