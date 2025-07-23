import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export interface UploadResponse {
  url: string
  filename: string
  size: number
  type: string
}

export const uploadSingleImage = async (file: File, folder: string = 'products'): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  const response = await axios.post(`${API_BASE_URL}/upload/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const uploadMultipleImages = async (files: File[], folder: string = 'products'): Promise<UploadResponse[]> => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })
  formData.append('folder', folder)

  const response = await axios.post(`${API_BASE_URL}/upload/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const deleteImage = async (filename: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/upload/image/${filename}`)
}

export const deleteMultipleImages = async (filenames: string[]): Promise<void> => {
  await axios.post(`${API_BASE_URL}/upload/images/delete`, { filenames })
}

// Utility functions for file validation
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not supported. Please use JPEG, PNG, or WebP.'
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Maximum size is 5MB.'
    }
  }

  return { valid: true }
}

export const validateImageFiles = (files: File[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  files.forEach((file, index) => {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      errors.push(`File ${index + 1}: ${validation.error}`)
    }
  })

  return {
    valid: errors.length === 0,
    errors
  }
}

// Helper function to create image preview URLs
export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error('Failed to create preview'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}