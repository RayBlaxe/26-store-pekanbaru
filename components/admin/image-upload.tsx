"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Upload, ImageIcon } from "lucide-react"
import { validateImageFiles, createImagePreview, formatFileSize } from "@/services/upload.service"

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
  disabled?: boolean
}

interface ImagePreview {
  file: File
  preview: string
  uploading?: boolean
  uploaded?: boolean
  url?: string
  error?: string
}

export function ImageUpload({ value = [], onChange, maxFiles = 5, disabled }: ImageUploadProps) {
  const [previews, setPreviews] = useState<ImagePreview[]>([])
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled) return

    // Validate files
    const validation = validateImageFiles(acceptedFiles)
    if (!validation.valid) {
      // Handle validation errors
      console.error('File validation errors:', validation.errors)
      return
    }

    // Create previews
    const newPreviews: ImagePreview[] = []
    for (const file of acceptedFiles) {
      try {
        const preview = await createImagePreview(file)
        newPreviews.push({
          file,
          preview,
          uploading: false,
          uploaded: false
        })
      } catch (error) {
        console.error('Error creating preview:', error)
      }
    }

    setPreviews(prev => [...prev, ...newPreviews].slice(0, maxFiles))
  }, [disabled, maxFiles])

  const { getRootProps, getInputProps, isDragActive: dropzoneIsDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxFiles - value.length - previews.length,
    disabled,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  })

  const removePreview = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const removeExisting = (index: number) => {
    const newValue = value.filter((_, i) => i !== index)
    onChange(newValue)
  }

  const uploadPreviews = async () => {
    // This would typically upload to your server
    // For now, we'll simulate the upload process
    const uploadPromises = previews.map(async (preview, index) => {
      if (preview.uploaded) return preview

      setPreviews(prev => prev.map((p, i) => 
        i === index ? { ...p, uploading: true } : p
      ))

      try {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // In a real app, you'd call your upload service here
        const mockUrl = `/uploads/${Date.now()}-${preview.file.name}`
        
        setPreviews(prev => prev.map((p, i) => 
          i === index ? { ...p, uploading: false, uploaded: true, url: mockUrl } : p
        ))

        return { ...preview, uploaded: true, url: mockUrl }
      } catch (error) {
        setPreviews(prev => prev.map((p, i) => 
          i === index ? { ...p, uploading: false, error: 'Upload failed' } : p
        ))
        throw error
      }
    })

    try {
      const results = await Promise.all(uploadPromises)
      const uploadedUrls = results
        .filter(r => r.uploaded && r.url)
        .map(r => r.url!)
      
      onChange([...value, ...uploadedUrls])
      setPreviews([])
    } catch (error) {
      console.error('Upload error:', error)
    }
  }

  const totalImages = value.length + previews.length
  const canAddMore = totalImages < maxFiles

  return (
    <div className="space-y-4">
      {/* Existing Images */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <Card key={url} className="relative group">
              <CardContent className="p-2">
                <div className="relative aspect-square">
                  <Image
                    src={url}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                  {!disabled && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeExisting(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Images */}
      {previews.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <div className="relative aspect-square">
                    <Image
                      src={preview.preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded"
                    />
                    {preview.uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      </div>
                    )}
                    {preview.error && (
                      <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center rounded">
                        <p className="text-white text-xs text-center p-1">
                          {preview.error}
                        </p>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePreview(index)}
                      disabled={preview.uploading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <p className="truncate">{preview.file.name}</p>
                    <p>{formatFileSize(preview.file.size)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button 
            onClick={uploadPreviews}
            disabled={previews.some(p => p.uploading) || previews.every(p => p.uploaded)}
            className="w-full"
          >
            {previews.some(p => p.uploading) ? 'Uploading...' : 'Upload Images'}
          </Button>
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive || dropzoneIsDragActive
              ? 'border-primary bg-primary/10'
              : 'border-muted-foreground/25 hover:border-primary hover:bg-muted/50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            {isDragActive || dropzoneIsDragActive ? (
              <>
                <Upload className="h-8 w-8 text-primary" />
                <p className="text-primary font-medium">Drop images here</p>
              </>
            ) : (
              <>
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG, WebP (max 5MB each)
                </p>
                <p className="text-xs text-muted-foreground">
                  {maxFiles - totalImages} more file{maxFiles - totalImages !== 1 ? 's' : ''} allowed
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {totalImages >= maxFiles && (
        <p className="text-sm text-muted-foreground text-center">
          Maximum of {maxFiles} images reached
        </p>
      )}
    </div>
  )
}