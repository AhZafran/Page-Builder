'use client'

import type { TeamMemberBlock as TeamMemberBlockType } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Twitter, Linkedin, Github, Mail, Globe } from 'lucide-react'

interface TeamMemberBlockProps {
  block: TeamMemberBlockType
  sectionId: string
}

export function TeamMemberBlock({ block, sectionId }: TeamMemberBlockProps) {
  const { selectedElement, selectElement } = useEditorStore()

  const isSelected =
    selectedElement.type === 'block' &&
    selectedElement.sectionId === sectionId &&
    selectedElement.blockId === block.id

  const containerStyle: React.CSSProperties = {
    backgroundColor: block.style.backgroundColor,
    borderRadius: `${block.style.borderRadius}px`,
    padding: `${block.style.padding.top}px ${block.style.padding.right}px ${block.style.padding.bottom}px ${block.style.padding.left}px`,
    margin: `${block.style.margin.top}px ${block.style.margin.right}px ${block.style.margin.bottom}px ${block.style.margin.left}px`,
    fontFamily: block.style.fontFamily,
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: block.style.cardBackgroundColor,
    border: block.style.cardBorderWidth
      ? `${block.style.cardBorderWidth}px solid ${block.style.cardBorderColor}`
      : 'none',
    borderRadius: `${block.style.borderRadius}px`,
    padding: '24px',
    textAlign: block.style.alignment,
    display: 'flex',
    flexDirection: 'column',
    alignItems: block.style.alignment === 'center' ? 'center' : block.style.alignment === 'right' ? 'flex-end' : 'flex-start',
  }

  const imageStyle: React.CSSProperties = {
    width: `${block.style.imageSize}px`,
    height: `${block.style.imageSize}px`,
    borderRadius: `${block.style.imageBorderRadius}px`,
    objectFit: 'cover',
    marginBottom: '16px',
  }

  const nameStyle: React.CSSProperties = {
    color: block.style.nameColor,
    fontSize: `${block.style.nameSize}px`,
    fontWeight: 700,
    marginBottom: '8px',
  }

  const roleStyle: React.CSSProperties = {
    color: block.style.roleColor,
    fontSize: `${block.style.roleSize}px`,
    fontWeight: 500,
    marginBottom: block.bio ? '12px' : '16px',
  }

  const bioStyle: React.CSSProperties = {
    color: block.style.bioColor,
    fontSize: `${block.style.bioSize}px`,
    lineHeight: '1.6',
    marginBottom: '16px',
  }

  const getSocialIcon = (platform: string) => {
    const iconProps = { size: 20, strokeWidth: 2 }
    switch (platform) {
      case 'twitter':
        return <Twitter {...iconProps} />
      case 'linkedin':
        return <Linkedin {...iconProps} />
      case 'github':
        return <Github {...iconProps} />
      case 'email':
        return <Mail {...iconProps} />
      case 'website':
        return <Globe {...iconProps} />
      default:
        return <Globe {...iconProps} />
    }
  }

  return (
    <div
      style={containerStyle}
      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        selectElement({ type: 'block', sectionId, blockId: block.id })
      }}
    >
      <div style={cardStyle}>
        {/* Profile Image */}
        {block.imageUrl ? (
          <img
            src={block.imageUrl}
            alt={block.name}
            style={imageStyle}
          />
        ) : (
          <div
            style={{
              ...imageStyle,
              backgroundColor: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${block.style.imageSize / 3}px`,
              color: '#9ca3af',
              fontWeight: 700,
            }}
          >
            {block.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Name */}
        <div style={nameStyle}>{block.name}</div>

        {/* Role */}
        <div style={roleStyle}>{block.role}</div>

        {/* Bio */}
        {block.bio && <div style={bioStyle}>{block.bio}</div>}

        {/* Social Links */}
        {block.socialLinks.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '8px',
            }}
          >
            {block.socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: block.style.roleColor,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.6')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                onClick={(e) => e.stopPropagation()}
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
