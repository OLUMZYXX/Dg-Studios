// API utility for hero slides
export async function fetchHeroSlides() {
  const res = await fetch('http://localhost:4000/api/heroslides')
  if (!res.ok) throw new Error('Failed to fetch hero slides')
  return await res.json()
}

import type { PortfolioItem } from './portfolioApi'

export async function addHeroSlide(portfolioItem: PortfolioItem) {
  const res = await fetch('http://localhost:4000/api/heroslides', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ portfolioItem }),
  })
  if (!res.ok) throw new Error('Failed to add hero slide')
  return await res.json()
}

export async function deleteHeroSlide(slideId: string) {
  const res = await fetch(`http://localhost:4000/api/heroslides/${slideId}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete hero slide')
  return await res.json()
}

export async function reorderHeroSlides(slideIds: string[]) {
  const res = await fetch('http://localhost:4000/api/heroslides/reorder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slideIds }),
  })
  if (!res.ok) throw new Error('Failed to reorder hero slides')
  return await res.json()
}
