'use client'
import React, { useState } from 'react'
import axios from 'axios'

export default function AdminRegister() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await axios.post('http://localhost:4000/api/admin/register', {
        username,
        email,
        password,
      })
      setSuccess(res.data.message)
      // Redirect to admin dashboard after successful registration
      window.location.href = '/admin/portfolio'
      setUsername('')
      setEmail('')
      setPassword('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200'
      >
        <h2 className='text-2xl font-bold mb-6 text-center'>
          Admin Registration
        </h2>
        <div className='mb-4'>
          <label className='block text-sm font-semibold mb-2'>Username</label>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none'
            required
            autoFocus
          />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-semibold mb-2'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none'
            required
          />
        </div>
        <div className='mb-6'>
          <label className='block text-sm font-semibold mb-2'>Password</label>
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black pr-12 outline-none'
              required
            />
            <button
              type='button'
              className='absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 bg-transparent px-2 py-1 rounded focus:outline-none'
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        {error && <div className='text-red-600 mb-4 text-center'>{error}</div>}
        {success && (
          <div className='text-green-600 mb-4 text-center'>{success}</div>
        )}
        <button
          type='submit'
          className='w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all'
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <button
          type='button'
          className='w-full mt-4 bg-gray-200 text-black py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all'
          onClick={() => (window.location.href = '/admin/login')}
        >
          Login
        </button>
      </form>
    </div>
  )
}
