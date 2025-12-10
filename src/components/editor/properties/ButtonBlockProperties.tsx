'use client'

import type { ButtonBlock } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { ValidatedInput } from '@/components/ui/validated-input'
import { validateURL, validateTextLength } from '@/lib/input-validation'

interface ButtonBlockPropertiesProps {
  block: ButtonBlock
  sectionId: string
}

export function ButtonBlockProperties({ block, sectionId }: ButtonBlockPropertiesProps) {
  const { updateBlock } = useEditorStore()

  const handleChange = (field: string, value: any) => {
    updateBlock(sectionId, block.id, { [field]: value })
  }

  const handleStyleChange = (field: string, value: any) => {
    updateBlock(sectionId, block.id, {
      style: { ...block.style, [field]: value },
    })
  }

  return (
    <div className="space-y-6">
      <ValidatedInput
        label="Button Text"
        id="button-text"
        value={block.text}
        onChange={(e) => handleChange('text', e.target.value)}
        placeholder="Click me"
        onValidate={(value) => validateTextLength(value, { minLength: 1, maxLength: 50 })}
      />

      <ValidatedInput
        label="Link URL"
        id="button-href"
        value={block.href}
        onChange={(e) => handleChange('href', e.target.value)}
        placeholder="https://example.com"
        onValidate={(value) => validateURL(value, true)}
        type="url"
      />

      <Separator />

      <div>
        <Label className="text-xs font-semibold">Layout</Label>
        <Select
          value={block.style.layout}
          onValueChange={(value) => handleStyleChange('layout', value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inline">Inline</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="full-width">Full Width</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <Label className="text-xs font-semibold mb-3 block">Colors</Label>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Background</Label>
            <Input
              type="color"
              value={block.style.backgroundColor}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="h-10 mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Text Color</Label>
            <Input
              type="color"
              value={block.style.color}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="h-10 mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-xs font-semibold">Border Radius</Label>
        <div className="flex items-center gap-3 mt-2">
          <Slider
            value={[block.style.borderRadius]}
            onValueChange={(value) => handleStyleChange('borderRadius', value[0])}
            min={0}
            max={50}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-gray-600 w-10 text-right">
            {block.style.borderRadius}px
          </span>
        </div>
      </div>
    </div>
  )
}
