// API utility for hero slides
export async function fetchHeroSlides() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/heroslides`
    : 'http://localhost:4000/api/heroslides'
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error('Failed to fetch hero slides')
  return await res.json()
}

import type { PortfolioItem } from './portfolioApi'

export async function addHeroSlide(portfolioItem: PortfolioItem) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/heroslides`
    : 'http://localhost:4000/api/heroslides'
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ portfolioItem }),
  })
  if (!res.ok) throw new Error('Failed to add hero slide')
  return await res.json()
}

export async function deleteHeroSlide(slideId: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/heroslides/${slideId}`
    : `http://localhost:4000/api/heroslides/${slideId}`
  const res = await fetch(API_URL, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete hero slide')
  return await res.json()
}

export async function reorderHeroSlides(slideIds: string[]) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/heroslides/reorder`
    : 'http://localhost:4000/api/heroslides/reorder'
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slideIds }),
  })
  if (!res.ok) throw new Error('Failed to reorder hero slides')
  return await res.json()
}
