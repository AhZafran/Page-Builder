'use client'

import type { TestimonialBlock } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Star, Quote } from 'lucide-react'

interface TestimonialBlockProps {
  block: TestimonialBlock
  sectionId: string
}

export function TestimonialBlock({ block, sectionId }: TestimonialBlockProps) {
  const { selectedElement, selectElement } = useEditorStore()
  const isSelected =
    selectedElement.type === 'block' &&
    selectedElement.sectionId === sectionId &&
    selectedElement.blockId === block.id

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
    position: 'relative',
    maxWidth: '600px',
    marginInline: block.style.alignment === 'center' ? 'auto' : undefined,
  }

  const quoteStyle: React.CSSProperties = {
    fontSize: `${block.style.fontSize}px`,
    color: block.style.textColor,
    marginBottom: '16px',
    lineHeight: 1.6,
    fontStyle: 'italic',
  }

  const authorStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '16px',
    justifyContent: block.style.alignment === 'center' ? 'center' : block.style.alignment === 'right' ? 'flex-end' : 'flex-start',
  }

  const nameStyle: React.CSSProperties = {
    color: block.style.authorColor,
    fontWeight: 600,
    fontSize: `${block.style.fontSize * 0.9}px`,
    fontStyle: 'normal',
  }

  const roleStyle: React.CSSProperties = {
    color: block.style.roleColor,
    fontSize: `${block.style.fontSize * 0.8}px`,
    opacity: 0.8,
    fontStyle: 'normal',
  }

  const renderRating = () => {
    if (!block.style.showRating || !block.rating) return null

    return (
      <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', justifyContent: block.style.alignment === 'center' ? 'center' : block.style.alignment === 'right' ? 'flex-end' : 'flex-start' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= (block.rating || 0) ? block.style.ratingColor : 'none'}
            color={star <= (block.rating || 0) ? block.style.ratingColor : '#d1d5db'}
            style={{ flexShrink: 0 }}
          />
        ))}
      </div>
    )
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
      {/* Quote Icon */}
      <Quote
        size={32}
        color={block.style.textColor}
        style={{ opacity: 0.2, marginBottom: '8px' }}
      />

      {/* Rating */}
      {renderRating()}

      {/* Quote Text */}
      <p style={quoteStyle}>&ldquo;{block.quote}&rdquo;</p>

      {/* Author Info */}
      <div style={authorStyle}>
        {block.authorImage && (
          <img
            src={block.authorImage}
            alt={block.authorName}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        )}
        <div style={{ textAlign: block.style.alignment }}>
          <div style={nameStyle}>{block.authorName}</div>
          {block.authorRole && <div style={roleStyle}>{block.authorRole}</div>}
        </div>
      </div>
    </div>
  )
}
