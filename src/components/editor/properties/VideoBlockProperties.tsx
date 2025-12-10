'use client'

import type { VideoBlock, VideoSource, AspectRatio } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { extractURLFromEmbed } from '@/lib/security'

interface VideoBlockPropertiesProps {
  block: VideoBlock
  sectionId: string
}

export function VideoBlockProperties({ block, sectionId }: VideoBlockPropertiesProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock)

  const handleChange = (field: string, value: any) => {
    updateBlock(sectionId, block.id, { [field]: value })
  }

  const handleURLChange = (value: string) => {
    // Extract URL from embed code if user pastes iframe HTML
    const extractedURL = extractURLFromEmbed(value)
    handleChange('url', extractedURL)
  }

  const handleStyleChange = (field: string, value: any) => {
    updateBlock(sectionId, block.id, {
      style: { ...block.style, [field]: value },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-xs font-semibold">Source</Label>
        <Select
          value={block.source}
          onValueChange={(value: VideoSource) => handleChange('source', value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="vimeo">Vimeo</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="direct">Direct Video File (MP4/WebM)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs font-semibold">Video URL or Embed Code</Label>
        <Input
          value={block.url}
          onChange={(e) => handleURLChange(e.target.value)}
          className="mt-2"
          placeholder={
            block.source === 'youtube' ? 'https://youtube.com/watch?v=... or paste embed code' :
            block.source === 'vimeo' ? 'https://vimeo.com/... or paste embed code' :
            block.source === 'instagram' ? 'https://instagram.com/p/...' :
            block.source === 'tiktok' ? 'https://tiktok.com/@user/video/...' :
            'https://example.com/video.mp4'
          }
        />
        {block.source === 'youtube' && (
          <p className="text-xs text-gray-500 mt-1">
            Paste the YouTube URL or the entire embed code - both work!
          </p>
        )}
        {block.source === 'vimeo' && (
          <p className="text-xs text-gray-500 mt-1">
            Paste the Vimeo URL or the entire embed code - both work!
          </p>
        )}
        {block.source === 'direct' && (
          <p className="text-xs text-gray-500 mt-1">
            Enter a direct link to a video file (.mp4, .webm, .ogg)
          </p>
        )}
        {block.source === 'instagram' && (
          <p className="text-xs text-amber-600 mt-1 bg-amber-50 p-2 rounded border border-amber-200">
            Note: Instagram embeds show a placeholder in the editor. Full embed will appear when published.
          </p>
        )}
      </div>

      <Separator />

      <div>
        <Label className="text-xs font-semibold">Aspect Ratio</Label>
        <Select
          value={block.style.aspectRatio}
          onValueChange={(value: AspectRatio) => handleStyleChange('aspectRatio', value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
            <SelectItem value="1:1">1:1 (Square)</SelectItem>
            <SelectItem value="4:3">4:3 (Standard)</SelectItem>
            <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
            <SelectItem value="auto">Auto</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
