'use client'

import { useState, useEffect } from 'react'
import { PortfolioItem, fetchPortfolio } from '../utils/portfolioApi'
import {
  fetchHeroSlides,
  addHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
} from '../utils/heroSlidesApi'

import CloudinaryImage from './CloudinaryImage'

import {
  Star,
  X,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Image,
  Grid3X3,
  Calendar,
} from 'lucide-react'
import Modal from './Modal'

// Define HeroSlide interface if not imported
interface HeroSlide {
  id: string
  portfolioItem: PortfolioItem
  addedAt: string
  order: number
}

export default function HeroSelector() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [showSelector, setShowSelector] = useState(false)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{
    open: boolean
    message: string
    title: string
    onConfirm: (() => void) | null
    showCancel: boolean
  }>({
    open: false,
    message: '',
    title: '',
    onConfirm: null,
    showCancel: false,
  })

  // Load data on component mount
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [portfolio, hero] = await Promise.all([
          fetchPortfolio(),
          fetchHeroSlides(),
        ])
        setPortfolioItems(portfolio)
        setHeroSlides(hero)
      } catch (error) {
        console.error('Failed to load data:', error)
        setModal({
          open: true,
          message: 'Failed to load data. Please refresh the page.',
          title: 'Error',
          onConfirm: () => setModal((m) => ({ ...m, open: false })),
          showCancel: false,
        })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Backend logic for hero slides
  const handleAddToHero = async (item: PortfolioItem) => {
    if (heroSlides.length >= 5) {
      setModal({
        open: true,
        message: 'Maximum 5 hero slides allowed',
        title: 'Limit Reached',
        onConfirm: () => setModal((m) => ({ ...m, open: false })),
        showCancel: false,
      })
      return
    }

    const isAlreadyInHero = heroSlides.some(
      (slide) => slide.portfolioItem.id === item.id
    )

    if (isAlreadyInHero) {
      setModal({
        open: true,
        message: 'This image is already in hero slides',
        title: 'Already Added',
        onConfirm: () => setModal((m) => ({ ...m, open: false })),
        showCancel: false,
      })
      return
    }

    try {
      const newSlide = await addHeroSlide(item)
      // Refetch hero slides to ensure backend sync
      const updatedHeroSlides = await fetchHeroSlides()
      setHeroSlides(updatedHeroSlides)
    } catch (err: any) {
      setModal({
        open: true,
        message: err.message || 'Failed to add hero slide',
        title: 'Error',
        onConfirm: () => setModal((m) => ({ ...m, open: false })),
        showCancel: false,
      })
    }
  }

  const handleRemoveFromHero = async (slideId: string) => {
    const slideToRemove = heroSlides.find((slide) => slide.id === slideId)
    const confirmMessage = slideToRemove
      ? `Remove "${slideToRemove.portfolioItem.title}" from hero slideshow?\n\nThis will only remove it from the hero slides, not from your portfolio.`
      : 'Remove this image from hero slideshow?'

    setModal({
      open: true,
      message: confirmMessage,
      title: 'Confirm Remove',
      showCancel: true,
      onConfirm: async () => {
        try {
          await deleteHeroSlide(slideId)
          // Refetch hero slides to ensure backend sync
          const updatedHeroSlides = await fetchHeroSlides()
          setHeroSlides(updatedHeroSlides)
          setModal({
            open: true,
            message: `"${
              slideToRemove?.portfolioItem.title || 'Image'
            }" removed from hero slideshow`,
            title: 'Removed',
            onConfirm: () => setModal((m) => ({ ...m, open: false })),
            showCancel: false,
          })
        } catch (err: any) {
          setModal({
            open: true,
            message: err.message || 'Failed to remove hero slide',
            title: 'Error',
            onConfirm: () => setModal((m) => ({ ...m, open: false })),
            showCancel: false,
          })
        }
      },
    })
  }

  const handleReorder = async (slideId: string, direction: 'up' | 'down') => {
    const currentIndex = heroSlides.findIndex((slide) => slide.id === slideId)
    if (currentIndex === -1) return

    const newSlides = [...heroSlides]
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= newSlides.length)
      return // Swap positions
    ;[newSlides[currentIndex], newSlides[targetIndex]] = [
      newSlides[targetIndex],
      newSlides[currentIndex],
    ]

    try {
      await reorderHeroSlides(newSlides.map((s) => s.id))
      // Refetch hero slides to ensure backend sync
      const updatedHeroSlides = await fetchHeroSlides()
      setHeroSlides(updatedHeroSlides)
    } catch (err: any) {
      setModal({
        open: true,
        message: err.message || 'Failed to reorder hero slides',
        title: 'Error',
        onConfirm: () => setModal((m) => ({ ...m, open: false })),
        showCancel: false,
      })
    }
  }

  const generatePreviewUrl = (item: PortfolioItem) => {
    if (item.publicId) {
      return `https://res.cloudinary.com/drqkqdttn/image/upload/w_400,h_225,c_fill,g_faces,f_auto,q_90,e_sharpen:60/${item.publicId}`
    }
    return item.cloudinaryUrl || item.image || ''
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8 md:p-16'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black mx-auto mb-4'></div>
          <p className='text-gray-600 font-medium'>Loading hero manager...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Modal
        isOpen={modal.open}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        onConfirm={
          modal.onConfirm || (() => setModal((m) => ({ ...m, open: false })))
        }
        showCancel={modal.showCancel}
      />
      <div className='bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200'>
          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0'>
              <div className='p-3 bg-black rounded-xl w-fit'>
                <Star className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
              </div>
              <div className='flex-1'>
                <h3 className='text-xl sm:text-2xl font-bold text-gray-900'>
                  Hero Slideshow
                </h3>
                <p className='text-gray-600 mt-1 text-sm sm:text-base'>
                  Manage up to 5 featured images for your homepage hero section
                </p>
                <div className='flex flex-wrap items-center gap-2 sm:gap-4 mt-2'>
                  <span className='inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800'>
                    {heroSlides.length}/5 slides
                  </span>
                  <span className='text-xs sm:text-sm text-gray-500 hidden sm:inline'>
                    Face detection enabled for optimal cropping
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowSelector(!showSelector)}
              className={`flex items-center justify-center sm:justify-start space-x-2 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base w-full sm:w-auto ${
                showSelector
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
              }`}
            >
              {showSelector ? <X size={16} /> : <Plus size={16} />}
              <span>{showSelector ? 'Close' : 'Add Images'}</span>
            </button>
          </div>
        </div>

        <div className='p-4 sm:p-6 lg:p-8'>
          {/* Current Hero Slides */}
          <div className='mb-8 lg:mb-10'>
            {heroSlides.length === 0 ? (
              <div className='text-center py-12 sm:py-16 lg:py-20 px-4 sm:px-8'>
                <div className='max-w-md mx-auto'>
                  <div className='p-4 bg-gray-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6'>
                    <Image className='w-8 h-8 sm:w-10 sm:h-10 text-gray-400' />
                  </div>
                  <h4 className='text-lg sm:text-xl font-semibold text-gray-900 mb-3'>
                    No hero slides selected
                  </h4>
                  <p className='text-gray-500 mb-6 text-sm sm:text-base'>
                    Start building your stunning hero slideshow by selecting
                    images from your portfolio
                  </p>
                  <button
                    onClick={() => setShowSelector(true)}
                    className='inline-flex items-center space-x-2 bg-black text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all shadow-lg text-sm sm:text-base'
                  >
                    <Plus size={16} />
                    <span className='hidden sm:inline'>
                      Select Your First Image
                    </span>
                    <span className='sm:hidden'>Add Image</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h4 className='text-base sm:text-lg font-semibold mb-4 sm:mb-6 flex items-center space-x-2 text-gray-900'>
                  <Grid3X3 className='w-4 h-4 sm:w-5 sm:h-5 text-gray-600' />
                  <span>Active Hero Slides</span>
                </h4>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                  {heroSlides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className='group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-500'
                    >
                      <div className='relative'>
                        {/* Order Badge */}
                        <div className='absolute top-2 sm:top-3 left-2 sm:left-3 z-20'>
                          <div className='bg-black text-white rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold shadow-lg'>
                            #{index + 1}
                          </div>
                        </div>

                        {/* Preview Image */}
                        <div className='aspect-video relative overflow-hidden'>
                          {slide.portfolioItem.publicId ? (
                            <CloudinaryImage
                              publicId={slide.portfolioItem.publicId}
                              width={400}
                              height={225}
                              alt={slide.portfolioItem.title}
                              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                              crop='fill'
                              gravity='faces'
                              highQuality={true}
                            />
                          ) : (
                            <img
                              src={generatePreviewUrl(slide.portfolioItem)}
                              alt={slide.portfolioItem.title}
                              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                            />
                          )}

                          {/* Always Visible Delete Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveFromHero(slide.id)
                            }}
                            className='absolute top-2 sm:top-3 right-2 sm:right-3 z-30 p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 rounded-lg shadow-lg transition-all duration-200 text-white hover:scale-110'
                            title='Remove from hero slideshow'
                          >
                            <Trash2 size={14} />
                          </button>

                          {/* Hover Controls - Hidden on mobile */}
                          <div className='absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-500 items-center justify-center opacity-0 group-hover:opacity-100 hidden sm:flex'>
                            <div className='flex items-center space-x-3'>
                              {/* Move Up */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleReorder(slide.id, 'up')
                                }}
                                disabled={index === 0}
                                className='p-3 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-white/20'
                                title='Move up'
                              >
                                <ArrowUp size={16} className='text-gray-700' />
                              </button>

                              {/* Move Down */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleReorder(slide.id, 'down')
                                }}
                                disabled={index === heroSlides.length - 1}
                                className='p-3 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-white/20'
                                title='Move down'
                              >
                                <ArrowDown
                                  size={16}
                                  className='text-gray-700'
                                />
                              </button>
                            </div>
                          </div>

                          {/* Quick Info Badge - Hidden on mobile */}
                          <div className='absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block'>
                            <span className='inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-black/70 text-white backdrop-blur-sm border border-white/20'>
                              {slide.portfolioItem.category.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Image Info */}
                      <div className='p-4 sm:p-6'>
                        <h5 className='font-bold text-gray-900 mb-2 text-base sm:text-lg line-clamp-2'>
                          {slide.portfolioItem.title}
                        </h5>
                        <div className='flex items-center justify-between text-xs sm:text-sm mb-3 sm:mb-4'>
                          <span className='inline-flex items-center px-2 sm:px-3 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium capitalize'>
                            {slide.portfolioItem.category}
                          </span>
                          <div className='flex items-center space-x-1 sm:space-x-2 text-gray-500'>
                            <Calendar className='w-3 h-3' />
                            <span className='text-xs'>
                              {new Date(
                                slide.portfolioItem.uploadedAt || slide.addedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-1 sm:space-x-2'>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleReorder(slide.id, 'up')
                              }}
                              disabled={index === 0}
                              className='p-1.5 sm:p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                              title='Move up'
                            >
                              <ArrowUp size={12} className='text-gray-600' />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleReorder(slide.id, 'down')
                              }}
                              disabled={index === heroSlides.length - 1}
                              className='p-1.5 sm:p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                              title='Move down'
                            >
                              <ArrowDown size={12} className='text-gray-600' />
                            </button>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveFromHero(slide.id)
                            }}
                            className='flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium'
                            title='Remove from hero slideshow'
                          >
                            <Trash2 size={12} />
                            <span className='hidden sm:inline'>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Portfolio Selector */}
          {showSelector && (
            <div className='border-t border-gray-200 pt-6 sm:pt-8 lg:pt-10'>
              <div className='mb-6 sm:mb-8'>
                <h4 className='text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center space-x-2'>
                  <Image className='w-4 h-4 sm:w-5 sm:h-5 text-gray-600' />
                  <span>Select from Portfolio</span>
                </h4>
                <p className='text-gray-600 text-sm sm:text-base'>
                  Choose images from your portfolio to add to the hero slideshow
                </p>
              </div>

              {portfolioItems.length === 0 ? (
                <div className='text-center py-12 sm:py-16 px-4 sm:px-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300'>
                  <div className='max-w-sm mx-auto'>
                    <div className='p-3 bg-gray-200 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4'>
                      <Image className='w-6 h-6 sm:w-8 sm:h-8 text-gray-400' />
                    </div>
                    <h5 className='text-base sm:text-lg font-semibold text-gray-900 mb-2'>
                      No portfolio items
                    </h5>
                    <p className='text-gray-500 text-sm sm:text-base'>
                      Upload some images to your portfolio first, then you can
                      add them to the hero slideshow
                    </p>
                  </div>
                </div>
              ) : (
                <div className='bg-gray-50 rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-200'>
                  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto'>
                    {portfolioItems.map((item) => {
                      const isInHero = heroSlides.some(
                        (slide) => slide.portfolioItem.id === item.id
                      )

                      return (
                        <div
                          key={item.id}
                          className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-500 ${
                            isInHero
                              ? 'ring-2 ring-green-500 shadow-xl'
                              : 'hover:ring-2 hover:ring-black hover:shadow-xl'
                          }`}
                        >
                          {/* Preview */}
                          <div className='aspect-video relative'>
                            {item.publicId ? (
                              <CloudinaryImage
                                publicId={item.publicId}
                                width={300}
                                height={169}
                                alt={item.title}
                                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                                crop='fill'
                                gravity='faces'
                                highQuality={true}
                              />
                            ) : (
                              <img
                                src={generatePreviewUrl(item)}
                                alt={item.title}
                                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                              />
                            )}

                            {/* Overlay */}
                            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-500 flex items-center justify-center'>
                              {isInHero ? (
                                <div className='bg-green-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-semibold shadow-lg flex items-center space-x-1 sm:space-x-2 backdrop-blur-sm text-xs sm:text-sm'>
                                  <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse'></div>
                                  <span className='hidden sm:inline'>
                                    In Hero
                                  </span>
                                  <span className='sm:hidden'>✓</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleAddToHero(item)}
                                  className='bg-white text-gray-900 px-2 sm:px-5 py-1 sm:py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-gray-200 backdrop-blur-sm text-xs sm:text-sm'
                                >
                                  <span className='hidden sm:inline'>
                                    Add to Hero
                                  </span>
                                  <span className='sm:hidden'>Add</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Info */}
                          <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 sm:p-4'>
                            <p className='text-white text-xs sm:text-sm font-bold truncate'>
                              {item.title}
                            </p>
                            <p className='text-white/80 text-xs capitalize font-medium tracking-wider'>
                              {item.category}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 space-y-4 sm:space-y-0'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0'>
                      <p className='text-xs sm:text-sm text-gray-600'>
                        <span className='font-semibold text-gray-900'>
                          {portfolioItems.length}
                        </span>{' '}
                        portfolio items available
                      </p>
                      <span className='inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 w-fit'>
                        {heroSlides.length} already selected
                      </span>
                    </div>
                    <button
                      onClick={() => setShowSelector(false)}
                      className='px-4 sm:px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all font-medium text-sm sm:text-base w-full sm:w-auto text-center'
                    >
                      Close Selector
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
