'use client'

import type { FeatureBlock, Spacing } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useDebouncedCallback } from '@/hooks/useDebounce'

interface FeatureBlockPropertiesProps {
  block: FeatureBlock
  sectionId: string
}

const iconOptions = [
  'Zap', 'Heart', 'Star', 'Shield', 'Award', 'Target', 'TrendingUp', 'CheckCircle',
  'Sparkles', 'Crown', 'Rocket', 'Gift', 'Lock', 'Unlock', 'Bell', 'Globe',
  'ThumbsUp', 'Users', 'Clock', 'Calendar', 'Mail', 'Phone', 'MessageCircle',
  'Settings', 'Sliders', 'Package', 'ShoppingCart', 'CreditCard', 'DollarSign',
  'Briefcase', 'Database', 'Server', 'Cloud', 'Wifi', 'Download', 'Upload',
  'Search', 'Filter', 'Layout', 'Grid', 'List', 'Eye', 'EyeOff', 'Edit',
  'Trash2', 'Plus', 'Minus', 'X', 'Check', 'ChevronRight', 'ChevronLeft'
]

export function FeatureBlockProperties({ block, sectionId }: FeatureBlockPropertiesProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock)

  const handleContentChange = (field: keyof FeatureBlock, value: any) => {
    updateBlock(sectionId, block.id, {
      [field]: value,
    })
  }

  const handleStyleChange = (field: keyof FeatureBlock['style'], value: any) => {
    updateBlock(sectionId, block.id, {
      style: {
        ...block.style,
        [field]: value,
      },
    })
  }

  const handlePaddingChange = (field: keyof Spacing, value: number) => {
    handleStyleChange('padding', {
      ...block.style.padding,
      [field]: value,
    })
  }

  const handleMarginChange = (field: keyof Spacing, value: number) => {
    handleStyleChange('margin', {
      ...block.style.margin,
      [field]: value,
    })
  }

  const debouncedTitleChange = useDebouncedCallback((value: string) => {
    handleContentChange('title', value)
  }, 300)

  const debouncedDescriptionChange = useDebouncedCallback((value: string) => {
    handleContentChange('description', value)
  }, 300)

  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="font-semibold mb-4">Feature Properties</h3>
      </div>

      {/* Icon */}
      <div>
        <Label>Show Icon</Label>
        <Select
          value={block.style.showIcon ? 'yes' : 'no'}
          onValueChange={(value) => handleStyleChange('showIcon', value === 'yes')}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {block.style.showIcon && (
        <>
          <div>
            <Label>Icon</Label>
            <Select
              value={block.iconName}
              onValueChange={(value) => handleContentChange('iconName', value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {iconOptions.map((icon) => (
                  <SelectItem key={icon} value={icon}>
                    {icon}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Icon Size</Label>
              <span className="text-sm text-gray-500">{block.style.iconSize}px</span>
            </div>
            <Slider
              value={[block.style.iconSize]}
              onValueChange={([value]) => handleStyleChange('iconSize', value)}
              min={24}
              max={96}
              step={4}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Icon Color</Label>
            <Input
              type="color"
              value={block.style.iconColor}
              onChange={(e) => handleStyleChange('iconColor', e.target.value)}
              className="h-10 mt-2"
            />
          </div>
        </>
      )}

      <Separator />

      {/* Title */}
      <div>
        <Label>Title</Label>
        <Input
          defaultValue={block.title}
          onChange={(e) => debouncedTitleChange(e.target.value)}
          placeholder="Feature title..."
          className="mt-2"
        />
      </div>

      <div>
        <Label>Title Color</Label>
        <Input
          type="color"
          value={block.style.titleColor}
          onChange={(e) => handleStyleChange('titleColor', e.target.value)}
          className="h-10 mt-2"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Title Size</Label>
          <span className="text-sm text-gray-500">{block.style.titleSize}px</span>
        </div>
        <Slider
          value={[block.style.titleSize]}
          onValueChange={([value]) => handleStyleChange('titleSize', value)}
          min={14}
          max={32}
          step={1}
          className="mt-2"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Title Weight</Label>
          <span className="text-sm text-gray-500">{block.style.titleWeight}</span>
        </div>
        <Slider
          value={[block.style.titleWeight]}
          onValueChange={([value]) => handleStyleChange('titleWeight', value)}
          min={400}
          max={700}
          step={100}
          className="mt-2"
        />
      </div>

      <Separator />

      {/* Description */}
      <div>
        <Label>Description</Label>
        <Textarea
          defaultValue={block.description}
          onChange={(e) => debouncedDescriptionChange(e.target.value)}
          placeholder="Feature description..."
          className="mt-2"
          rows={4}
        />
      </div>

      <div>
        <Label>Description Color</Label>
        <Input
          type="color"
          value={block.style.descriptionColor}
          onChange={(e) => handleStyleChange('descriptionColor', e.target.value)}
          className="h-10 mt-2"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Description Size</Label>
          <span className="text-sm text-gray-500">{block.style.descriptionSize}px</span>
        </div>
        <Slider
          value={[block.style.descriptionSize]}
          onValueChange={([value]) => handleStyleChange('descriptionSize', value)}
          min={12}
          max={20}
          step={1}
          className="mt-2"
        />
      </div>

      <Separator />

      {/* Styling */}
      <div>
        <Label>Background Color</Label>
        <Input
          type="color"
          value={block.style.backgroundColor}
          onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          className="h-10 mt-2"
        />
      </div>

      <div>
        <Label>Font Family</Label>
        <Select
          value={block.style.fontFamily}
          onValueChange={(value) => handleStyleChange('fontFamily', value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial, sans-serif">Arial</SelectItem>
            <SelectItem value="Georgia, serif">Georgia</SelectItem>
            <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
            <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
            <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
          </SelectContent>
        </Select>
      </div>

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

      <Separator />

      {/* Border */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Border Width</Label>
          <span className="text-sm text-gray-500">{block.style.borderWidth || 0}px</span>
        </div>
        <Slider
          value={[block.style.borderWidth || 0]}
          onValueChange={([value]) => handleStyleChange('borderWidth', value)}
          min={0}
          max={8}
          step={1}
          className="mt-2"
        />
      </div>

      {(block.style.borderWidth || 0) > 0 && (
        <div>
          <Label>Border Color</Label>
          <Input
            type="color"
            value={block.style.borderColor || '#e5e7eb'}
            onChange={(e) => handleStyleChange('borderColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Border Radius</Label>
          <span className="text-sm text-gray-500">{block.style.borderRadius}px</span>
        </div>
        <Slider
          value={[block.style.borderRadius]}
          onValueChange={([value]) => handleStyleChange('borderRadius', value)}
          min={0}
          max={32}
          step={1}
          className="mt-2"
        />
      </div>

      <Separator />

      {/* Padding */}
      <div>
        <Label className="mb-3 block">Padding</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-500">Top</Label>
            <Input
              type="number"
              value={block.style.padding.top}
              onChange={(e) => handlePaddingChange('top', parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Bottom</Label>
            <Input
              type="number"
              value={block.style.padding.bottom}
              onChange={(e) => handlePaddingChange('bottom', parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Left</Label>
            <Input
              type="number"
              value={block.style.padding.left}
              onChange={(e) => handlePaddingChange('left', parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Right</Label>
            <Input
              type="number"
              value={block.style.padding.right}
              onChange={(e) => handlePaddingChange('right', parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Margin */}
      <div>
        <Label className="mb-3 block">Margin</Label>
        <div className="grid grid-cols-2 gap-2">
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
