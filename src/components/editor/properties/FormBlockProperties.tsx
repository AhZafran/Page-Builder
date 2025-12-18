'use client'

import type { FormBlock, FormField, FormFieldType, Spacing } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { nanoid } from 'nanoid'

interface FormBlockPropertiesProps {
  block: FormBlock
  sectionId: string
}

export function FormBlockProperties({ block, sectionId }: FormBlockPropertiesProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock)

  const handleContentChange = (field: keyof FormBlock, value: any) => {
    updateBlock(sectionId, block.id, { [field]: value })
  }

  const handleStyleChange = (field: keyof FormBlock['style'], value: any) => {
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

  // Field management
  const handleAddField = () => {
    const newField: FormField = {
      id: `field-${nanoid()}`,
      type: 'text',
      label: 'New Field',
      placeholder: '',
      required: false,
    }
    updateBlock(sectionId, block.id, {
      fields: [...block.fields, newField],
    })
  }

  const handleRemoveField = (fieldId: string) => {
    updateBlock(sectionId, block.id, {
      fields: block.fields.filter((f) => f.id !== fieldId),
    })
  }

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    updateBlock(sectionId, block.id, {
      fields: block.fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)),
    })
  }

  const handleAddOption = (fieldId: string) => {
    const field = block.fields.find((f) => f.id === fieldId)
    if (!field) return

    const newOptions = [...(field.options || []), 'New Option']
    handleUpdateField(fieldId, { options: newOptions })
  }

  const handleRemoveOption = (fieldId: string, optionIndex: number) => {
    const field = block.fields.find((f) => f.id === fieldId)
    if (!field || !field.options) return

    const newOptions = field.options.filter((_, i) => i !== optionIndex)
    handleUpdateField(fieldId, { options: newOptions })
  }

  const handleUpdateOption = (fieldId: string, optionIndex: number, value: string) => {
    const field = block.fields.find((f) => f.id === fieldId)
    if (!field || !field.options) return

    const newOptions = [...field.options]
    newOptions[optionIndex] = value
    handleUpdateField(fieldId, { options: newOptions })
  }

  return (
    <div className="space-y-6 p-4">
      <h3 className="font-semibold">Form Block Properties</h3>

      {/* Form Title & Description */}
      <div>
        <Label>Form Title</Label>
        <Input
          value={block.title || ''}
          onChange={(e) => handleContentChange('title', e.target.value)}
          placeholder="Contact Us"
          className="mt-2"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={block.description || ''}
          onChange={(e) => handleContentChange('description', e.target.value)}
          placeholder="Optional description"
          className="mt-2"
          rows={2}
        />
      </div>

      <Separator />

      {/* Form Fields */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Form Fields</Label>
          <Button size="sm" variant="outline" onClick={handleAddField} className="h-7">
            <Plus className="h-3 w-3 mr-1" />
            Add Field
          </Button>
        </div>

        <div className="space-y-4 mt-2">
          {block.fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-3 space-y-3 bg-gray-50">
              {/* Field Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">Field {index + 1}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveField(field.id)}
                  className="h-7 w-7 p-0 text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              {/* Field Type */}
              <div>
                <Label className="text-xs">Type</Label>
                <Select
                  value={field.type}
                  onValueChange={(value: FormFieldType) => handleUpdateField(field.id, { type: value })}
                >
                  <SelectTrigger className="mt-1 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="tel">Phone</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="textarea">Textarea</SelectItem>
                    <SelectItem value="select">Select Dropdown</SelectItem>
                    <SelectItem value="checkbox">Checkbox Group</SelectItem>
                    <SelectItem value="radio">Radio Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Field Label */}
              <div>
                <Label className="text-xs">Label</Label>
                <Input
                  value={field.label}
                  onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                  className="mt-1 h-8"
                />
              </div>

              {/* Field Placeholder */}
              <div>
                <Label className="text-xs">Placeholder</Label>
                <Input
                  value={field.placeholder || ''}
                  onChange={(e) => handleUpdateField(field.id, { placeholder: e.target.value })}
                  className="mt-1 h-8"
                />
              </div>

              {/* Required Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                  className="rounded"
                />
                <Label className="text-xs">Required field</Label>
              </div>

              {/* Options for select/checkbox/radio */}
              {(field.type === 'select' || field.type === 'checkbox' || field.type === 'radio') && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs">Options</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddOption(field.id)}
                      className="h-6 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {field.options?.map((option, optIdx) => (
                      <div key={optIdx} className="flex gap-1">
                        <Input
                          value={option}
                          onChange={(e) => handleUpdateOption(field.id, optIdx, e.target.value)}
                          className="h-7 text-xs flex-1"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveOption(field.id, optIdx)}
                          className="h-7 w-7 p-0 text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Submit Button */}
      <div>
        <Label>Submit Button Text</Label>
        <Input
          value={block.submitButtonText}
          onChange={(e) => handleContentChange('submitButtonText', e.target.value)}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Success Message</Label>
        <Input
          value={block.successMessage}
          onChange={(e) => handleContentChange('successMessage', e.target.value)}
          className="mt-2"
        />
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
          <Label>Input Background</Label>
          <Input
            type="color"
            value={block.style.inputBackgroundColor}
            onChange={(e) => handleStyleChange('inputBackgroundColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
        <div>
          <Label>Input Border</Label>
          <Input
            type="color"
            value={block.style.inputBorderColor}
            onChange={(e) => handleStyleChange('inputBorderColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Button Background</Label>
          <Input
            type="color"
            value={block.style.buttonBackgroundColor}
            onChange={(e) => handleStyleChange('buttonBackgroundColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
        <div>
          <Label>Button Text</Label>
          <Input
            type="color"
            value={block.style.buttonTextColor}
            onChange={(e) => handleStyleChange('buttonTextColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
      </div>

      <Separator />

      {/* Border Radius */}
      <div>
        <Label>Container Border Radius: {block.style.borderRadius}px</Label>
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
        <Label>Input Border Radius: {block.style.inputBorderRadius}px</Label>
        <Input
          type="range"
          min="0"
          max="16"
          value={block.style.inputBorderRadius}
          onChange={(e) => handleStyleChange('inputBorderRadius', parseInt(e.target.value))}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Field Spacing: {block.style.spacing}px</Label>
        <Input
          type="range"
          min="8"
          max="40"
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
