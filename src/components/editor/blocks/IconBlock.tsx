'use client'

import { useEditorStore } from '@/store/editorStore'
import type { IconBlock as IconBlockType } from '@/types'
import * as LucideIcons from 'lucide-react'

interface IconBlockProps {
  block: IconBlockType
  sectionId: string
}

export function IconBlock({ block, sectionId }: IconBlockProps) {
  const { selectedElement, selectElement } = useEditorStore()
  const isSelected =
    selectedElement.type === 'block' &&
    selectedElement.sectionId === sectionId &&
    selectedElement.blockId === block.id

  // Dynamically get the icon component from Lucide
  const IconComponent = (LucideIcons as any)[block.iconName] || LucideIcons.CircleHelp

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: block.style.alignment === 'left' ? 'flex-start' : block.style.alignment === 'right' ? 'flex-end' : 'center',
    marginTop: `${block.style.margin.top}px`,
    marginRight: `${block.style.margin.right}px`,
    marginBottom: `${block.style.margin.bottom}px`,
    marginLeft: `${block.style.margin.left}px`,
  }

  const iconElement = (
    <IconComponent
      size={block.style.size}
      color={block.style.color}
      style={{ cursor: block.href ? 'pointer' : 'default' }}
    />
  )

  const content = block.href ? (
    <a
      href={block.href}
      target={block.target || '_self'}
      rel={block.target === '_blank' ? 'noopener noreferrer' : undefined}
      onClick={(e) => e.preventDefault()} // Prevent navigation in editor
    >
      {iconElement}
    </a>
  ) : (
    iconElement
  )

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
      {content}
    </div>
  )
}
