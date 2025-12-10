'use client'

import type { CountdownBlock } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ValidatedInput } from '@/components/ui/validated-input'
import { validateFutureDate } from '@/lib/input-validation'

interface CountdownBlockPropertiesProps {
  block: CountdownBlock
  sectionId: string
}

export function CountdownBlockProperties({ block, sectionId }: CountdownBlockPropertiesProps) {
  const { updateBlock } = useEditorStore()

  const handleChange = (field: string, value: any) => {
    updateBlock(sectionId, block.id, { [field]: value })
  }

  const handleStyleChange = (field: string, value: any) => {
    updateBlock(sectionId, block.id, {
      style: { ...block.style, [field]: value },
    })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      handleChange('targetDate', new Date(e.target.value).toISOString())
    }
  }

  return (
    <div className="space-y-6">
      <ValidatedInput
        label="Target Date"
        id="countdown-date"
        type="datetime-local"
        value={block.targetDate.slice(0, 16)}
        onChange={handleDateChange}
        onValidate={(value) => {
          if (!value) return { isValid: false, error: 'Date is required' }
          const isoDate = new Date(value).toISOString()
          return validateFutureDate(isoDate)
        }}
      />

      <div>
        <Label className="text-xs font-semibold">Label</Label>
        <Input
          value={block.label || ''}
          onChange={(e) => handleChange('label', e.target.value)}
          className="mt-2"
          placeholder="Time remaining"
        />
      </div>

      <div>
        <Label className="text-xs font-semibold">Display Format</Label>
        <Select
          value={block.displayFormat}
          onValueChange={(value) => handleChange('displayFormat', value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dhms">Days, Hours, Minutes, Seconds</SelectItem>
            <SelectItem value="hms">Hours, Minutes, Seconds</SelectItem>
            <SelectItem value="ms">Minutes, Seconds</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs font-semibold">Text Color</Label>
        <Input
          type="color"
          value={block.style.color}
          onChange={(e) => handleStyleChange('color', e.target.value)}
          className="h-10 mt-2"
        />
      </div>
    </div>
  )
}
