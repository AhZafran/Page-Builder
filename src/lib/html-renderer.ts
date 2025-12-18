/**
 * HTML renderer for Page Builder
 * Converts page data into standalone HTML
 */

import type { PageData, Section, Block, Spacing } from '@/types'
import {
  sanitizeHTML,
  sanitizeText,
  sanitizeURL,
  sanitizeImageURL,
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

  // Sanitize URL and alt text - use sanitizeImageURL to allow base64 data URLs
  const sanitizedSrc = sanitizeImageURL(src)
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
 * Renders a divider block
 */
function renderDividerBlock(block: Block & { type: 'divider' }): string {
  const { style } = block
  const marginCSS = spacingToCSS(style.margin, 'margin')
  const sanitizedColor = sanitizeColor(style.color)

  const dividerStyle = style.style === 'solid'
    ? `background-color: ${sanitizedColor}; height: ${style.height}px;`
    : `border-top: ${style.height}px ${style.style} ${sanitizedColor}; height: 0;`

  return `
    <div style="
      width: ${style.width};
      ${dividerStyle}
      ${marginCSS}
      margin-left: auto;
      margin-right: auto;
    "></div>
  `
}

/**
 * Renders an icon block
 * Note: For HTML export, we use a simple circle as a placeholder since we can't include Lucide React
 * In a production environment, you might want to include actual SVG icons or use an icon font
 */
function renderIconBlock(block: Block & { type: 'icon' }): string {
  const { style, href, target } = block
  const marginCSS = spacingToCSS(style.margin, 'margin')
  const sanitizedColor = sanitizeColor(style.color)
  const sanitizedHref = href ? sanitizeURL(href) : null

  const alignmentStyles: Record<string, string> = {
    'left': 'justify-content: flex-start;',
    'center': 'justify-content: center;',
    'right': 'justify-content: flex-end;',
  }

  // Simple SVG placeholder (circle with icon name)
  const iconSVG = `
    <svg width="${style.size}" height="${style.size}" viewBox="0 0 24 24" fill="none" stroke="${sanitizedColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 6v6l4 2"></path>
    </svg>
  `

  const iconHTML = sanitizedHref
    ? `<a href="${sanitizedHref}" target="${target || '_self'}" ${target === '_blank' ? 'rel="noopener noreferrer"' : ''}>${iconSVG}</a>`
    : iconSVG

  return `
    <div style="
      display: flex;
      ${alignmentStyles[style.alignment]}
      ${marginCSS}
    ">
      ${iconHTML}
    </div>
  `
}

/**
 * Renders a social media block
 */
function renderSocialMediaBlock(block: Block & { type: 'social' }): string {
  const { links, style } = block
  const marginCSS = spacingToCSS(style.margin, 'margin')

  const alignmentStyles: Record<string, string> = {
    'left': 'justify-content: flex-start;',
    'center': 'justify-content: center;',
    'right': 'justify-content: flex-end;',
  }

  // Simple SVG circles for social icons (in production, you'd use actual brand icons)
  const platformColors: Record<string, string> = {
    facebook: '#1877F2',
    twitter: '#1DA1F2',
    instagram: '#E4405F',
    linkedin: '#0A66C2',
    youtube: '#FF0000',
    tiktok: '#000000',
    github: '#181717',
    discord: '#5865F2',
  }

  const iconsHTML = links
    .map((link) => {
      const sanitizedUrl = sanitizeURL(link.url)
      if (!sanitizedUrl) return ''

      const color = style.useBrandColors ? (platformColors[link.platform] || '#000000') : (style.customColor || '#000000')
      const sanitizedColor = sanitizeColor(color)

      const iconSVG = `
        <svg width="${style.size}" height="${style.size}" viewBox="0 0 24 24" fill="${sanitizedColor}" stroke="none">
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      `

      return `
        <a href="${sanitizedUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; transition: opacity 0.2s;">
          ${iconSVG}
        </a>
      `
    })
    .join('')

  return `
    <div style="
      display: flex;
      flex-direction: ${style.layout === 'vertical' ? 'column' : 'row'};
      ${alignmentStyles[style.alignment]}
      align-items: center;
      gap: ${style.spacing}px;
      ${marginCSS}
    ">
      ${iconsHTML}
    </div>
  `
}

/**
 * Renders a testimonial block
 */
function renderTestimonialBlock(block: Block & { type: 'testimonial' }): string {
  const { quote, authorName, authorRole, authorImage, rating, style } = block
  const paddingCSS = spacingToCSS(style.padding, 'padding')
  const marginCSS = spacingToCSS(style.margin, 'margin')

  // Sanitize all inputs
  const sanitizedQuote = sanitizeHTML(quote)
  const sanitizedAuthorName = sanitizeText(authorName)
  const sanitizedAuthorRole = authorRole ? sanitizeText(authorRole) : null
  const sanitizedAuthorImage = authorImage ? sanitizeURL(authorImage) : null
  const sanitizedBgColor = sanitizeColor(style.backgroundColor)
  const sanitizedTextColor = sanitizeColor(style.textColor)
  const sanitizedAuthorColor = sanitizeColor(style.authorColor)
  const sanitizedRoleColor = sanitizeColor(style.roleColor)
  const sanitizedRatingColor = sanitizeColor(style.ratingColor)
  const sanitizedFontFamily = sanitizeFontFamily(style.fontFamily)
  const sanitizedBorderColor = style.borderColor ? sanitizeColor(style.borderColor) : '#e5e7eb'

  // Generate star rating HTML if enabled
  let ratingHTML = ''
  if (style.showRating && rating) {
    const stars = Array.from({ length: 5 }, (_, i) => {
      const filled = i < rating
      return `<span style="color: ${filled ? sanitizedRatingColor : '#d1d5db'}; font-size: 16px;">★</span>`
    }).join('')
    ratingHTML = `
      <div style="display: flex; gap: 4px; margin-bottom: 12px; justify-content: ${style.alignment === 'center' ? 'center' : style.alignment === 'right' ? 'flex-end' : 'flex-start'};">
        ${stars}
      </div>
    `
  }

  // Author image HTML if provided
  let authorImageHTML = ''
  if (sanitizedAuthorImage) {
    authorImageHTML = `
      <img
        src="${sanitizedAuthorImage}"
        alt="${sanitizedAuthorName}"
        style="
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        "
      />
    `
  }

  return `
    <div style="
      background-color: ${sanitizedBgColor};
      border-radius: ${style.borderRadius}px;
      ${paddingCSS}
      ${marginCSS}
      text-align: ${style.alignment};
      font-family: ${sanitizedFontFamily};
      ${style.borderWidth ? `border: ${style.borderWidth}px solid ${sanitizedBorderColor};` : ''}
      max-width: 600px;
      ${style.alignment === 'center' ? 'margin-left: auto; margin-right: auto;' : ''}
    ">
      <!-- Quote Icon -->
      <div style="font-size: 32px; color: ${sanitizedTextColor}; opacity: 0.2; margin-bottom: 8px;">"</div>

      <!-- Rating -->
      ${ratingHTML}

      <!-- Quote Text -->
      <p style="
        font-size: ${style.fontSize}px;
        color: ${sanitizedTextColor};
        margin-bottom: 16px;
        line-height: 1.6;
        font-style: italic;
      ">"${sanitizedQuote}"</p>

      <!-- Author Info -->
      <div style="
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 16px;
        justify-content: ${style.alignment === 'center' ? 'center' : style.alignment === 'right' ? 'flex-end' : 'flex-start'};
      ">
        ${authorImageHTML}
        <div style="text-align: ${style.alignment};">
          <div style="
            color: ${sanitizedAuthorColor};
            font-weight: 600;
            font-size: ${style.fontSize * 0.9}px;
            font-style: normal;
          ">${sanitizedAuthorName}</div>
          ${sanitizedAuthorRole ? `
            <div style="
              color: ${sanitizedRoleColor};
              font-size: ${style.fontSize * 0.8}px;
              opacity: 0.8;
              font-style: normal;
            ">${sanitizedAuthorRole}</div>
          ` : ''}
        </div>
      </div>
    </div>
  `
}

/**
 * Renders a feature card block
 */
function renderFeatureBlock(block: Block & { type: 'feature' }): string {
  const { iconName, title, description, style } = block
  const paddingCSS = spacingToCSS(style.padding, 'padding')
  const marginCSS = spacingToCSS(style.margin, 'margin')

  // Sanitize all inputs
  const sanitizedTitle = sanitizeHTML(title)
  const sanitizedDescription = sanitizeHTML(description)
  const sanitizedBgColor = sanitizeColor(style.backgroundColor)
  const sanitizedIconColor = sanitizeColor(style.iconColor)
  const sanitizedTitleColor = sanitizeColor(style.titleColor)
  const sanitizedDescriptionColor = sanitizeColor(style.descriptionColor)
  const sanitizedFontFamily = sanitizeFontFamily(style.fontFamily)
  const sanitizedBorderColor = style.borderColor ? sanitizeColor(style.borderColor) : '#e5e7eb'

  // Simple icon representation (in production, you'd use actual SVG icons)
  let iconHTML = ''
  if (style.showIcon) {
    iconHTML = `
      <div style="margin-bottom: 16px;">
        <svg width="${style.iconSize}" height="${style.iconSize}" viewBox="0 0 24 24" fill="none" stroke="${sanitizedIconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 6v6l4 2"></path>
        </svg>
      </div>
    `
  }

  return `
    <div style="
      background-color: ${sanitizedBgColor};
      border-radius: ${style.borderRadius}px;
      ${paddingCSS}
      ${marginCSS}
      text-align: ${style.alignment};
      font-family: ${sanitizedFontFamily};
      ${style.borderWidth ? `border: ${style.borderWidth}px solid ${sanitizedBorderColor};` : ''}
      display: flex;
      flex-direction: column;
      align-items: ${style.alignment === 'center' ? 'center' : style.alignment === 'right' ? 'flex-end' : 'flex-start'};
    ">
      <!-- Icon -->
      ${iconHTML}

      <!-- Title -->
      <h3 style="
        color: ${sanitizedTitleColor};
        font-size: ${style.titleSize}px;
        font-weight: ${style.titleWeight};
        margin-bottom: 12px;
        line-height: 1.3;
      ">${sanitizedTitle}</h3>

      <!-- Description -->
      <p style="
        color: ${sanitizedDescriptionColor};
        font-size: ${style.descriptionSize}px;
        line-height: 1.6;
      ">${sanitizedDescription}</p>
    </div>
  `
}

/**
 * Renders a pricing table block
 */
function renderPricingBlock(block: Block & { type: 'pricing' }): string {
  const { planName, price, currency, period, features, buttonText, buttonLink, highlighted, highlightLabel, style } = block
  const paddingCSS = spacingToCSS(style.padding, 'padding')
  const marginCSS = spacingToCSS(style.margin, 'margin')

  // Sanitize all inputs
  const sanitizedPlanName = sanitizeText(planName)
  const sanitizedPrice = sanitizeText(price)
  const sanitizedCurrency = sanitizeText(currency)
  const sanitizedPeriod = sanitizeText(period)
  const sanitizedButtonText = sanitizeText(buttonText)
  const sanitizedButtonLink = sanitizeURL(buttonLink) || '#'
  const sanitizedHighlightLabel = highlightLabel ? sanitizeText(highlightLabel) : null
  const sanitizedBgColor = sanitizeColor(style.backgroundColor)
  const sanitizedPlanNameColor = sanitizeColor(style.planNameColor)
  const sanitizedPriceColor = sanitizeColor(style.priceColor)
  const sanitizedPeriodColor = sanitizeColor(style.periodColor)
  const sanitizedFeaturesColor = sanitizeColor(style.featuresColor)
  const sanitizedHighlightColor = sanitizeColor(style.highlightColor)
  const sanitizedFontFamily = sanitizeFontFamily(style.fontFamily)
  const sanitizedBorderColor = style.borderColor ? sanitizeColor(style.borderColor) : '#e5e7eb'

  // Generate features list HTML
  const featuresHTML = features.map((feature) => {
    const sanitizedFeature = sanitizeText(feature)
    return `
      <div style="
        display: flex;
        align-items: flex-start;
        gap: 8px;
        margin-bottom: 8px;
        text-align: left;
        width: 100%;
        color: ${sanitizedFeaturesColor};
        font-size: ${style.featuresSize}px;
      ">
        <svg width="${style.featuresSize}" height="${style.featuresSize}" viewBox="0 0 24 24" fill="none" stroke="${highlighted ? sanitizedHighlightColor : '#10b981'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${sanitizedFeature}</span>
      </div>
    `
  }).join('')

  // Highlight badge HTML
  let highlightBadgeHTML = ''
  if (highlighted && sanitizedHighlightLabel) {
    highlightBadgeHTML = `
      <div style="
        position: absolute;
        top: -12px;
        right: 20px;
        background-color: ${sanitizedHighlightColor};
        color: #ffffff;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;
      ">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
        ${sanitizedHighlightLabel}
      </div>
    `
  }

  return `
    <div style="
      background-color: ${sanitizedBgColor};
      border-radius: ${style.borderRadius}px;
      ${paddingCSS}
      ${marginCSS}
      text-align: ${style.alignment};
      font-family: ${sanitizedFontFamily};
      ${style.borderWidth ? `border: ${style.borderWidth}px solid ${sanitizedBorderColor};` : ''}
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: ${style.alignment === 'center' ? 'center' : style.alignment === 'right' ? 'flex-end' : 'flex-start'};
      ${highlighted ? 'box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); transform: scale(1.05);' : ''}
      transition: transform 0.2s;
    ">
      <!-- Highlight Badge -->
      ${highlightBadgeHTML}

      <!-- Plan Name -->
      <h3 style="
        color: ${sanitizedPlanNameColor};
        font-size: ${style.planNameSize}px;
        font-weight: 600;
        margin-bottom: 8px;
      ">${sanitizedPlanName}</h3>

      <!-- Price -->
      <div style="
        display: flex;
        align-items: baseline;
        gap: 4px;
        margin-bottom: 16px;
        justify-content: ${style.alignment === 'center' ? 'center' : style.alignment === 'right' ? 'flex-end' : 'flex-start'};
      ">
        <span style="font-size: ${style.priceSize * 0.6}px; color: ${sanitizedPriceColor};">
          ${sanitizedCurrency}
        </span>
        <span style="color: ${sanitizedPriceColor}; font-size: ${style.priceSize}px; font-weight: 700;">
          ${sanitizedPrice}
        </span>
        <span style="color: ${sanitizedPeriodColor}; font-size: ${style.periodSize}px;">
          ${sanitizedPeriod}
        </span>
      </div>

      <!-- Features List -->
      <div style="width: 100%; margin-bottom: 16px;">
        ${featuresHTML}
      </div>

      <!-- CTA Button -->
      <a href="${sanitizedButtonLink}" style="
        background-color: ${highlighted ? sanitizedHighlightColor : '#3b82f6'};
        color: #ffffff;
        padding: 12px 24px;
        border-radius: 6px;
        border: none;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 16px;
        width: 100%;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        transition: opacity 0.2s;
      " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
        ${sanitizedButtonText}
      </a>
    </div>
  `
}

/**
 * Renders a form block
 */
function renderFormBlock(block: Block & { type: 'form' }): string {
  const { title, description, fields, submitButtonText, successMessage, style } = block
  const paddingCSS = spacingToCSS(style.padding, 'padding')
  const marginCSS = spacingToCSS(style.margin, 'margin')

  // Sanitize all inputs
  const sanitizedTitle = title ? sanitizeText(title) : null
  const sanitizedDescription = description ? sanitizeHTML(description) : null
  const sanitizedSubmitButtonText = sanitizeText(submitButtonText)
  const sanitizedSuccessMessage = sanitizeText(successMessage)
  const sanitizedBgColor = sanitizeColor(style.backgroundColor)
  const sanitizedLabelColor = sanitizeColor(style.labelColor)
  const sanitizedInputBgColor = sanitizeColor(style.inputBackgroundColor)
  const sanitizedInputBorderColor = sanitizeColor(style.inputBorderColor)
  const sanitizedInputTextColor = sanitizeColor(style.inputTextColor)
  const sanitizedButtonBgColor = sanitizeColor(style.buttonBackgroundColor)
  const sanitizedButtonTextColor = sanitizeColor(style.buttonTextColor)
  const sanitizedFontFamily = sanitizeFontFamily(style.fontFamily)

  // Generate form fields HTML
  const fieldsHTML = fields.map((field) => {
    const sanitizedLabel = sanitizeText(field.label)
    const sanitizedPlaceholder = field.placeholder ? sanitizeText(field.placeholder) : ''
    const requiredAttr = field.required ? 'required' : ''
    const requiredMark = field.required ? '<span style="color: #ef4444;"> *</span>' : ''

    const fieldContainerStyle = `margin-bottom: ${style.spacing}px;`
    const labelStyle = `
      color: ${sanitizedLabelColor};
      font-size: ${style.labelSize}px;
      font-weight: 600;
      margin-bottom: 8px;
      display: block;
    `
    const inputStyle = `
      background-color: ${sanitizedInputBgColor};
      border: 1px solid ${sanitizedInputBorderColor};
      color: ${sanitizedInputTextColor};
      border-radius: ${style.inputBorderRadius}px;
      padding: 12px 16px;
      font-size: 14px;
      width: 100%;
      font-family: ${sanitizedFontFamily};
      box-sizing: border-box;
    `
    const textareaStyle = `
      ${inputStyle}
      min-height: 120px;
      resize: vertical;
    `

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return `
          <div style="${fieldContainerStyle}">
            <label style="${labelStyle}">
              ${sanitizedLabel}${requiredMark}
            </label>
            <input
              type="${field.type}"
              name="${sanitizeText(field.id)}"
              placeholder="${sanitizedPlaceholder}"
              ${requiredAttr}
              style="${inputStyle}"
            />
          </div>
        `

      case 'textarea':
        return `
          <div style="${fieldContainerStyle}">
            <label style="${labelStyle}">
              ${sanitizedLabel}${requiredMark}
            </label>
            <textarea
              name="${sanitizeText(field.id)}"
              placeholder="${sanitizedPlaceholder}"
              ${requiredAttr}
              style="${textareaStyle}"
            ></textarea>
          </div>
        `

      case 'select':
        const selectOptions = (field.options || [])
          .map((option) => `<option value="${sanitizeText(option)}">${sanitizeText(option)}</option>`)
          .join('')
        return `
          <div style="${fieldContainerStyle}">
            <label style="${labelStyle}">
              ${sanitizedLabel}${requiredMark}
            </label>
            <select
              name="${sanitizeText(field.id)}"
              ${requiredAttr}
              style="${inputStyle}"
            >
              <option value="">Select an option</option>
              ${selectOptions}
            </select>
          </div>
        `

      case 'checkbox':
        const checkboxOptions = (field.options || [])
          .map((option) => {
            const sanitizedOption = sanitizeText(option)
            return `
              <label style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: ${sanitizedInputTextColor}; margin-bottom: 8px;">
                <input type="checkbox" name="${sanitizeText(field.id)}" value="${sanitizedOption}" />
                ${sanitizedOption}
              </label>
            `
          })
          .join('')
        return `
          <div style="${fieldContainerStyle}">
            <label style="${labelStyle}">
              ${sanitizedLabel}${requiredMark}
            </label>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${checkboxOptions}
            </div>
          </div>
        `

      case 'radio':
        const radioOptions = (field.options || [])
          .map((option) => {
            const sanitizedOption = sanitizeText(option)
            return `
              <label style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: ${sanitizedInputTextColor}; margin-bottom: 8px;">
                <input type="radio" name="${sanitizeText(field.id)}" value="${sanitizedOption}" ${requiredAttr} />
                ${sanitizedOption}
              </label>
            `
          })
          .join('')
        return `
          <div style="${fieldContainerStyle}">
            <label style="${labelStyle}">
              ${sanitizedLabel}${requiredMark}
            </label>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${radioOptions}
            </div>
          </div>
        `

      default:
        return ''
    }
  }).join('')

  return `
    <div style="
      background-color: ${sanitizedBgColor};
      border-radius: ${style.borderRadius}px;
      ${paddingCSS}
      ${marginCSS}
      font-family: ${sanitizedFontFamily};
    ">
      ${sanitizedTitle ? `
        <h3 style="
          font-size: 24px;
          font-weight: 700;
          color: ${sanitizedLabelColor};
          margin-bottom: 8px;
        ">${sanitizedTitle}</h3>
      ` : ''}

      ${sanitizedDescription ? `
        <p style="
          font-size: 14px;
          color: ${sanitizedInputTextColor};
          margin-bottom: ${style.spacing}px;
        ">${sanitizedDescription}</p>
      ` : ''}

      <form onsubmit="event.preventDefault(); this.style.display='none'; this.nextElementSibling.style.display='block';">
        ${fieldsHTML}

        <button
          type="submit"
          style="
            background-color: ${sanitizedButtonBgColor};
            color: ${sanitizedButtonTextColor};
            border-radius: ${style.buttonBorderRadius}px;
            padding: 12px 24px;
            border: none;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            font-family: ${sanitizedFontFamily};
            transition: opacity 0.2s;
          "
          onmouseover="this.style.opacity='0.9'"
          onmouseout="this.style.opacity='1'"
        >
          ${sanitizedSubmitButtonText}
        </button>
      </form>

      <div style="
        display: none;
        background-color: #10b981;
        color: #ffffff;
        padding: 12px 16px;
        border-radius: ${style.inputBorderRadius}px;
        text-align: center;
      ">
        ${sanitizedSuccessMessage}
      </div>
    </div>
  `
}

