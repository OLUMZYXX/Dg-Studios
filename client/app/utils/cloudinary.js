export function getCloudinaryUrl(publicId, options = {}) {
  const cloudName = 'drqkqdttn'
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload/`
  const transformations = []

  if (options.width) transformations.push(`w_${options.width}`)
  if (options.height) transformations.push(`h_${options.height}`)
  if (options.quality) transformations.push(`q_${options.quality}`)
  if (options.format) transformations.push(`f_${options.format}`)
  if (options.crop) transformations.push(`c_${options.crop}`)

  const transformationString = transformations.join(',')
  return `${baseUrl}${
    transformationString ? transformationString + '/' : ''
  }${publicId}`
}
