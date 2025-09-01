'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PortfolioItem, fetchPortfolio } from '../utils/portfolioApi'
import { fetchHeroSlides } from '../utils/heroSlidesApi'
import CloudinaryImage from '../components/CloudinaryImage'
import InstagramFeed from '../components/InstagramFeed'

import {
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  PageContainer,
  SmoothHover,
} from '../components/AnimationComponents'
import { smoothScrollTo } from '../utils/smoothScroll'
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Play,
  Pause,
  Camera,
  Award,
  Users,
  Star,
  Instagram,
  Heart,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'

export default function DGStudiosLanding() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/dg_studios_warri/',
    },
    { name: 'Facebook', icon: Users, url: '#' },
    {
      name: 'TikTok',
      icon: Camera,
      url: 'http://tiktok.com/@dgstudiowarri?_t=ZM-8v93eMrNt7V&_r=1',
    },
    { name: 'Pinterest', icon: Award, url: '#' },
  ]
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [typingText, setTypingText] = useState('')
  const [typingIndex, setTypingIndex] = useState(0)
  const [typingText2, setTypingText2] = useState('')
  const [typingIndex2, setTypingIndex2] = useState(0)
  const [startSecondAnimation, setStartSecondAnimation] = useState(false)
  const [hoveredPost, setHoveredPost] = useState<number | null>(null)
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [portfolioLoading, setPortfolioLoading] = useState(true)
  const [heroSlides, setHeroSlides] = useState<any[]>([])
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  const fullText =
    'DG Studio is a creative hub where visual storytelling comes to life. Specializing in photography, videography, and design, we are dedicated to transforming your ideas into powerful visuals that resonate. Our logo reflects the dynamic and innovative spirit of our studio, combining elegance and simplicity to convey our passion for creativity and craftsmanship.'

  const secondText =
    "At DG Studio, we understand the importance of making a lasting impression. Whether it's through capturing unforgettable moments, producing captivating videos, or creating stunning designs, we focus on delivering exceptional quality and personalized service for every project. Our goal is to help you communicate your message and vision through visuals that truly stand out."

  // Fallback portfolio data (shown if no uploaded images)
  const fallbackPortfolioItems = [
    {
      id: 'fallback-1',
      category: 'wedding',
      title: 'Elegant Wedding',
      publicId: '',
      cloudinaryUrl:
        'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214171/WhatsApp_Image_2025-08-26_at_13.41.05_4bf21354_tyvb6k.jpg',
      uploadedAt: new Date().toISOString(),
      order: 0,
      image:
        'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214171/WhatsApp_Image_2025-08-26_at_13.41.05_4bf21354_tyvb6k.jpg',
      isCloudinary: false,
    },
    {
      id: 'fallback-2',
      category: 'portrait',
      title: 'Professional Portrait',
      publicId: '',
      cloudinaryUrl:
        'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214065/WhatsApp_Image_2025-08-26_at_13.42.04_ebe2af1e_sdhkft.jpg',
      uploadedAt: new Date().toISOString(),
      order: 1,
      image:
        'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214065/WhatsApp_Image_2025-08-26_at_13.42.04_ebe2af1e_sdhkft.jpg',
      isCloudinary: false,
    },
    {
      id: 'fallback-3',
      category: 'fashion',
      title: 'Fashion Editorial',
      publicId: '',
      cloudinaryUrl:
        'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214253/WhatsApp_Image_2025-08-26_at_14.17.18_f21e80c3_ofyat7.jpg',
      uploadedAt: new Date().toISOString(),
      order: 2,
      image:
        'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214253/WhatsApp_Image_2025-08-26_at_14.17.18_f21e80c3_ofyat7.jpg',
      isCloudinary: false,
    },
    {
      id: 'fallback-4',
      category: 'portrait',
      title: 'Creative Portrait',
      publicId: '',
      cloudinaryUrl:
        'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214387/WhatsApp_Image_2025-08-26_at_14.19.36_d7443474_str3is.jpg',
      uploadedAt: new Date().toISOString(),
      order: 3,
      image:
        'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214387/WhatsApp_Image_2025-08-26_at_14.19.36_d7443474_str3is.jpg',
      isCloudinary: false,
    },
  ]

  // Fallback hero slides (used if no hero slides are selected) - Optimized for faster loading
  const fallbackHeroSlides = [
    'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214171/WhatsApp_Image_2025-08-26_at_13.41.05_4bf21354_tyvb6k.jpg',
    'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214387/WhatsApp_Image_2025-08-26_at_14.19.36_d7443474_str3is.jpg',
    // 'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214065/WhatsApp_Image_2025-08-26_at_13.42.04_ebe2af1e_sdhkft.jpg',
  ]

  // Comprehensive hero text options - will dynamically match the number of hero slides
  const allHeroTexts = [
    {
      title: 'Capturing Stories,',
      subtitle: 'Creating Legacy',
      description:
        'Where artistry meets precision - crafting timeless imagery that transcends moments and becomes your eternal story',
    },
    {
      title: 'Visual Storytelling,',
      subtitle: 'Endless Possibilities',
      description:
        'Every frame tells a unique story - we transform your precious moments into breathtaking visual narratives',
    },
    {
      title: 'Creative Vision,',
      subtitle: 'Timeless Memories',
      description:
        'Professional photography that captures the essence of your most important moments with artistic excellence',
    },
    {
      title: 'Artistic Excellence,',
      subtitle: 'Perfect Moments',
      description:
        'Elevating everyday moments into extraordinary masterpieces through innovative photography techniques',
    },
    {
      title: 'Passion & Precision,',
      subtitle: 'Stunning Results',
      description:
        'Combining creative passion with technical precision to deliver photography that exceeds expectations',
    },
    {
      title: 'Dream & Reality,',
      subtitle: 'Captured Forever',
      description:
        'Transforming your dreams into reality through breathtaking photography that tells your unique story',
    },
    {
      title: 'Emotion & Art,',
      subtitle: 'Pure Magic',
      description:
        "Every photograph captures not just an image, but the emotions and magic of life's most precious moments",
    },
  ]

  // Dynamic hero text that matches the number of hero slides
  const heroTexts = allHeroTexts.slice(0, Math.max(heroSlides.length, 3))

  // Always use backend portfolioItems, fallback only if empty
  // Limit portfolio excellence images to 7 and always show images when switching filters
  let filteredItems: PortfolioItem[] = []
  if (activeFilter === 'all') {
    filteredItems =
      portfolioItems.length > 0
        ? portfolioItems.slice(0, 7)
        : fallbackPortfolioItems.slice(0, 7)
  } else {
    const filtered = portfolioItems.filter(
      (item) => item.category === activeFilter
    )
    filteredItems =
      filtered.length > 0
        ? filtered.slice(0, 7)
        : fallbackPortfolioItems
            .filter((item) => item.category === activeFilter)
            .slice(0, 7)
  }

  const filteredItemsSorted = filteredItems.sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  )

  // Load portfolio items and hero slides from backend
  useEffect(() => {
    async function loadData() {
      setPortfolioLoading(true)
      try {
        const [portfolio, hero] = await Promise.all([
          fetchPortfolio(),
          fetchHeroSlides(),
        ])
        setPortfolioItems(portfolio)
        // If no hero slides from backend, use fallback
        setHeroSlides(hero && hero.length > 0 ? hero : fallbackHeroSlides)
      } catch (error) {
        setPortfolioItems(fallbackPortfolioItems)
        setHeroSlides(fallbackHeroSlides)
      }
      setPortfolioLoading(false)
    }
    loadData()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(
        (prev) =>
          (prev + 1) %
          (heroSlides.length > 0
            ? heroSlides.length
            : fallbackHeroSlides.length)
      )
    }, 6000)
    return () => clearInterval(interval)
  }, [heroSlides.length])

  // Typing animation effect for first text
  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (typingIndex < fullText.length) {
        setTypingText(fullText.substring(0, typingIndex + 1))
        setTypingIndex((prev) => prev + 1)
      } else {
        clearInterval(typingInterval)
        // Start second animation after a short delay
        setTimeout(() => setStartSecondAnimation(true), 500)
      }
    }, 50)

    return () => clearInterval(typingInterval)
  }, [typingIndex, fullText])

  // Typing animation effect for second text
  useEffect(() => {
    if (!startSecondAnimation) return

    const typingInterval = setInterval(() => {
      if (typingIndex2 < secondText.length) {
        setTypingText2(secondText.substring(0, typingIndex2 + 1))
        setTypingIndex2((prev) => prev + 1)
      } else {
        clearInterval(typingInterval)
      }
    }, 50)

    return () => clearInterval(typingInterval)
  }, [typingIndex2, secondText, startSecondAnimation])

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setShowScrollTop(scrollTop > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const getSlides = () =>
    heroSlides && heroSlides.length > 0 ? heroSlides : fallbackHeroSlides

  // Responsive check for mobile devices
  const isMobile =
    typeof window !== 'undefined' ? window.innerWidth < 768 : false

  const nextSlide = () => {
    const slides = getSlides()
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    const slides = getSlides()
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className='min-h-screen bg-white text-gray-900 font-body'>
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Navigation */}
        <motion.nav
          className='fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg'
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: [0.21, 1.11, 0.81, 0.99] }}
        >
          <motion.div className='max-w-[1400px] mx-auto px-4 sm:px-8 py-4 sm:py-5 flex justify-between items-center'>
            <motion.div
              className='text-2xl sm:text-3xl font-heading font-bold tracking-tight text-black cursor-pointer'
              onClick={() => smoothScrollTo('home')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              DG Studios
            </motion.div>
            {/* Desktop Menu */}
            <div className='hidden md:flex space-x-8 lg:space-x-12'>
              {['Home', 'Gallery', 'Services', 'About', 'Contact'].map(
                (item, index) => (
                  <motion.button
                    key={item}
                    onClick={() => {
                      if (item === 'Gallery') {
                        window.location.href = '/gallery'
                      } else if (item === 'Contact') {
                        setShowContactModal(true)
                      } else {
                        smoothScrollTo(item.toLowerCase())
                      }
                    }}
                    className='text-gray-700 hover:text-black transition-all duration-300 font-medium text-sm uppercase tracking-wider relative group'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: [0.21, 1.11, 0.81, 0.99],
                    }}
                    whileHover={{ y: -2 }}
                  >
                    {item}
                    <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full'></span>
                  </motion.button>
                )
              )}
            </div>
            {/* Hamburger Icon for Mobile */}
            <div className='md:hidden flex items-center'>
              <button
                aria-label='Open menu'
                className='text-black focus:outline-none'
                onClick={() => setMobileMenuOpen((open) => !open)}
              >
                <svg
                  width='32'
                  height='32'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='w-8 h-8'
                >
                  <line x1='3' y1='12' x2='21' y2='12' />
                  <line x1='3' y1='6' x2='21' y2='6' />
                  <line x1='3' y1='18' x2='21' y2='18' />
                </svg>
              </button>
            </div>
            <motion.button
              className='bg-black text-white px-4 sm:px-8 py-2 sm:py-3 hover:bg-gray-800 transition-all duration-300 font-medium text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl rounded-lg hidden md:inline-block cursor-pointer'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                window.open('https://wa.me/2348120784462', '_blank')
              }
            >
              Book Session
            </motion.button>
          </motion.div>
          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='fixed inset-0 bg-black/60 z-50 flex flex-col items-center justify-start pt-24 md:hidden'
            >
              <div className='bg-white rounded-xl shadow-2xl w-11/12 max-w-sm mx-auto p-8 flex flex-col space-y-6'>
                {['Home', 'Gallery', 'Services', 'About', 'Contact'].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setMobileMenuOpen(false)
                        if (item === 'Gallery') {
                          window.location.href = '/gallery'
                        } else if (item === 'Contact') {
                          setShowContactModal(true)
                        } else {
                          smoothScrollTo(item.toLowerCase())
                        }
                      }}
                      className='text-black text-lg font-bold uppercase tracking-wider py-2 rounded hover:bg-gray-100 transition-all duration-300 w-full'
                    >
                      {item}
                    </button>
                  )
                )}
                <button
                  className='bg-black text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300 text-base w-full cursor-pointer'
                  onClick={() => {
                    setMobileMenuOpen(false)
                    window.open('https://wa.me/2348120784462', '_blank')
                  }}
                >
                  Book Session
                </button>
              </div>
              {/* Close area when clicking outside */}
              <div
                className='absolute inset-0'
                onClick={() => setMobileMenuOpen(false)}
                style={{ zIndex: 1 }}
              />
            </motion.div>
          )}
        </motion.nav>
      </motion.div>

      {/* Hero Section */}
      <section id='home' className='relative h-screen overflow-hidden'>
        <div className='absolute inset-0'>
          {getSlides().map((slide, index) => {
            // If slide is an object with publicId, use CloudinaryImage
            const publicId = slide?.portfolioItem?.publicId || slide?.publicId
            const imageUrl =
              slide?.portfolioItem?.cloudinaryUrl ||
              slide?.portfolioItem?.image ||
              slide?.cloudinaryUrl ||
              slide?.image ||
              slide
            const altText =
              slide?.portfolioItem?.title || slide?.title || `Hero ${index + 1}`
            return (
              <motion.div
                key={index}
                className={`absolute inset-0`}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{
                  opacity: index === currentSlide ? 1 : 0,
                  scale: index === currentSlide ? 1 : 1.05,
                }}
                transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {publicId ? (
                  <CloudinaryImage
                    publicId={publicId}
                    width={isMobile ? 600 : 1920}
                    height={isMobile ? 900 : 1080}
                    alt={altText}
                    className='w-full h-full object-cover'
                    gravity='faces'
                    highQuality={true}
                  />
                ) : (
                  <img
                    src={imageUrl}
                    alt={altText}
                    className='w-full h-full object-cover'
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                )}
                <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70'></div>
              </motion.div>
            )
          })}
        </div>

        {/* Hero Navigation */}
        <motion.button
          onClick={prevSlide}
          className='absolute left-2 sm:left-8 top-1/2 transform -translate-y-1/2 text-white/90 hover:text-white transition-all duration-300 z-20 group'
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className='bg-black/30 backdrop-blur-sm rounded-full p-2 sm:p-4 group-hover:bg-black/50 transition-all duration-300'>
            <ChevronLeft size={24} className='sm:w-8 sm:h-8' />
          </div>
        </motion.button>
        <motion.button
          onClick={nextSlide}
          className='absolute right-2 sm:right-8 top-1/2 transform -translate-y-1/2 text-white/90 hover:text-white transition-all duration-300 z-20 group'
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className='bg-black/30 backdrop-blur-sm rounded-full p-2 sm:p-4 group-hover:bg-black/50 transition-all duration-300'>
            <ChevronRight size={24} className='sm:w-8 sm:h-8' />
          </div>
        </motion.button>

        {/* Hero Content */}
        <div className='absolute inset-0 flex items-center justify-center z-10'>
          <div className='text-center text-white max-w-6xl px-4 sm:px-8'>
            <motion.div
              className='mb-8 sm:mb-12 opacity-90'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.9, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className='inline-flex items-center space-x-2 sm:space-x-3 bg-black/20 backdrop-blur-md rounded-full px-4 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm font-medium border border-white/30'>
                <Camera size={16} className='sm:w-5 sm:h-5 text-white' />
                <span className='text-white'>
                  Professional Photography Studio
                </span>
              </div>
            </motion.div>

            <motion.h1
              className='text-4xl sm:text-6xl md:text-8xl font-heading font-bold mb-8 sm:mb-12 leading-none tracking-tight text-white drop-shadow-lg'
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              key={`title-${currentSlide}`}
              transition={{
                duration: 1,
                delay: 0.7,
                ease: [0.21, 1.11, 0.81, 0.99],
              }}
            >
              {heroTexts[currentSlide % heroTexts.length]?.title}
              <br />
              <motion.span
                className='text-gray-200 drop-shadow-lg'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={`subtitle-${currentSlide}`}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                {heroTexts[currentSlide % heroTexts.length]?.subtitle}
              </motion.span>
            </motion.h1>

            <motion.p
              className='text-base sm:text-xl md:text-2xl mb-12 sm:mb-16 opacity-95 max-w-4xl mx-auto leading-relaxed drop-shadow-md px-4'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 0.95, y: 0 }}
              key={`desc-${currentSlide}`}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              {heroTexts[currentSlide % heroTexts.length]?.description}
            </motion.p>

            <motion.div
              className='flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 md:space-x-8'
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              <motion.button
                className='bg-white text-black px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-bold hover:bg-gray-100 transition-all duration-500 shadow-2xl uppercase tracking-wider border-2 border-white w-full sm:w-auto rounded-lg'
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 25px 50px rgba(255,255,255,0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => smoothScrollTo('portfolio')}
              >
                BOOK SESSION
              </motion.button>
              <motion.button
                className='border-2 border-white bg-black/30 text-white px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-semibold hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-sm uppercase tracking-wider w-full sm:w-auto rounded-lg'
                whileHover={{
                  scale: 1.05,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  color: '#000000',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => smoothScrollTo('portfolio')}
              >
                Explore Portfolio
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Slide Indicators */}
        <motion.div
          className='absolute bottom-6 sm:bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-4 z-20'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          {getSlides().map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-500`}
              animate={{
                backgroundColor:
                  index === currentSlide ? '#ffffff' : 'rgba(255,255,255,0.5)',
                scale: index === currentSlide ? 1.25 : 1,
              }}
              whileHover={{ scale: index === currentSlide ? 1.25 : 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>
      </section>

      {/* Portfolio Section */}
      <section
        id='portfolio'
        className='py-16 sm:py-24 lg:py-32 px-4 sm:px-8 bg-gradient-to-b from-slate-50 to-slate-200'
      >
        <div className='max-w-[1400px] mx-auto'>
          <div className='text-center mb-16 sm:mb-20 lg:mb-24'>
            <FadeInUp>
              <div className='inline-flex items-center space-x-2 sm:space-x-3 bg-slate-300/50 rounded-full px-4 sm:px-8 py-2 sm:py-3 text-slate-800 font-semibold text-xs sm:text-sm mb-8 sm:mb-12 border border-slate-300'>
                <Award size={16} className='sm:w-[18px] sm:h-[18px]' />
                <span>Portfolio Excellence</span>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <h2 className='text-3xl sm:text-5xl md:text-7xl font-heading font-bold mb-8 sm:mb-12 leading-tight text-black'>
                Masterful <span className='text-gray-700'>Creations</span>
              </h2>
            </FadeInUp>

            <FadeInUp delay={0.4}>
              <p className='text-base sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-4'>
                Each frame tells a story of passion, precision, and artistry.
                Discover our collection of award-winning photography that
                captures life's most precious moments.
              </p>
            </FadeInUp>
          </div>

          {/* Portfolio Filter */}
          <FadeInUp delay={0.6}>
            <div className='flex justify-center mb-12 sm:mb-16 lg:mb-20'>
              <div className='flex flex-wrap justify-center space-x-1 sm:space-x-2 bg-slate-300/30 p-1 sm:p-2 border border-slate-300 rounded-xl shadow-sm'>
                {[
                  { id: 'all', name: 'All' },
                  { id: 'wedding', name: 'Wedding' },
                  { id: 'portrait', name: 'Portrait' },
                  { id: 'fashion', name: 'Fashion' },
                ].map((category, index) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 font-semibold transition-all duration-500 text-xs sm:text-sm uppercase tracking-wider rounded-lg ${
                      activeFilter === category.id
                        ? 'bg-black text-white shadow-lg'
                        : 'text-slate-700 hover:text-black hover:bg-white/70'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </FadeInUp>

          {/* Portfolio Grid */}
          <StaggerContainer className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10'>
            {portfolioLoading ? (
              // Loading state
              <FadeInUp className='col-span-full flex items-center justify-center py-12'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-black'></div>
                <span className='ml-3 text-gray-600'>Loading portfolio...</span>
              </FadeInUp>
            ) : filteredItemsSorted.length === 0 ? (
              // Empty state
              <FadeInUp className='col-span-full text-center py-12'>
                <p className='text-gray-500 text-lg'>
                  No images found in {activeFilter} category.
                </p>
                <p className='text-gray-400 text-sm mt-2'>
                  Upload some images through the admin panel!
                </p>
              </FadeInUp>
            ) : (
              // Portfolio items
              filteredItemsSorted.map((item, index) => (
                <StaggerItem
                  key={item.id}
                  className={`group relative overflow-hidden bg-gray-200 hover:shadow-2xl transition-all duration-700 rounded-xl ${
                    index % 4 === 0
                      ? 'lg:col-span-2 aspect-[3/2]'
                      : index % 3 === 0
                      ? 'md:row-span-2 aspect-[4/5]'
                      : 'aspect-square'
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className='w-full h-full'
                  >
                    {/* Use CloudinaryImage for uploaded images, regular img for fallbacks */}
                    {item.publicId ? (
                      <CloudinaryImage
                        publicId={item.publicId}
                        width={800}
                        height={800}
                        alt={item.title}
                        className='w-full h-full'
                        gravity='faces'
                        highQuality={true}
                      />
                    ) : (
                      <img
                        src={item.cloudinaryUrl || item.image}
                        alt={item.title}
                        className='w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 filter brightness-90 group-hover:brightness-100'
                      />
                    )}

                    <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-end justify-center p-8'>
                      <div className='text-center text-white transform translate-y-12 group-hover:translate-y-0 transition-all duration-700'>
                        <div className='w-12 h-0.5 bg-white mx-auto mb-4'></div>
                        <h3 className='text-xl font-heading font-bold mb-2'>
                          {item.title}
                        </h3>
                        <p className='text-sm opacity-90 font-medium tracking-wider uppercase'>
                          {item.category}
                        </p>
                        {item.uploadedAt && (
                          <p className='text-xs opacity-70 mt-1'>
                            {new Date(item.uploadedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))
            )}
          </StaggerContainer>
        </div>
      </section>

      {/* Services Section - Redesigned */}
      <motion.section
        id='services'
        className='py-16 sm:py-24 lg:py-32 px-4 sm:px-8 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white'
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <motion.div
          className='max-w-[1400px] mx-auto'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className='text-center mb-16 sm:mb-20 lg:mb-24'>
            <div className='inline-flex items-center space-x-2 sm:space-x-3 bg-white/10 rounded-full px-4 sm:px-8 py-2 sm:py-3 text-white font-semibold text-xs sm:text-sm mb-8 sm:mb-12 border border-white/20'>
              <Camera size={16} className='sm:w-[18px] sm:h-[18px]' />
              <span>Our Services</span>
            </div>
            <h2 className='text-3xl sm:text-5xl md:text-7xl font-heading font-bold mb-8 sm:mb-12 leading-tight text-white px-2'>
              Professional <span className='text-gray-200'>Photography</span>
            </h2>
            <p className='text-base sm:text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed px-4'>
              From intimate portraits to grand celebrations, we specialize in
              capturing life's most meaningful moments with artistic excellence
              and professional precision.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12'>
            {[
              {
                icon: Camera,
                title: 'Wedding Photography',
                description:
                  'Timeless documentation of your most sacred moments with cinematic artistry and emotional depth that tells your unique love story.',
                features: [
                  'Full day coverage',
                  '500+ edited photos',
                  'Online gallery',
                  'Print release',
                ],
                image:
                  'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
              },
              {
                icon: Users,
                title: 'Portrait Sessions',
                description:
                  'Professional portraits that capture your authentic self with expert lighting, composition, and attention to detail.',
                features: [
                  '1-2 hour session',
                  '20+ edited photos',
                  'Styling consultation',
                  'Multiple locations',
                ],
                image:
                  'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214065/WhatsApp_Image_2025-08-26_at_13.42.04_ebe2af1e_sdhkft.jpg',
              },
              {
                icon: Award,
                title: 'Commercial Work',
                description:
                  'High-end commercial photography for brands and businesses looking to make a powerful visual impact.',
                features: [
                  'Brand consultation',
                  'Multiple concepts',
                  'Commercial license',
                  'Fast turnaround',
                ],
                image:
                  'https://images.unsplash.com/photo-1556760544-74068565f05c?w=600&h=400&fit=crop',
              },
            ].map((service, index) => (
              <div
                key={index}
                className='group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2'
              >
                {/* Service Image */}
                <div className='relative h-48 sm:h-56 lg:h-64 overflow-hidden'>
                  <img
                    src={service.image}
                    alt={service.title}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500'></div>
                  <div className='absolute top-3 left-3 sm:top-4 sm:left-4'>
                    <div className='w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                      <service.icon className='w-5 h-5 sm:w-6 sm:h-6 text-black' />
                    </div>
                  </div>
                </div>

                {/* Service Content */}
                <div className='p-4 sm:p-6 lg:p-8'>
                  <div className='mb-3 sm:mb-4'>
                    <h3 className='text-xl sm:text-2xl font-heading font-bold text-black group-hover:text-gray-700 transition-colors duration-300'>
                      {service.title}
                    </h3>
                  </div>

                  <p className='text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6'>
                    {service.description}
                  </p>

                  {/* Features List */}
                  <ul className='space-y-1.5 sm:space-y-2 mb-4 sm:mb-6'>
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className='flex items-center text-xs sm:text-sm text-gray-600'
                      >
                        <div className='w-1.5 h-1.5 bg-black rounded-full mr-3 flex-shrink-0'></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {/* Removed Learn More button */}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* About Section */}
      <motion.section
        id='about'
        className='py-16 sm:py-24 lg:py-32 px-4 sm:px-8 bg-gradient-to-r from-white via-gray-50 to-white'
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <motion.div
          className='max-w-[1400px] mx-auto'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.div
            className='grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 sm:mb-8 text-black leading-tight'>
                <span className='inline-block'>
                  {['D', 'G', ' ', 'S', 't', 'u', 'd', 'i', 'o'].map(
                    (char, index) => (
                      <span
                        key={index}
                        className='inline-block animate-bounce text-black'
                        style={{
                          animationDelay: `${index * 0.1}s`,
                          animationDuration: '1s',
                          animationIterationCount: '1',
                          animationFillMode: 'both',
                        }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    )
                  )}
                </span>
              </h2>

              <div className='mb-3 sm:mb-4'>
                <p className='text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed min-h-[80px] sm:min-h-[100px] lg:min-h-[120px]'>
                  {typingText}
                  <span className='animate-pulse'>|</span>
                </p>
              </div>

              <div className='mb-8 sm:mb-10 lg:mb-12'>
                <p className='text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed min-h-[80px] sm:min-h-[100px] lg:min-h-[120px]'>
                  {typingText2}
                  {startSecondAnimation && (
                    <span className='animate-pulse'>|</span>
                  )}
                </p>
              </div>

              <div className='grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-center'>
                {[
                  { number: '500+', label: 'Happy Clients' },
                  { number: '10+', label: 'Years Experience' },
                  { number: '2025', label: 'Founded' },
                ].map((stat, index) => (
                  <div key={index} className='group'>
                    <div className='text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-black mb-1 sm:mb-2 group-hover:text-gray-600 transition-colors duration-300'>
                      {stat.number}
                    </div>
                    <div className='text-xs sm:text-sm text-gray-600 uppercase tracking-wider font-medium'>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='relative group mt-8 lg:mt-0'>
              <div className='relative group mt-8 lg:mt-0 hidden sm:block'>
                <img
                  src='https://images.unsplash.com/photo-1554048612-b6a482b224b4?w=600&h=800&fit=crop&auto=format&q=75'
                  alt='DG Studio Excellence'
                  className='w-full rounded-lg shadow-2xl transition-all duration-700 group-hover:shadow-3xl filter brightness-95 group-hover:brightness-100'
                  loading='lazy'
                />
                <div className='absolute -bottom-2 -left-4 sm:-left-8 bg-black text-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-2xl hidden sm:block'>
                  <Star className='w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3' />
                  <div className='font-heading font-bold text-base sm:text-lg'>
                    Creative Hub
                  </div>
                  <div className='text-xs sm:text-sm font-medium uppercase tracking-wider'>
                    Since 2025
                  </div>
                </div>
                <div className='absolute -top-4 sm:-top-8 -right-4 sm:-right-8 bg-white text-black p-3 sm:p-4 lg:p-6 rounded-lg shadow-2xl border border-gray-200'>
                  <div className='font-heading font-bold text-xl sm:text-2xl text-black'>
                    DG
                  </div>
                  <div className='text-xs font-medium uppercase tracking-wider text-gray-600'>
                    Studio
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Testimonials Section - Redesigned */}
      <motion.section
        className='py-16 sm:py-24 lg:py-32 px-4 sm:px-8 bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white'
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <motion.div
          className='max-w-[1400px] mx-auto'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.div
            className='text-center mb-12 sm:mb-16 lg:mb-20'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className='inline-flex items-center space-x-2 sm:space-x-3 bg-white/10 rounded-full px-4 sm:px-8 py-2 sm:py-3 text-white font-semibold text-xs sm:text-sm mb-6 sm:mb-8 border border-white/20'>
              <Star size={16} className='sm:w-[18px] sm:h-[18px] text-white' />
              <span>Client Reviews</span>
            </div>
            <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 sm:mb-8 text-white leading-tight px-2'>
              What Our <span className='text-gray-200'>Clients Say</span>
            </h2>
            <p className='text-sm sm:text-base lg:text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed px-4'>
              Hear from couples, families, and brands who trusted us with their
              most precious moments
            </p>
          </motion.div>

          <motion.div
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, staggerChildren: 0.2 }}
            viewport={{ once: true }}
          >
            {[
              {
                name: 'Sarah A.',
                role: 'Bride',
                image:
                  'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214387/WhatsApp_Image_2025-08-26_at_14.19.36_d7443474_str3is.jpg',
                review:
                  'DG Studios made my wedding unforgettable. Every photo is a masterpiece! The attention to detail and artistic vision exceeded all our expectations.',
                rating: 5,
              },
              {
                name: 'Michael R.',
                role: 'Fashion Brand CEO',
                image:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                review:
                  'Professional, creative, and absolutely brilliant. Our brand campaign shots were beyond what we imagined. Highly recommend for commercial work.',
                rating: 5,
              },
              {
                name: 'Emma & James',
                role: 'Engagement Session',
                image:
                  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face',
                review:
                  "The most beautiful engagement photos! DG Studios captured our love story perfectly. We can't wait to work with them for our wedding!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className='bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 text-center group border border-gray-200'
              >
                <div className='flex justify-center mb-4 sm:mb-6'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className='sm:w-5 sm:h-5 text-black fill-current'
                    />
                  ))}
                </div>
                <p className='text-gray-700 leading-relaxed mb-6 sm:mb-8 italic text-sm sm:text-base lg:text-lg'>
                  "{testimonial.review}"
                </p>
                <div className='flex items-center justify-center space-x-3 sm:space-x-4'>
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className='w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full object-cover border-2 border-gray-200 group-hover:border-gray-300 transition-colors duration-300'
                  />
                  <div className='text-left'>
                    <div className='font-bold text-black text-sm sm:text-base lg:text-lg'>
                      {testimonial.name}
                    </div>
                    <div className='text-gray-600 text-xs sm:text-sm'>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Instagram Social Proof Section - Redesigned */}
      <motion.section
        className='py-16 sm:py-24 lg:py-32 px-4 sm:px-8 bg-gradient-to-b from-slate-100 to-slate-200'
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <motion.div
          className='max-w-[1400px] mx-auto'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.div
            className='text-center mb-12 sm:mb-16'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className='inline-flex items-center space-x-2 sm:space-x-3 bg-white rounded-full px-4 sm:px-8 py-2 sm:py-3 text-black font-semibold text-xs sm:text-sm mb-6 sm:mb-8 border border-gray-200 shadow-sm'>
              <Instagram
                size={16}
                className='sm:w-[18px] sm:h-[18px] text-black'
              />
              <span>Follow Our Journey</span>
            </div>
            <h2 className='text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-6 sm:mb-8 text-black leading-tight px-2'>
              Behind the <span className='text-gray-700'>Lens</span>
            </h2>
            <p className='text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4'>
              Get inspired by our latest work and behind-the-scenes moments.
              Follow us for daily inspiration and exclusive content.
            </p>
          </motion.div>

          <motion.div className='mb-16'>
            <InstagramFeed
              accessToken={process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN}
              userId={process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID}
              limit={6}
            />
          </motion.div>

          <motion.div
            className='text-center'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <a
              href='https://www.instagram.com/dg_studios_warri/'
              target='_blank'
              rel='noopener noreferrer'
              className='bg-black text-white px-12 py-4 text-lg font-bold hover:bg-gray-800 transition-all duration-500 transform hover:scale-105 shadow-xl uppercase tracking-wider border border-black hover:border-gray-800 inline-flex items-center justify-center space-x-3 rounded-lg'
            >
              <Instagram size={24} />
              <span>Follow @dg_studios_warri</span>
            </a>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Enhanced CTA Section - Redesigned
      <section className='py-32 px-8 text-white'>
        <div className='max-w-[1400px] mx-auto text-center'>
          <div className='inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-full px-8 py-3 text-sm font-semibold mb-12 border border-white/20'>
            <Camera size={20} className='text-white' />
            <span>Ready to Start?</span>
          </div>
          <h2 className='text-5xl md:text-8xl font-heading font-bold mb-12 leading-none tracking-tight text-white'>
            Ready to Capture Your{' '}
            <span className='text-gray-300'>Best Moments?</span>
          </h2>
          <p className='text-xl md:text-2xl mb-16 max-w-4xl mx-auto leading-relaxed opacity-95 text-gray-200'>
            Don't let your precious moments slip away. Book your photoshoot
            today and create memories that will last forever.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-10'>
            <button className='bg-white text-black px-16 py-6 text-lg font-bold hover:bg-gray-100 transition-all duration-500 transform hover:scale-105 shadow-2xl uppercase tracking-wider rounded-lg'>
              Book Your Photoshoot Now
            </button>
            <button className='border-2 border-white bg-transparent text-white px-16 py-6 text-lg font-bold hover:bg-white hover:text-black transition-all duration-500 uppercase tracking-wider rounded-lg'>
              View Our Work
            </button>
          </div>
        </div>
      </section> */}

      {/* Footer - Redesigned */}
      <motion.footer
        className='py-16 sm:py-24 lg:py-32 px-4 sm:px-8 bg-gradient-to-r from-gray-900 via-black to-gray-900'
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <motion.div
          className='max-w-[1400px] mx-auto'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16'>
            {/* Brand Section */}
            <div className='sm:col-span-2 lg:col-span-1'>
              <div className='text-3xl sm:text-4xl font-heading font-bold mb-4 sm:mb-6 text-white '>
                DG Studios
              </div>
              <p className='text-sm sm:text-base text-white leading-relaxed mb-6 sm:mb-8'>
                Where artistry meets legacy. Creating timeless photography that
                transcends moments and becomes your eternal story.
              </p>

              {/* Social Media */}
              <div>
                <h4 className='text-lg sm:text-xl font-heading font-bold mb-4 sm:mb-6 text-white'>
                  Follow Us
                </h4>
                <div className='flex flex-wrap gap-2 sm:gap-3 '>
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 font-medium text-xs sm:text-sm p-2 sm:p-3 bg-gray-800 rounded-lg hover:bg-gray-700'
                    >
                      <social.icon
                        size={16}
                        className='sm:w-[18px] sm:h-[18px]'
                      />
                      <span className='hidden sm:inline'>{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className='text-lg sm:text-xl font-heading font-bold mb-4 sm:mb-6 text-white'>
                Contact Info
              </h4>
              <div className='space-y-3 sm:space-y-4'>
                <div className='flex items-start space-x-3 text-white'>
                  <MapPin
                    size={18}
                    className='sm:w-5 sm:h-5 mt-1 flex-shrink-0'
                  />
                  <div className='text-sm sm:text-base'>
                    <div>
                      Federal junction along okoukoko express way iterigbi,
                      Warri, Nigeria
                    </div>
                  </div>
                </div>
                <div className='flex items-center space-x-3 text-white hover:text-white transition-colors duration-300 cursor-pointer'>
                  <Phone size={18} className='sm:w-5 sm:h-5 flex-shrink-0' />
                  <span className='text-sm sm:text-base'>08120784462</span>
                </div>
                <div className='flex items-center space-x-3 text-white hover:text-white transition-colors duration-300 cursor-pointer'>
                  <Mail size={18} className='sm:w-5 sm:h-5 flex-shrink-0' />
                  <span className='text-sm sm:text-base'>
                    studio@dgstudios.com
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className='text-lg sm:text-xl font-heading font-bold mb-4 sm:mb-6 text-white'>
                Quick Links
              </h4>
              <ul className='space-y-2 sm:space-y-3 text-gray-300'>
                {[
                  'Portfolio',
                  'About Us',
                  'Contact',
                  'Book Session',
                  'Pricing',
                ].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(' ', '')}`}
                      className='hover:text-white transition-colors duration-300 text-sm sm:text-base block py-1'
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className='text-lg sm:text-xl font-heading font-bold mb-4 sm:mb-6 text-white'>
                Our Services
              </h4>
              <ul className='space-y-2 sm:space-y-3 text-gray-300'>
                {[
                  'Wedding Photography',
                  'Portrait Sessions',
                  'Fashion Editorial',
                  'Commercial Work',
                  'Event Photography',
                  'Fine Art Prints',
                ].map((service) => (
                  <li key={service}>
                    <a
                      href='#'
                      className='hover:text-white transition-colors duration-300 text-sm sm:text-base block py-1'
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className='pt-6 sm:pt-8 border-t border-gray-700'>
            <div className='flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0'>
              <p className='text-gray-400 text-xs sm:text-sm'>
                © {new Date().getFullYear()} DG STUDIOS. All rights reserved.
              </p>
              <div className='flex flex-wrap justify-center space-x-4 sm:space-x-6 text-gray-400 text-xs sm:text-sm'>
                <a
                  href='#'
                  className='hover:text-white transition-colors duration-300'
                >
                  Privacy Policy
                </a>
                <a
                  href='#'
                  className='hover:text-white transition-colors duration-300'
                >
                  Terms of Service
                </a>
                <a
                  href='#'
                  className='hover:text-white transition-colors duration-300'
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.footer>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 bg-black text-white p-4 rounded-full shadow-2xl hover:bg-gray-800 transition-all duration-300 ${
          showScrollTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        whileHover={{
          scale: 1.1,
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          y: showScrollTop ? 0 : 20,
        }}
        transition={{ duration: 0.3 }}
        aria-label='Scroll to top'
      >
        <ChevronUp size={24} className='w-6 h-6' />
      </motion.button>

      {/* Contact Modal */}
      {showContactModal && (
        <div
          className='fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200'
          onClick={() => setShowContactModal(false)}
        >
          <div
            className='bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg w-full relative transform animate-in zoom-in-95 duration-200'
            onClick={(e) => e.stopPropagation()}
            role='dialog'
            aria-modal='true'
            aria-labelledby='modal-title'
          >
            {/* Close Button */}
            <button
              className='absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all duration-200 flex items-center justify-center group'
              onClick={() => setShowContactModal(false)}
              aria-label='Close contact modal'
            >
              <svg
                className='w-4 h-4 group-hover:scale-110 transition-transform'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>

            {/* Header */}
            <div className='text-center mb-8'>
              <div className='w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center'>
                <svg
                  className='w-8 h-8 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                  />
                </svg>
              </div>
              <h2
                id='modal-title'
                className='text-2xl font-bold mb-2 text-black'
              >
                Get In Touch
              </h2>
              <p className='text-gray-600 text-sm leading-relaxed'>
                Choose your preferred way to contact DG Studio
              </p>
            </div>

            {/* Contact Options */}
            <div className='space-y-3'>
              {/* WhatsApp */}
              <a
                href='https://wa.me/2348012345678'
                target='_blank'
                rel='noopener noreferrer'
                className='group flex items-center space-x-4 bg-gray-50 hover:bg-gray-100 text-black px-5 py-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300'
              >
                <div className='w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200'>
                  <MessageCircle size={20} className='text-white' />
                </div>
                <div className='flex-1'>
                  <div className='font-semibold text-sm text-black'>
                    WhatsApp
                  </div>
                  <div className='text-xs text-gray-600'>+234 801 234 5678</div>
                </div>
                <svg
                  className='w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-black'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                  />
                </svg>
              </a>

              {/* Email */}
              <button
                onClick={() =>
                  window.open('mailto:studio@dgstudios.com', '_blank')
                }
                className='group w-full flex items-center space-x-4 bg-gray-50 hover:bg-gray-100 text-black px-5 py-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300'
              >
                <div className='w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200'>
                  <Mail size={20} className='text-white' />
                </div>
                <div className='flex-1 text-left'>
                  <div className='font-semibold text-sm text-black'>Email</div>
                  <div className='text-xs text-gray-600'>
                    studio@dgstudios.com
                  </div>
                </div>
                <svg
                  className='w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-black'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                  />
                </svg>
              </button>

              {/* Phone */}
              <button
                onClick={() => window.open('tel:+2348031234567', '_self')}
                className='group w-full flex items-center space-x-4 bg-gray-50 hover:bg-gray-100 text-black px-5 py-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300'
              >
                <div className='w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200'>
                  <Phone size={20} className='text-white' />
                </div>
                <div className='flex-1 text-left'>
                  <div className='font-semibold text-sm text-black'>Phone</div>
                  <div className='text-xs text-gray-600'>08120784462</div>
                </div>
                <svg
                  className='w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-black'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                  />
                </svg>
              </button>
            </div>
            {/* Footer */}
          </div>
        </div>
      )}
    </div>
  )
}
