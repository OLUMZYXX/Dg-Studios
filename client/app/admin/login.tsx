import React, { useState } from 'react'
import axios from 'axios'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${API_URL}/api/admin/login`, {
        identifier,
        password,
      })
      // Save JWT to localStorage or cookie
      localStorage.setItem('dg_studio_admin_jwt', res.data.token)
      window.location.href = '/admin/portfolio'
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200'
      >
        <h2 className='text-2xl font-bold mb-6 text-center'>Admin Login</h2>
        <div className='mb-4'>
          <label className='block text-sm font-semibold mb-2'>
            Username or Email
          </label>
          <input
            type='text'
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black'
            required
            autoFocus
          />
        </div>
        <div className='mb-6'>
          <label className='block text-sm font-semibold mb-2'>Password</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black'
            required
          />
        </div>
        {error && <div className='text-red-600 mb-4 text-center'>{error}</div>}
        <button
          type='submit'
          className='w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all'
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
