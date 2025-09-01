// Simple Express backend for portfolio items
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 4000

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/dg-studio'
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err))

// Define schemas
const portfolioSchema = new mongoose.Schema({
  id: String,
  title: String,
  category: String,
  cloudinaryUrl: String,
  publicId: String,
  uploadedAt: Date,
  order: Number,
  isCloudinary: Boolean,
  image: String,
})

const heroSlideSchema = new mongoose.Schema({
  id: String,
  portfolioItemId: String,
  portfolioItem: Object,
  order: Number,
  isActive: Boolean,
  addedAt: Date,
})

const PortfolioItem = mongoose.model('PortfolioItem', portfolioSchema)
const HeroSlide = mongoose.model('HeroSlide', heroSlideSchema)

app.use(
  cors({
    origin: '*', // Allow all origins for testing
    credentials: true,
  })
)

app.use(bodyParser.json())

// Get all portfolio items
app.get('/api/portfolio', async (req, res) => {
  try {
    const items = await PortfolioItem.find().sort({ order: 1 })
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio items' })
  }
})

// Add a new portfolio item
app.post('/api/portfolio', async (req, res) => {
  try {
    const item = req.body
    if (!item || !item.cloudinaryUrl) {
      return res.status(400).json({ error: 'Missing image data' })
    }

    // Check for duplicate images
    const existingItem = await PortfolioItem.findOne({
      $or: [{ publicId: item.publicId }, { cloudinaryUrl: item.cloudinaryUrl }],
    })

    if (existingItem) {
      return res.status(409).json({
        error: 'This image has already been uploaded to your portfolio.',
        duplicate: true,
      })
    }

    item.id = Date.now().toString()
    const newItem = new PortfolioItem(item)
    await newItem.save()
    res.status(201).json(newItem)
  } catch (error) {
    res.status(500).json({ error: 'Failed to add portfolio item' })
  }
})

// Delete a portfolio item by ID
app.delete('/api/portfolio/:id', async (req, res) => {
  try {
    const { id } = req.params
    await PortfolioItem.findOneAndDelete({ id })
    // Remove hero slides referencing this portfolio item
    await HeroSlide.deleteMany({ portfolioItemId: id })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete portfolio item' })
  }
})

// Clear all items (for testing)
app.delete('/api/portfolio', async (req, res) => {
  try {
    await PortfolioItem.deleteMany({})
    await HeroSlide.deleteMany({})
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear portfolio' })
  }
})

// Hero slides endpoints
app.get('/api/heroslides', async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1 })
    res.json(slides)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hero slides' })
  }
})

app.post('/api/heroslides', async (req, res) => {
  try {
    const count = await HeroSlide.countDocuments()
    if (count >= 5) {
      return res.status(400).json({ error: 'Maximum 5 hero slides allowed' })
    }
    const { portfolioItem } = req.body
    if (!portfolioItem || !portfolioItem.id) {
      return res.status(400).json({ error: 'Missing portfolio item' })
    }
    const newSlide = new HeroSlide({
      id: `hero_${Date.now()}`,
      portfolioItemId: portfolioItem.id,
      portfolioItem,
      order: count,
      isActive: count === 0,
      addedAt: new Date().toISOString(),
    })
    await newSlide.save()
    res.json(newSlide)
  } catch (error) {
    res.status(500).json({ error: 'Failed to add hero slide' })
  }
})

app.delete('/api/heroslides/:id', async (req, res) => {
  try {
    const { id } = req.params
    await HeroSlide.findOneAndDelete({ id })
    // Reorder remaining slides
    const remainingSlides = await HeroSlide.find().sort({ order: 1 })
    for (let i = 0; i < remainingSlides.length; i++) {
      remainingSlides[i].order = i
      remainingSlides[i].isActive = i === 0
      await remainingSlides[i].save()
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete hero slide' })
  }
})

app.post('/api/heroslides/reorder', async (req, res) => {
  try {
    const { slideIds } = req.body
    const reorderedSlides = []
    for (let i = 0; i < slideIds.length; i++) {
      const slide = await HeroSlide.findOne({ id: slideIds[i] })
      if (slide) {
        slide.order = i
        slide.isActive = i === 0
        await slide.save()
        reorderedSlides.push(slide)
      }
    }
    res.json(reorderedSlides)
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder hero slides' })
  }
})

app.listen(PORT, () => {
  console.log(`Portfolio backend running on port ${PORT}`)
})
