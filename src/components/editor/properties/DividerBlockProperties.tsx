'use client'

import type { DividerBlock, Spacing } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDebouncedCallback } from '@/hooks/useDebounce'

interface DividerBlockPropertiesProps {
  block: DividerBlock
  sectionId: string
}

export function DividerBlockProperties({ block, sectionId }: DividerBlockPropertiesProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock)

  const handleStyleChange = (field: keyof DividerBlock['style'], value: any) => {
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

  const debouncedHandleHeightChange = useDebouncedCallback(
    (value: number) => handleStyleChange('height', value),
    150
  )

  return (
    <div className="space-y-6">
      {/* Width */}
      <div>
        <Label className="text-xs font-semibold">Width</Label>
        <Input
          type="text"
          value={block.style.width}
          onChange={(e) => handleStyleChange('width', e.target.value)}
          placeholder="e.g., 100%, 50%, 200px"
          className="mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          Use %, px, or other CSS units
        </p>
      </div>

      {/* Height (Thickness) */}
      <div>
        <Label className="text-xs font-semibold">Thickness</Label>
        <div className="flex items-center gap-3 mt-2">
          <Slider
            value={[block.style.height]}
            onValueChange={(value) => debouncedHandleHeightChange(value[0])}
            min={1}
            max={20}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-gray-600 w-12 text-right">
            {block.style.height}px
          </span>
        </div>
      </div>

      {/* Color */}
      <div>
        <Label className="text-xs font-semibold">Color</Label>
        <div className="flex gap-2 mt-2">
          <Input
            type="color"
            value={block.style.color}
            onChange={(e) => handleStyleChange('color', e.target.value)}
            className="w-20 h-10"
          />
          <Input
            type="text"
            value={block.style.color}
            onChange={(e) => handleStyleChange('color', e.target.value)}
            className="flex-1"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Style */}
      <div>
        <Label className="text-xs font-semibold">Line Style</Label>
        <Select
          value={block.style.style}
          onValueChange={(value: 'solid' | 'dashed' | 'dotted') =>
            handleStyleChange('style', value)
          }
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="dashed">Dashed</SelectItem>
            <SelectItem value="dotted">Dotted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Margin */}
      <div>
        <Label className="text-xs font-semibold">Margin (Spacing)</Label>
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
