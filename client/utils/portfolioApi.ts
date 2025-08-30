// API utility for portfolio backend
export interface PortfolioItem {
  id?: string
  title: string
  category: string
  cloudinaryUrl: string
  publicId?: string
  uploadedAt?: string
  order?: number
  isCloudinary?: boolean
  image?: string
}

const API_URL = 'http://localhost:4000/api/portfolio'

export async function fetchPortfolio(): Promise<PortfolioItem[]> {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error('Failed to fetch portfolio')
  return res.json()
}

export async function addPortfolioItem(
  item: PortfolioItem
): Promise<PortfolioItem> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
  if (!res.ok) throw new Error('Failed to add portfolio item')
  return res.json()
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete portfolio item')
}

export async function clearPortfolio(): Promise<void> {
  await fetch(API_URL, { method: 'DELETE' })
}