/**
 * Renders an accordion block
 */
function renderAccordionBlock(block: Block & { type: 'accordion' }): string {
  const { items, defaultExpandedIndex, style } = block
  const paddingCSS = spacingToCSS(style.padding, 'padding')
  const marginCSS = spacingToCSS(style.margin, 'margin')

  // Sanitize all inputs
  const sanitizedBgColor = sanitizeColor(style.backgroundColor)
  const sanitizedItemBgColor = sanitizeColor(style.itemBackgroundColor)
  const sanitizedExpandedBgColor = sanitizeColor(style.expandedItemBackgroundColor)
  const sanitizedItemBorderColor = sanitizeColor(style.itemBorderColor)
  const sanitizedTitleColor = sanitizeColor(style.titleColor)
  const sanitizedContentColor = sanitizeColor(style.contentColor)
  const sanitizedFontFamily = sanitizeFontFamily(style.fontFamily)

  // Generate unique ID for this accordion instance
  const accordionId = `accordion-${Math.random().toString(36).substr(2, 9)}`

  // Generate accordion items HTML
  const itemsHTML = items.map((item, index) => {
    const sanitizedTitle = sanitizeHTML(item.title)
    const sanitizedContent = sanitizeHTML(item.content)
    const itemId = `${accordionId}-item-${index}`
    const isDefaultExpanded = defaultExpandedIndex === index

    return `
      <div style="
        background-color: ${sanitizedItemBgColor};
        border: 1px solid ${sanitizedItemBorderColor};
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: ${index === items.length - 1 ? '0' : `${style.spacing}px`};
      " class="accordion-item">
        <div
          onclick="toggleAccordion('${itemId}')"
          style="
            color: ${sanitizedTitleColor};
            font-size: ${style.titleSize}px;
            font-weight: 600;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            user-select: none;
          "
        >
          <span>${sanitizedTitle}</span>
          <svg
            id="${itemId}-chevron"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="transition: transform 0.3s ease; transform: ${isDefaultExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        <div
          id="${itemId}-content"
          style="
            color: ${sanitizedContentColor};
            font-size: ${style.contentSize}px;
            padding: ${isDefaultExpanded ? '0 16px 16px 16px' : '0'};
            max-height: ${isDefaultExpanded ? '1000px' : '0'};
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s ease;
            line-height: 1.6;
          "
        >
          ${sanitizedContent}
        </div>
      </div>
    `
  }).join('')

  return `
    <div style="
      background-color: ${sanitizedBgColor};
      border-radius: ${style.borderRadius}px;
      ${paddingCSS}
      ${marginCSS}
      font-family: ${sanitizedFontFamily};
    ">
      ${itemsHTML}
    </div>

    <script>
    (function() {
      if (typeof window.toggleAccordion === 'undefined') {
        window.toggleAccordion = function(itemId) {
          const content = document.getElementById(itemId + '-content');
          const chevron = document.getElementById(itemId + '-chevron');
          const item = content.closest('.accordion-item');

          if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
            // Expand
            content.style.maxHeight = '1000px';
            content.style.padding = '0 16px 16px 16px';
            chevron.style.transform = 'rotate(180deg)';
            item.style.backgroundColor = '${sanitizedExpandedBgColor}';
          } else {
            // Collapse
            content.style.maxHeight = '0';
            content.style.padding = '0';
            chevron.style.transform = 'rotate(0deg)';
            item.style.backgroundColor = '${sanitizedItemBgColor}';
          }
        };
      }
    })();
    </script>
  `
}

