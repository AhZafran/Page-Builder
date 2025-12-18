'use client'

import type { FeatureBlock } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import * as LucideIcons from 'lucide-react'

interface FeatureBlockProps {
  block: FeatureBlock
  sectionId: string
}

export function FeatureBlock({ block, sectionId }: FeatureBlockProps) {
  const { selectedElement, selectElement } = useEditorStore()
  const isSelected =
    selectedElement.type === 'block' &&
    selectedElement.sectionId === sectionId &&
    selectedElement.blockId === block.id

  const IconComponent = (LucideIcons as any)[block.iconName] || LucideIcons.Star

  const containerStyle: React.CSSProperties = {
    backgroundColor: block.style.backgroundColor,
    borderRadius: `${block.style.borderRadius}px`,
    padding: `${block.style.padding.top}px ${block.style.padding.right}px ${block.style.padding.bottom}px ${block.style.padding.left}px`,
    marginTop: `${block.style.margin.top}px`,
    marginRight: `${block.style.margin.right}px`,
    marginBottom: `${block.style.margin.bottom}px`,
    marginLeft: `${block.style.margin.left}px`,
    textAlign: block.style.alignment,
    fontFamily: block.style.fontFamily,
    border: block.style.borderWidth ? `${block.style.borderWidth}px solid ${block.style.borderColor || '#e5e7eb'}` : 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: block.style.alignment === 'center' ? 'center' : block.style.alignment === 'right' ? 'flex-end' : 'flex-start',
  }

  const iconContainerStyle: React.CSSProperties = {
    marginBottom: '16px',
  }

  const titleStyle: React.CSSProperties = {
    color: block.style.titleColor,
    fontSize: `${block.style.titleSize}px`,
    fontWeight: block.style.titleWeight,
    marginBottom: '12px',
    lineHeight: 1.3,
  }

  const descriptionStyle: React.CSSProperties = {
    color: block.style.descriptionColor,
    fontSize: `${block.style.descriptionSize}px`,
    lineHeight: 1.6,
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
      {/* Icon */}
      {block.style.showIcon && (
        <div style={iconContainerStyle}>
          <IconComponent
            size={block.style.iconSize}
            color={block.style.iconColor}
          />
        </div>
      )}

      {/* Title */}
      <h3 style={titleStyle}>{block.title}</h3>

      {/* Description */}
      <p style={descriptionStyle}>{block.description}</p>
    </div>
  )
}
