/**
 * HTML renderer for Page Builder
 * Converts page data into standalone HTML
 */

import type { PageData, Section, Block, Spacing } from '@/types'
import {
  sanitizeHTML,
  sanitizeText,
  sanitizeURL,
  sanitizeColor,
  sanitizeFontFamily,
  getSafeEmbedURL
} from './security'

/**
 * Converts spacing object to CSS string
 */
function spacingToCSS(spacing: Spacing, property: 'padding' | 'margin'): string {
  return `${property}: ${spacing.top}px ${spacing.right}px ${spacing.bottom}px ${spacing.left}px;`
}

/**
 * Renders a text block
 */
function renderTextBlock(block: Block & { type: 'text' }): string {
  const { content, style } = block
  const paddingCSS = spacingToCSS(style.padding, 'padding')
  const marginCSS = spacingToCSS(style.margin, 'margin')

  // Sanitize content and CSS values
  const sanitizedContent = sanitizeHTML(content)
  const sanitizedFontFamily = sanitizeFontFamily(style.fontFamily)
  const sanitizedColor = sanitizeColor(style.color)
  const sanitizedBgColor = style.backgroundColor ? sanitizeColor(style.backgroundColor) : ''

  return `
    <div style="
      font-family: ${sanitizedFontFamily};
      font-size: ${style.fontSize}px;
      font-weight: ${style.fontWeight};
      font-style: ${style.fontStyle || 'normal'};
      color: ${sanitizedColor};
      ${sanitizedBgColor ? `background-color: ${sanitizedBgColor};` : ''}
      text-align: ${style.textAlign};
      ${paddingCSS}
      ${marginCSS}
    ">${sanitizedContent}</div>
  `
}

/**
 * Renders an image block
 */
function renderImageBlock(block: Block & { type: 'image' }): string {
  const { src, alt, style } = block
  const paddingCSS = spacingToCSS(style.padding, 'padding')
  const marginCSS = spacingToCSS(style.margin, 'margin')

  // Sanitize URL and alt text
  const sanitizedSrc = sanitizeURL(src)
  const sanitizedAlt = sanitizeText(alt || '')

  // If URL is invalid, return placeholder
  if (!sanitizedSrc) {
    return `<div style="${paddingCSS} ${marginCSS}"><div style="background: #f3f4f6; padding: 2rem; text-align: center;">Invalid image URL</div></div>`
  }

  return `
    <div style="${paddingCSS} ${marginCSS}">
      <img
        src="${sanitizedSrc}"
        alt="${sanitizedAlt}"
        style="
          border-radius: ${style.borderRadius}px;
          object-fit: ${style.objectFit};
          ${style.width ? `width: ${style.width};` : ''}
          ${style.height ? `height: ${style.height};` : ''}
          max-width: 100%;
        "
      />
    </div>
  `
}

/**
 * Renders a video block with embed
 */
function renderVideoBlock(block: Block & { type: 'video' }): string {
  const { url, source, style } = block
  const paddingCSS = spacingToCSS(style.padding, 'padding')
  const marginCSS = spacingToCSS(style.margin, 'margin')

  let aspectRatioPercent = '56.25%' // 16:9 default

  // Convert aspect ratio to percentage
  const aspectRatioMap: Record<string, string> = {
    '16:9': '56.25%',
    '1:1': '100%',
    '4:3': '75%',
    '9:16': '177.78%',
    'auto': '56.25%',
  }
  aspectRatioPercent = aspectRatioMap[style.aspectRatio] || '56.25%'

  // Get safe embed URL using security utility
  const safeEmbedUrl = getSafeEmbedURL(url, source)

  // If URL is invalid or unsafe, return placeholder
  if (!safeEmbedUrl) {
    return `<div style="${paddingCSS} ${marginCSS}"><div style="background: #f3f4f6; padding: 2rem; text-align: center;">Invalid or unsafe video URL</div></div>`
  }

  return `
    <div style="${paddingCSS} ${marginCSS}">
      <div style="position: relative; padding-bottom: ${aspectRatioPercent}; height: 0; overflow: hidden;">
        <iframe
          src="${safeEmbedUrl}"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
          frameborder="0"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  `
}

