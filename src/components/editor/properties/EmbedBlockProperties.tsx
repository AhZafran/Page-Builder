'use client'

import type { EmbedBlock } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useDebouncedCallback } from '@/hooks/useDebounce'
import { Info, Map, Calendar, FileText, Globe } from 'lucide-react'

interface EmbedBlockPropertiesProps {
  block: EmbedBlock
  sectionId: string
}

export function EmbedBlockProperties({ block, sectionId }: EmbedBlockPropertiesProps) {
  const { updateBlock } = useEditorStore()

  const handleChange = (key: keyof EmbedBlock, value: any) => {
    updateBlock(sectionId, block.id, { [key]: value })
  }

  const handleStyleChange = (key: string, value: any) => {
    updateBlock(sectionId, block.id, {
      style: { ...block.style, [key]: value },
    })
  }

  const handleBorderChange = (key: string, value: any) => {
    updateBlock(sectionId, block.id, {
      style: {
        ...block.style,
        border: { ...block.style.border, [key]: value },
      },
    })
  }

  const debouncedHandleStyleChange = useDebouncedCallback(handleStyleChange, 150)

  // Get icon for embed type
  const getEmbedIcon = () => {
    switch (block.embedType) {
      case 'map':
        return <Map className="h-4 w-4 text-gray-500" />
      case 'form':
        return <FileText className="h-4 w-4 text-gray-500" />
      case 'calendar':
        return <Calendar className="h-4 w-4 text-gray-500" />
      default:
        return <Globe className="h-4 w-4 text-gray-500" />
    }
  }

  // Quick embed guides
  const getEmbedGuide = () => {
    switch (block.embedType) {
      case 'map':
        return (
          <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
            <div className="flex gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="font-medium text-blue-900">How to embed Google Maps:</div>
            </div>
            <ol className="list-decimal list-inside space-y-1 ml-6">
              <li>Go to Google Maps</li>
              <li>Search for a location</li>
              <li>Click Share → Embed a map</li>
              <li>Copy the URL from the iframe src</li>
              <li>Paste it below</li>
            </ol>
          </div>
        )
      case 'form':
        return (
          <div className="text-xs text-gray-600 bg-green-50 p-3 rounded border border-green-200">
            <div className="flex gap-2 mb-2">
              <Info className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="font-medium text-green-900">Embed forms from:</div>
            </div>
            <ul className="list-disc list-inside space-y-1 ml-6">
              <li>Google Forms</li>
              <li>Typeform</li>
              <li>JotForm</li>
              <li>Microsoft Forms</li>
            </ul>
          </div>
        )
      case 'calendar':
        return (
          <div className="text-xs text-gray-600 bg-purple-50 p-3 rounded border border-purple-200">
            <div className="flex gap-2 mb-2">
              <Info className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="font-medium text-purple-900">Embed calendars from:</div>
            </div>
            <ul className="list-disc list-inside space-y-1 ml-6">
              <li>Google Calendar</li>
              <li>Calendly</li>
              <li>Outlook Calendar</li>
            </ul>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Embed Type */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Embed Type</Label>
        <div className="flex items-center gap-2 mb-3">
          {getEmbedIcon()}
          <Select value={block.embedType} onValueChange={(value: any) => handleChange('embedType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="map">Map (Google Maps, etc.)</SelectItem>
              <SelectItem value="form">Form</SelectItem>
              <SelectItem value="calendar">Calendar</SelectItem>
              <SelectItem value="custom">Custom Embed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {getEmbedGuide()}
      </div>

      <Separator />

      {/* Embed URL */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Embed URL</Label>
        <Textarea
          placeholder={
            block.embedType === 'map'
              ? 'https://www.google.com/maps/embed?pb=...'
              : block.embedType === 'form'
              ? 'https://docs.google.com/forms/d/e/.../viewform?embedded=true'
              : 'Paste embed iframe src URL here'
          }
          value={block.embedUrl}
          onChange={(e) => handleChange('embedUrl', e.target.value)}
          className="font-mono text-xs min-h-[100px]"
        />
        <p className="text-xs text-gray-500 mt-2">
          Paste the iframe src URL from your embed code
        </p>
      </div>

      <Separator />

      {/* Optional Title */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Title (optional)</Label>
        <Input
          type="text"
          placeholder="e.g., Find Us Here"
          value={block.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>

      <Separator />

      {/* Dimensions */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Dimensions</Label>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Aspect Ratio</Label>
            <Select
              value={block.style.aspectRatio}
              onValueChange={(value: any) => handleStyleChange('aspectRatio', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                <SelectItem value="1:1">1:1 (Square)</SelectItem>
                <SelectItem value="21:9">21:9 (Ultra-wide)</SelectItem>
                <SelectItem value="custom">Custom (specify height)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-gray-600">Width</Label>
            <Input
              type="text"
              placeholder="e.g., 100%, 800px"
              value={block.style.width}
              onChange={(e) => handleStyleChange('width', e.target.value)}
              className="mt-1"
            />
          </div>

          {block.style.aspectRatio === 'custom' && (
            <div>
              <Label className="text-xs text-gray-600">Height</Label>
              <Input
                type="text"
                placeholder="e.g., 450px, 600px"
                value={block.style.height}
                onChange={(e) => handleStyleChange('height', e.target.value)}
                className="mt-1"
              />
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Embed Settings */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Settings</Label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="allowFullScreen"
            checked={block.allowFullScreen}
            onChange={(e) => handleChange('allowFullScreen', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="allowFullScreen" className="text-xs cursor-pointer">
            Allow fullscreen
          </Label>
        </div>
      </div>

      <Separator />

      {/* Border */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Border</Label>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Border Style</Label>
            <Select
              value={block.style.border.style}
              onValueChange={(value: any) => handleBorderChange('style', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {block.style.border.style !== 'none' && (
            <>
              <div>
                <Label className="text-xs text-gray-600">Border Width (px)</Label>
                <Input
                  type="number"
                  min="0"
                  value={block.style.border.width}
                  onChange={(e) => handleBorderChange('width', Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-600">Border Color</Label>
                <Input
                  type="color"
                  value={block.style.border.color}
                  onChange={(e) => handleBorderChange('color', e.target.value)}
                  className="h-10 mt-1"
                />
              </div>
            </>
          )}

          <div>
            <Label className="text-xs text-gray-600">Border Radius (px)</Label>
            <Input
              type="number"
              min="0"
              value={block.style.borderRadius}
              onChange={(e) => debouncedHandleStyleChange('borderRadius', Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Colors */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Colors</Label>
        <div>
          <Label className="text-xs text-gray-600">Background Color</Label>
          <Input
            type="color"
            value={block.style.backgroundColor}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            className="h-10 mt-1"
          />
        </div>
      </div>

      <Separator />

      {/* Spacing */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Spacing</Label>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600 mb-2 block">Padding</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Top"
                value={block.style.padding.top}
                onChange={(e) =>
                  handleStyleChange('padding', { ...block.style.padding, top: Number(e.target.value) })
                }
              />
              <Input
                type="number"
                placeholder="Right"
                value={block.style.padding.right}
                onChange={(e) =>
                  handleStyleChange('padding', { ...block.style.padding, right: Number(e.target.value) })
                }
              />
              <Input
                type="number"
                placeholder="Bottom"
                value={block.style.padding.bottom}
                onChange={(e) =>
                  handleStyleChange('padding', { ...block.style.padding, bottom: Number(e.target.value) })
                }
              />
              <Input
                type="number"
                placeholder="Left"
                value={block.style.padding.left}
                onChange={(e) =>
                  handleStyleChange('padding', { ...block.style.padding, left: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-600 mb-2 block">Margin</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Top"
                value={block.style.margin.top}
                onChange={(e) =>
                  handleStyleChange('margin', { ...block.style.margin, top: Number(e.target.value) })
                }
              />
              <Input
                type="number"
                placeholder="Right"
                value={block.style.margin.right}
                onChange={(e) =>
                  handleStyleChange('margin', { ...block.style.margin, right: Number(e.target.value) })
                }
              />
              <Input
                type="number"
                placeholder="Bottom"
                value={block.style.margin.bottom}
                onChange={(e) =>
                  handleStyleChange('margin', { ...block.style.margin, bottom: Number(e.target.value) })
                }
              />
              <Input
                type="number"
                placeholder="Left"
                value={block.style.margin.left}
                onChange={(e) =>
                  handleStyleChange('margin', { ...block.style.margin, left: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
