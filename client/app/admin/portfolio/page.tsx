'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import HeroSelector from '@/components/HeroSelector'
import PersistentPortfolioManager from '@/components/PersistentPortfolioManager'

export default function AdminPortfolio() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('dg_studio_admin_jwt')
    if (!token) {
      router.replace('/admin/login')
    }
  }, [router])

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-8'>
      <div className='max-w-[1400px] mx-auto'>
        {/* Logout button at the top, mobile responsive */}
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-2xl sm:text-4xl font-heading font-bold text-black'>
            Portfolio Admin
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem('dg_studio_admin_jwt')
              router.replace('/admin/login')
            }}
            className='bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all shadow text-xs sm:text-base cursor-pointer'
            style={{ minWidth: '80px' }}
          >
            Logout
          </button>
        </div>
        <p className='text-gray-600 mb-4'>
          Manage your photography portfolio and hero slideshow with Cloudinary
          integration
        </p>

        {/* Hero Slides Manager */}
        <div className='mb-12'>
          <HeroSelector />
        </div>

        {/* Portfolio Manager */}
        <PersistentPortfolioManager isAdmin={true} />
      </div>
    </div>
  )
}
