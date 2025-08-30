'use client'

import { AdvancedImage } from '@cloudinary/react'
import { cld } from '../utils/cloudinary'
import { fill, fit } from '@cloudinary/url-gen/actions/resize'
import { quality } from '@cloudinary/url-gen/actions/delivery'
import { auto } from '@cloudinary/url-gen/qualifiers/quality'
import { format } from '@cloudinary/url-gen/actions/delivery'
import { auto as autoFormatQualifier } from '@cloudinary/url-gen/qualifiers/format'
import { sharpen } from '@cloudinary/url-gen/actions/adjust'

interface CloudinaryImageProps {
  publicId: string
  width?: number
  height?: number
  alt: string
  className?: string
  resizeMode?: 'fill' | 'fit'
  crop?: 'fill' | 'fit'
  gravity?: 'faces' | 'center' | 'auto'
  highQuality?: boolean
}

function autoFormat() {
  return format(autoFormatQualifier())
}

export default function CloudinaryImage({
  publicId,
  width,
  height,
  alt,
  className = '',
  resizeMode = 'fill',
  crop = 'fill',
  gravity = 'faces',
  highQuality = false,
}: CloudinaryImageProps) {
  const img = cld.image(publicId)

  // Apply high quality settings for portfolio images
  if (highQuality) {
    // Use higher quality setting and add sharpening
    img.delivery(quality(90)).delivery(autoFormat()).adjust(sharpen(80))
  } else {
    // Standard quality
    img.delivery(quality(auto())).delivery(autoFormat())
  }

  // Apply resize if dimensions provided
  if (width && height) {
    if (crop === 'fill') {
      // Use fill with gravity for smart cropping
      const gravityValue =
        gravity === 'faces' ? 'faces' : gravity === 'auto' ? 'auto' : 'center'
      img.resize(fill().width(width).height(height).gravity(gravityValue))
    } else {
      img.resize(fit().width(width).height(height))
    }
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <AdvancedImage
        cldImg={img}
        alt={alt}
        className='w-full h-full object-cover transition-all duration-300'
      />
    </div>
  )
}
