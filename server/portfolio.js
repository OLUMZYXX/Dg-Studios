// Simple Express backend for portfolio items
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const PORT = process.env.PORT || 4000

const allowedOrigins = [
  'http://localhost:3000', // for local dev
  'https://dg-studios.vercel.app', // your deployed frontend
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)

app.use(bodyParser.json())

// In-memory store (replace with DB for production)

let portfolioItems = []
let heroSlides = []

// Get all portfolio items
app.get('/api/portfolio', (req, res) => {
  res.json(portfolioItems)
})

// Add a new portfolio item
app.post('/api/portfolio', (req, res) => {
  const item = req.body
  if (!item || !item.cloudinaryUrl) {
    return res.status(400).json({ error: 'Missing image data' })
  }
  item.id = Date.now().toString()
  portfolioItems.push(item)
  res.status(201).json(item)
})

// Delete a portfolio item by ID
app.delete('/api/portfolio/:id', (req, res) => {
  const { id } = req.params
  portfolioItems = portfolioItems.filter((item) => item.id !== id)
  // Remove hero slides referencing this portfolio item
  heroSlides = heroSlides.filter((slide) => slide.portfolioItemId !== id)
  res.json({ success: true })
})

// Clear all items (for testing)
app.delete('/api/portfolio', (req, res) => {
  portfolioItems = []
  heroSlides = []
  res.json({ success: true })
})

// Hero slides endpoints
app.get('/api/heroslides', (req, res) => {
  res.json(heroSlides)
})

app.post('/api/heroslides', (req, res) => {
  if (heroSlides.length >= 5) {
    return res.status(400).json({ error: 'Maximum 5 hero slides allowed' })
  }
  const { portfolioItem } = req.body
  if (!portfolioItem || !portfolioItem.id) {
    return res.status(400).json({ error: 'Missing portfolio item' })
  }
  const newSlide = {
    id: `hero_${Date.now()}`,
    portfolioItemId: portfolioItem.id,
    portfolioItem,
    order: heroSlides.length,
    isActive: heroSlides.length === 0,
    addedAt: new Date().toISOString(),
  }
  heroSlides.push(newSlide)
  res.json(newSlide)
})

app.delete('/api/heroslides/:id', (req, res) => {
  const { id } = req.params
  heroSlides = heroSlides.filter((slide) => slide.id !== id)
  // Reorder remaining slides
  heroSlides = heroSlides.map((slide, idx) => ({
    ...slide,
    order: idx,
    isActive: idx === 0,
  }))
  res.json({ success: true })
})

app.post('/api/heroslides/reorder', (req, res) => {
  const { slideIds } = req.body
  const reorderedSlides = []
  slideIds.forEach((id, idx) => {
    const slide = heroSlides.find((s) => s.id === id)
    if (slide) {
      reorderedSlides.push({ ...slide, order: idx, isActive: idx === 0 })
    }
  })
  heroSlides = reorderedSlides
  res.json(heroSlides)
})

app.listen(PORT, () => {
  console.log(`Portfolio backend running on port ${PORT}`)
})
