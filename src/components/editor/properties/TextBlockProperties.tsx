'use client'

import type { TextBlock } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { useDebouncedCallback } from '@/hooks/useDebounce'

interface TextBlockPropertiesProps {
  block: TextBlock
  sectionId: string
}

export function TextBlockProperties({ block, sectionId }: TextBlockPropertiesProps) {
  const { updateBlock } = useEditorStore()

  const handleChange = (field: string, value: any) => {
    updateBlock(sectionId, block.id, { [field]: value })
  }

  const handleStyleChange = (path: string, value: any) => {
    const keys = path.split('.')
    const updates: any = { style: { ...block.style } }

    let current = updates.style
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] }
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value

    updateBlock(sectionId, block.id, updates)
  }

  // Debounced handlers for text input and number inputs
  const debouncedHandleChange = useDebouncedCallback(handleChange, 300)
  const debouncedHandleStyleChange = useDebouncedCallback(handleStyleChange, 150)

  return (
    <div className="space-y-6">
      {/* Content */}
      <div>
        <Label className="text-xs font-semibold">Content</Label>
        <Textarea
          value={block.content}
          onChange={(e) => debouncedHandleChange('content', e.target.value)}
          className="mt-2 min-h-[100px]"
          placeholder="Enter your text..."
        />
      </div>

      <Separator />

      {/* Typography */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Typography</Label>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Font Size</Label>
            <div className="flex items-center gap-3 mt-1">
              <Slider
                value={[block.style.fontSize]}
                onValueChange={(value) => debouncedHandleStyleChange('fontSize', value[0])}
                min={8}
                max={120}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-gray-600 w-10 text-right">
                {block.style.fontSize}px
              </span>
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-600">Font Weight</Label>
            <Select
              value={String(block.style.fontWeight)}
              onValueChange={(value) => handleStyleChange('fontWeight', Number(value))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="300">Light (300)</SelectItem>
                <SelectItem value="400">Normal (400)</SelectItem>
                <SelectItem value="500">Medium (500)</SelectItem>
                <SelectItem value="600">Semibold (600)</SelectItem>
                <SelectItem value="700">Bold (700)</SelectItem>
                <SelectItem value="800">Extra Bold (800)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-gray-600">Text Align</Label>
            <Select
              value={block.style.textAlign}
              onValueChange={(value) => handleStyleChange('textAlign', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="justify">Justify</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Colors */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Colors</Label>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Text Color</Label>
            <Input
              type="color"
              value={block.style.color}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="h-10 mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Background Color</Label>
            <Input
              type="color"
              value={block.style.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="h-10 mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Spacing */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Padding</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-600">Top</Label>
            <Input
              type="number"
              value={block.style.padding.top}
              onChange={(e) => debouncedHandleStyleChange('padding.top', Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Right</Label>
            <Input
              type="number"
              value={block.style.padding.right}
              onChange={(e) => debouncedHandleStyleChange('padding.right', Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Bottom</Label>
            <Input
              type="number"
              value={block.style.padding.bottom}
              onChange={(e) => debouncedHandleStyleChange('padding.bottom', Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Left</Label>
            <Input
              type="number"
              value={block.style.padding.left}
              onChange={(e) => debouncedHandleStyleChange('padding.left', Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
