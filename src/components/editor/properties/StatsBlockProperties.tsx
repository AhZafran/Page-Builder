'use client'

import type { StatsBlock, StatItem, Spacing } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { nanoid } from 'nanoid'

interface StatsBlockPropertiesProps {
  block: StatsBlock
  sectionId: string
}

export function StatsBlockProperties({ block, sectionId }: StatsBlockPropertiesProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock)

  const handleStyleChange = (field: keyof StatsBlock['style'], value: any) => {
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

  // Item management
  const handleAddItem = () => {
    const newItem: StatItem = {
      id: `item-${nanoid()}`,
      label: 'New Stat',
      value: 100,
      maxValue: 100,
      suffix: '%',
      prefix: '',
      showProgressBar: true,
    }
    updateBlock(sectionId, block.id, {
      items: [...block.items, newItem],
    })
  }

  const handleRemoveItem = (itemId: string) => {
    updateBlock(sectionId, block.id, {
      items: block.items.filter((item) => item.id !== itemId),
    })
  }

  const handleUpdateItem = (itemId: string, updates: Partial<StatItem>) => {
    updateBlock(sectionId, block.id, {
      items: block.items.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
    })
  }

  return (
    <div className="space-y-6 p-4">
      <h3 className="font-semibold">Stats Block Properties</h3>

      {/* Layout Options */}
      <div>
        <Label>Layout</Label>
        <Select value={block.style.layout} onValueChange={(value) => handleStyleChange('layout', value)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="horizontal">Horizontal - Side by side</SelectItem>
            <SelectItem value="vertical">Vertical - Stacked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Alignment</Label>
        <Select value={block.style.alignment} onValueChange={(value) => handleStyleChange('alignment', value)}>
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

      {/* Stat Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Stat Items</Label>
          <Button size="sm" variant="outline" onClick={handleAddItem} className="h-7">
            <Plus className="h-3 w-3 mr-1" />
            Add Stat
          </Button>
        </div>

        <div className="space-y-4 mt-2">
          {block.items.map((item, index) => (
            <div key={item.id} className="border rounded-lg p-3 space-y-3 bg-gray-50">
              {/* Item Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">Stat {index + 1}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveItem(item.id)}
                  className="h-7 w-7 p-0 text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              {/* Label */}
              <div>
                <Label className="text-xs">Label</Label>
                <Input
                  value={item.label}
                  onChange={(e) => handleUpdateItem(item.id, { label: e.target.value })}
                  className="mt-1"
                  placeholder="e.g., Projects Completed"
                />
              </div>

              {/* Value */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Value</Label>
                  <Input
                    type="number"
                    value={item.value}
                    onChange={(e) => handleUpdateItem(item.id, { value: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Max Value</Label>
                  <Input
                    type="number"
                    value={item.maxValue || 100}
                    onChange={(e) => handleUpdateItem(item.id, { maxValue: parseInt(e.target.value) || 100 })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Prefix & Suffix */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Prefix</Label>
                  <Input
                    value={item.prefix || ''}
                    onChange={(e) => handleUpdateItem(item.id, { prefix: e.target.value })}
                    className="mt-1"
                    placeholder="e.g., $"
                  />
                </div>
                <div>
                  <Label className="text-xs">Suffix</Label>
                  <Input
                    value={item.suffix || ''}
                    onChange={(e) => handleUpdateItem(item.id, { suffix: e.target.value })}
                    className="mt-1"
                    placeholder="e.g., %"
                  />
                </div>
              </div>

              {/* Show Progress Bar */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`showProgressBar-${item.id}`}
                  checked={item.showProgressBar}
                  onChange={(e) => handleUpdateItem(item.id, { showProgressBar: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor={`showProgressBar-${item.id}`} className="text-xs cursor-pointer">
                  Show Progress Bar
                </Label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Background</Label>
          <Input
            type="color"
            value={block.style.backgroundColor}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
        <div>
          <Label>Label Color</Label>
          <Input
            type="color"
            value={block.style.labelColor}
            onChange={(e) => handleStyleChange('labelColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Value Color</Label>
          <Input
            type="color"
            value={block.style.valueColor}
            onChange={(e) => handleStyleChange('valueColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
        <div>
          <Label>Progress Bar</Label>
          <Input
            type="color"
            value={block.style.progressBarColor}
            onChange={(e) => handleStyleChange('progressBarColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
      </div>

      <div>
        <Label>Progress Bar Background</Label>
        <Input
          type="color"
          value={block.style.progressBarBackgroundColor}
          onChange={(e) => handleStyleChange('progressBarBackgroundColor', e.target.value)}
          className="h-10 mt-2"
        />
      </div>

      <Separator />

      {/* Font Sizes */}
      <div>
        <Label>Label Size: {block.style.labelSize}px</Label>
        <Input
          type="range"
          min="12"
          max="20"
          value={block.style.labelSize}
          onChange={(e) => handleStyleChange('labelSize', parseInt(e.target.value))}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Value Size: {block.style.valueSize}px</Label>
        <Input
          type="range"
          min="20"
          max="48"
          value={block.style.valueSize}
          onChange={(e) => handleStyleChange('valueSize', parseInt(e.target.value))}
          className="mt-2"
        />
      </div>

      <Separator />

      {/* Progress Bar Settings */}
      <div>
        <Label>Progress Bar Height: {block.style.progressBarHeight}px</Label>
        <Input
          type="range"
          min="4"
          max="20"
          value={block.style.progressBarHeight}
          onChange={(e) => handleStyleChange('progressBarHeight', parseInt(e.target.value))}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Item Spacing: {block.style.itemSpacing}px</Label>
        <Input
          type="range"
          min="8"
          max="48"
          value={block.style.itemSpacing}
          onChange={(e) => handleStyleChange('itemSpacing', parseInt(e.target.value))}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Border Radius: {block.style.borderRadius}px</Label>
        <Input
          type="range"
          min="0"
          max="24"
          value={block.style.borderRadius}
          onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value))}
          className="mt-2"
        />
      </div>

      <Separator />

      {/* Padding & Margin */}
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