function renderQuoteBlock(block: Block & { type: 'quote' }): string {
  const { quote, author, authorTitle, style } = block

  // Sanitize content
  const sanitizedQuote = sanitizeHTML(quote)
  const sanitizedAuthor = author ? sanitizeHTML(author) : ''
  const sanitizedAuthorTitle = authorTitle ? sanitizeHTML(authorTitle) : ''

  // Sanitize styles
  const sanitizedBgColor = sanitizeColor(style.backgroundColor)
  const sanitizedQuoteColor = sanitizeColor(style.quoteColor)
  const sanitizedAuthorColor = sanitizeColor(style.authorColor)
  const sanitizedQuoteMarkColor = sanitizeColor(style.quoteMarkColor || style.quoteColor)
  const sanitizedBorderColor = style.borderLeftColor ? sanitizeColor(style.borderLeftColor) : '#e5e7eb'
  const sanitizedFontFamily = sanitizeFontFamily(style.fontFamily)

  // Build CSS strings
  const paddingCSS = `padding: ${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px;`
  const marginCSS = `margin: ${style.margin.top}px ${style.margin.right}px ${style.margin.bottom}px ${style.margin.left}px;`
  const borderLeftCSS = style.borderLeftWidth
    ? `border-left: ${style.borderLeftWidth}px solid ${sanitizedBorderColor};`
    : ''

  // Quote marks HTML
  const quoteMarksHTML = style.showQuoteMarks
    ? `<span style="color: ${sanitizedQuoteMarkColor}; font-size: ${style.quoteSize * 1.5}px; opacity: 0.3; line-height: 1;">&ldquo;</span>`
    : ''
  const quoteMarksCloseHTML = style.showQuoteMarks
    ? `<span style="color: ${sanitizedQuoteMarkColor}; font-size: ${style.quoteSize * 1.5}px; opacity: 0.3; line-height: 1;">&rdquo;</span>`
    : ''

  // Author HTML
  const authorHTML = sanitizedAuthor
    ? `
      <div style="margin-top: 16px;">
        <p style="
          color: ${sanitizedAuthorColor};
          font-size: ${style.authorSize}px;
          font-weight: 600;
          margin: 0;
        ">&mdash; ${sanitizedAuthor}</p>
        ${sanitizedAuthorTitle ? `
          <p style="
            color: ${sanitizedAuthorColor};
            font-size: ${style.authorSize - 2}px;
            opacity: 0.8;
            margin: 4px 0 0 0;
          ">${sanitizedAuthorTitle}</p>
        ` : ''}
      </div>
    `
    : ''

  return `
    <div style="
      background-color: ${sanitizedBgColor};
      border-radius: ${style.borderRadius}px;
      ${paddingCSS}
      ${marginCSS}
      ${borderLeftCSS}
      text-align: ${style.alignment};
      font-family: ${sanitizedFontFamily};
      position: relative;
    ">
      <blockquote style="
        color: ${sanitizedQuoteColor};
        font-size: ${style.quoteSize}px;
        font-style: ${style.fontStyle};
        line-height: 1.6;
        margin: 0 0 16px 0;
        position: relative;
      ">
        ${quoteMarksHTML}${sanitizedQuote}${quoteMarksCloseHTML}
      </blockquote>
      ${authorHTML}
    </div>
  `
}

