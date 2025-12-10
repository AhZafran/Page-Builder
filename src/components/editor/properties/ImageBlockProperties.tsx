'use client'

import { useRef, useState } from 'react'
import type { ImageBlock } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { ValidatedInput } from '@/components/ui/validated-input'
import { validateURL } from '@/lib/input-validation'
import { Upload, X } from 'lucide-react'

interface ImageBlockPropertiesProps {
  block: ImageBlock
  sectionId: string
}

export function ImageBlockProperties({ block, sectionId }: ImageBlockPropertiesProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleChange = (field: string, value: any) => {
    updateBlock(sectionId, block.id, { [field]: value })
  }

  const handleStyleChange = (field: string, value: any) => {
    updateBlock(sectionId, block.id, {
      style: { ...block.style, [field]: value },
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setUploading(true)

    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        handleChange('src', base64String)
        setUploading(false)
      }
      reader.onerror = () => {
        alert('Failed to read file')
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      alert('Failed to upload image')
      setUploading(false)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = () => {
    handleChange('src', 'https://placehold.co/600x400/e2e8f0/64748b?text=Add+Your+Image')
  }

  const isDefaultPlaceholder = block.src.includes('placehold.co')

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div>
        <Label className="text-xs font-semibold mb-2 block">Upload Image</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
          {!isDefaultPlaceholder && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRemoveImage}
              size="icon"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or</span>
        </div>
      </div>

      <ValidatedInput
        label="Image URL"
        id="image-url"
        value={block.src}
        onChange={(e) => handleChange('src', e.target.value)}
        placeholder="https://example.com/image.jpg"
        onValidate={(value) => validateURL(value, true)}
        type="url"
      />

      <div>
        <Label htmlFor="image-alt" className="text-xs font-semibold">Alt Text</Label>
        <Input
          id="image-alt"
          value={block.alt || ''}
          onChange={(e) => handleChange('alt', e.target.value)}
          className="mt-2"
          placeholder="Image description"
        />
      </div>

      <Separator />

      <div>
        <Label className="text-xs font-semibold">Border Radius</Label>
        <div className="flex items-center gap-3 mt-2">
          <Slider
            value={[block.style.borderRadius]}
            onValueChange={(value) => handleStyleChange('borderRadius', value[0])}
            min={0}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-gray-600 w-10 text-right">
            {block.style.borderRadius}px
          </span>
        </div>
      </div>
    </div>
  )
}
