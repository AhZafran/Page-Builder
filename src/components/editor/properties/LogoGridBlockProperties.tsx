'use client'

import { useState, useRef } from 'react'
import type { LogoGridBlock, LogoItem } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useDebouncedCallback } from '@/hooks/useDebounce'
import { validateImageFile } from '@/lib/security'
import { Plus, Trash2, Upload, Link as LinkIcon } from 'lucide-react'
import { nanoid } from 'nanoid'

interface LogoGridBlockPropertiesProps {
  block: LogoGridBlock
  sectionId: string
}

export function LogoGridBlockProperties({ block, sectionId }: LogoGridBlockPropertiesProps) {
  const { updateBlock } = useEditorStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleChange = (key: keyof LogoGridBlock, value: any) => {
    updateBlock(sectionId, block.id, { [key]: value })
  }

  const handleStyleChange = (key: string, value: any) => {
    updateBlock(sectionId, block.id, {
      style: { ...block.style, [key]: value },
    })
  }

  const debouncedHandleStyleChange = useDebouncedCallback(handleStyleChange, 150)

  const handleAddLogo = (imageUrl: string, alt: string = '', link: string = '') => {
    const newLogo: LogoItem = {
      id: nanoid(),
      imageUrl,
      alt,
      link,
      target: '_blank',
    }
    handleChange('logos', [...block.logos, newLogo])
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
        handleAddLogo(base64String, file.name)
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

  const handleUpdateLogo = (id: string, updates: Partial<LogoItem>) => {
    const updatedLogos = block.logos.map((logo) =>
      logo.id === id ? { ...logo, ...updates } : logo
    )
    handleChange('logos', updatedLogos)
  }

  const handleDeleteLogo = (id: string) => {
    handleChange('logos', block.logos.filter((logo) => logo.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Logos */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Logos ({block.logos.length})</Label>

        {/* Upload Logo */}
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
          {uploading ? 'Uploading...' : 'Upload Logo'}
        </Button>

        {/* Add Logo by URL */}
        <div className="flex gap-2 mb-3">
          <Input
            type="text"
            placeholder="Or paste logo URL"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                handleAddLogo(e.currentTarget.value)
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
                handleAddLogo(input.value)
                input.value = ''
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Logo List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {block.logos.map((logo) => (
            <div key={logo.id} className="border rounded p-3 space-y-2">
              <div className="flex items-start gap-2">
                <img
                  src={logo.imageUrl}
                  alt={logo.alt || 'Logo'}
                  className="w-16 h-16 object-contain rounded bg-gray-50 p-1"
                />
                <div className="flex-1 space-y-2">
                  <Input
                    type="text"
                    placeholder="Alt text"
                    value={logo.alt || ''}
                    onChange={(e) => handleUpdateLogo(logo.id, { alt: e.target.value })}
                    className="text-xs"
                  />
                  <div className="flex gap-1">
                    <Input
                      type="text"
                      placeholder="Link URL (optional)"
                      value={logo.link || ''}
                      onChange={(e) => handleUpdateLogo(logo.id, { link: e.target.value })}
                      className="text-xs flex-1"
                    />
                    <LinkIcon className="h-4 w-4 text-gray-400 self-center" />
                  </div>
                  {logo.link && (
                    <Select
                      value={logo.target || '_blank'}
                      onValueChange={(value: '_blank' | '_self') =>
                        handleUpdateLogo(logo.id, { target: value })
                      }
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_blank">Open in new tab</SelectItem>
                        <SelectItem value="_self">Open in same tab</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDeleteLogo(logo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Grid Settings */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Grid Settings</Label>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Columns</Label>
            <Select
              value={block.style.columns.toString()}
              onValueChange={(value) => handleStyleChange('columns', Number(value))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
                <SelectItem value="4">4 Columns</SelectItem>
                <SelectItem value="5">5 Columns</SelectItem>
                <SelectItem value="6">6 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-gray-600">Gap Between Logos (px)</Label>
            <Input
              type="number"
              min="0"
              value={block.style.gap}
              onChange={(e) => debouncedHandleStyleChange('gap', Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Logo Size (max height in px)</Label>
            <Input
              type="number"
              min="20"
              max="200"
              value={block.style.logoSize}
              onChange={(e) => debouncedHandleStyleChange('logoSize', Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Alignment</Label>
            <Select
              value={block.style.alignment}
              onValueChange={(value: any) => handleStyleChange('alignment', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Visual Effects */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Visual Effects</Label>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="grayscale"
              checked={block.style.grayscale}
              onChange={(e) => handleStyleChange('grayscale', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="grayscale" className="text-xs cursor-pointer">
              Apply grayscale filter
            </Label>
          </div>

          {block.style.grayscale && (
            <div className="flex items-center gap-2 ml-6">
              <input
                type="checkbox"
                id="grayscaleHover"
                checked={block.style.grayscaleHover}
                onChange={(e) => handleStyleChange('grayscaleHover', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="grayscaleHover" className="text-xs cursor-pointer">
                Remove grayscale on hover
              </Label>
            </div>
          )}

          <div>
            <Label className="text-xs text-gray-600">Opacity (0-1)</Label>
            <Input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={block.style.opacity}
              onChange={(e) => debouncedHandleStyleChange('opacity', Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Hover Opacity (0-1)</Label>
            <Input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={block.style.hoverOpacity}
              onChange={(e) => debouncedHandleStyleChange('hoverOpacity', Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Colors */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Colors</Label>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Background Color</Label>
            <Input
              type="color"
              value={block.style.backgroundColor}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="h-10 mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Logo Container Background</Label>
            <Input
              type="color"
              value={block.style.logoBackgroundColor}
              onChange={(e) => handleStyleChange('logoBackgroundColor', e.target.value)}
              className="h-10 mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Border Radius (px)</Label>
            <Input
              type="number"
              min="0"
              value={block.style.borderRadius}
              onChange={(e) => debouncedHandleStyleChange('borderRadius', Number(e.target.value))}
              className="mt-1"
            />
          </div>
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
