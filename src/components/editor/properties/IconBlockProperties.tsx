'use client'

import type { IconBlock, Spacing } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDebouncedCallback } from '@/hooks/useDebounce'
import * as LucideIcons from 'lucide-react'

interface IconBlockPropertiesProps {
  block: IconBlock
  sectionId: string
}

// Popular icon names from Lucide
const popularIcons = [
  'Heart', 'Star', 'Check', 'X', 'Plus', 'Minus',
  'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown',
  'Mail', 'Phone', 'MapPin', 'Globe',
  'User', 'Users', 'Settings', 'Search',
  'Menu', 'Home', 'Calendar', 'Clock',
  'ShoppingCart', 'CreditCard', 'DollarSign', 'TrendingUp',
  'MessageCircle', 'Send', 'Share2', 'Download',
  'Upload', 'Eye', 'EyeOff', 'Lock',
  'Unlock', 'Bell', 'Award', 'Gift',
  'Zap', 'Coffee', 'Book', 'Bookmark',
  'Camera', 'Image', 'Video', 'Music',
  'FileText', 'Folder', 'Database', 'Server'
]

export function IconBlockProperties({ block, sectionId }: IconBlockPropertiesProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock)

  const handleStyleChange = (field: keyof IconBlock['style'], value: any) => {
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

  const debouncedColorChange = useDebouncedCallback((value: string) => {
    handleStyleChange('color', value)
  }, 300)

  const debouncedHrefChange = useDebouncedCallback((value: string) => {
    updateBlock(sectionId, block.id, { href: value || undefined })
  }, 500)

  // Get the icon component for preview
  const IconComponent = (LucideIcons as any)[block.iconName] || LucideIcons.CircleHelp

  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="font-semibold mb-4">Icon Properties</h3>
      </div>

      {/* Icon Preview */}
      <div className="flex justify-center p-6 bg-gray-50 rounded">
        <IconComponent size={block.style.size} color={block.style.color} />
      </div>

      {/* Icon Selection */}
      <div>
        <Label>Icon</Label>
        <Select
          value={block.iconName}
          onValueChange={(value) => updateBlock(sectionId, block.id, { iconName: value })}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {popularIcons.map((iconName) => {
              const Icon = (LucideIcons as any)[iconName]
              return (
                <SelectItem key={iconName} value={iconName}>
                  <div className="flex items-center gap-2">
                    <Icon size={16} />
                    <span>{iconName}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Size */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Size</Label>
          <span className="text-sm text-gray-500">{block.style.size}px</span>
        </div>
        <Slider
          value={[block.style.size]}
          onValueChange={([value]) => handleStyleChange('size', value)}
          min={16}
          max={200}
          step={1}
          className="mt-2"
        />
      </div>

      {/* Color */}
      <div>
        <Label>Color</Label>
        <div className="flex gap-2 mt-2">
          <Input
            type="color"
            value={block.style.color}
            onChange={(e) => debouncedColorChange(e.target.value)}
            className="w-20 h-10"
          />
          <Input
            type="text"
            value={block.style.color}
            onChange={(e) => debouncedColorChange(e.target.value)}
            placeholder="#000000"
          />
        </div>
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

      {/* Link */}
      <div>
        <Label>Link (Optional)</Label>
        <Input
          type="url"
          defaultValue={block.href || ''}
          onChange={(e) => debouncedHrefChange(e.target.value)}
          placeholder="https://example.com"
          className="mt-2"
        />
        {block.href && (
          <div className="mt-2">
            <Label>Link Target</Label>
            <Select
              value={block.target || '_self'}
              onValueChange={(value: '_blank' | '_self') =>
                updateBlock(sectionId, block.id, { target: value })
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_self">Same Tab</SelectItem>
                <SelectItem value="_blank">New Tab</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

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
