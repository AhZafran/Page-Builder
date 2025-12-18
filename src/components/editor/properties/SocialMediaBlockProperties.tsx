'use client'

import type { SocialMediaBlock, Spacing, SocialPlatform, SocialLink } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { useDebouncedCallback } from '@/hooks/useDebounce'

interface SocialMediaBlockPropertiesProps {
  block: SocialMediaBlock
  sectionId: string
}

const availablePlatforms: { value: SocialPlatform; label: string }[] = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'github', label: 'GitHub' },
  { value: 'discord', label: 'Discord' },
]

export function SocialMediaBlockProperties({ block, sectionId }: SocialMediaBlockPropertiesProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock)

  const handleStyleChange = (field: keyof SocialMediaBlock['style'], value: any) => {
    updateBlock(sectionId, block.id, {
      style: {
        ...block.style,
        [field]: value,
      },
    })
  }

  const handleMarginChange = (field: keyof Spacing, value: number) => {
    handleStyleChange('margin', {
      ...block.style.margin,
      [field]: value,
    })
  }

  const handleAddLink = () => {
    updateBlock(sectionId, block.id, {
      links: [
        ...block.links,
        { platform: 'facebook', url: 'https://facebook.com' },
      ],
    })
  }

  const handleRemoveLink = (index: number) => {
    updateBlock(sectionId, block.id, {
      links: block.links.filter((_, i) => i !== index),
    })
  }

  const handleUpdateLink = (index: number, updates: Partial<SocialLink>) => {
    const newLinks = [...block.links]
    newLinks[index] = { ...newLinks[index], ...updates }
    updateBlock(sectionId, block.id, { links: newLinks })
  }

  const debouncedUrlChange = useDebouncedCallback((index: number, url: string) => {
    handleUpdateLink(index, { url })
  }, 500)

  const debouncedColorChange = useDebouncedCallback((value: string) => {
    handleStyleChange('customColor', value)
  }, 300)

  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="font-semibold mb-4">Social Media Properties</h3>
      </div>

      {/* Social Links */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Social Links</Label>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddLink}
            className="h-7"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-3 mt-2">
          {block.links.map((link, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1 space-y-2">
                <Select
                  value={link.platform}
                  onValueChange={(value: SocialPlatform) =>
                    handleUpdateLink(index, { platform: value })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlatforms.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="url"
                  defaultValue={link.url}
                  onChange={(e) => debouncedUrlChange(index, e.target.value)}
                  placeholder="https://..."
                  className="h-9"
                />
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveLink(index)}
                className="h-9 w-9 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Icon Size</Label>
          <span className="text-sm text-gray-500">{block.style.size}px</span>
        </div>
        <Slider
          value={[block.style.size]}
          onValueChange={([value]) => handleStyleChange('size', value)}
          min={16}
          max={80}
          step={1}
          className="mt-2"
        />
      </div>

      {/* Layout */}
      <div>
        <Label>Layout</Label>
        <Select
          value={block.style.layout}
          onValueChange={(value: 'horizontal' | 'vertical') => handleStyleChange('layout', value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="horizontal">Horizontal</SelectItem>
            <SelectItem value="vertical">Vertical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alignment */}
      <div>
        <Label>Alignment</Label>
        <Select
          value={block.style.alignment}
          onValueChange={(value: 'left' | 'center' | 'right') => handleStyleChange('alignment', value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Spacing */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Icon Spacing</Label>
          <span className="text-sm text-gray-500">{block.style.spacing}px</span>
        </div>
        <Slider
          value={[block.style.spacing]}
          onValueChange={([value]) => handleStyleChange('spacing', value)}
          min={0}
          max={48}
          step={1}
          className="mt-2"
        />
      </div>

      {/* Use Brand Colors */}
      <div>
        <Label>Use Brand Colors</Label>
        <Select
          value={block.style.useBrandColors ? 'yes' : 'no'}
          onValueChange={(value) => handleStyleChange('useBrandColors', value === 'yes')}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes - Use platform colors</SelectItem>
            <SelectItem value="no">No - Use custom color</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom Color */}
      {!block.style.useBrandColors && (
        <div>
          <Label>Custom Color</Label>
          <div className="flex gap-2 mt-2">
            <Input
              type="color"
              value={block.style.customColor || '#000000'}
              onChange={(e) => debouncedColorChange(e.target.value)}
              className="w-20 h-10"
            />
            <Input
              type="text"
              value={block.style.customColor || '#000000'}
              onChange={(e) => debouncedColorChange(e.target.value)}
              placeholder="#000000"
            />
          </div>
        </div>
      )}

      {/* Margin */}
      <div>
        <Label>Margin</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <Label className="text-xs text-gray-500">Top</Label>
            <Input
              type="number"
              value={block.style.margin.top}
              onChange={(e) => handleMarginChange('top', parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Bottom</Label>
            <Input
              type="number"
              value={block.style.margin.bottom}
              onChange={(e) => handleMarginChange('bottom', parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
