const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('./User')

const router = express.Router()

// Admin Login
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body
  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  })
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET || 'your_jwt_secret',
    {
      expiresIn: '2h',
    }
  )
  res.status(200).json({ token })
})

// Admin Registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  const existing = await User.findOne({ $or: [{ username }, { email }] })
  if (existing) {
    return res.status(409).json({ message: 'Username or email already exists' })
  }
  const hashed = await bcrypt.hash(password, 10)
  const user = new User({ username, email, password: hashed })
  await user.save()
  res.status(201).json({ message: 'User registered successfully' })
})

module.exports = router