/**
 * Renders a button block
 */
function renderButtonBlock(block: Block & { type: 'button' }): string {
  const { text, href, target, style } = block
  const paddingCSS = spacingToCSS(style.padding, 'padding')
  const marginCSS = spacingToCSS(style.margin, 'margin')

  // Sanitize text, URL, and CSS values
  const sanitizedText = sanitizeText(text)
  const sanitizedHref = sanitizeURL(href) || '#'
  const sanitizedBgColor = sanitizeColor(style.backgroundColor)
  const sanitizedColor = sanitizeColor(style.color)
  const sanitizedFontFamily = sanitizeFontFamily(style.fontFamily)

  const layoutStyles: Record<string, string> = {
    'inline': 'display: inline-block;',
    'center': 'display: inline-block; margin-left: auto; margin-right: auto; display: block; text-align: center;',
    'full-width': 'display: block; width: 100%;',
  }

  return `
    <div style="${marginCSS}">
      <a
        href="${sanitizedHref}"
        target="${target === '_blank' ? '_blank' : '_self'}"
        rel="${target === '_blank' ? 'noopener noreferrer' : ''}"
        style="
          ${layoutStyles[style.layout]}
          background-color: ${sanitizedBgColor};
          color: ${sanitizedColor};
          font-size: ${style.fontSize}px;
          font-weight: ${style.fontWeight};
          font-family: ${sanitizedFontFamily};
          border-radius: ${style.borderRadius}px;
          ${paddingCSS}
          text-decoration: none;
          cursor: pointer;
        "
      >${sanitizedText}</a>
    </div>
  `
}

/**
 * Renders a countdown block (static HTML with current values)
 */
function renderCountdownBlock(block: Block & { type: 'countdown' }): string {
  const { targetDate, label, displayFormat, style } = block
  const paddingCSS = spacingToCSS(style.padding, 'padding')
  const marginCSS = spacingToCSS(style.margin, 'margin')

  // Sanitize label and CSS values
  const sanitizedLabel = label ? sanitizeText(label) : ''
  const sanitizedFontFamily = sanitizeFontFamily(style.fontFamily)
  const sanitizedColor = sanitizeColor(style.color)
  const sanitizedBgColor = style.backgroundColor ? sanitizeColor(style.backgroundColor) : ''
  const sanitizedLabelColor = style.labelColor ? sanitizeColor(style.labelColor) : sanitizedColor

  // Calculate time remaining
  const now = new Date().getTime()
  const target = new Date(targetDate).getTime()
  const diff = Math.max(0, target - now)

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  let display = ''
  if (displayFormat === 'dhms') {
    display = `${days}d ${hours}h ${minutes}m ${seconds}s`
  } else if (displayFormat === 'hms') {
    display = `${hours + days * 24}h ${minutes}m ${seconds}s`
  } else {
    display = `${minutes + hours * 60 + days * 24 * 60}m ${seconds}s`
  }

  return `
    <div style="
      font-size: ${style.fontSize}px;
      font-weight: ${style.fontWeight};
      font-family: ${sanitizedFontFamily};
      color: ${sanitizedColor};
      ${sanitizedBgColor ? `background-color: ${sanitizedBgColor};` : ''}
      ${paddingCSS}
      ${marginCSS}
      text-align: center;
    ">
      ${sanitizedLabel ? `<div style="color: ${sanitizedLabelColor}; margin-bottom: 8px;">${sanitizedLabel}</div>` : ''}
      <div style="font-size: ${style.fontSize * 1.5}px; font-weight: 700;">${display}</div>
    </div>
  `
}

/**
 * Renders an FAQ block
 */
