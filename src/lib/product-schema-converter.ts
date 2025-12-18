/**
 * Product Schema to Page Builder Converter
 * Converts e-commerce product JSON to our page builder schema
 */

import { nanoid } from 'nanoid'
import type { PageData, Section, TextBlock } from '@/types/page-builder'

interface ProductSchema {
  hero: {
    headline: string
    subheadline: string
    cta_text: string
    media_type: 'image' | 'video'
    media_url: string
  }
  variants?: Array<{
    id: string
    label: string
    price: number
  }>
  products?: {
    bump?: {
      id: string
      label: string
      price: number
    }
    upsell?: {
      id: string
      label: string
      price: number
    }
  }
  upsell_page?: {
    headline: string
    subheadline: string
    image_url: string
    cta_yes: string
    cta_no: string
  }
  reviews?: Array<{
    author: string
    text: string
  }>
  faq?: Array<{
    q: string
    a: string
  }>
  theme?: {
    primary?: string
    bg?: string
    text?: string
    light_bg?: string
    font_heading?: string
    font_body?: string
    radius?: string
  }
}

export function convertProductSchemaToPageBuilder(
  productData: ProductSchema,
  pageName: string = 'Imported Product Page'
): PageData {
  const sections: Section[] = []
  const theme = productData.theme || {}

  // Extract theme colors with defaults
  const primaryColor = theme.primary || '#3b82f6'
  const bgColor = theme.bg || '#ffffff'
  const textColor = theme.text || '#000000'
  const lightBgColor = theme.light_bg || '#f9fafb'
  const headingFont = theme.font_heading || 'Arial, sans-serif'
  const bodyFont = theme.font_body || 'Arial, sans-serif'

  // 1. Hero Section
  if (productData.hero) {
    sections.push({
      id: `section-${nanoid()}`,
      style: {
        backgroundColor: bgColor,
        padding: { top: 80, right: 16, bottom: 80, left: 16 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        flex: {
          direction: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          wrap: 'nowrap',
        },
      },
      blocks: [
        // Media (Image/Video)
        productData.hero.media_type === 'image'
          ? {
              id: `block-${nanoid()}`,
              type: 'image' as const,
              src: productData.hero.media_url,
              alt: productData.hero.headline,
              style: {
                borderRadius: 8,
                objectFit: 'cover' as const,
                width: '100%',
                height: 'auto',
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
                margin: { top: 0, right: 0, bottom: 32, left: 0 },
              },
            }
          : {
              id: `block-${nanoid()}`,
              type: 'video' as const,
              url: productData.hero.media_url,
              source: 'youtube' as const,
              style: {
                aspectRatio: '16:9' as const,
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
                margin: { top: 0, right: 0, bottom: 32, left: 0 },
              },
            },
        // Headline
        {
          id: `block-${nanoid()}`,
          type: 'text' as const,
          content: productData.hero.headline,
          style: {
            fontFamily: headingFont,
            fontSize: 48,
            fontWeight: 800,
            fontStyle: 'normal' as const,
            color: textColor,
            backgroundColor: 'transparent',
            textAlign: 'center' as const,
            padding: { top: 0, right: 16, bottom: 16, left: 16 },
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
          },
        },
        // Subheadline
        {
          id: `block-${nanoid()}`,
          type: 'text' as const,
          content: productData.hero.subheadline,
          style: {
            fontFamily: bodyFont,
            fontSize: 20,
            fontWeight: 400,
            fontStyle: 'normal' as const,
            color: textColor,
            backgroundColor: 'transparent',
            textAlign: 'center' as const,
            padding: { top: 0, right: 16, bottom: 24, left: 16 },
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
          },
        },
        // CTA Button
        {
          id: `block-${nanoid()}`,
          type: 'button' as const,
          text: productData.hero.cta_text,
          href: '#order',
          target: '_self' as const,
          style: {
            backgroundColor: primaryColor,
            color: '#ffffff',
            fontSize: 18,
            fontWeight: 600,
            fontFamily: bodyFont,
            borderRadius: 8,
            layout: 'center' as const,
            padding: { top: 16, right: 32, bottom: 16, left: 32 },
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
          },
        },
      ],
    })
  }

  // 2. Product Variants Section
  if (productData.variants && productData.variants.length > 0) {
    const variantBlocks = [
      {
        id: `block-${nanoid()}`,
        type: 'text' as const,
        content: 'Choose Your Package',
        style: {
          fontFamily: headingFont,
          fontSize: 36,
          fontWeight: 700,
          fontStyle: 'normal' as const,
          color: textColor,
          backgroundColor: 'transparent',
          textAlign: 'center' as const,
          padding: { top: 0, right: 16, bottom: 32, left: 16 },
          margin: { top: 0, right: 0, bottom: 24, left: 0 },
        },
      },
    ]

    // Add each variant as a text block (in future, use PricingTableBlock)
    productData.variants.forEach((variant) => {
      variantBlocks.push({
        id: `block-${nanoid()}`,
        type: 'text' as const,
        content: `<strong>${variant.label}</strong><br/>RM ${variant.price.toFixed(2)}`,
        style: {
          fontFamily: bodyFont,
          fontSize: 18,
          fontWeight: 400,
          fontStyle: 'normal' as const,
          color: textColor,
          backgroundColor: lightBgColor,
          textAlign: 'center' as const,
          padding: { top: 16, right: 24, bottom: 16, left: 24 },
          margin: { top: 0, right: 8, bottom: 16, left: 8 },
        },
      })
    })

    sections.push({
      id: `section-${nanoid()}`,
      style: {
        backgroundColor: bgColor,
        padding: { top: 64, right: 16, bottom: 64, left: 16 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        flex: {
          direction: 'column' as const,
          alignItems: 'stretch' as const,
          justifyContent: 'flex-start' as const,
          wrap: 'nowrap' as const,
        },
      },
      blocks: variantBlocks,
    })
  }

  // 3. Reviews/Testimonials Section
  if (productData.reviews && productData.reviews.length > 0) {
    const reviewBlocks: TextBlock[] = [
      {
        id: `block-${nanoid()}`,
        type: 'text' as const,
        content: 'What Our Customers Say',
        style: {
          fontFamily: headingFont,
          fontSize: 36,
          fontWeight: 700,
          fontStyle: 'normal' as const,
          color: textColor,
          backgroundColor: 'transparent',
          textAlign: 'center' as const,
          padding: { top: 0, right: 16, bottom: 32, left: 16 },
          margin: { top: 0, right: 0, bottom: 48, left: 0 },
        },
      },
    ]

    // Add each review (in future, use TestimonialBlock)
    productData.reviews.forEach((review) => {
      reviewBlocks.push(
        {
          id: `block-${nanoid()}`,
          type: 'text' as const,
          content: `"${review.text}"`,
          style: {
            fontFamily: bodyFont,
            fontSize: 18,
            fontWeight: 400,
            fontStyle: 'italic' as const,
            color: textColor,
            backgroundColor: 'transparent',
            textAlign: 'center' as const,
            padding: { top: 16, right: 24, bottom: 8, left: 24 },
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
          },
        },
        {
          id: `block-${nanoid()}`,
          type: 'text' as const,
          content: `- ${review.author}`,
          style: {
            fontFamily: bodyFont,
            fontSize: 14,
            fontWeight: 600,
            fontStyle: 'normal' as const,
            color: textColor,
            backgroundColor: 'transparent',
            textAlign: 'center' as const,
            padding: { top: 0, right: 16, bottom: 24, left: 16 },
            margin: { top: 0, right: 0, bottom: 16, left: 0 },
          },
        }
      )
    })

    sections.push({
      id: `section-${nanoid()}`,
      style: {
        backgroundColor: lightBgColor,
        padding: { top: 64, right: 16, bottom: 64, left: 16 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        flex: {
          direction: 'column' as const,
          alignItems: 'stretch' as const,
          justifyContent: 'flex-start' as const,
          wrap: 'nowrap' as const,
        },
      },
      blocks: reviewBlocks,
    })
  }

  // 4. FAQ Section
  if (productData.faq && productData.faq.length > 0) {
    sections.push({
      id: `section-${nanoid()}`,
      style: {
        backgroundColor: bgColor,
        padding: { top: 64, right: 16, bottom: 64, left: 16 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        flex: {
          direction: 'column' as const,
          alignItems: 'stretch' as const,
          justifyContent: 'flex-start' as const,
          wrap: 'nowrap' as const,
        },
      },
      blocks: [
        {
          id: `block-${nanoid()}`,
          type: 'text' as const,
          content: 'Frequently Asked Questions',
          style: {
            fontFamily: headingFont,
            fontSize: 36,
            fontWeight: 700,
            fontStyle: 'normal' as const,
            color: textColor,
            backgroundColor: 'transparent',
            textAlign: 'center' as const,
            padding: { top: 0, right: 16, bottom: 32, left: 16 },
            margin: { top: 0, right: 0, bottom: 24, left: 0 },
          },
        },
        {
          id: `block-${nanoid()}`,
          type: 'faq' as const,
          items: productData.faq.map((item) => ({
            id: `faq-${nanoid()}`,
            question: item.q,
            answer: item.a,
          })),
          style: {
            fontSize: 16,
            fontWeight: 400,
            fontFamily: bodyFont,
            questionColor: textColor,
            answerColor: textColor,
            backgroundColor: 'transparent',
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
          },
        },
      ],
    })
  }

  // 5. Upsell Section (if exists)
  if (productData.upsell_page) {
    sections.push({
      id: `section-${nanoid()}`,
      style: {
        backgroundColor: primaryColor,
        padding: { top: 64, right: 16, bottom: 64, left: 16 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        flex: {
          direction: 'column' as const,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          wrap: 'nowrap' as const,
        },
      },
      blocks: [
        {
          id: `block-${nanoid()}`,
          type: 'text' as const,
          content: productData.upsell_page.headline,
          style: {
            fontFamily: headingFont,
            fontSize: 36,
            fontWeight: 700,
            fontStyle: 'normal' as const,
            color: '#ffffff',
            backgroundColor: 'transparent',
            textAlign: 'center' as const,
            padding: { top: 0, right: 16, bottom: 16, left: 16 },
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
          },
        },
        {
          id: `block-${nanoid()}`,
          type: 'text' as const,
          content: productData.upsell_page.subheadline,
          style: {
            fontFamily: bodyFont,
            fontSize: 18,
            fontWeight: 400,
            fontStyle: 'normal' as const,
            color: '#ffffff',
            backgroundColor: 'transparent',
            textAlign: 'center' as const,
            padding: { top: 0, right: 16, bottom: 24, left: 16 },
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
          },
        },
        {
          id: `block-${nanoid()}`,
          type: 'image' as const,
          src: productData.upsell_page.image_url,
          alt: productData.upsell_page.headline,
          style: {
            borderRadius: 8,
            objectFit: 'cover' as const,
            width: '400px',
            height: 'auto',
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
            margin: { top: 0, right: 0, bottom: 24, left: 0 },
          },
        },
        {
          id: `block-${nanoid()}`,
          type: 'button' as const,
          text: productData.upsell_page.cta_yes,
          href: '#add-upsell',
          target: '_self' as const,
          style: {
            backgroundColor: '#ffffff',
            color: primaryColor,
            fontSize: 18,
            fontWeight: 600,
            fontFamily: bodyFont,
            borderRadius: 8,
            layout: 'center' as const,
            padding: { top: 16, right: 32, bottom: 16, left: 32 },
            margin: { top: 0, right: 0, bottom: 16, left: 0 },
          },
        },
        {
          id: `block-${nanoid()}`,
          type: 'text' as const,
          content: productData.upsell_page.cta_no,
          style: {
            fontFamily: bodyFont,
            fontSize: 14,
            fontWeight: 400,
            fontStyle: 'normal' as const,
            color: '#ffffff',
            backgroundColor: 'transparent',
            textAlign: 'center' as const,
            padding: { top: 8, right: 16, bottom: 0, left: 16 },
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
          },
        },
      ],
    })
  }

  return {
    id: `page-${nanoid()}`,
    name: pageName,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
