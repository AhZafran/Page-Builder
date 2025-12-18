'use client'

import type { QuoteBlock, Spacing } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

interface QuoteBlockPropertiesProps {
  block: QuoteBlock
  sectionId: string
}

export function QuoteBlockProperties({ block, sectionId }: QuoteBlockPropertiesProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock)

  const handleContentChange = (field: keyof QuoteBlock, value: any) => {
    updateBlock(sectionId, block.id, { [field]: value })
  }

  const handleStyleChange = (field: keyof QuoteBlock['style'], value: any) => {
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

  return (
    <div className="space-y-6 p-4">
      <h3 className="font-semibold">Quote Block Properties</h3>

      {/* Quote Content */}
      <div>
        <Label>Quote Text</Label>
        <Textarea
          value={block.quote}
          onChange={(e) => handleContentChange('quote', e.target.value)}
          placeholder="Enter your quote..."
          className="mt-2"
          rows={4}
        />
      </div>

      {/* Author Information */}
      <div>
        <Label>Author Name</Label>
        <Input
          value={block.author || ''}
          onChange={(e) => handleContentChange('author', e.target.value)}
          placeholder="e.g., John Doe"
          className="mt-2"
        />
      </div>

      <div>
        <Label>Author Title</Label>
        <Input
          value={block.authorTitle || ''}
          onChange={(e) => handleContentChange('authorTitle', e.target.value)}
          placeholder="e.g., CEO, Company Name"
          className="mt-2"
        />
      </div>

      <Separator />

      {/* Style Options */}
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

      <div>
        <Label>Font Style</Label>
        <Select value={block.style.fontStyle} onValueChange={(value) => handleStyleChange('fontStyle', value)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="italic">Italic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showQuoteMarks"
          checked={block.style.showQuoteMarks}
          onChange={(e) => handleStyleChange('showQuoteMarks', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="showQuoteMarks" className="cursor-pointer">Show Quote Marks</Label>
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
          <Label>Quote Color</Label>
          <Input
            type="color"
            value={block.style.quoteColor}
            onChange={(e) => handleStyleChange('quoteColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Author Color</Label>
          <Input
            type="color"
            value={block.style.authorColor}
            onChange={(e) => handleStyleChange('authorColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
        <div>
          <Label>Quote Mark Color</Label>
          <Input
            type="color"
            value={block.style.quoteMarkColor || block.style.quoteColor}
            onChange={(e) => handleStyleChange('quoteMarkColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
      </div>

      <Separator />

      {/* Font Sizes */}
      <div>
        <Label>Quote Size: {block.style.quoteSize}px</Label>
        <Input
          type="range"
          min="14"
          max="32"
          value={block.style.quoteSize}
          onChange={(e) => handleStyleChange('quoteSize', parseInt(e.target.value))}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Author Size: {block.style.authorSize}px</Label>
        <Input
          type="range"
          min="12"
          max="20"
          value={block.style.authorSize}
          onChange={(e) => handleStyleChange('authorSize', parseInt(e.target.value))}
          className="mt-2"
        />
      </div>

      <Separator />

      {/* Border Options */}
      <div>
        <Label>Border Left Width: {block.style.borderLeftWidth || 0}px</Label>
        <Input
          type="range"
          min="0"
          max="10"
          value={block.style.borderLeftWidth || 0}
          onChange={(e) => handleStyleChange('borderLeftWidth', parseInt(e.target.value))}
          className="mt-2"
        />
      </div>

      {block.style.borderLeftWidth && block.style.borderLeftWidth > 0 && (
        <div>
          <Label>Border Color</Label>
          <Input
            type="color"
            value={block.style.borderLeftColor || '#e5e7eb'}
            onChange={(e) => handleStyleChange('borderLeftColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
      )}

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
