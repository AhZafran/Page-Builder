'use client'

import { useRef, useState } from 'react'
import type { Section } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useDebouncedCallback } from '@/hooks/useDebounce'
import { validateImageFile } from '@/lib/security'
import { Upload, X } from 'lucide-react'

interface SectionPropertiesProps {
  section: Section
}

export function SectionProperties({ section }: SectionPropertiesProps) {
  const { updateSection } = useEditorStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleStyleChange = (path: string, value: any) => {
    const keys = path.split('.')
    const updates: any = { style: { ...section.style } }

    let current = updates.style
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] }
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value

    updateSection(section.id, updates)
  }

  const handleLayoutChange = (key: string, value: any) => {
    updateSection(section.id, { [key]: value })
  }

  // Debounced handler for number inputs
  const debouncedHandleStyleChange = useDebouncedCallback(handleStyleChange, 150)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setUploading(true)

    try {
      // Validate actual file type using magic numbers
      const isValidImage = await validateImageFile(file)
      if (!isValidImage) {
        alert('Invalid image file. Please select a valid JPEG, PNG, GIF, or WebP image.')
        setUploading(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }

      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        handleStyleChange('backgroundImage', base64String)
        setUploading(false)
      }
      reader.onerror = () => {
        alert('Failed to read file')
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      alert('Failed to upload image')
      setUploading(false)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveBackgroundImage = () => {
    handleStyleChange('backgroundImage', '')
  }

  // Quick layout presets
  const applyLayoutPreset = (preset: 'vertical' | 'horizontal-2' | 'horizontal-3' | 'grid-2' | 'grid-3') => {
    switch (preset) {
      case 'vertical':
        updateSection(section.id, {
          layout: 'flex',
          columns: undefined,
          style: {
            ...section.style,
            flex: {
              ...section.style.flex,
              direction: 'column',
              alignItems: 'stretch',
              justifyContent: 'flex-start',
              wrap: 'nowrap',
            },
            columnGap: 0,
            rowGap: 16,
          },
        })
        break
      case 'horizontal-2':
        updateSection(section.id, {
          layout: 'flex',
          columns: undefined,
          style: {
            ...section.style,
            flex: {
              ...section.style.flex,
              direction: 'row',
              alignItems: 'stretch',
              justifyContent: 'space-between',
              wrap: 'wrap',
            },
            columnGap: 24,
            rowGap: 16,
          },
        })
        break
      case 'horizontal-3':
        updateSection(section.id, {
          layout: 'flex',
          columns: undefined,
          style: {
            ...section.style,
            flex: {
              ...section.style.flex,
              direction: 'row',
              alignItems: 'stretch',
              justifyContent: 'space-between',
              wrap: 'wrap',
            },
            columnGap: 24,
            rowGap: 16,
          },
        })
        break
      case 'grid-2':
        updateSection(section.id, {
          layout: 'grid',
          columns: 2,
          style: {
            ...section.style,
            columnGap: 24,
            rowGap: 24,
          },
        })
        break
      case 'grid-3':
        updateSection(section.id, {
          layout: 'grid',
          columns: 3,
          style: {
            ...section.style,
            columnGap: 24,
            rowGap: 24,
          },
        })
        break
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Layout Presets */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Quick Layout</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={section.layout === 'flex' && section.style.flex.direction === 'column' ? 'default' : 'outline'}
            size="sm"
            onClick={() => applyLayoutPreset('vertical')}
            className="flex flex-col items-center justify-center h-16"
          >
            <div className="flex flex-col gap-1 mb-1">
              <div className="w-8 h-1 bg-current opacity-60 rounded"></div>
              <div className="w-8 h-1 bg-current opacity-60 rounded"></div>
              <div className="w-8 h-1 bg-current opacity-60 rounded"></div>
            </div>
            <span className="text-xs">Vertical</span>
          </Button>
          <Button
            variant={section.layout === 'flex' && section.style.flex.direction === 'row' ? 'default' : 'outline'}
            size="sm"
            onClick={() => applyLayoutPreset('horizontal-2')}
            className="flex flex-col items-center justify-center h-16"
          >
            <div className="flex gap-1 mb-1">
              <div className="w-3 h-8 bg-current opacity-60 rounded"></div>
              <div className="w-3 h-8 bg-current opacity-60 rounded"></div>
            </div>
            <span className="text-xs">Flex 2-Col</span>
          </Button>
          <Button
            variant={section.layout === 'grid' && section.columns === 2 ? 'default' : 'outline'}
            size="sm"
            onClick={() => applyLayoutPreset('grid-2')}
            className="flex flex-col items-center justify-center h-16"
          >
            <div className="grid grid-cols-2 gap-1 mb-1">
              <div className="w-3 h-6 bg-current opacity-60 rounded"></div>
              <div className="w-3 h-6 bg-current opacity-60 rounded"></div>
            </div>
            <span className="text-xs">Grid 2-Col</span>
          </Button>
          <Button
            variant={section.layout === 'grid' && section.columns === 3 ? 'default' : 'outline'}
            size="sm"
            onClick={() => applyLayoutPreset('grid-3')}
            className="flex flex-col items-center justify-center h-16"
          >
            <div className="grid grid-cols-3 gap-1 mb-1">
              <div className="w-2 h-6 bg-current opacity-60 rounded"></div>
              <div className="w-2 h-6 bg-current opacity-60 rounded"></div>
              <div className="w-2 h-6 bg-current opacity-60 rounded"></div>
            </div>
            <span className="text-xs">Grid 3-Col</span>
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {section.layout === 'grid'
            ? `✓ Grid layout with ${section.columns || 2} columns`
            : section.style.flex.direction === 'row'
              ? '✓ Flex layout - horizontal'
              : '✓ Flex layout - vertical'}
        </p>
      </div>

      <Separator />

      {/* Layout Type and Grid Controls */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Layout Settings</Label>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Layout Type</Label>
            <Select
              value={section.layout || 'flex'}
              onValueChange={(value) => handleLayoutChange('layout', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flex">Flexbox</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {section.layout === 'grid' && (
            <div>
              <Label className="text-xs text-gray-600">Grid Columns</Label>
              <Input
                type="number"
                min="1"
                max="6"
                value={section.columns || 2}
                onChange={(e) => handleLayoutChange('columns', Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Number of columns (1-6)</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-600">Column Gap</Label>
              <Input
                type="number"
                min="0"
                value={section.style.columnGap || 0}
                onChange={(e) => debouncedHandleStyleChange('columnGap', Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Row Gap</Label>
              <Input
                type="number"
                min="0"
                value={section.style.rowGap || 0}
                onChange={(e) => debouncedHandleStyleChange('rowGap', Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Background */}
      <div>
        <Label className="text-xs font-semibold">Background Color</Label>
        <Input
          type="color"
          value={section.style.backgroundColor}
          onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          className="h-10 mt-2"
        />
      </div>

      {/* Background Image Upload */}
      <div>
        <Label className="text-xs font-semibold mb-2 block">Upload Background Image</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
          {section.style.backgroundImage && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRemoveBackgroundImage}
              size="icon"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or</span>
        </div>
      </div>

      <div>
        <Label className="text-xs font-semibold">Background Image URL</Label>
        <Input
          type="text"
          value={section.style.backgroundImage || ''}
          onChange={(e) => handleStyleChange('backgroundImage', e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="mt-2"
        />
      </div>

      {section.style.backgroundImage && (
        <>
          <div>
            <Label className="text-xs text-gray-600">Background Size</Label>
            <Select
              value={section.style.backgroundSize || 'cover'}
              onValueChange={(value) => handleStyleChange('backgroundSize', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cover">Cover</SelectItem>
                <SelectItem value="contain">Contain</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-gray-600">Background Position</Label>
            <Input
              type="text"
              value={section.style.backgroundPosition || 'center'}
              onChange={(e) => handleStyleChange('backgroundPosition', e.target.value)}
              placeholder="center"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Background Repeat</Label>
            <Select
              value={section.style.backgroundRepeat || 'no-repeat'}
              onValueChange={(value) => handleStyleChange('backgroundRepeat', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-repeat">No Repeat</SelectItem>
                <SelectItem value="repeat">Repeat</SelectItem>
                <SelectItem value="repeat-x">Repeat X</SelectItem>
                <SelectItem value="repeat-y">Repeat Y</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <Separator />

      {/* Padding */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Padding</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-600">Top</Label>
            <Input
              type="number"
              value={section.style.padding.top}
              onChange={(e) => debouncedHandleStyleChange('padding.top', Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Right</Label>
            <Input
              type="number"
              value={section.style.padding.right}
              onChange={(e) => debouncedHandleStyleChange('padding.right', Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Bottom</Label>
            <Input
              type="number"
              value={section.style.padding.bottom}
              onChange={(e) => debouncedHandleStyleChange('padding.bottom', Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Left</Label>
            <Input
              type="number"
              value={section.style.padding.left}
              onChange={(e) => debouncedHandleStyleChange('padding.left', Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Margin */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Margin</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-600">Top</Label>
            <Input
              type="number"
              value={section.style.margin.top}
              onChange={(e) => debouncedHandleStyleChange('margin.top', Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Right</Label>
            <Input
              type="number"
              value={section.style.margin.right}
              onChange={(e) => debouncedHandleStyleChange('margin.right', Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Bottom</Label>
            <Input
              type="number"
              value={section.style.margin.bottom}
              onChange={(e) => debouncedHandleStyleChange('margin.bottom', Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Left</Label>
            <Input
              type="number"
              value={section.style.margin.left}
              onChange={(e) => debouncedHandleStyleChange('margin.left', Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Flexbox */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Layout (Flexbox)</Label>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Direction</Label>
            <Select
              value={section.style.flex.direction}
              onValueChange={(value) => handleStyleChange('flex.direction', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="row">Row</SelectItem>
                <SelectItem value="column">Column</SelectItem>
                <SelectItem value="row-reverse">Row Reverse</SelectItem>
                <SelectItem value="column-reverse">Column Reverse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-gray-600">Align Items</Label>
            <Select
              value={section.style.flex.alignItems}
              onValueChange={(value) => handleStyleChange('flex.alignItems', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flex-start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="flex-end">End</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
                <SelectItem value="baseline">Baseline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-gray-600">Justify Content</Label>
            <Select
              value={section.style.flex.justifyContent}
              onValueChange={(value) => handleStyleChange('flex.justifyContent', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flex-start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="flex-end">End</SelectItem>
                <SelectItem value="space-between">Space Between</SelectItem>
                <SelectItem value="space-around">Space Around</SelectItem>
                <SelectItem value="space-evenly">Space Evenly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-gray-600">Wrap</Label>
            <Select
              value={section.style.flex.wrap || 'nowrap'}
              onValueChange={(value) => handleStyleChange('flex.wrap', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nowrap">No Wrap</SelectItem>
                <SelectItem value="wrap">Wrap</SelectItem>
                <SelectItem value="wrap-reverse">Wrap Reverse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
