'use client'

import type { ImageBlock } from '@/types'
import { LazyImage } from '@/components/ui/lazy-image'
import { cn } from '@/lib/utils'
import { sanitizeURL } from '@/lib/security'

interface ImageBlockComponentProps {
  block: ImageBlock
}

export function ImageBlockComponent({ block }: ImageBlockComponentProps) {
  console.log('ImageBlockComponent rendering:', { id: block.id, src: block.src })

  const containerStyle: React.CSSProperties = {
    paddingTop: `${block.style.padding.top}px`,
    paddingRight: `${block.style.padding.right}px`,
    paddingBottom: `${block.style.padding.bottom}px`,
    paddingLeft: `${block.style.padding.left}px`,
    marginTop: `${block.style.margin.top}px`,
    marginRight: `${block.style.margin.right}px`,
    marginBottom: `${block.style.margin.bottom}px`,
    marginLeft: `${block.style.margin.left}px`,
  }

  const imageStyle: React.CSSProperties = {
    borderRadius: `${block.style.borderRadius}px`,
    objectFit: block.style.objectFit,
    width: block.style.width || '100%',
    height: block.style.height || 'auto',
  }

  // Sanitize the image URL
  const sanitizedSrc = block.src ? sanitizeURL(block.src) : null

  if (!sanitizedSrc) {
    return (
      <div style={containerStyle}>
        <div className="bg-gray-100 p-8 rounded text-center">
          <p className="text-gray-500 text-sm">
            {block.src ? 'Invalid or unsafe image URL' : 'Enter an image URL'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <img
        src={sanitizedSrc}
        alt={block.alt || 'Image'}
        style={imageStyle}
        className="max-w-full"
      />
    </div>
  )
}
