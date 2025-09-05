'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Heart,
  Share2,
} from 'lucide-react'

interface LightboxProps {
  isOpen: boolean
  onClose: () => void
  images: Array<{
    id: string
    url: string
    title: string
    category: string
  }>
  currentIndex: number
  onNavigate: (direction: 'prev' | 'next') => void
}

export default function Lightbox({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
}: LightboxProps) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [shareMsg, setShareMsg] = useState('')

  useEffect(() => {
    // Load favorites from localStorage
    const favs = localStorage.getItem('dg_studios_favorites')
    setFavorites(favs ? JSON.parse(favs) : [])
  }, [isOpen])

  if (!images || images.length === 0) return null

  const currentImage = images[currentIndex]

  const handleDownload = async () => {
    try {
      const response = await fetch(currentImage.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `dg-studios-${currentImage.title
        .toLowerCase()
        .replace(/\s+/g, '-')}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(currentImage.url)
      setShareMsg('Image link copied!')
      setTimeout(() => setShareMsg(''), 2000)
    } catch (error) {
      setShareMsg('Failed to copy link')
      setTimeout(() => setShareMsg(''), 2000)
    }
  }

  const isFavorited = currentImage ? favorites.includes(currentImage.id) : false
  const handleFavorite = () => {
    if (!currentImage) return
    let updated
    if (isFavorited) {
      updated = favorites.filter((id) => id !== currentImage.id)
    } else {
      updated = [...favorites, currentImage.id]
    }
    setFavorites(updated)
    localStorage.setItem('dg_studios_favorites', JSON.stringify(updated))
  }

  return (
    <AnimatePresence>
      {isOpen && currentImage && (
        <>
          {/* Backdrop */}
          <motion.div
            className='fixed inset-0 bg-black/90 backdrop-blur-sm z-50'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Lightbox Container */}
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className='absolute top-4 right-4 z-10 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
            </motion.button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <motion.button
                  onClick={() => onNavigate('prev')}
                  className='absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft size={24} />
                </motion.button>

                <motion.button
                  onClick={() => onNavigate('next')}
                  className='absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight size={24} />
                </motion.button>
              </>
            )}

            {/* Image Container */}
            <motion.div
              className='relative max-w-[1400px] max-h-[90vh] w-full h-full flex items-center justify-center'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={currentImage.url}
                alt={currentImage.title}
                className='max-w-full max-h-full object-contain rounded-lg shadow-2xl'
              />

              {/* Image Info Overlay */}
              <motion.div
                className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg'
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-white text-xl font-semibold mb-1'>
                      {currentImage.title}
                    </h3>
                    <p className='text-white/80 text-sm capitalize'>
                      {currentImage.category} • {currentIndex + 1} of{' '}
                      {images.length}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex items-center space-x-3'>
                    <motion.button
                      onClick={handleDownload}
                      className='p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title='Download Image'
                    >
                      <Download size={20} />
                    </motion.button>

                    <motion.button
                      onClick={handleShare}
                      className='p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title='Share Image Link'
                    >
                      <Share2 size={20} />
                    </motion.button>

                    <motion.button
                      onClick={handleFavorite}
                      className={`p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 ${
                        isFavorited ? 'bg-red-600/80' : ''
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title={isFavorited ? 'Unfavorite' : 'Favorite'}
                    >
                      <Heart size={20} fill={isFavorited ? 'red' : 'none'} />
                    </motion.button>
                  </div>
                </div>
                {shareMsg && (
                  <div className='mt-2 text-green-400 text-sm'>{shareMsg}</div>
                )}
              </motion.div>
            </motion.div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <motion.div
                className='absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 bg-white/10 backdrop-blur-md rounded-full p-2 max-w-lg overflow-x-auto'
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {images
                  .slice(Math.max(0, currentIndex - 2), currentIndex + 3)
                  .map((image, idx) => {
                    const actualIndex = Math.max(0, currentIndex - 2) + idx
                    return (
                      <motion.button
                        key={image.id}
                        onClick={() => {
                          const diff = actualIndex - currentIndex
                          if (diff > 0) {
                            for (let i = 0; i < diff; i++) onNavigate('next')
                          } else if (diff < 0) {
                            for (let i = 0; i < Math.abs(diff); i++)
                              onNavigate('prev')
                          }
                        }}
                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          actualIndex === currentIndex
                            ? 'border-white shadow-lg'
                            : 'border-white/30 hover:border-white/60'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <img
                          src={image.url}
                          alt={image.title}
                          className='w-full h-full object-cover'
                        />
                      </motion.button>
                    )
                  })}
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
