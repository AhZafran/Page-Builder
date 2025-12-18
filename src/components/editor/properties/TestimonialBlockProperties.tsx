'use client'

import type { TestimonialBlock, Spacing } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useDebouncedCallback } from '@/hooks/useDebounce'

interface TestimonialBlockPropertiesProps {
  block: TestimonialBlock
  sectionId: string
}

export function TestimonialBlockProperties({ block, sectionId }: TestimonialBlockPropertiesProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock)

  const handleContentChange = (field: keyof TestimonialBlock, value: any) => {
    updateBlock(sectionId, block.id, {
      [field]: value,
    })
  }

  const handleStyleChange = (field: keyof TestimonialBlock['style'], value: any) => {
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

  const debouncedQuoteChange = useDebouncedCallback((value: string) => {
    handleContentChange('quote', value)
  }, 300)

  const debouncedAuthorNameChange = useDebouncedCallback((value: string) => {
    handleContentChange('authorName', value)
  }, 300)

  const debouncedAuthorRoleChange = useDebouncedCallback((value: string) => {
    handleContentChange('authorRole', value)
  }, 300)

  const debouncedAuthorImageChange = useDebouncedCallback((value: string) => {
    handleContentChange('authorImage', value)
  }, 300)

  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="font-semibold mb-4">Testimonial Properties</h3>
      </div>

      {/* Quote */}
      <div>
        <Label>Quote</Label>
        <Textarea
          defaultValue={block.quote}
          onChange={(e) => debouncedQuoteChange(e.target.value)}
          placeholder="Enter testimonial quote..."
          className="mt-2"
          rows={4}
        />
      </div>

      <Separator />

      {/* Author Info */}
      <div>
        <Label>Author Name</Label>
        <Input
          defaultValue={block.authorName}
          onChange={(e) => debouncedAuthorNameChange(e.target.value)}
          placeholder="John Doe"
          className="mt-2"
        />
      </div>

      <div>
        <Label>Author Role/Title</Label>
        <Input
          defaultValue={block.authorRole || ''}
          onChange={(e) => debouncedAuthorRoleChange(e.target.value)}
          placeholder="CEO, Company Inc."
          className="mt-2"
        />
      </div>

      <div>
        <Label>Author Image URL</Label>
        <Input
          defaultValue={block.authorImage || ''}
          onChange={(e) => debouncedAuthorImageChange(e.target.value)}
          placeholder="https://example.com/avatar.jpg"
          className="mt-2"
        />
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <Label>Show Rating</Label>
        <Select
          value={block.style.showRating ? 'yes' : 'no'}
          onValueChange={(value) => handleStyleChange('showRating', value === 'yes')}
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

      {block.style.showRating && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Rating (1-5 stars)</Label>
            <span className="text-sm text-gray-500">{block.rating || 5}</span>
          </div>
          <Slider
            value={[block.rating || 5]}
            onValueChange={([value]) => handleContentChange('rating', value)}
            min={1}
            max={5}
            step={1}
            className="mt-2"
          />
        </div>
      )}

      {block.style.showRating && (
        <div>
          <Label>Rating Color</Label>
          <Input
            type="color"
            value={block.style.ratingColor}
            onChange={(e) => handleStyleChange('ratingColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
      )}

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
        <Label>Text Color</Label>
        <Input
          type="color"
          value={block.style.textColor}
          onChange={(e) => handleStyleChange('textColor', e.target.value)}
          className="h-10 mt-2"
        />
      </div>

      <div>
        <Label>Author Name Color</Label>
        <Input
          type="color"
          value={block.style.authorColor}
          onChange={(e) => handleStyleChange('authorColor', e.target.value)}
          className="h-10 mt-2"
        />
      </div>

      <div>
        <Label>Author Role Color</Label>
        <Input
          type="color"
          value={block.style.roleColor}
          onChange={(e) => handleStyleChange('roleColor', e.target.value)}
          className="h-10 mt-2"
        />
      </div>

      <Separator />

      {/* Font Settings */}
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
        <div className="flex items-center justify-between mb-2">
          <Label>Font Size</Label>
          <span className="text-sm text-gray-500">{block.style.fontSize}px</span>
        </div>
        <Slider
          value={[block.style.fontSize]}
          onValueChange={([value]) => handleStyleChange('fontSize', value)}
          min={12}
          max={24}
          step={1}
          className="mt-2"
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