function renderStatsBlock(block: Block & { type: 'stats' }): string {
  const { items, style } = block

  // Sanitize styles
  const sanitizedBgColor = sanitizeColor(style.backgroundColor)
  const sanitizedLabelColor = sanitizeColor(style.labelColor)
  const sanitizedValueColor = sanitizeColor(style.valueColor)
  const sanitizedProgressBarColor = sanitizeColor(style.progressBarColor)
  const sanitizedProgressBarBgColor = sanitizeColor(style.progressBarBackgroundColor)
  const sanitizedFontFamily = sanitizeFontFamily(style.fontFamily)

  // Build CSS strings
  const paddingCSS = `padding: ${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px;`
  const marginCSS = `margin: ${style.margin.top}px ${style.margin.right}px ${style.margin.bottom}px ${style.margin.left}px;`

  const itemsHTML = items
    .map((item) => {
      const sanitizedLabel = sanitizeText(item.label)
      const sanitizedValue = item.value.toLocaleString()
      const sanitizedPrefix = item.prefix ? sanitizeText(item.prefix) : ''
      const sanitizedSuffix = item.suffix ? sanitizeText(item.suffix) : ''
      const percentage = item.maxValue ? (item.value / item.maxValue) * 100 : 100

      const progressBarHTML = item.showProgressBar
        ? `
          <div style="
            width: 100%;
            height: ${style.progressBarHeight}px;
            background-color: ${sanitizedProgressBarBgColor};
            border-radius: ${style.progressBarHeight / 2}px;
            overflow: hidden;
            margin-top: 12px;
          ">
            <div style="
              height: 100%;
              width: ${percentage}%;
              background-color: ${sanitizedProgressBarColor};
              border-radius: ${style.progressBarHeight / 2}px;
              transition: width 0.5s ease-in-out;
            "></div>
          </div>
        `
        : ''

      return `
        <div style="
          flex: ${style.layout === 'horizontal' ? '1 1 200px' : 'none'};
          min-width: ${style.layout === 'horizontal' ? '200px' : 'auto'};
        ">
          <div style="
            color: ${sanitizedLabelColor};
            font-size: ${style.labelSize}px;
            font-weight: 500;
            margin-bottom: 8px;
            text-align: ${style.alignment};
          ">${sanitizedLabel}</div>
          <div style="
            color: ${sanitizedValueColor};
            font-size: ${style.valueSize}px;
            font-weight: 700;
            margin-bottom: ${item.showProgressBar ? '12px' : '0'};
            text-align: ${style.alignment};
          ">
            <span style="font-size: ${style.valueSize * 0.6}px; margin-right: 4px;">📈</span>
            ${sanitizedPrefix}${sanitizedValue}${sanitizedSuffix}
          </div>
          ${progressBarHTML}
        </div>
      `
    })
    .join('')

  return `
    <div style="
      background-color: ${sanitizedBgColor};
      border-radius: ${style.borderRadius}px;
      ${paddingCSS}
      ${marginCSS}
      font-family: ${sanitizedFontFamily};
    ">
      <div style="
        display: flex;
        flex-direction: ${style.layout === 'vertical' ? 'column' : 'row'};
        gap: ${style.itemSpacing}px;
        flex-wrap: ${style.layout === 'horizontal' ? 'wrap' : 'nowrap'};
      ">
        ${itemsHTML}
      </div>
    </div>
  `
}

