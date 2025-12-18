'use client'

import type { QuoteBlock as QuoteBlockType } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Quote as QuoteIcon } from 'lucide-react'

interface QuoteBlockProps {
  block: QuoteBlockType
  sectionId: string
}

export function QuoteBlock({ block, sectionId }: QuoteBlockProps) {
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
    textAlign: block.style.alignment,
    fontFamily: block.style.fontFamily,
    position: 'relative',
    borderLeft: block.style.borderLeftWidth
      ? `${block.style.borderLeftWidth}px solid ${block.style.borderLeftColor}`
      : undefined,
  }

  const quoteStyle: React.CSSProperties = {
    color: block.style.quoteColor,
    fontSize: `${block.style.quoteSize}px`,
    fontStyle: block.style.fontStyle,
    lineHeight: '1.6',
    margin: '0 0 16px 0',
    position: 'relative',
  }

  const authorStyle: React.CSSProperties = {
    color: block.style.authorColor,
    fontSize: `${block.style.authorSize}px`,
    fontWeight: 600,
    margin: '0',
  }

  const authorTitleStyle: React.CSSProperties = {
    color: block.style.authorColor,
    fontSize: `${block.style.authorSize - 2}px`,
    opacity: 0.8,
    margin: '4px 0 0 0',
  }

  const quoteMarkStyle: React.CSSProperties = {
    color: block.style.quoteMarkColor || block.style.quoteColor,
    fontSize: `${block.style.quoteSize * 1.5}px`,
    opacity: 0.3,
    lineHeight: '1',
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
      {/* Quote Icon for Visual Cue */}
      {block.style.alignment === 'left' && (
        <QuoteIcon
          size={32}
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            opacity: 0.1,
            color: block.style.quoteColor,
          }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Quote Text */}
        <blockquote style={quoteStyle}>
          {block.style.showQuoteMarks && (
            <span style={quoteMarkStyle}>&ldquo;</span>
          )}
          {block.quote}
          {block.style.showQuoteMarks && (
            <span style={quoteMarkStyle}>&rdquo;</span>
          )}
        </blockquote>

        {/* Author Info */}
        {block.author && (
          <div style={{ marginTop: '16px' }}>
            <p style={authorStyle}>&mdash; {block.author}</p>
            {block.authorTitle && (
              <p style={authorTitleStyle}>{block.authorTitle}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
