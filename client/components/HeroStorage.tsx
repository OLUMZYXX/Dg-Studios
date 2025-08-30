'use client'

import { PortfolioItem } from './PortfolioStorage'

interface HeroSlide {
  id: string
  portfolioItemId: string
  portfolioItem: PortfolioItem
  order: number
  isActive: boolean
  addedAt: string
}

export class HeroStorage {
  private static STORAGE_KEY = 'dg_studio_hero_slides'

  // Save hero slides to localStorage
  static saveHeroSlides(slides: HeroSlide[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(slides))
    }
  }

  // Load hero slides from localStorage
  static loadHeroSlides(): HeroSlide[] {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    }
    return []
  }

  // Add a portfolio item as a hero slide
  static addHeroSlide(portfolioItem: PortfolioItem): HeroSlide {
    const slides = this.loadHeroSlides()
    const newSlide: HeroSlide = {
      id: `hero_${Date.now()}`,
      portfolioItemId: portfolioItem.id,
      portfolioItem,
      order: slides.length,
      isActive: slides.length === 0, // First slide is active by default
      addedAt: new Date().toISOString(),
    }

    slides.push(newSlide)
    this.saveHeroSlides(slides)
    return newSlide
  }

  // Remove a hero slide by portfolio item ID (when portfolio item is deleted)
  static removeByPortfolioId(portfolioItemId: string): HeroSlide[] {
    const slides = this.loadHeroSlides().filter(
      (slide) => slide.portfolioItemId !== portfolioItemId
    )

    // Reorder remaining slides
    const reorderedSlides = slides.map((slide, index) => ({
      ...slide,
      order: index,
      isActive: index === 0, // First slide becomes active
    }))

    this.saveHeroSlides(reorderedSlides)
    return reorderedSlides
  }

  // Remove a hero slide
  static removeHeroSlide(slideId: string): HeroSlide[] {
    const slides = this.loadHeroSlides().filter((slide) => slide.id !== slideId)

    // Reorder remaining slides
    const reorderedSlides = slides.map((slide, index) => ({
      ...slide,
      order: index,
      isActive: index === 0, // First slide becomes active
    }))

    this.saveHeroSlides(reorderedSlides)
    return reorderedSlides
  }

  // Reorder hero slides
  static reorderHeroSlides(slideIds: string[]): HeroSlide[] {
    const slides = this.loadHeroSlides()
    const reorderedSlides: HeroSlide[] = []

    slideIds.forEach((id, index) => {
      const slide = slides.find((s) => s.id === id)
      if (slide) {
        reorderedSlides.push({
          ...slide,
          order: index,
          isActive: index === 0,
        })
      }
    })

    this.saveHeroSlides(reorderedSlides)
    return reorderedSlides
  }

  // Get hero slides as Cloudinary URLs with face detection
  static getHeroSlidesUrls(): string[] {
    const slides = this.loadHeroSlides().sort((a, b) => a.order - b.order)

    return slides
      .map((slide) => {
        const item = slide.portfolioItem
        if (item.publicId) {
          // Use Cloudinary URL with face detection and high-quality optimizations
          return `https://res.cloudinary.com/drqkqdttn/image/upload/w_1920,h_1080,c_fill,g_faces,f_auto,q_90,e_sharpen:80/${item.publicId}`
        }
        return item.cloudinaryUrl || item.image || ''
      })
      .filter(Boolean)
  }

  // Check if a portfolio item is already in hero slides
  static isInHeroSlides(portfolioItemId: string): boolean {
    const slides = this.loadHeroSlides()
    return slides.some((slide) => slide.portfolioItemId === portfolioItemId)
  }

  // Get count of hero slides
  static getHeroSlidesCount(): number {
    return this.loadHeroSlides().length
  }
}

export type { HeroSlide }