function renderTeamMemberBlock(block: Block & { type: 'team' }): string {
  const { name, role, bio, imageUrl, socialLinks, style } = block

  // Sanitize content
  const sanitizedName = sanitizeText(name)
  const sanitizedRole = sanitizeText(role)
  const sanitizedBio = bio ? sanitizeHTML(bio) : ''
  const sanitizedImageUrl = imageUrl ? sanitizeImageURL(imageUrl) : ''

  // Sanitize styles
  const sanitizedBgColor = sanitizeColor(style.backgroundColor)
  const sanitizedCardBgColor = sanitizeColor(style.cardBackgroundColor)
  const sanitizedNameColor = sanitizeColor(style.nameColor)
  const sanitizedRoleColor = sanitizeColor(style.roleColor)
  const sanitizedBioColor = sanitizeColor(style.bioColor)
  const sanitizedFontFamily = sanitizeFontFamily(style.fontFamily)
  const sanitizedBorderColor = style.cardBorderColor ? sanitizeColor(style.cardBorderColor) : '#e5e7eb'

  // Build CSS strings
  const paddingCSS = `padding: ${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px;`
  const marginCSS = `margin: ${style.margin.top}px ${style.margin.right}px ${style.margin.bottom}px ${style.margin.left}px;`
  const borderCSS = style.cardBorderWidth
    ? `border: ${style.cardBorderWidth}px solid ${sanitizedBorderColor};`
    : ''

  // Image HTML
  const imageHTML = sanitizedImageUrl
    ? `<img src="${sanitizedImageUrl}" alt="${sanitizedName}" style="
        width: ${style.imageSize}px;
        height: ${style.imageSize}px;
        border-radius: ${style.imageBorderRadius}px;
        object-fit: cover;
        margin-bottom: 16px;
      " />`
    : `<div style="
        width: ${style.imageSize}px;
        height: ${style.imageSize}px;
        border-radius: ${style.imageBorderRadius}px;
        background-color: #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${style.imageSize / 3}px;
        color: #9ca3af;
        font-weight: 700;
        margin-bottom: 16px;
      ">${sanitizedName.charAt(0).toUpperCase()}</div>`

  // Social icons mapping
  const getSocialIcon = (platform: string) => {
    const icons: Record<string, string> = {
      twitter: '🐦',
      linkedin: '💼',
      github: '🔧',
      email: '📧',
      website: '🌐',
    }
    return icons[platform] || '🌐'
  }

  // Social links HTML
  const socialLinksHTML = socialLinks.length > 0
    ? `<div style="display: flex; gap: 12px; margin-top: 8px;">
        ${socialLinks
          .map((link) => {
            const sanitizedUrl = sanitizeURL(link.url)
            if (!sanitizedUrl) return ''
            return `<a href="${sanitizedUrl}" target="_blank" rel="noopener noreferrer" style="
              color: ${sanitizedRoleColor};
              text-decoration: none;
              font-size: 20px;
              transition: opacity 0.2s;
            " onmouseover="this.style.opacity='0.6'" onmouseout="this.style.opacity='1'">${getSocialIcon(link.platform)}</a>`
          })
          .join('')}
      </div>`
    : ''

  // Bio HTML
  const bioHTML = sanitizedBio
    ? `<div style="
        color: ${sanitizedBioColor};
        font-size: ${style.bioSize}px;
        line-height: 1.6;
        margin-bottom: 16px;
      ">${sanitizedBio}</div>`
    : ''

  return `
    <div style="
      background-color: ${sanitizedBgColor};
      border-radius: ${style.borderRadius}px;
      ${paddingCSS}
      ${marginCSS}
      font-family: ${sanitizedFontFamily};
    ">
      <div style="
        background-color: ${sanitizedCardBgColor};
        ${borderCSS}
        border-radius: ${style.borderRadius}px;
        padding: 24px;
        text-align: ${style.alignment};
        display: flex;
        flex-direction: column;
        align-items: ${style.alignment === 'center' ? 'center' : style.alignment === 'right' ? 'flex-end' : 'flex-start'};
      ">
        ${imageHTML}
        <div style="
          color: ${sanitizedNameColor};
          font-size: ${style.nameSize}px;
          font-weight: 700;
          margin-bottom: 8px;
        ">${sanitizedName}</div>
        <div style="
          color: ${sanitizedRoleColor};
          font-size: ${style.roleSize}px;
          font-weight: 500;
          margin-bottom: ${bio ? '12px' : '16px'};
        ">${sanitizedRole}</div>
        ${bioHTML}
        ${socialLinksHTML}
      </div>
    </div>
  `
}

