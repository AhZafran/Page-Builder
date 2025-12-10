/**
 * Security utilities for sanitization and protection against XSS attacks
 */

import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  })
}

/**
 * Sanitizes plain text content (removes all HTML tags)
 */
export function sanitizeText(text: string): string {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })
}

/**
 * Validates and sanitizes URLs to prevent javascript: and data: protocols
 */
export function sanitizeURL(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null
  }

  const trimmedUrl = url.trim()

  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:']
  const lowerUrl = trimmedUrl.toLowerCase()

  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      console.warn(`Blocked dangerous URL protocol: ${protocol}`)
      return null
    }
  }

  // Allow relative URLs, http, and https
  if (
    trimmedUrl.startsWith('/') ||
    trimmedUrl.startsWith('#') ||
    trimmedUrl.startsWith('http://') ||
    trimmedUrl.startsWith('https://')
  ) {
    return trimmedUrl
  }

  // If it doesn't start with a protocol, add https://
  if (!trimmedUrl.includes('://')) {
    return `https://${trimmedUrl}`
  }

  return trimmedUrl
}

/**
 * Extracts URL from embed code if user pastes iframe HTML
 */
export function extractURLFromEmbed(input: string): string {
  // Check if input looks like HTML embed code
  if (input.includes('<iframe') || input.includes('</iframe>')) {
    // Extract src attribute from iframe
    const srcMatch = input.match(/src=["']([^"']+)["']/)
    if (srcMatch && srcMatch[1]) {
      const embedUrl = srcMatch[1]

      // Convert YouTube embed URL back to watch URL for consistency
      if (embedUrl.includes('youtube.com/embed/') || embedUrl.includes('youtube-nocookie.com/embed/')) {
        const videoIdMatch = embedUrl.match(/\/embed\/([^?]+)/)
        if (videoIdMatch && videoIdMatch[1]) {
          return `https://www.youtube.com/watch?v=${videoIdMatch[1]}`
        }
      }

      // For other platforms, return the extracted URL
      return embedUrl
    }
  }

  // If not embed code, return input as-is
  return input
}

/**
 * Validates video embed URLs against whitelist
 */
export function validateVideoURL(url: string, source: 'youtube' | 'vimeo' | 'instagram' | 'tiktok' | 'direct'): boolean {
  const lowerUrl = url.toLowerCase()

  switch (source) {
    case 'youtube':
      return (
        lowerUrl.includes('youtube.com/') ||
        lowerUrl.includes('youtu.be/') ||
        lowerUrl.includes('youtube-nocookie.com/')
      )
    case 'vimeo':
      return lowerUrl.includes('vimeo.com/')
    case 'instagram':
      return lowerUrl.includes('instagram.com/')
    case 'tiktok':
      return lowerUrl.includes('tiktok.com/')
    case 'direct':
      // For direct files, check if it ends with video extensions
      return (
        lowerUrl.endsWith('.mp4') ||
        lowerUrl.endsWith('.webm') ||
        lowerUrl.endsWith('.ogg') ||
        lowerUrl.endsWith('.mov')
      )
    default:
      return false
  }
}

/**
 * Converts video URL to safe embed URL
 */
export function getSafeEmbedURL(url: string, source: 'youtube' | 'vimeo' | 'instagram' | 'tiktok' | 'direct'): string | null {
  if (!validateVideoURL(url, source)) {
    return null
  }

  const sanitized = sanitizeURL(url)
  if (!sanitized) return null

  // For direct video files, return the sanitized URL as-is
  if (source === 'direct') {
    return sanitized
  }

  try {
    const urlObj = new URL(sanitized)

    switch (source) {
      case 'youtube': {
        let videoId: string | null = null

        // Extract video ID from various YouTube URL formats
        if (urlObj.hostname.includes('youtube.com')) {
          videoId = urlObj.searchParams.get('v')
        } else if (urlObj.hostname.includes('youtu.be')) {
          videoId = urlObj.pathname.slice(1)
        }

        if (videoId) {
          // Use youtube-nocookie.com for privacy
          return `https://www.youtube-nocookie.com/embed/${videoId}`
        }
        break
      }

      case 'vimeo': {
        // Extract Vimeo video ID
        const match = urlObj.pathname.match(/\/(\d+)/)
        if (match) {
          return `https://player.vimeo.com/video/${match[1]}`
        }
        break
      }

      case 'instagram': {
        // Instagram embed format
        if (urlObj.pathname.includes('/p/') || urlObj.pathname.includes('/reel/')) {
          // Remove trailing slash from pathname and construct embed URL
          const cleanPath = urlObj.pathname.replace(/\/$/, '')
          return `${urlObj.origin}${cleanPath}/embed/`
        }
        break
      }

      case 'tiktok': {
        // TikTok embed requires video ID
        const match = urlObj.pathname.match(/\/video\/(\d+)/)
        if (match) {
          return `https://www.tiktok.com/embed/v2/${match[1]}`
        }
        break
      }
    }
  } catch (e) {
    console.error('Failed to parse video URL:', e)
  }

  return null
}

