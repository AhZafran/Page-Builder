'use client'

import type { VideoBlock } from '@/types'
import { getSafeEmbedURL, getSecureIframeProps, sanitizeURL } from '@/lib/security'

interface VideoBlockComponentProps {
  block: VideoBlock
}

export function VideoBlockComponent({ block }: VideoBlockComponentProps) {
  const containerStyle: React.CSSProperties = {
    width: '100%',
    paddingTop: `${block.style.padding.top}px`,
    paddingRight: `${block.style.padding.right}px`,
    paddingBottom: `${block.style.padding.bottom}px`,
    paddingLeft: `${block.style.padding.left}px`,
    marginTop: `${block.style.margin.top}px`,
    marginRight: `${block.style.margin.right}px`,
    marginBottom: `${block.style.margin.bottom}px`,
    marginLeft: `${block.style.margin.left}px`,
  }

  // Get aspect ratio padding
  const aspectRatioPadding = {
    '16:9': '56.25%',
    '1:1': '100%',
    '4:3': '75%',
    '9:16': '177.78%',
    'auto': '56.25%',
  }[block.style.aspectRatio]

  // For direct video files, use HTML5 video tag
  if (block.source === 'direct') {
    const videoUrl = sanitizeURL(block.url)

    if (!videoUrl) {
      return (
        <div style={containerStyle}>
          <div className="bg-gray-100 p-8 rounded text-center">
            <p className="text-gray-500 text-sm">
              {block.url ? 'Invalid video URL' : 'Enter a video URL to preview'}
            </p>
          </div>
        </div>
      )
    }

    return (
      <div style={containerStyle}>
        <div className="relative w-full min-w-[200px]" style={{ paddingBottom: aspectRatioPadding }}>
          <video
            src={videoUrl}
            className="absolute top-0 left-0 w-full h-full rounded object-cover"
            controls
            preload="metadata"
            playsInline
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    )
  }

  // Special handling for Instagram - they don't support simple iframe embeds
  if (block.source === 'instagram') {
    const sanitized = sanitizeURL(block.url)
    return (
      <div style={containerStyle}>
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded text-center border-2 border-purple-200">
          <div className="mb-4">
            <svg className="w-12 h-12 mx-auto text-purple-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <p className="text-gray-700 font-medium mb-3">Instagram content</p>
          <p className="text-gray-600 text-sm mb-4">
            Instagram embeds require special handling. Your visitors will see this content when you publish.
          </p>
          {sanitized && (
            <a
              href={sanitized}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              View on Instagram
            </a>
          )}
        </div>
      </div>
    )
  }

  // For embedded videos (YouTube, Vimeo, TikTok), use iframe
  const embedUrl = getSafeEmbedURL(block.url, block.source)
  const iframeProps = getSecureIframeProps()

  if (!embedUrl) {
    return (
      <div style={containerStyle}>
        <div className="bg-gray-100 p-8 rounded text-center">
          <p className="text-gray-500 text-sm">
            {block.url ? 'Invalid video URL' : 'Enter a video URL to preview'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div className="relative w-full min-w-[200px]" style={{ paddingBottom: aspectRatioPadding }}>
        <iframe
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full rounded"
          frameBorder="0"
          allowFullScreen
          title="Video embed"
          {...iframeProps}
        />
      </div>
    </div>
  )
}