function renderFAQBlock(block: Block & { type: 'faq' }): string {
  const { items, style } = block
  const paddingCSS = spacingToCSS(style.padding, 'padding')
  const marginCSS = spacingToCSS(style.margin, 'margin')

  // Sanitize CSS values
  const sanitizedFontFamily = sanitizeFontFamily(style.fontFamily)
  const sanitizedQuestionColor = sanitizeColor(style.questionColor)
  const sanitizedAnswerColor = sanitizeColor(style.answerColor)
  const sanitizedBgColor = style.backgroundColor ? sanitizeColor(style.backgroundColor) : ''

  const itemsHTML = items
    .map(
      (item) => {
        // Sanitize question and answer content
        const sanitizedQuestion = sanitizeHTML(item.question)
        const sanitizedAnswer = sanitizeHTML(item.answer)

        return `
    <details style="margin-bottom: 12px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
      <summary style="
        font-size: ${style.fontSize}px;
        font-weight: ${style.fontWeight};
        font-family: ${sanitizedFontFamily};
        color: ${sanitizedQuestionColor};
        cursor: pointer;
        list-style: none;
      ">${sanitizedQuestion}</summary>
      <div style="
        margin-top: 12px;
        font-size: ${style.fontSize}px;
        font-family: ${sanitizedFontFamily};
        color: ${sanitizedAnswerColor};
      ">${sanitizedAnswer}</div>
    </details>
  `
      }
    )
    .join('')

  return `
    <div style="
      ${sanitizedBgColor ? `background-color: ${sanitizedBgColor};` : ''}
      ${paddingCSS}
      ${marginCSS}
    ">
      ${itemsHTML}
    </div>
  `
}

/**
 * Renders a space block
 */
function renderSpaceBlock(block: Block & { type: 'space' }): string {
  return `<div style="height: ${block.height}px;"></div>`
}

/**
 * Renders a single block based on type
 */
function renderBlock(block: Block): string {
  switch (block.type) {
    case 'text':
      return renderTextBlock(block)
    case 'image':
      return renderImageBlock(block)
    case 'video':
      return renderVideoBlock(block)
    case 'button':
      return renderButtonBlock(block)
    case 'countdown':
      return renderCountdownBlock(block)
    case 'faq':
      return renderFAQBlock(block)
    case 'space':
      return renderSpaceBlock(block)
    default:
      return ''
  }
}

/**
 * Renders a section with all its blocks
 */
function renderSection(section: Section): string {
  const { style, blocks } = section
  const paddingCSS = spacingToCSS(style.padding, 'padding')
  const marginCSS = spacingToCSS(style.margin, 'margin')

  // Sanitize section background color and background image
  const sanitizedBgColor = sanitizeColor(style.backgroundColor)
  const sanitizedBgImage = style.backgroundImage ? sanitizeURL(style.backgroundImage) : null

  const blocksHTML = blocks.map((block) => renderBlock(block)).join('')

  return `
    <section style="
      background-color: ${sanitizedBgColor};
      ${sanitizedBgImage ? `background-image: url('${sanitizedBgImage}');` : ''}
      ${sanitizedBgImage && style.backgroundSize ? `background-size: ${style.backgroundSize};` : ''}
      ${sanitizedBgImage && style.backgroundPosition ? `background-position: ${style.backgroundPosition};` : ''}
      ${sanitizedBgImage && style.backgroundRepeat ? `background-repeat: ${style.backgroundRepeat};` : ''}
      ${paddingCSS}
      ${marginCSS}
      display: flex;
      flex-direction: ${style.flex.direction};
      align-items: ${style.flex.alignItems};
      justify-content: ${style.flex.justifyContent};
      flex-wrap: ${style.flex.wrap || 'nowrap'};
    ">
      ${blocksHTML}
    </section>
  `
}

/**
 * Renders complete HTML page
 */
export function renderPageToHTML(pageData: PageData): string {
  const sectionsHTML = pageData.sections.map((section) => renderSection(section)).join('')

  // Sanitize page name for title tag
  const sanitizedPageName = sanitizeText(pageData.name)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'none'; style-src 'unsafe-inline'; img-src * data:; media-src *; frame-src https://www.youtube-nocookie.com https://player.vimeo.com https://www.tiktok.com https://instagram.com;">
  <title>${sanitizedPageName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.5;
    }
    img {
      display: block;
    }
  </style>
</head>
<body>
  ${sectionsHTML}
</body>
</html>`
}
