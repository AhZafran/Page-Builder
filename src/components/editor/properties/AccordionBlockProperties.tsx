'use client'

import type { AccordionBlock, AccordionItem, Spacing } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { nanoid } from 'nanoid'

interface AccordionBlockPropertiesProps {
  block: AccordionBlock
  sectionId: string
}

export function AccordionBlockProperties({ block, sectionId }: AccordionBlockPropertiesProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock)

  const handleContentChange = (field: keyof AccordionBlock, value: any) => {
    updateBlock(sectionId, block.id, { [field]: value })
  }

  const handleStyleChange = (field: keyof AccordionBlock['style'], value: any) => {
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
    const newItem: AccordionItem = {
      id: `item-${nanoid()}`,
      title: 'New Question',
      content: 'Add your answer here...',
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

  const handleUpdateItem = (itemId: string, updates: Partial<AccordionItem>) => {
    updateBlock(sectionId, block.id, {
      items: block.items.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
    })
  }

  return (
    <div className="space-y-6 p-4">
      <h3 className="font-semibold">Accordion Properties</h3>

      {/* Behavior Settings */}
      <div>
        <Label>Expand Mode</Label>
        <Select
          value={block.allowMultipleExpanded ? 'multiple' : 'single'}
          onValueChange={(value) => handleContentChange('allowMultipleExpanded', value === 'multiple')}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single - Only one open at a time</SelectItem>
            <SelectItem value="multiple">Multiple - Allow multiple open</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Default Expanded Item</Label>
        <Select
          value={block.defaultExpandedIndex?.toString() || '-1'}
          onValueChange={(value) => handleContentChange('defaultExpandedIndex', parseInt(value))}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-1">None</SelectItem>
            {block.items.map((item, index) => (
              <SelectItem key={item.id} value={index.toString()}>
                Item {index + 1}: {item.title.substring(0, 30)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Accordion Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Accordion Items</Label>
          <Button size="sm" variant="outline" onClick={handleAddItem} className="h-7">
            <Plus className="h-3 w-3 mr-1" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4 mt-2">
          {block.items.map((item, index) => (
            <div key={item.id} className="border rounded-lg p-3 space-y-3 bg-gray-50">
              {/* Item Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">Item {index + 1}</span>
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

              {/* Item Title */}
              <div>
                <Label className="text-xs">Title</Label>
                <Input
                  value={item.title}
                  onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Item Content */}
              <div>
                <Label className="text-xs">Content</Label>
                <Textarea
                  value={item.content}
                  onChange={(e) => handleUpdateItem(item.id, { content: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
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
          <Label>Item Background</Label>
          <Input
            type="color"
            value={block.style.itemBackgroundColor}
            onChange={(e) => handleStyleChange('itemBackgroundColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Expanded Background</Label>
          <Input
            type="color"
            value={block.style.expandedItemBackgroundColor}
            onChange={(e) => handleStyleChange('expandedItemBackgroundColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
        <div>
          <Label>Item Border</Label>
          <Input
            type="color"
            value={block.style.itemBorderColor}
            onChange={(e) => handleStyleChange('itemBorderColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
          <Label>Content Color</Label>
          <Input
            type="color"
            value={block.style.contentColor}
            onChange={(e) => handleStyleChange('contentColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
      </div>

      <Separator />

      {/* Font Sizes */}
      <div>
        <Label>Title Size: {block.style.titleSize}px</Label>
        <Input
          type="range"
          min="12"
          max="24"
          value={block.style.titleSize}
          onChange={(e) => handleStyleChange('titleSize', parseInt(e.target.value))}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Content Size: {block.style.contentSize}px</Label>
        <Input
          type="range"
          min="12"
          max="20"
          value={block.style.contentSize}
          onChange={(e) => handleStyleChange('contentSize', parseInt(e.target.value))}
          className="mt-2"
        />
      </div>

      <Separator />

      {/* Spacing */}
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

      <div>
        <Label>Item Spacing: {block.style.spacing}px</Label>
        <Input
          type="range"
          min="4"
          max="32"
          value={block.style.spacing}
          onChange={(e) => handleStyleChange('spacing', parseInt(e.target.value))}
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
