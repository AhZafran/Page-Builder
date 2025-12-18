'use client'

import type { TeamMemberBlock, TeamMemberSocialLink, Spacing } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2 } from 'lucide-react'

interface TeamMemberBlockPropertiesProps {
  block: TeamMemberBlock
  sectionId: string
}

export function TeamMemberBlockProperties({ block, sectionId }: TeamMemberBlockPropertiesProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock)

  const handleContentChange = (field: keyof TeamMemberBlock, value: any) => {
    updateBlock(sectionId, block.id, { [field]: value })
  }

  const handleStyleChange = (field: keyof TeamMemberBlock['style'], value: any) => {
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

  // Social links management
  const handleAddSocialLink = () => {
    const newLink: TeamMemberSocialLink = {
      platform: 'twitter',
      url: '',
    }
    updateBlock(sectionId, block.id, {
      socialLinks: [...block.socialLinks, newLink],
    })
  }

  const handleRemoveSocialLink = (index: number) => {
    updateBlock(sectionId, block.id, {
      socialLinks: block.socialLinks.filter((_, i) => i !== index),
    })
  }

  const handleUpdateSocialLink = (index: number, updates: Partial<TeamMemberSocialLink>) => {
    updateBlock(sectionId, block.id, {
      socialLinks: block.socialLinks.map((link, i) => (i === index ? { ...link, ...updates } : link)),
    })
  }

  return (
    <div className="space-y-6 p-4">
      <h3 className="font-semibold">Team Member Properties</h3>

      {/* Basic Info */}
      <div>
        <Label>Name</Label>
        <Input
          value={block.name}
          onChange={(e) => handleContentChange('name', e.target.value)}
          placeholder="e.g., John Doe"
          className="mt-2"
        />
      </div>

      <div>
        <Label>Role/Title</Label>
        <Input
          value={block.role}
          onChange={(e) => handleContentChange('role', e.target.value)}
          placeholder="e.g., CEO & Founder"
          className="mt-2"
        />
      </div>

      <div>
        <Label>Bio (Optional)</Label>
        <Textarea
          value={block.bio || ''}
          onChange={(e) => handleContentChange('bio', e.target.value)}
          placeholder="A short bio about this team member..."
          className="mt-2"
          rows={3}
        />
      </div>

      <div>
        <Label>Profile Image URL</Label>
        <Input
          value={block.imageUrl || ''}
          onChange={(e) => handleContentChange('imageUrl', e.target.value)}
          placeholder="https://example.com/photo.jpg"
          className="mt-2"
        />
      </div>

      <Separator />

      {/* Social Links */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Social Links</Label>
          <Button size="sm" variant="outline" onClick={handleAddSocialLink} className="h-7">
            <Plus className="h-3 w-3 mr-1" />
            Add Link
          </Button>
        </div>

        <div className="space-y-3 mt-2">
          {block.socialLinks.map((link, index) => (
            <div key={index} className="border rounded-lg p-3 space-y-2 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs">Link {index + 1}</Label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveSocialLink(index)}
                  className="h-7 w-7 p-0 text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              <div>
                <Label className="text-xs">Platform</Label>
                <Select
                  value={link.platform}
                  onValueChange={(value) =>
                    handleUpdateSocialLink(index, { platform: value as TeamMemberSocialLink['platform'] })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">URL</Label>
                <Input
                  value={link.url}
                  onChange={(e) => handleUpdateSocialLink(index, { url: e.target.value })}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            </div>
          ))}
        </div>
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
          <Label>Card Background</Label>
          <Input
            type="color"
            value={block.style.cardBackgroundColor}
            onChange={(e) => handleStyleChange('cardBackgroundColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Name Color</Label>
          <Input
            type="color"
            value={block.style.nameColor}
            onChange={(e) => handleStyleChange('nameColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
        <div>
          <Label>Role Color</Label>
          <Input
            type="color"
            value={block.style.roleColor}
            onChange={(e) => handleStyleChange('roleColor', e.target.value)}
            className="h-10 mt-2"
          />
        </div>
      </div>

      <div>
        <Label>Bio Color</Label>
        <Input
          type="color"
          value={block.style.bioColor}
          onChange={(e) => handleStyleChange('bioColor', e.target.value)}
          className="h-10 mt-2"
        />
      </div>

      <Separator />

      {/* Font Sizes */}
      <div>
        <Label>Name Size: {block.style.nameSize}px</Label>
        <Input
          type="range"
          min="16"
          max="32"
          value={block.style.nameSize}
          onChange={(e) => handleStyleChange('nameSize', parseInt(e.target.value))}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Role Size: {block.style.roleSize}px</Label>
        <Input
          type="range"
          min="12"
          max="20"
          value={block.style.roleSize}
          onChange={(e) => handleStyleChange('roleSize', parseInt(e.target.value))}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Bio Size: {block.style.bioSize}px</Label>
        <Input
          type="range"
          min="12"
          max="18"
          value={block.style.bioSize}
          onChange={(e) => handleStyleChange('bioSize', parseInt(e.target.value))}
          className="mt-2"
        />
      </div>

      <Separator />

      {/* Image Settings */}
      <div>
        <Label>Image Size: {block.style.imageSize}px</Label>
        <Input
          type="range"
          min="80"
          max="200"
          value={block.style.imageSize}
          onChange={(e) => handleStyleChange('imageSize', parseInt(e.target.value))}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Image Border Radius: {block.style.imageBorderRadius}px</Label>
        <Input
          type="range"
          min="0"
          max="100"
          value={block.style.imageBorderRadius}
          onChange={(e) => handleStyleChange('imageBorderRadius', parseInt(e.target.value))}
          className="mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">Use 50% of image size for circular</p>
      </div>

      <Separator />

      {/* Border Settings */}
      <div>
        <Label>Card Border Width: {block.style.cardBorderWidth || 0}px</Label>
        <Input
          type="range"
          min="0"
          max="4"
          value={block.style.cardBorderWidth || 0}
          onChange={(e) => handleStyleChange('cardBorderWidth', parseInt(e.target.value))}
          className="mt-2"
        />
      </div>

      {block.style.cardBorderWidth && block.style.cardBorderWidth > 0 && (
        <div>
          <Label>Border Color</Label>
          <Input
            type="color"
            value={block.style.cardBorderColor || '#e5e7eb'}
            onChange={(e) => handleStyleChange('cardBorderColor', e.target.value)}
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
