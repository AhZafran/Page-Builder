'use client'

import type { PricingBlock, Spacing } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2 } from 'lucide-react'
import { useDebouncedCallback } from '@/hooks/useDebounce'

interface PricingBlockPropertiesProps {
  block: PricingBlock
  sectionId: string
}

export function PricingBlockProperties({ block, sectionId }: PricingBlockPropertiesProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock)

  const handleContentChange = (field: keyof PricingBlock, value: any) => {
    updateBlock(sectionId, block.id, { [field]: value })
  }

  const handleStyleChange = (field: keyof PricingBlock['style'], value: any) => {
    updateBlock(sectionId, block.id, {
      style: { ...block.style, [field]: value },
    })
  }

  const handlePaddingChange = (field: keyof Spacing, value: number) => {
    handleStyleChange('padding', { ...block.style.padding, [field]: value })
  }

  const handleMarginChange = (field: keyof Spacing, value: number) => {
    handleStyleChange('margin', { ...block.style.margin, [field]: value })
  }

  const handleAddFeature = () => {
    updateBlock(sectionId, block.id, {
      features: [...block.features, 'New feature'],
    })
  }

  const handleRemoveFeature = (index: number) => {
    updateBlock(sectionId, block.id, {
      features: block.features.filter((_, i) => i !== index),
    })
  }

  const handleUpdateFeature = (index: number, value: string) => {
    const newFeatures = [...block.features]
    newFeatures[index] = value
    updateBlock(sectionId, block.id, { features: newFeatures })
  }

  const debouncedPlanNameChange = useDebouncedCallback((value: string) => {
    handleContentChange('planName', value)
  }, 300)

  const debouncedPriceChange = useDebouncedCallback((value: string) => {
    handleContentChange('price', value)
  }, 300)

  return (
    <div className="space-y-6 p-4">
      <h3 className="font-semibold">Pricing Block Properties</h3>

      {/* Plan Details */}
      <div>
        <Label>Plan Name</Label>
        <Input
          defaultValue={block.planName}
          onChange={(e) => debouncedPlanNameChange(e.target.value)}
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Currency</Label>
          <Input
            value={block.currency}
            onChange={(e) => handleContentChange('currency', e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Price</Label>
          <Input
            defaultValue={block.price}
            onChange={(e) => debouncedPriceChange(e.target.value)}
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <Label>Period</Label>
        <Input
          value={block.period}
          onChange={(e) => handleContentChange('period', e.target.value)}
          placeholder="/ month"
          className="mt-2"
        />
      </div>

      <Separator />

      {/* Features List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Features</Label>
          <Button size="sm" variant="outline" onClick={handleAddFeature} className="h-7">
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2 mt-2">
          {block.features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={feature}
                onChange={(e) => handleUpdateFeature(index, e.target.value)}
                className="flex-1"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveFeature(index)}
                className="h-9 w-9 p-0 text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* CTA Button */}
      <div>
        <Label>Button Text</Label>
        <Input
          value={block.buttonText}
          onChange={(e) => handleContentChange('buttonText', e.target.value)}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Button Link</Label>
        <Input
          value={block.buttonLink}
          onChange={(e) => handleContentChange('buttonLink', e.target.value)}
          placeholder="#"
          className="mt-2"
        />
      </div>

      <Separator />

      {/* Highlight Settings */}
      <div>
        <Label>Highlighted</Label>
        <Select
          value={block.highlighted ? 'yes' : 'no'}
          onValueChange={(value) => handleContentChange('highlighted', value === 'yes')}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes - Feature this plan</SelectItem>
            <SelectItem value="no">No - Standard plan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {block.highlighted && (
        <div>
          <Label>Highlight Label</Label>
          <Input
            value={block.highlightLabel || ''}
            onChange={(e) => handleContentChange('highlightLabel', e.target.value)}
            placeholder="Popular"
            className="mt-2"
          />
        </div>
      )}

      <div>
        <Label>Highlight Color</Label>
        <Input
          type="color"
          value={block.style.highlightColor}
          onChange={(e) => handleStyleChange('highlightColor', e.target.value)}
          className="h-10 mt-2"
        />
      </div>

      <Separator />

      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Plan Name Color</Label>
          <Input
            type="color"
            value={block.style.planNameColor}
            onChange={(e) => handleStyleChange('planNameColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
        <div>
          <Label>Price Color</Label>
          <Input
            type="color"
            value={block.style.priceColor}
            onChange={(e) => handleStyleChange('priceColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
      </div>

      <Separator />

      {/* Font Sizes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Plan Name Size</Label>
          <span className="text-sm text-gray-500">{block.style.planNameSize}px</span>
        </div>
        <Slider
          value={[block.style.planNameSize]}
          onValueChange={([value]) => handleStyleChange('planNameSize', value)}
          min={16}
          max={32}
          step={1}
          className="mt-2"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Price Size</Label>
          <span className="text-sm text-gray-500">{block.style.priceSize}px</span>
        </div>
        <Slider
          value={[block.style.priceSize]}
          onValueChange={([value]) => handleStyleChange('priceSize', value)}
          min={24}
          max={72}
          step={2}
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

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Border Radius</Label>
          <span className="text-sm text-gray-500">{block.style.borderRadius}px</span>
        </div>
        <Slider
          value={[block.style.borderRadius]}
          onValueChange={([value]) => handleStyleChange('borderRadius', value)}
          min={0}
          max={24}
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
