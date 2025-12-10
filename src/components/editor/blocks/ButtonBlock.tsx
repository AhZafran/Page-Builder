'use client'

import type { ButtonBlock } from '@/types'
import { sanitizeURL } from '@/lib/security'

interface ButtonBlockComponentProps {
  block: ButtonBlock
}

export function ButtonBlockComponent({ block }: ButtonBlockComponentProps) {
  const containerStyle: React.CSSProperties = {
    paddingTop: `${block.style.padding.top}px`,
    paddingRight: `${block.style.padding.right}px`,
    paddingBottom: `${block.style.padding.bottom}px`,
    paddingLeft: `${block.style.padding.left}px`,
    marginTop: `${block.style.margin.top}px`,
    marginRight: `${block.style.margin.right}px`,
    marginBottom: `${block.style.margin.bottom}px`,
    marginLeft: `${block.style.margin.left}px`,
    display: 'flex',
    justifyContent:
      block.style.layout === 'center'
        ? 'center'
        : block.style.layout === 'full-width'
        ? 'stretch'
        : 'flex-start',
  }

  const buttonStyle: React.CSSProperties = {
    backgroundColor: block.style.backgroundColor,
    color: block.style.color,
    fontSize: `${block.style.fontSize}px`,
    fontWeight: block.style.fontWeight,
    fontFamily: block.style.fontFamily,
    borderRadius: `${block.style.borderRadius}px`,
    padding: '12px 24px',
    border: 'none',
    cursor: 'pointer',
    width: block.style.layout === 'full-width' ? '100%' : 'auto',
    display: 'inline-block',
    textAlign: 'center',
    textDecoration: 'none',
  }

  // Sanitize the URL to prevent XSS attacks
  const safeHref = sanitizeURL(block.href) || '#'

  return (
    <div style={containerStyle}>
      <a
        href={safeHref}
        target={block.target || '_self'}
        rel={block.target === '_blank' ? 'noopener noreferrer' : undefined}
        style={buttonStyle}
        onClick={(e) => {
          // Prevent navigation in editor mode
          e.preventDefault()
        }}
      >
        {block.text || 'Click me'}
      </a>
    </div>
  )
}
