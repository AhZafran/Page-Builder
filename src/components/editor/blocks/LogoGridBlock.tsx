'use client'

import type { LogoGridBlock } from '@/types'
import { useEditorStore } from '@/store/editorStore'

interface LogoGridBlockProps {
  block: LogoGridBlock
  sectionId: string
}

export function LogoGridBlock({ block, sectionId }: LogoGridBlockProps) {
  const selectedElement = useEditorStore((state) => state.selectedElement)
  const selectElement = useEditorStore((state) => state.selectElement)

  const isSelected =
    selectedElement.type === 'block' &&
    selectedElement.blockId === block.id &&
    selectedElement.sectionId === sectionId

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectElement({ type: 'block', sectionId, blockId: block.id })
  }

  if (block.logos.length === 0) {
    return (
      <div
        onClick={handleClick}
        style={{
          ...spacingStyle(block.style.padding, 'padding'),
          ...spacingStyle(block.style.margin, 'margin'),
          border: isSelected ? '2px solid #3b82f6' : '2px dashed #d1d5db',
          borderRadius: `${block.style.borderRadius}px`,
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#f9fafb',
          cursor: 'pointer',
        }}
      >
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          No logos added. Add logos in the properties panel.
        </p>
      </div>
    )
  }

  const containerStyle: React.CSSProperties = {
    ...spacingStyle(block.style.padding, 'padding'),
    ...spacingStyle(block.style.margin, 'margin'),
    backgroundColor: block.style.backgroundColor,
    borderRadius: `${block.style.borderRadius}px`,
    border: isSelected ? '2px solid #3b82f6' : 'none',
    cursor: 'pointer',
  }

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${block.style.columns}, 1fr)`,
    gap: `${block.style.gap}px`,
    alignItems: 'center',
    justifyItems: block.style.alignment,
  }

  const logoContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: block.style.logoBackgroundColor,
    borderRadius: `${block.style.borderRadius}px`,
    padding: '16px',
    height: `${block.style.logoSize + 32}px`,
    transition: 'all 0.3s ease',
  }

  const getLogoStyle = (hasLink: boolean): React.CSSProperties => ({
    maxHeight: `${block.style.logoSize}px`,
    maxWidth: '100%',
    height: 'auto',
    width: 'auto',
    objectFit: 'contain',
    filter: block.style.grayscale ? 'grayscale(100%)' : 'none',
    opacity: block.style.opacity,
    transition: 'all 0.3s ease',
    cursor: hasLink ? 'pointer' : 'default',
  })

  const getHoverStyle = (): React.CSSProperties => ({
    filter: block.style.grayscale && block.style.grayscaleHover ? 'grayscale(0%)' : block.style.grayscale ? 'grayscale(100%)' : 'none',
    opacity: block.style.hoverOpacity,
  })

  return (
    <div onClick={handleClick} style={containerStyle}>
      <div style={gridStyle}>
        {block.logos.map((logo) => {
          const content = (
            <div
              key={logo.id}
              style={logoContainerStyle}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img')
                if (img) {
                  Object.assign(img.style, getHoverStyle())
                }
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img')
                if (img) {
                  Object.assign(img.style, getLogoStyle(!!logo.link))
                }
              }}
            >
              <img
                src={logo.imageUrl}
                alt={logo.alt || 'Logo'}
                style={getLogoStyle(!!logo.link)}
              />
            </div>
          )

          if (logo.link) {
            return (
              <a
                key={logo.id}
                href={logo.link}
                target={logo.target || '_blank'}
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', display: 'block' }}
                onClick={(e) => e.stopPropagation()}
              >
                {content}
              </a>
            )
          }

          return content
        })}
      </div>
    </div>
  )
}

// Helper function to convert spacing to CSS
function spacingStyle(
  spacing: { top: number; right: number; bottom: number; left: number },
  property: 'padding' | 'margin'
): React.CSSProperties {
  return {
    [`${property}Top`]: `${spacing.top}px`,
    [`${property}Right`]: `${spacing.right}px`,
    [`${property}Bottom`]: `${spacing.bottom}px`,
    [`${property}Left`]: `${spacing.left}px`,
  } as React.CSSProperties
}
