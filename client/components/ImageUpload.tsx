'use client'

import { useState, useRef } from 'react'
import { uploadImage } from '../utils/cloudinary'
import { Camera, Upload, X, Check } from 'lucide-react'

interface ImageUploadProps {
  onUploadSuccess?: (data: any) => void
  onUploadError?: (error: any) => void
  className?: string
  acceptedFormats?: string
  maxFileSize?: number // in MB
}

export default function ImageUpload({
  onUploadSuccess,
  onUploadError,
  className = '',
  acceptedFormats = 'image/*',
  maxFileSize = 10,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    // Validate file size
    if (file.size > maxFileSize * 1024 * 1024) {
      const errorMsg = `File size must be less than ${maxFileSize}MB`
      setError(errorMsg)
      onUploadError?.(new Error(errorMsg))
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      const errorMsg = 'Please select an image file'
      setError(errorMsg)
      onUploadError?.(new Error(errorMsg))
      return
    }

    setUploading(true)
    setError(null)
    setUploadSuccess(false)

    try {
      const result = await uploadImage(file)
      setUploadSuccess(true)
      onUploadSuccess?.(result)

      // Reset success state after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (err) {
      const errorMsg = 'Upload failed. Please try again.'
      setError(errorMsg)
      onUploadError?.(err)
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type='file'
        className='hidden'
        accept={acceptedFormats}
        onChange={handleChange}
        disabled={uploading}
      />

      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-300 hover:border-gray-400
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          ${uploadSuccess ? 'border-green-400 bg-green-50' : ''}
          ${error ? 'border-red-400 bg-red-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!uploading ? openFileDialog : undefined}
      >
        {uploading ? (
          <div className='flex flex-col items-center space-y-4'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-black'></div>
            <p className='text-gray-600'>Uploading image...</p>
          </div>
        ) : uploadSuccess ? (
          <div className='flex flex-col items-center space-y-4 text-green-600'>
            <Check size={48} />
            <p className='font-semibold'>Upload successful!</p>
          </div>
        ) : (
          <div className='flex flex-col items-center space-y-4'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center'>
              {dragActive ? (
                <Upload size={24} className='text-blue-600' />
              ) : (
                <Camera size={24} className='text-gray-400' />
              )}
            </div>
            <div>
              <p className='text-lg font-semibold text-gray-700 mb-2'>
                {dragActive ? 'Drop image here' : 'Upload your image'}
              </p>
              <p className='text-sm text-gray-500'>
                Drag & drop or click to select • Max {maxFileSize}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className='mt-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center space-x-2'>
          <X size={16} className='text-red-600' />
          <p className='text-red-700 text-sm'>{error}</p>
        </div>
      )}
    </div>
  )
}
