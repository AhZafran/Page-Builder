'use client'

import type { NewsletterBlock } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useDebouncedCallback } from '@/hooks/useDebounce'

interface NewsletterBlockPropertiesProps {
  block: NewsletterBlock
  sectionId: string
}

export function NewsletterBlockProperties({ block, sectionId }: NewsletterBlockPropertiesProps) {
  const { updateBlock } = useEditorStore()

  const handleChange = (key: keyof NewsletterBlock, value: any) => {
    updateBlock(sectionId, block.id, { [key]: value })
  }

  const handleStyleChange = (key: string, value: any) => {
    updateBlock(sectionId, block.id, {
      style: { ...block.style, [key]: value },
    })
  }

  const debouncedHandleStyleChange = useDebouncedCallback(handleStyleChange, 150)

  return (
    <div className="space-y-6">
      {/* Content */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Content</Label>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Heading</Label>
            <Input
              type="text"
              placeholder="e.g., Subscribe to our newsletter"
              value={block.heading}
              onChange={(e) => handleChange('heading', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Description</Label>
            <Textarea
              placeholder="e.g., Get the latest updates and exclusive offers delivered to your inbox"
              value={block.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="mt-1 min-h-[60px]"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Email Input Placeholder</Label>
            <Input
              type="text"
              placeholder="e.g., Enter your email"
              value={block.inputPlaceholder}
              onChange={(e) => handleChange('inputPlaceholder', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Button Text</Label>
            <Input
              type="text"
              placeholder="e.g., Subscribe"
              value={block.buttonText}
              onChange={(e) => handleChange('buttonText', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Success Message</Label>
            <Input
              type="text"
              placeholder="e.g., Thanks for subscribing!"
              value={block.successMessage}
              onChange={(e) => handleChange('successMessage', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Privacy Checkbox */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Privacy Options</Label>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showPrivacyCheckbox"
              checked={block.showPrivacyCheckbox}
              onChange={(e) => handleChange('showPrivacyCheckbox', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="showPrivacyCheckbox" className="text-xs cursor-pointer">
              Show privacy agreement checkbox
            </Label>
          </div>

          {block.showPrivacyCheckbox && (
            <div>
              <Label className="text-xs text-gray-600">Privacy Text</Label>
              <Textarea
                placeholder="e.g., I agree to receive marketing emails and accept the privacy policy"
                value={block.privacyText}
                onChange={(e) => handleChange('privacyText', e.target.value)}
                className="mt-1 min-h-[60px]"
              />
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Layout */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Layout</Label>
        <Select
          value={block.style.layout}
          onValueChange={(value: any) => handleStyleChange('layout', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inline">Inline (Input and button side by side)</SelectItem>
            <SelectItem value="stacked">Stacked (Input and button on separate rows)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Heading Styles */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Heading Styles</Label>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Font Size (px)</Label>
            <Input
              type="number"
              min="12"
              max="72"
              value={block.style.headingSize}
              onChange={(e) => debouncedHandleStyleChange('headingSize', Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Font Weight</Label>
            <Select
              value={block.style.headingWeight.toString()}
              onValueChange={(value) => handleStyleChange('headingWeight', Number(value))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="400">Regular (400)</SelectItem>
                <SelectItem value="500">Medium (500)</SelectItem>
                <SelectItem value="600">Semi-bold (600)</SelectItem>
                <SelectItem value="700">Bold (700)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-gray-600">Text Align</Label>
            <Select
              value={block.style.headingAlign}
              onValueChange={(value: any) => handleStyleChange('headingAlign', value)}
            >
              <SelectTrigger className="mt-1">
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
            <Label className="text-xs text-gray-600">Color</Label>
            <Input
              type="color"
              value={block.style.headingColor}
              onChange={(e) => handleStyleChange('headingColor', e.target.value)}
              className="h-10 mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Description Styles */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Description Styles</Label>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Font Size (px)</Label>
            <Input
              type="number"
              min="10"
              max="32"
              value={block.style.descriptionSize}
              onChange={(e) => debouncedHandleStyleChange('descriptionSize', Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Text Align</Label>
            <Select
              value={block.style.descriptionAlign}
              onValueChange={(value: any) => handleStyleChange('descriptionAlign', value)}
            >
              <SelectTrigger className="mt-1">
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
            <Label className="text-xs text-gray-600">Color</Label>
            <Input
              type="color"
              value={block.style.descriptionColor}
              onChange={(e) => handleStyleChange('descriptionColor', e.target.value)}
              className="h-10 mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Input Styles */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Input Styles</Label>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Background Color</Label>
            <Input
              type="color"
              value={block.style.inputBackgroundColor}
              onChange={(e) => handleStyleChange('inputBackgroundColor', e.target.value)}
              className="h-10 mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Text Color</Label>
            <Input
              type="color"
              value={block.style.inputTextColor}
              onChange={(e) => handleStyleChange('inputTextColor', e.target.value)}
              className="h-10 mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Border Color</Label>
            <Input
              type="color"
              value={block.style.inputBorderColor}
              onChange={(e) => handleStyleChange('inputBorderColor', e.target.value)}
              className="h-10 mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Border Width (px)</Label>
            <Input
              type="number"
              min="0"
              max="10"
              value={block.style.inputBorderWidth}
              onChange={(e) => debouncedHandleStyleChange('inputBorderWidth', Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Border Radius (px)</Label>
            <Input
              type="number"
              min="0"
              value={block.style.inputBorderRadius}
              onChange={(e) => debouncedHandleStyleChange('inputBorderRadius', Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Padding (px)</Label>
            <Input
              type="number"
              min="0"
              value={block.style.inputPadding}
              onChange={(e) => debouncedHandleStyleChange('inputPadding', Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Button Styles */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Button Styles</Label>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Background Color</Label>
            <Input
              type="color"
              value={block.style.buttonBackgroundColor}
              onChange={(e) => handleStyleChange('buttonBackgroundColor', e.target.value)}
              className="h-10 mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Text Color</Label>
            <Input
              type="color"
              value={block.style.buttonTextColor}
              onChange={(e) => handleStyleChange('buttonTextColor', e.target.value)}
              className="h-10 mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Font Size (px)</Label>
            <Input
              type="number"
              min="10"
              max="32"
              value={block.style.buttonFontSize}
              onChange={(e) => debouncedHandleStyleChange('buttonFontSize', Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Font Weight</Label>
            <Select
              value={block.style.buttonFontWeight.toString()}
              onValueChange={(value) => handleStyleChange('buttonFontWeight', Number(value))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="400">Regular (400)</SelectItem>
                <SelectItem value="500">Medium (500)</SelectItem>
                <SelectItem value="600">Semi-bold (600)</SelectItem>
                <SelectItem value="700">Bold (700)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-gray-600">Border Radius (px)</Label>
            <Input
              type="number"
              min="0"
              value={block.style.buttonBorderRadius}
              onChange={(e) => debouncedHandleStyleChange('buttonBorderRadius', Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Padding (px)</Label>
            <Input
              type="number"
              min="0"
              value={block.style.buttonPadding}
              onChange={(e) => debouncedHandleStyleChange('buttonPadding', Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Container Styles */}
      <div>
        <Label className="text-xs font-semibold mb-3 block">Container</Label>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Background Color</Label>
            <Input
              type="color"
              value={block.style.backgroundColor}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="h-10 mt-1"
            />
          </div>

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

          <div>
            <Label className="text-xs text-gray-600">Gap Between Elements (px)</Label>
            <Input
              type="number"
              min="0"
              value={block.style.gap}
              onChange={(e) => debouncedHandleStyleChange('gap', Number(e.target.value))}
              className="mt-1"
            />
          </div>
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
