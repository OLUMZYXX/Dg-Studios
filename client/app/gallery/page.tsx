'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Camera, Filter, Grid, List } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Lightbox from '../../components/Lightbox'
import { PortfolioItem, fetchPortfolio } from '../../utils/portfolioApi'

export default function Gallery() {
  const router = useRouter()
  const [images, setImages] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    setLoading(true)
    let mounted = true
    ;(async () => {
      try {
        const data = await fetchPortfolio()
        if (mounted) setImages(data)
      } catch (err) {
        if (mounted) setImages([])
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const categories = [
    { id: 'all', name: 'All', count: images.length },
    ...Array.from(new Set(images.map((img) => img.category))).map((cat) => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      count: images.filter((img) => img.category === cat).length,
    })),
  ]

  const filteredImages =
    activeCategory === 'all'
      ? images
      : images.filter((img) => img.category === activeCategory)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      setLightboxIndex((prev) => (prev + 1) % filteredImages.length)
    } else {
      setLightboxIndex(
        (prev) => (prev - 1 + filteredImages.length) % filteredImages.length
      )
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white'>
      {/* Header */}
      <motion.header
        className='bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50'
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className='max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between'>
          <motion.button
            onClick={() => router.back()}
            className='flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-300'
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={20} />
            <span className='font-medium'>Back</span>
          </motion.button>

          <motion.h1
            className='text-2xl sm:text-3xl font-bold text-black'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Gallery
          </motion.h1>

          <div className='flex items-center space-x-4'>
            <motion.button
              onClick={() =>
                setViewMode(viewMode === 'grid' ? 'masonry' : 'grid')
              }
              className='p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 py-8'>
        {/* Category Filter */}
        <motion.div
          className='mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className='flex flex-wrap gap-3 justify-center'>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name} ({category.count})
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            className='flex justify-center items-center py-20'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className='flex items-center space-x-3'>
              <Camera className='animate-pulse' size={24} />
              <span className='text-lg font-medium'>Loading gallery...</span>
            </div>
          </motion.div>
        )}

        {/* Image Grid */}
        {!loading && (
          <motion.div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                  viewMode === 'masonry'
                    ? 'break-inside-avoid mb-6'
                    : 'aspect-square'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => openLightbox(index)}
              >
                <div className='relative overflow-hidden'>
                  <img
                    src={image.cloudinaryUrl || image.image || ''}
                    alt={image.title}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />

                  {/* Overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500'>
                    <div className='absolute bottom-4 left-4 right-4'>
                      <h3 className='text-white font-semibold text-lg mb-1'>
                        {image.title}
                      </h3>
                      <span className='text-white/80 text-sm capitalize'>
                        {image.category}
                      </span>
                    </div>

                    {/* Click to view indicator */}
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                      <div className='bg-white/20 backdrop-blur-sm rounded-full p-3'>
                        <Camera size={24} className='text-white' />
                      </div>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <span className='bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium capitalize'>
                      {image.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredImages.length === 0 && (
          <motion.div
            className='text-center py-20'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Camera size={48} className='mx-auto mb-4 text-gray-400' />
            <h3 className='text-xl font-semibold text-gray-600 mb-2'>
              No images found
            </h3>
            <p className='text-gray-500'>Try selecting a different category</p>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={filteredImages.map((img) => ({
          id: img.id ?? '',
          url: img.cloudinaryUrl || img.image || '',
          title: img.title,
          category: img.category,
        }))}
        currentIndex={lightboxIndex}
        onNavigate={navigateLightbox}
      />
    </div>
  )
}
