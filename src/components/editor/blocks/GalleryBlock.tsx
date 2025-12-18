'use client'

import { useState, useEffect } from 'react'
import type { GalleryBlock } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryBlockProps {
  block: GalleryBlock
  sectionId: string
}

export function GalleryBlock({ block, sectionId }: GalleryBlockProps) {
  const selectedElement = useEditorStore((state) => state.selectedElement)
  const selectElement = useEditorStore((state) => state.selectElement)
  const [currentIndex, setCurrentIndex] = useState(0)

  const isSelected =
    selectedElement.type === 'block' &&
    selectedElement.blockId === block.id &&
    selectedElement.sectionId === sectionId

  // Reset currentIndex if it's out of bounds when images change
  useEffect(() => {
    if (currentIndex >= block.images.length && block.images.length > 0) {
      setCurrentIndex(0)
    }
  }, [block.images.length, currentIndex])

  // Auto-play functionality
  useEffect(() => {
    if (!block.autoPlay || block.images.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (block.loop) {
          return (prev + 1) % block.images.length
        } else {
          return prev < block.images.length - 1 ? prev + 1 : prev
        }
      })
    }, block.autoPlayInterval)

    return () => clearInterval(interval)
  }, [block.autoPlay, block.autoPlayInterval, block.images.length, block.loop])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectElement({ type: 'block', sectionId, blockId: block.id })
  }

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => {
      if (block.loop) {
        return prev === 0 ? block.images.length - 1 : prev - 1
      } else {
        return Math.max(0, prev - 1)
      }
    })
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => {
      if (block.loop) {
        return (prev + 1) % block.images.length
      } else {
        return Math.min(block.images.length - 1, prev + 1)
      }
    })
  }

  const handleThumbnailClick = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex(index)
  }

  const handleDotClick = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex(index)
  }

  if (block.images.length === 0) {
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
          No images added. Add images in the properties panel.
        </p>
      </div>
    )
  }

  // Ensure currentIndex is within bounds
  const safeIndex = Math.min(currentIndex, block.images.length - 1)
  const currentImage = block.images[safeIndex]

  // Safety check - if currentImage is still undefined, show empty state
  if (!currentImage) {
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
          No images available.
        </p>
      </div>
    )
  }

  // Calculate aspect ratio padding
  const aspectRatioMap: Record<string, string> = {
    '16:9': '56.25%',
    '1:1': '100%',
    '4:3': '75%',
    '3:2': '66.67%',
    'auto': '0',
  }
  const aspectRatioPadding = aspectRatioMap[block.style.aspectRatio] || '56.25%'

  const containerStyle: React.CSSProperties = {
    ...spacingStyle(block.style.padding, 'padding'),
    ...spacingStyle(block.style.margin, 'margin'),
    border: isSelected ? '2px solid #3b82f6' : 'none',
    borderRadius: `${block.style.borderRadius}px`,
    overflow: 'hidden',
    cursor: 'pointer',
    position: 'relative',
  }

  const carouselContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    paddingTop: block.style.aspectRatio === 'auto' ? '0' : aspectRatioPadding,
    backgroundColor: '#000',
    borderRadius: `${block.style.borderRadius}px`,
    overflow: 'hidden',
  }

  const imageStyle: React.CSSProperties = {
    position: block.style.aspectRatio === 'auto' ? 'relative' : 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: block.style.aspectRatio === 'auto' ? 'auto' : '100%',
    objectFit: block.style.imageObjectFit,
    borderRadius: `${block.style.borderRadius}px`,
  }

  const navButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: block.style.navButtonBackgroundColor,
    color: block.style.navButtonColor,
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    opacity: 0.8,
    transition: 'opacity 0.2s',
  }

  const captionStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: block.style.captionBackgroundColor,
    color: block.style.captionColor,
    fontSize: `${block.style.captionSize}px`,
    fontFamily: block.style.fontFamily,
    padding: '12px 16px',
    textAlign: 'center',
  }

  const thumbnailsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  }

  const thumbnailStyle = (index: number): React.CSSProperties => ({
    width: `${block.style.thumbnailSize}px`,
    height: `${block.style.thumbnailSize}px`,
    objectFit: 'cover',
    borderRadius: '4px',
    cursor: 'pointer',
    border: index === currentIndex ? '2px solid #3b82f6' : '2px solid transparent',
    opacity: index === currentIndex ? 1 : 0.6,
    transition: 'all 0.2s',
  })

  const dotsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginTop: '12px',
  }

  const dotStyle = (index: number): React.CSSProperties => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: index === currentIndex ? block.style.dotActiveColor : block.style.dotColor,
    cursor: 'pointer',
    transition: 'all 0.2s',
  })

  return (
    <div onClick={handleClick} style={containerStyle}>
      {/* Main carousel */}
      <div style={carouselContainerStyle}>
        <img
          src={currentImage.url}
          alt={currentImage.alt || `Gallery image ${currentIndex + 1}`}
          style={imageStyle}
        />

        {/* Navigation buttons */}
        {block.showNavButtons && block.images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              style={{ ...navButtonStyle, left: '12px' }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              style={{ ...navButtonStyle, right: '12px' }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Caption */}
        {block.style.showCaptions && currentImage.caption && (
          <div style={captionStyle}>{currentImage.caption}</div>
        )}
      </div>

      {/* Thumbnails */}
      {block.style.showThumbnails && block.images.length > 1 && (
        <div style={thumbnailsContainerStyle}>
          {block.images.map((image, index) => (
            <img
              key={image.id}
              src={image.url}
              alt={image.alt || `Thumbnail ${index + 1}`}
              style={thumbnailStyle(index)}
              onClick={handleThumbnailClick(index)}
            />
          ))}
        </div>
      )}

      {/* Dots */}
      {block.showDots && !block.style.showThumbnails && block.images.length > 1 && (
        <div style={dotsContainerStyle}>
          {block.images.map((_, index) => (
            <div
              key={index}
              style={dotStyle(index)}
              onClick={handleDotClick(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Helper function to convert spacing to CSS
function spacingStyle(spacing: { top: number; right: number; bottom: number; left: number }, property: 'padding' | 'margin'): React.CSSProperties {
  return {
    [`${property}Top`]: `${spacing.top}px`,
    [`${property}Right`]: `${spacing.right}px`,
    [`${property}Bottom`]: `${spacing.bottom}px`,
    [`${property}Left`]: `${spacing.left}px`,
  } as React.CSSProperties
}
