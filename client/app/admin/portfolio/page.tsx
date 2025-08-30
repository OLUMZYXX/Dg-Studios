'use client'
import HeroSelector from '@/components/HeroSelector'
import PersistentPortfolioManager from '@/components/PersistentPortfolioManager'

export default function AdminPortfolio() {
  return (
    <div className='min-h-screen bg-gray-50 py-12 px-8'>
      <div className='max-w-[1400px] mx-auto'>
        <div className='mb-12'>
          <h1 className='text-4xl font-heading font-bold text-black mb-4'>
            Portfolio Admin
          </h1>
          <p className='text-gray-600 mb-4'>
            Manage your photography portfolio and hero slideshow with Cloudinary
            integration
          </p>
        </div>

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