/**
 * Gets secure iframe attributes for video embeds
 */
export function getSecureIframeProps() {
  return {
    sandbox: 'allow-scripts allow-same-origin allow-presentation allow-popups',
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
    referrerPolicy: 'no-referrer-when-downgrade' as const,
    loading: 'lazy' as const,
  }
}

/**
 * Sanitizes color values to prevent CSS injection
 */
export function sanitizeColor(color: string): string {
  // Only allow hex colors and named colors
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  const namedColors = [
    'transparent',
    'black',
    'white',
    'red',
    'green',
    'blue',
    'yellow',
    'orange',
    'purple',
    'pink',
    'gray',
    'grey',
  ]

  if (hexPattern.test(color)) {
    return color
  }

  if (namedColors.includes(color.toLowerCase())) {
    return color.toLowerCase()
  }

  // Default to transparent if invalid
  return 'transparent'
}

/**
 * Validates and sanitizes CSS length values
 */
export function sanitizeCSSLength(value: string | number): string {
  if (typeof value === 'number') {
    return `${value}px`
  }

  // Allow px, em, rem, %, vh, vw
  const validPattern = /^-?\d+(\.\d+)?(px|em|rem|%|vh|vw)$/
  if (validPattern.test(value)) {
    return value
  }

  return '0px'
}

/**
 * Sanitizes font family names to prevent CSS injection
 */
export function sanitizeFontFamily(fontFamily: string): string {
  // Remove any quotes and potentially dangerous characters
  const sanitized = fontFamily.replace(/['"\\<>]/g, '')

  // Only allow alphanumeric, spaces, hyphens, and commas
  if (/^[a-zA-Z0-9\s,\-]+$/.test(sanitized)) {
    return sanitized
  }

  return 'system-ui, -apple-system, sans-serif'
}

/**
 * Validates image file by checking MIME type and magic numbers
 * @param file The file to validate
 * @returns Promise<boolean> True if file is a valid image
 */
export async function validateImageFile(file: File): Promise<boolean> {
  // First check the MIME type
  const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  if (!validMimeTypes.includes(file.type)) {
    return false
  }

  // Check file magic numbers (first few bytes) to verify actual file type
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onloadend = (e) => {
      if (!e.target?.result) {
        resolve(false)
        return
      }

      const arr = new Uint8Array(e.target.result as ArrayBuffer)

      // Check magic numbers for common image formats
      // JPEG: FF D8 FF
      if (arr[0] === 0xff && arr[1] === 0xd8 && arr[2] === 0xff) {
        resolve(true)
        return
      }

      // PNG: 89 50 4E 47
      if (arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4e && arr[3] === 0x47) {
        resolve(true)
        return
      }

      // GIF: 47 49 46
      if (arr[0] === 0x47 && arr[1] === 0x49 && arr[2] === 0x46) {
        resolve(true)
        return
      }

      // WebP: 52 49 46 46 ... 57 45 42 50
      if (arr[0] === 0x52 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x46 &&
          arr[8] === 0x57 && arr[9] === 0x45 && arr[10] === 0x42 && arr[11] === 0x50) {
        resolve(true)
        return
      }

      // SVG: Check for XML/SVG signature (3C 73 76 67 = "<svg" or 3C 3F 78 6D 6C = "<?xml")
      if (file.type === 'image/svg+xml') {
        const text = new TextDecoder().decode(arr.slice(0, 100))
        if (text.includes('<svg') || text.includes('<?xml')) {
          resolve(true)
          return
        }
      }

      resolve(false)
    }

    reader.onerror = () => resolve(false)

    // Read only the first 12 bytes for magic number check
    reader.readAsArrayBuffer(file.slice(0, 12))
  })
}
