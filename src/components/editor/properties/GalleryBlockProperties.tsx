'use client'

import { useState, useRef } from 'react'
import type { GalleryBlock, GalleryImage } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useDebouncedCallback } from '@/hooks/useDebounce'
import { validateImageFile } from '@/lib/security'
import { Plus, Trash2, Upload, MoveUp, MoveDown } from 'lucide-react'
import { nanoid } from 'nanoid'

interface GalleryBlockPropertiesProps {
  block: GalleryBlock
  sectionId: string
}

export function GalleryBlockProperties({ block, sectionId }: GalleryBlockPropertiesProps) {
  const { updateBlock } = useEditorStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleChange = (key: keyof GalleryBlock, value: any) => {
    updateBlock(sectionId, block.id, { [key]: value })
  }

  const handleStyleChange = (key: string, value: any) => {
    updateBlock(sectionId, block.id, {
      style: { ...block.style, [key]: value },
    })
  }

  const debouncedHandleStyleChange = useDebouncedCallback(handleStyleChange, 150)

  const handleAddImage = (url: string, alt: string = '', caption: string = '') => {
    const newImage: GalleryImage = {
      id: nanoid(),
      url,
      alt,
      caption,
    }
    handleChange('images', [...block.images, newImage])
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setUploading(true)

    try {
      const isValidImage = await validateImageFile(file)
      if (!isValidImage) {
        alert('Invalid image file. Please select a valid JPEG, PNG, GIF, or WebP image.')
        setUploading(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        handleAddImage(base64String, file.name)
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

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpdateImage = (id: string, updates: Partial<GalleryImage>) => {
    const updatedImages = block.images.map((img) =>
      img.id === id ? { ...img, ...updates } : img
    )
    handleChange('images', updatedImages)
  }

  const handleDeleteImage = (id: string) => {
    handleChange('images', block.images.filter((img) => img.id !== id))
  }

  const handleMoveImageUp = (index: number) => {
    if (index === 0) return
    const newImages = [...block.images]
    ;[newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]]
    handleChange('images', newImages)
  }

  const handleMoveImageDown = (index: number) => {
    if (index === block.images.length - 1) return
    const newImages = [...block.images]
    ;[newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]]
    handleChange('images', newImages)
  }

  return (
    <div className="space-y-6">
      {/* Images */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Images ({block.images.length})</Label>

        {/* Upload Image */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full mb-3"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>

        {/* Add Image by URL */}
        <div className="flex gap-2 mb-3">
          <Input
            type="text"
            placeholder="Or paste image URL"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                handleAddImage(e.currentTarget.value)
                e.currentTarget.value = ''
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement
              if (input.value) {
                handleAddImage(input.value)
                input.value = ''
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Image List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {block.images.map((image, index) => (
            <div key={image.id} className="border rounded p-3 space-y-2">
              <div className="flex items-start gap-2">
                <img
                  src={image.url}
                  alt={image.alt || `Image ${index + 1}`}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 space-y-2">
                  <Input
                    type="text"
                    placeholder="Alt text"
                    value={image.alt || ''}
                    onChange={(e) => handleUpdateImage(image.id, { alt: e.target.value })}
                    className="text-xs"
                  />
                  <Input
                    type="text"
                    placeholder="Caption (optional)"
                    value={image.caption || ''}
                    onChange={(e) => handleUpdateImage(image.id, { caption: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleMoveImageUp(index)}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleMoveImageDown(index)}
                    disabled={index === block.images.length - 1}
                  >
                    <MoveDown className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Gallery Settings */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Gallery Settings</Label>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoPlay"
              checked={block.autoPlay}
              onChange={(e) => handleChange('autoPlay', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="autoPlay" className="text-xs cursor-pointer">Auto-play</Label>
          </div>

          {block.autoPlay && (
            <div>
              <Label className="text-xs text-gray-600">Auto-play Interval (ms)</Label>
              <Input
                type="number"
                min="1000"
                step="500"
                value={block.autoPlayInterval}
                onChange={(e) => handleChange('autoPlayInterval', Number(e.target.value))}
                className="mt-1"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="loop"
              checked={block.loop}
              onChange={(e) => handleChange('loop', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="loop" className="text-xs cursor-pointer">Loop images</Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showNavButtons"
              checked={block.showNavButtons}
              onChange={(e) => handleChange('showNavButtons', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="showNavButtons" className="text-xs cursor-pointer">Show navigation buttons</Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showDots"
              checked={block.showDots}
              onChange={(e) => handleChange('showDots', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="showDots" className="text-xs cursor-pointer">Show dots indicator</Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Display Settings */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Display Settings</Label>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Aspect Ratio</Label>
            <Select
              value={block.style.aspectRatio}
              onValueChange={(value: any) => handleStyleChange('aspectRatio', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                <SelectItem value="4:3">4:3</SelectItem>
                <SelectItem value="3:2">3:2</SelectItem>
                <SelectItem value="1:1">1:1 (Square)</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-gray-600">Image Fit</Label>
            <Select
              value={block.style.imageObjectFit}
              onValueChange={(value: any) => handleStyleChange('imageObjectFit', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cover">Cover</SelectItem>
                <SelectItem value="contain">Contain</SelectItem>
                <SelectItem value="fill">Fill</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-gray-600">Border Radius</Label>
            <Input
              type="number"
              min="0"
              value={block.style.borderRadius}
              onChange={(e) => debouncedHandleStyleChange('borderRadius', Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showThumbnails"
              checked={block.style.showThumbnails}
              onChange={(e) => handleStyleChange('showThumbnails', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="showThumbnails" className="text-xs cursor-pointer">Show thumbnails</Label>
          </div>

          {block.style.showThumbnails && (
            <div>
              <Label className="text-xs text-gray-600">Thumbnail Size (px)</Label>
              <Input
                type="number"
                min="40"
                max="150"
                value={block.style.thumbnailSize}
                onChange={(e) => debouncedHandleStyleChange('thumbnailSize', Number(e.target.value))}
                className="mt-1"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showCaptions"
              checked={block.style.showCaptions}
              onChange={(e) => handleStyleChange('showCaptions', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="showCaptions" className="text-xs cursor-pointer">Show captions</Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Colors */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Colors</Label>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Nav Button Color</Label>
            <Input
              type="color"
              value={block.style.navButtonColor}
              onChange={(e) => handleStyleChange('navButtonColor', e.target.value)}
              className="h-10 mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Nav Button Background</Label>
            <Input
              type="color"
              value={block.style.navButtonBackgroundColor}
              onChange={(e) => handleStyleChange('navButtonBackgroundColor', e.target.value)}
              className="h-10 mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Dot Color</Label>
            <Input
              type="color"
              value={block.style.dotColor}
              onChange={(e) => handleStyleChange('dotColor', e.target.value)}
              className="h-10 mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Active Dot Color</Label>
            <Input
              type="color"
              value={block.style.dotActiveColor}
              onChange={(e) => handleStyleChange('dotActiveColor', e.target.value)}
              className="h-10 mt-1"
            />
          </div>

          {block.style.showCaptions && (
            <>
              <div>
                <Label className="text-xs text-gray-600">Caption Color</Label>
                <Input
                  type="color"
                  value={block.style.captionColor}
                  onChange={(e) => handleStyleChange('captionColor', e.target.value)}
                  className="h-10 mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-600">Caption Background</Label>
                <Input
                  type="color"
                  value={block.style.captionBackgroundColor}
                  onChange={(e) => handleStyleChange('captionBackgroundColor', e.target.value)}
                  className="h-10 mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-600">Caption Size</Label>
                <Input
                  type="number"
                  min="10"
                  max="24"
                  value={block.style.captionSize}
                  onChange={(e) => debouncedHandleStyleChange('captionSize', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <Separator />

      {/* Spacing */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Spacing</Label>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600 mb-2 block">Padding</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Top"
                value={block.style.padding.top}
                onChange={(e) =>
                  handleStyleChange('padding', { ...block.style.padding, top: Number(e.target.value) })
                }
              />
              <Input
                type="number"
                placeholder="Right"
                value={block.style.padding.right}
                onChange={(e) =>
                  handleStyleChange('padding', { ...block.style.padding, right: Number(e.target.value) })
                }
              />
              <Input
                type="number"
                placeholder="Bottom"
                value={block.style.padding.bottom}
                onChange={(e) =>
                  handleStyleChange('padding', { ...block.style.padding, bottom: Number(e.target.value) })
                }
              />
              <Input
                type="number"
                placeholder="Left"
                value={block.style.padding.left}
                onChange={(e) =>
                  handleStyleChange('padding', { ...block.style.padding, left: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-600 mb-2 block">Margin</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Top"
                value={block.style.margin.top}
                onChange={(e) =>
                  handleStyleChange('margin', { ...block.style.margin, top: Number(e.target.value) })
                }
              />
              <Input
                type="number"
                placeholder="Right"
                value={block.style.margin.right}
                onChange={(e) =>
                  handleStyleChange('margin', { ...block.style.margin, right: Number(e.target.value) })
                }
              />
              <Input
                type="number"
                placeholder="Bottom"
                value={block.style.margin.bottom}
                onChange={(e) =>
                  handleStyleChange('margin', { ...block.style.margin, bottom: Number(e.target.value) })
                }
              />
              <Input
                type="number"
                placeholder="Left"
                value={block.style.margin.left}
                onChange={(e) =>
                  handleStyleChange('margin', { ...block.style.margin, left: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