/**
 * Renders a gallery/carousel block with multiple images
 */
function renderGalleryBlock(block: Block & { type: 'gallery' }): string {
  const { images, style } = block

  if (images.length === 0) {
    return `<div style="
      padding: 40px;
      text-align: center;
      background-color: #f9fafb;
      border: 2px dashed #d1d5db;
      border-radius: ${style.borderRadius}px;
      color: #6b7280;
    ">No images in gallery</div>`
  }

  // Calculate aspect ratio padding
  const aspectRatioMap: Record<string, string> = {
    '16:9': '56.25%',
    '1:1': '100%',
    '4:3': '75%',
    '3:2': '66.67%',
    'auto': '0',
  }
  const aspectRatioPadding = aspectRatioMap[style.aspectRatio] || '56.25%'

  // Sanitize colors
  const sanitizedCaptionColor = sanitizeColor(style.captionColor)
  const sanitizedCaptionBgColor = sanitizeColor(style.captionBackgroundColor)
  const sanitizedFontFamily = sanitizeFontFamily(style.fontFamily)

  // Build CSS
  const paddingCSS = spacingToCSS(style.padding, 'padding')
  const marginCSS = spacingToCSS(style.margin, 'margin')

  // Since this is static HTML export, we'll just show all images stacked
  const imagesHTML = images.map((image, index) => {
    const sanitizedUrl = sanitizeImageURL(image.url)
    const sanitizedAlt = sanitizeText(image.alt || `Gallery image ${index + 1}`)
    const sanitizedCaption = image.caption ? sanitizeHTML(image.caption) : ''

    if (!sanitizedUrl) return ''

    const imageStyle = style.aspectRatio === 'auto'
      ? `width: 100%; height: auto;`
      : `position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: ${style.imageObjectFit};`

    const wrapperStyle = style.aspectRatio === 'auto'
      ? 'position: relative; width: 100%;'
      : `position: relative; width: 100%; padding-top: ${aspectRatioPadding};`

    const captionHTML = style.showCaptions && sanitizedCaption
      ? `<div style="
          background-color: ${sanitizedCaptionBgColor};
          color: ${sanitizedCaptionColor};
          font-size: ${style.captionSize}px;
          font-family: ${sanitizedFontFamily};
          padding: 12px 16px;
          text-align: center;
          ${style.aspectRatio !== 'auto' ? 'position: absolute; bottom: 0; left: 0; right: 0;' : 'margin-top: 8px;'}
        ">${sanitizedCaption}</div>`
      : ''

    return `
      <div style="
        ${wrapperStyle}
        background-color: #000;
        border-radius: ${style.borderRadius}px;
        overflow: hidden;
        margin-bottom: ${index < images.length - 1 ? '16px' : '0'};
      ">
        <img
          src="${sanitizedUrl}"
          alt="${sanitizedAlt}"
          style="${imageStyle} border-radius: ${style.borderRadius}px;"
        />
        ${captionHTML}
      </div>
    `
  }).join('')

  return `
    <div style="${paddingCSS} ${marginCSS}">
      <div style="border-radius: ${style.borderRadius}px; overflow: hidden;">
        ${imagesHTML}
      </div>
      <div style="
        text-align: center;
        margin-top: 12px;
        font-size: 12px;
        color: #9ca3af;
      ">Gallery with ${images.length} ${images.length === 1 ? 'image' : 'images'}</div>
    </div>
  `
}

