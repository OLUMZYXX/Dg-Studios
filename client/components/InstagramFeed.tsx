'use client'

import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Instagram } from 'lucide-react'

interface InstagramPost {
  id: string
  media_type: string
  media_url: string
  permalink: string
  caption?: string
  timestamp: string
}

interface InstagramFeedProps {
  accessToken?: string
  userId?: string
  limit?: number
}

export default function InstagramFeed({
  accessToken,
  userId,
  limit = 6,
}: InstagramFeedProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hoveredPost, setHoveredPost] = useState<number | null>(null)

  // Fallback posts if API is not set up
  const fallbackPosts = [
    {
      id: 'fallback-1',
      media_type: 'IMAGE',
      media_url:
        'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214171/WhatsApp_Image_2025-08-26_at_13.41.05_4bf21354_tyvb6k.jpg',
      permalink: 'https://www.instagram.com/dg_studios_warri/',
      caption: 'Elegant wedding moments ✨',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'fallback-2',
      media_type: 'IMAGE',
      media_url:
        'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214065/WhatsApp_Image_2025-08-26_at_13.42.04_ebe2af1e_sdhkft.jpg',
      permalink: 'https://www.instagram.com/dg_studios_warri/',
      caption: 'Professional portrait session 📸',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'fallback-3',
      media_type: 'IMAGE',
      media_url:
        'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214253/WhatsApp_Image_2025-08-26_at_14.17.18_f21e80c3_ofyat7.jpg',
      permalink: 'https://www.instagram.com/dg_studios_warri/',
      caption: 'Fashion editorial vibes 🔥',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'fallback-4',
      media_type: 'IMAGE',
      media_url:
        'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214387/WhatsApp_Image_2025-08-26_at_14.19.36_d7443474_str3is.jpg',
      permalink: 'https://www.instagram.com/dg_studios_warri/',
      caption: 'Creative portrait art 🎨',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'fallback-5',
      media_type: 'IMAGE',
      media_url:
        'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214171/WhatsApp_Image_2025-08-26_at_13.41.05_4bf21354_tyvb6k.jpg',
      permalink: 'https://www.instagram.com/dg_studios_warri/',
      caption: 'Behind the scenes magic ✨',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'fallback-6',
      media_type: 'IMAGE',
      media_url:
        'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214253/WhatsApp_Image_2025-08-26_at_14.17.18_f21e80c3_ofyat7.jpg',
      permalink: 'https://www.instagram.com/dg_studios_warri/',
      caption: 'Studio life 📷',
      timestamp: new Date().toISOString(),
    },
  ]

  const fetchInstagramPosts = async () => {
    if (!accessToken || !userId) {
      setPosts(fallbackPosts)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://graph.instagram.com/${userId}/media?fields=id,media_type,media_url,permalink,caption,timestamp&access_token=${accessToken}&limit=${limit}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch Instagram posts')
      }

      const data = await response.json()
      setPosts(data.data || fallbackPosts)
    } catch (err) {
      console.error('Instagram API Error:', err)
      setError('Failed to load Instagram posts')
      setPosts(fallbackPosts) // Use fallback on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInstagramPosts()
  }, [accessToken, userId, limit])

  const displayPosts = posts.slice(0, limit)

  if (loading) {
    return (
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className='aspect-square bg-gray-200 animate-pulse rounded-lg'
          />
        ))}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
      {displayPosts.map((post, index) => (
        <div
          key={post.id}
          className='aspect-square group cursor-pointer relative overflow-hidden rounded-lg border border-gray-200 bg-white'
          onMouseEnter={() => setHoveredPost(index)}
          onMouseLeave={() => setHoveredPost(null)}
          onClick={() => window.open(post.permalink, '_blank')}
        >
          <img
            src={post.media_url}
            alt={post.caption || `Instagram post ${index + 1}`}
            className='w-full h-full object-cover transition-all duration-500 group-hover:scale-110'
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement
              target.src =
                'https://res.cloudinary.com/drqkqdttn/image/upload/v1756214171/WhatsApp_Image_2025-08-26_at_13.41.05_4bf21354_tyvb6k.jpg'
            }}
          />
          <div
            className={`absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center ${
              hoveredPost === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className='text-white text-center p-4'>
              <div className='flex items-center justify-center space-x-6 mb-4'>
                <div className='flex items-center space-x-1'>
                  <Heart size={20} className='fill-current' />
                  <span className='text-sm font-semibold'>
                    {Math.floor(Math.random() * 5000) + 100}
                  </span>
                </div>
                <div className='flex items-center space-x-1'>
                  <MessageCircle size={20} />
                  <span className='text-sm font-semibold'>
                    {Math.floor(Math.random() * 500) + 10}
                  </span>
                </div>
              </div>
              <div className='text-sm font-medium'>View on Instagram</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
