/**
 * Optimized lazy-loading image component
 */

'use client'

import * as React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt?: string
  fallback?: React.ReactNode
  onLoad?: () => void
  onError?: () => void
}

export function LazyImage({
  src,
  alt = '',
  fallback,
  className,
  onLoad,
  onError,
  ...props
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const imgRef = React.useRef<HTMLImageElement>(null)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  if (hasError) {
    return (
      <div className={cn('bg-gray-100 flex items-center justify-center', className)}>
        {fallback || (
          <div className="text-center p-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs text-gray-500 mt-2">Failed to load image</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {isLoading && (
        <div className={cn('bg-gray-100 animate-pulse', className)} />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={cn(isLoading && 'hidden', className)}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </>
  )
}
