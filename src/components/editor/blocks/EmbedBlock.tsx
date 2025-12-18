'use client'

import type { EmbedBlock as EmbedBlockType } from '@/types'
import { sanitizeURL } from '@/lib/security'

interface EmbedBlockProps {
  block: EmbedBlockType
  sectionId: string
}

export function EmbedBlock({ block, sectionId }: EmbedBlockProps) {
  const { embedUrl, embedType, title, allowFullScreen, style } = block

  // Sanitize the embed URL
  const safeUrl = sanitizeURL(embedUrl)

  // Calculate aspect ratio padding
  const aspectRatioMap: Record<string, string> = {
    '16:9': '56.25%',
    '4:3': '75%',
    '1:1': '100%',
    '21:9': '42.86%',
    'custom': '0',
  }
  const aspectRatioPadding = aspectRatioMap[style.aspectRatio] || '56.25%'

  // Build styles
  const containerStyle: React.CSSProperties = {
    padding: `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`,
    margin: `${style.margin.top}px ${style.margin.right}px ${style.margin.bottom}px ${style.margin.left}px`,
    backgroundColor: style.backgroundColor,
  }

  const wrapperStyle: React.CSSProperties =
    style.aspectRatio === 'custom'
      ? {
          position: 'relative',
          width: style.width,
          height: style.height,
          borderRadius: `${style.borderRadius}px`,
          overflow: 'hidden',
          border: style.border.style !== 'none' ? `${style.border.width}px ${style.border.style} ${style.border.color}` : 'none',
        }
      : {
          position: 'relative',
          width: style.width,
          paddingTop: aspectRatioPadding,
          borderRadius: `${style.borderRadius}px`,
          overflow: 'hidden',
          border: style.border.style !== 'none' ? `${style.border.width}px ${style.border.style} ${style.border.color}` : 'none',
        }

  const iframeStyle: React.CSSProperties =
    style.aspectRatio === 'custom'
      ? {
          width: '100%',
          height: '100%',
          border: 'none',
        }
      : {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
        }

  // Empty state if no URL
  if (!embedUrl || !safeUrl) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            backgroundColor: '#f9fafb',
            border: '2px dashed #d1d5db',
            borderRadius: `${style.borderRadius}px`,
            color: '#6b7280',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📍</div>
          <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
            {embedType === 'map' ? 'Add a Map Embed' : embedType === 'form' ? 'Add a Form Embed' : embedType === 'calendar' ? 'Add a Calendar Embed' : 'Add an Embed'}
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
            {embedType === 'map'
              ? 'Paste your Google Maps embed URL in the properties panel'
              : 'Paste your embed URL in the properties panel'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      {title && (
        <div
          style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '16px',
            color: '#1f2937',
          }}
        >
          {title}
        </div>
      )}
      <div style={wrapperStyle}>
        <iframe
          src={safeUrl}
          style={iframeStyle}
          allowFullScreen={allowFullScreen}
          loading="lazy"
          title={title || `${embedType} embed`}
        />
      </div>
    </div>
  )
}