/**
 * Renders a logo grid block
 */
function renderLogoGridBlock(block: Block & { type: 'logo-grid' }): string {
  const { logos, style } = block

  if (logos.length === 0) {
    return `<div style="
      padding: 40px;
      text-align: center;
      background-color: #f9fafb;
      border: 2px dashed #d1d5db;
      border-radius: ${style.borderRadius}px;
      color: #6b7280;
    ">No logos in grid</div>`
  }

  // Sanitize colors
  const sanitizedBgColor = sanitizeColor(style.backgroundColor)
  const sanitizedLogoBgColor = sanitizeColor(style.logoBackgroundColor)

  // Build CSS
  const paddingCSS = spacingToCSS(style.padding, 'padding')
  const marginCSS = spacingToCSS(style.margin, 'margin')

  // Build logos HTML
  const logosHTML = logos.map((logo) => {
    const sanitizedUrl = sanitizeImageURL(logo.imageUrl)
    const sanitizedAlt = sanitizeText(logo.alt || 'Logo')
    const sanitizedLink = logo.link ? sanitizeURL(logo.link) : null

    if (!sanitizedUrl) return ''

    const logoStyle = `
      max-height: ${style.logoSize}px;
      max-width: 100%;
      height: auto;
      width: auto;
      object-fit: contain;
      ${style.grayscale ? 'filter: grayscale(100%);' : ''}
      opacity: ${style.opacity};
      transition: all 0.3s ease;
    `

    const containerStyle = `
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background-color: ${sanitizedLogoBgColor};
      border-radius: ${style.borderRadius}px;
    `

    const imageElement = `<img src="${sanitizedUrl}" alt="${sanitizedAlt}" style="${logoStyle}" />`

    const logoElement = sanitizedLink
      ? `<a href="${sanitizedLink}" target="${logo.target || '_blank'}" style="text-decoration: none; display: flex; align-items: center; justify-content: center;">${imageElement}</a>`
      : imageElement

    return `<div style="${containerStyle}">${logoElement}</div>`
  }).join('')

  return `
    <div style="${paddingCSS} ${marginCSS} background-color: ${sanitizedBgColor};">
      <div style="
        display: grid;
        grid-template-columns: repeat(${style.columns}, 1fr);
        gap: ${style.gap}px;
        align-items: center;
        justify-items: ${style.alignment};
      ">
        ${logosHTML}
      </div>
    </div>
  `
}

/**
 * Renders an embed block
 */
function renderEmbedBlock(block: Block & { type: 'embed' }): string {
  const { embedUrl, embedType, title, allowFullScreen, style } = block

  // Sanitize the embed URL
  const safeUrl = sanitizeURL(embedUrl)

  if (!embedUrl || !safeUrl) {
    return `<div style="
      padding: 40px;
      text-align: center;
      background-color: #f9fafb;
      border: 2px dashed #d1d5db;
      border-radius: ${style.borderRadius}px;
      color: #6b7280;
    ">
      <div style="font-size: 48px; margin-bottom: 16px;">📍</div>
      <div style="font-size: 14px; font-weight: 500; margin-bottom: 8px;">
        ${embedType === 'map' ? 'Map Embed' : embedType === 'form' ? 'Form Embed' : embedType === 'calendar' ? 'Calendar Embed' : 'Custom Embed'}
      </div>
      <div style="font-size: 12px; color: #9ca3af;">
        Embed URL not configured
      </div>
    </div>`
  }

  // Calculate aspect ratio padding
  const aspectRatioMap: Record<string, string> = {
    '16:9': '56.25%',
    '4:3': '75%',
    '1:1': '100%',
    '21:9': '42.86%',
    'custom': '0',
  }
  const aspectRatioPadding = aspectRatioMap[style.aspectRatio] || '56.25%'

  // Build CSS
  const paddingCSS = spacingToCSS(style.padding, 'padding')
  const marginCSS = spacingToCSS(style.margin, 'margin')
  const sanitizedBgColor = sanitizeColor(style.backgroundColor)
  const sanitizedBorderColor = sanitizeColor(style.border.color)

  const borderCSS = style.border.style !== 'none'
    ? `border: ${style.border.width}px ${style.border.style} ${sanitizedBorderColor};`
    : 'border: none;'

  const wrapperStyle =
    style.aspectRatio === 'custom'
      ? `position: relative; width: ${style.width}; height: ${style.height}; border-radius: ${style.borderRadius}px; overflow: hidden; ${borderCSS}`
      : `position: relative; width: ${style.width}; padding-top: ${aspectRatioPadding}; border-radius: ${style.borderRadius}px; overflow: hidden; ${borderCSS}`

  const iframeStyle =
    style.aspectRatio === 'custom'
      ? 'width: 100%; height: 100%; border: none;'
      : 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;'

  const titleHTML = title
    ? `<div style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #1f2937;">${sanitizeText(title)}</div>`
    : ''

  return `
    <div style="${paddingCSS} ${marginCSS} background-color: ${sanitizedBgColor};">
      ${titleHTML}
      <div style="${wrapperStyle}">
        <iframe
          src="${safeUrl}"
          style="${iframeStyle}"
          ${allowFullScreen ? 'allowfullscreen' : ''}
          loading="lazy"
          title="${title ? sanitizeText(title) : `${embedType} embed`}"
        ></iframe>
      </div>
    </div>
  `
}

/**
 * Renders a newsletter signup block
 */
