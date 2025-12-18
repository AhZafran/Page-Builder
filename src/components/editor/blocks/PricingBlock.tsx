'use client'

import type { PricingBlock } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Check, Crown } from 'lucide-react'

interface PricingBlockProps {
  block: PricingBlock
  sectionId: string
}

export function PricingBlock({ block, sectionId }: PricingBlockProps) {
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: block.style.alignment === 'center' ? 'center' : block.style.alignment === 'right' ? 'flex-end' : 'flex-start',
    boxShadow: block.highlighted ? '0 10px 40px rgba(0, 0, 0, 0.1)' : undefined,
    transform: block.highlighted ? 'scale(1.05)' : undefined,
    transition: 'transform 0.2s',
  }

  const planNameStyle: React.CSSProperties = {
    color: block.style.planNameColor,
    fontSize: `${block.style.planNameSize}px`,
    fontWeight: 600,
    marginBottom: '8px',
  }

  const priceContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    marginBottom: '16px',
    justifyContent: block.style.alignment === 'center' ? 'center' : block.style.alignment === 'right' ? 'flex-end' : 'flex-start',
  }

  const priceStyle: React.CSSProperties = {
    color: block.style.priceColor,
    fontSize: `${block.style.priceSize}px`,
    fontWeight: 700,
  }

  const periodStyle: React.CSSProperties = {
    color: block.style.periodColor,
    fontSize: `${block.style.periodSize}px`,
  }

  const featureStyle: React.CSSProperties = {
    color: block.style.featuresColor,
    fontSize: `${block.style.featuresSize}px`,
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    marginBottom: '8px',
    textAlign: 'left',
    width: '100%',
  }

  const buttonStyle: React.CSSProperties = {
    backgroundColor: block.highlighted ? block.style.highlightColor : '#3b82f6',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '16px',
    width: '100%',
    transition: 'background-color 0.2s',
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
      {/* Highlight Badge */}
      {block.highlighted && block.highlightLabel && (
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            right: '20px',
            backgroundColor: block.style.highlightColor,
            color: '#ffffff',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Crown size={14} />
          {block.highlightLabel}
        </div>
      )}

      {/* Plan Name */}
      <h3 style={planNameStyle}>{block.planName}</h3>

      {/* Price */}
      <div style={priceContainerStyle}>
        <span style={{ fontSize: `${block.style.priceSize * 0.6}px`, color: block.style.priceColor }}>
          {block.currency}
        </span>
        <span style={priceStyle}>{block.price}</span>
        <span style={periodStyle}>{block.period}</span>
      </div>

      {/* Features List */}
      <div style={{ width: '100%', marginBottom: '16px' }}>
        {block.features.map((feature, index) => (
          <div key={index} style={featureStyle}>
            <Check
              size={block.style.featuresSize}
              color={block.highlighted ? block.style.highlightColor : '#10b981'}
              style={{ flexShrink: 0, marginTop: '2px' }}
            />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        style={buttonStyle}
        onClick={(e) => {
          e.stopPropagation()
          // Prevent navigation in editor
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.9'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1'
        }}
      >
        {block.buttonText}
      </button>
    </div>
  )
}
