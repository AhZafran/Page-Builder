'use client'

import { useEditorStore } from '@/store/editorStore'
import type { SocialMediaBlock as SocialMediaBlockType, SocialPlatform } from '@/types'
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle, Github } from 'lucide-react'

interface SocialMediaBlockProps {
  block: SocialMediaBlockType
  sectionId: string
}

// Map of platform names to their Lucide icons and brand colors
const platformConfig: Record<SocialPlatform, { Icon: any; brandColor: string }> = {
  facebook: { Icon: Facebook, brandColor: '#1877F2' },
  twitter: { Icon: Twitter, brandColor: '#1DA1F2' },
  instagram: { Icon: Instagram, brandColor: '#E4405F' },
  linkedin: { Icon: Linkedin, brandColor: '#0A66C2' },
  youtube: { Icon: Youtube, brandColor: '#FF0000' },
  tiktok: { Icon: MessageCircle, brandColor: '#000000' }, // Using MessageCircle as placeholder
  github: { Icon: Github, brandColor: '#181717' },
  discord: { Icon: MessageCircle, brandColor: '#5865F2' },
}

export function SocialMediaBlock({ block, sectionId }: SocialMediaBlockProps) {
  const { selectedElement, selectElement } = useEditorStore()
  const isSelected =
    selectedElement.type === 'block' &&
    selectedElement.sectionId === sectionId &&
    selectedElement.blockId === block.id

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: block.style.layout === 'vertical' ? 'column' : 'row',
    justifyContent: block.style.alignment === 'left' ? 'flex-start' : block.style.alignment === 'right' ? 'flex-end' : 'center',
    alignItems: 'center',
    gap: `${block.style.spacing}px`,
    marginTop: `${block.style.margin.top}px`,
    marginRight: `${block.style.margin.right}px`,
    marginBottom: `${block.style.margin.bottom}px`,
    marginLeft: `${block.style.margin.left}px`,
  }

  return (
    <div
      className={`cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      style={containerStyle}
      onClick={(e) => {
        e.stopPropagation()
        selectElement({ type: 'block', sectionId, blockId: block.id })
      }}
    >
      {block.links.map((link, index) => {
        const config = platformConfig[link.platform]
        if (!config) return null

        const { Icon, brandColor } = config
        const iconColor = block.style.useBrandColors ? brandColor : (block.style.customColor || '#000000')

        return (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.preventDefault()} // Prevent navigation in editor
            className="transition-opacity hover:opacity-80"
          >
            <Icon
              size={block.style.size}
              color={iconColor}
            />
          </a>
        )
      })}
    </div>
  )
}