function renderNewsletterBlock(block: Block & { type: 'newsletter' }): string {
  const { heading, description, inputPlaceholder, buttonText, showPrivacyCheckbox, privacyText, style } = block

  // Build CSS
  const paddingCSS = spacingToCSS(style.padding, 'padding')
  const marginCSS = spacingToCSS(style.margin, 'margin')
  const sanitizedBgColor = sanitizeColor(style.backgroundColor)
  const sanitizedHeadingColor = sanitizeColor(style.headingColor)
  const sanitizedDescColor = sanitizeColor(style.descriptionColor)
  const sanitizedInputBgColor = sanitizeColor(style.inputBackgroundColor)
  const sanitizedInputTextColor = sanitizeColor(style.inputTextColor)
  const sanitizedInputBorderColor = sanitizeColor(style.inputBorderColor)
  const sanitizedButtonBgColor = sanitizeColor(style.buttonBackgroundColor)
  const sanitizedButtonTextColor = sanitizeColor(style.buttonTextColor)

  // Sanitize text content
  const sanitizedHeading = sanitizeHTML(heading)
  const sanitizedDescription = sanitizeHTML(description)
  const sanitizedInputPlaceholder = sanitizeText(inputPlaceholder)
  const sanitizedButtonText = sanitizeText(buttonText)
  const sanitizedPrivacyText = sanitizeHTML(privacyText)

  const headingHTML = heading
    ? `<h3 style="
        color: ${sanitizedHeadingColor};
        font-size: ${style.headingSize}px;
        font-weight: ${style.headingWeight};
        text-align: ${style.headingAlign};
        margin: 0 0 ${description ? style.gap : 0}px 0;
      ">${sanitizedHeading}</h3>`
    : ''

  const descriptionHTML = description
    ? `<p style="
        color: ${sanitizedDescColor};
        font-size: ${style.descriptionSize}px;
        text-align: ${style.descriptionAlign};
        margin: 0 0 ${style.gap}px 0;
      ">${sanitizedDescription}</p>`
    : ''

  const formStyle = style.layout === 'inline'
    ? `display: flex; flex-direction: row; gap: ${style.gap}px; align-items: center;`
    : `display: flex; flex-direction: column; gap: ${style.gap}px;`

  const inputStyle = `
    flex: ${style.layout === 'inline' ? '1' : 'none'};
    padding: ${style.inputPadding}px;
    background-color: ${sanitizedInputBgColor};
    color: ${sanitizedInputTextColor};
    border: ${style.inputBorderWidth}px solid ${sanitizedInputBorderColor};
    border-radius: ${style.inputBorderRadius}px;
    font-size: 14px;
    outline: none;
    font-family: inherit;
  `

  const buttonStyle = `
    padding: ${style.buttonPadding}px ${style.buttonPadding * 2}px;
    background-color: ${sanitizedButtonBgColor};
    color: ${sanitizedButtonTextColor};
    border: none;
    border-radius: ${style.buttonBorderRadius}px;
    font-size: ${style.buttonFontSize}px;
    font-weight: ${style.buttonFontWeight};
    cursor: pointer;
    white-space: nowrap;
    font-family: inherit;
  `

  const checkboxHTML = showPrivacyCheckbox
    ? `<div style="display: flex; align-items: flex-start; gap: 8px; margin-top: ${style.gap}px;">
        <input type="checkbox" required style="margin-top: 4px;" />
        <label style="font-size: 12px; color: ${sanitizedDescColor}; line-height: 1.5;">
          ${sanitizedPrivacyText}
        </label>
      </div>`
    : ''

  return `
    <div style="${paddingCSS} ${marginCSS} background-color: ${sanitizedBgColor}; border-radius: ${style.borderRadius}px;">
      ${headingHTML}
      ${descriptionHTML}
      <form style="${formStyle}" action="#" method="POST">
        <input
          type="email"
          name="email"
          placeholder="${sanitizedInputPlaceholder}"
          required
          style="${inputStyle}"
        />
        <button type="submit" style="${buttonStyle}">
          ${sanitizedButtonText}
        </button>
      </form>
      ${checkboxHTML}
    </div>
  `
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
    case 'divider':
      return renderDividerBlock(block)
    case 'icon':
      return renderIconBlock(block)
    case 'social':
      return renderSocialMediaBlock(block)
    case 'testimonial':
      return renderTestimonialBlock(block)
    case 'feature':
      return renderFeatureBlock(block)
    case 'pricing':
      return renderPricingBlock(block)
    case 'form':
      return renderFormBlock(block)
    case 'accordion':
      return renderAccordionBlock(block)
    case 'quote':
      return renderQuoteBlock(block)
    case 'stats':
      return renderStatsBlock(block)
    case 'team':
      return renderTeamMemberBlock(block)
    case 'gallery':
      return renderGalleryBlock(block)
    case 'logo-grid':
      return renderLogoGridBlock(block)
    case 'embed':
      return renderEmbedBlock(block)
    case 'newsletter':
      return renderNewsletterBlock(block)
    default:
      return ''
  }
}

/**
 * Renders a section with all its blocks
 */
function renderSection(section: Section): string {
  const { style, blocks, layout, columns } = section
  const paddingCSS = spacingToCSS(style.padding, 'padding')
  const marginCSS = spacingToCSS(style.margin, 'margin')

  // Sanitize section background color and background image
  const sanitizedBgColor = sanitizeColor(style.backgroundColor)
  const sanitizedBgImage = style.backgroundImage ? sanitizeURL(style.backgroundImage) : null

  const blocksHTML = blocks.map((block) => renderBlock(block)).join('')

  // Determine layout CSS based on layout type (with backward compatibility)
  const isGridLayout = layout === 'grid' && columns
  const layoutCSS = isGridLayout
    ? `
      display: grid;
      grid-template-columns: repeat(${columns}, 1fr);
      gap: ${style.rowGap ?? 16}px ${style.columnGap ?? 16}px;
    `
    : `
      display: flex;
      flex-direction: ${style.flex?.direction || 'column'};
      align-items: ${style.flex?.alignItems || 'stretch'};
      justify-content: ${style.flex?.justifyContent || 'flex-start'};
      flex-wrap: ${style.flex?.wrap || 'nowrap'};
      gap: ${style.rowGap ?? 0}px ${style.columnGap ?? 0}px;
    `

  return `
    <section style="
      background-color: ${sanitizedBgColor};
      ${sanitizedBgImage ? `background-image: url('${sanitizedBgImage}');` : ''}
      ${sanitizedBgImage && style.backgroundSize ? `background-size: ${style.backgroundSize};` : ''}
      ${sanitizedBgImage && style.backgroundPosition ? `background-position: ${style.backgroundPosition};` : ''}
      ${sanitizedBgImage && style.backgroundRepeat ? `background-repeat: ${style.backgroundRepeat};` : ''}
      ${paddingCSS}
      ${marginCSS}
      ${layoutCSS}
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
