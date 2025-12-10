/**
 * Default block and section creation helpers
 */

import { nanoid } from 'nanoid'
import type {
  Block,
  Section,
  TextBlock,
  ImageBlock,
  VideoBlock,
  ButtonBlock,
  CountdownBlock,
  FAQBlock,
  SpaceBlock,
  defaultSpacing,
  defaultSectionStyle,
} from '@/types/page-builder'

// ============================================
// BLOCK DEFAULTS
// ============================================

export function createDefaultTextBlock(): TextBlock {
  return {
    id: `block-${nanoid()}`,
    type: 'text',
    content: 'Enter your text here',
    style: {
      fontFamily: 'Arial, sans-serif',
      fontSize: 16,
      fontWeight: 400,
      fontStyle: 'normal',
      color: '#000000',
      backgroundColor: 'transparent',
      textAlign: 'left',
      padding: { top: 8, right: 8, bottom: 8, left: 8 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
  }
}

export function createDefaultImageBlock(): ImageBlock {
  return {
    id: `block-${nanoid()}`,
    type: 'image',
    src: 'https://placehold.co/600x400/e2e8f0/64748b?text=Add+Your+Image',
    alt: 'Placeholder image',
    style: {
      borderRadius: 0,
      objectFit: 'cover',
      width: '100%',
      height: 'auto',
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      margin: { top: 0, right: 0, bottom: 16, left: 0 },
    },
  }
}

export function createDefaultVideoBlock(): VideoBlock {
  return {
    id: `block-${nanoid()}`,
    type: 'video',
    url: '',
    source: 'youtube',
    style: {
      aspectRatio: '16:9',
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      margin: { top: 0, right: 0, bottom: 16, left: 0 },
    },
  }
}

export function createDefaultButtonBlock(): ButtonBlock {
  return {
    id: `block-${nanoid()}`,
    type: 'button',
    text: 'Click me',
    href: '#',
    target: '_self',
    style: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 600,
      fontFamily: 'Arial, sans-serif',
      borderRadius: 6,
      layout: 'inline',
      padding: { top: 12, right: 24, bottom: 12, left: 24 },
      margin: { top: 0, right: 0, bottom: 16, left: 0 },
    },
  }
}

export function createDefaultCountdownBlock(): CountdownBlock {
  // Set default to 7 days from now
  const defaultDate = new Date()
  defaultDate.setDate(defaultDate.getDate() + 7)

  return {
    id: `block-${nanoid()}`,
    type: 'countdown',
    targetDate: defaultDate.toISOString(),
    label: 'Time remaining',
    displayFormat: 'dhms',
    style: {
      fontSize: 32,
      fontWeight: 700,
      fontFamily: 'Arial, sans-serif',
      color: '#000000',
      labelColor: '#666666',
      backgroundColor: 'transparent',
      padding: { top: 16, right: 16, bottom: 16, left: 16 },
      margin: { top: 0, right: 0, bottom: 16, left: 0 },
    },
  }
}

export function createDefaultFAQBlock(): FAQBlock {
  return {
    id: `block-${nanoid()}`,
    type: 'faq',
    items: [
      {
        id: `faq-${nanoid()}`,
        question: 'What is this product?',
        answer: 'This is a sample answer. Edit to add your own content.',
      },
      {
        id: `faq-${nanoid()}`,
        question: 'How does it work?',
        answer: 'This is a sample answer. Edit to add your own content.',
      },
    ],
    style: {
      fontSize: 16,
      fontWeight: 400,
      fontFamily: 'Arial, sans-serif',
      questionColor: '#000000',
      answerColor: '#666666',
      backgroundColor: 'transparent',
      padding: { top: 16, right: 16, bottom: 16, left: 16 },
      margin: { top: 0, right: 0, bottom: 16, left: 0 },
    },
  }
}

export function createDefaultSpaceBlock(): SpaceBlock {
  return {
    id: `block-${nanoid()}`,
    type: 'space',
    height: 40,
  }
}

// ============================================
// SECTION DEFAULTS
// ============================================

export function createDefaultSection(blocks: Block[] = []): Section {
  return {
    id: `section-${nanoid()}`,
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 32, right: 16, bottom: 32, left: 16 },
      margin: { top: 0, right: 0, bottom: 24, left: 0 },
      flex: {
        direction: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        wrap: 'nowrap',
      },
    },
    blocks,
  }
}

export function createTwoColumnSection(): Section {
  return {
    id: `section-${nanoid()}`,
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 32, right: 16, bottom: 32, left: 16 },
      margin: { top: 0, right: 0, bottom: 24, left: 0 },
      flex: {
        direction: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        wrap: 'wrap',
      },
    },
    blocks: [],
  }
}

export function createThreeColumnSection(): Section {
  return {
    id: `section-${nanoid()}`,
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 32, right: 16, bottom: 32, left: 16 },
      margin: { top: 0, right: 0, bottom: 24, left: 0 },
      flex: {
        direction: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        wrap: 'wrap',
      },
    },
    blocks: [],
  }
}

// ============================================
// PRE-DEFINED SECTION TEMPLATES
// ============================================

export function createHeroSection(): Section {
  return {
    id: `section-${nanoid()}`,
    style: {
      backgroundColor: '#1e40af',
      padding: { top: 80, right: 16, bottom: 80, left: 16 },
      margin: { top: 0, right: 0, bottom: 24, left: 0 },
      flex: {
        direction: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        wrap: 'nowrap',
      },
    },
    blocks: [
      {
        id: `block-${nanoid()}`,
        type: 'text',
        content: 'Welcome to Our Amazing Product',
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 48,
          fontWeight: 700,
          fontStyle: 'normal',
          color: '#ffffff',
          backgroundColor: 'transparent',
          textAlign: 'center',
          padding: { top: 0, right: 16, bottom: 16, left: 16 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      },
      {
        id: `block-${nanoid()}`,
        type: 'text',
        content: 'Transform your business with our innovative solutions',
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 20,
          fontWeight: 400,
          fontStyle: 'normal',
          color: '#e0e7ff',
          backgroundColor: 'transparent',
          textAlign: 'center',
          padding: { top: 0, right: 16, bottom: 24, left: 16 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      },
      {
        id: `block-${nanoid()}`,
        type: 'button',
        text: 'Get Started',
        href: '#',
        target: '_self',
        style: {
          backgroundColor: '#ffffff',
          color: '#1e40af',
          fontSize: 18,
          fontWeight: 600,
          fontFamily: 'Arial, sans-serif',
          borderRadius: 8,
          layout: 'center',
          padding: { top: 16, right: 32, bottom: 16, left: 32 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      },
    ],
  }
}

export function createProductsSection(): Section {
  return {
    id: `section-${nanoid()}`,
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 64, right: 16, bottom: 64, left: 16 },
      margin: { top: 0, right: 0, bottom: 24, left: 0 },
      flex: {
        direction: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        wrap: 'nowrap',
      },
    },
    blocks: [
      {
        id: `block-${nanoid()}`,
        type: 'text',
        content: 'Our Products & Services',
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 36,
          fontWeight: 700,
          fontStyle: 'normal',
          color: '#1f2937',
          backgroundColor: 'transparent',
          textAlign: 'center',
          padding: { top: 0, right: 16, bottom: 32, left: 16 },
          margin: { top: 0, right: 0, bottom: 24, left: 0 },
        },
      },
      {
        id: `block-${nanoid()}`,
        type: 'text',
        content: 'Discover our range of solutions designed to help your business grow',
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 16,
          fontWeight: 400,
          fontStyle: 'normal',
          color: '#6b7280',
          backgroundColor: 'transparent',
          textAlign: 'center',
          padding: { top: 0, right: 16, bottom: 16, left: 16 },
          margin: { top: 0, right: 0, bottom: 48, left: 0 },
        },
      },
    ],
  }
}

export function createTestimonialSection(): Section {
  return {
    id: `section-${nanoid()}`,
    style: {
      backgroundColor: '#f9fafb',
      padding: { top: 64, right: 16, bottom: 64, left: 16 },
      margin: { top: 0, right: 0, bottom: 24, left: 0 },
      flex: {
        direction: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        wrap: 'nowrap',
      },
    },
    blocks: [
      {
        id: `block-${nanoid()}`,
        type: 'text',
        content: 'What Our Customers Say',
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 36,
          fontWeight: 700,
          fontStyle: 'normal',
          color: '#1f2937',
          backgroundColor: 'transparent',
          textAlign: 'center',
          padding: { top: 0, right: 16, bottom: 32, left: 16 },
          margin: { top: 0, right: 0, bottom: 48, left: 0 },
        },
      },
      {
        id: `block-${nanoid()}`,
        type: 'text',
        content: '"This product has completely transformed how we work. Highly recommended!"',
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 20,
          fontWeight: 400,
          fontStyle: 'italic',
          color: '#374151',
          backgroundColor: 'transparent',
          textAlign: 'center',
          padding: { top: 24, right: 32, bottom: 16, left: 32 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      },
      {
        id: `block-${nanoid()}`,
        type: 'text',
        content: '- Sarah Johnson, CEO at TechCorp',
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 14,
          fontWeight: 600,
          fontStyle: 'normal',
          color: '#6b7280',
          backgroundColor: 'transparent',
          textAlign: 'center',
          padding: { top: 0, right: 16, bottom: 16, left: 16 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      },
    ],
  }
}

export function createWhyChooseUsSection(): Section {
  return {
    id: `section-${nanoid()}`,
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 64, right: 16, bottom: 64, left: 16 },
      margin: { top: 0, right: 0, bottom: 24, left: 0 },
      flex: {
        direction: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        wrap: 'nowrap',
      },
    },
    blocks: [
      {
        id: `block-${nanoid()}`,
        type: 'text',
        content: 'Why Choose Us',
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 36,
          fontWeight: 700,
          fontStyle: 'normal',
          color: '#1f2937',
          backgroundColor: 'transparent',
          textAlign: 'center',
          padding: { top: 0, right: 16, bottom: 32, left: 16 },
          margin: { top: 0, right: 0, bottom: 48, left: 0 },
        },
      },
      {
        id: `block-${nanoid()}`,
        type: 'text',
        content: '✓ Industry-leading expertise with 10+ years of experience',
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 18,
          fontWeight: 400,
          fontStyle: 'normal',
          color: '#374151',
          backgroundColor: 'transparent',
          textAlign: 'left',
          padding: { top: 12, right: 16, bottom: 12, left: 16 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      },
      {
        id: `block-${nanoid()}`,
        type: 'text',
        content: '✓ 24/7 customer support to help you succeed',
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 18,
          fontWeight: 400,
          fontStyle: 'normal',
          color: '#374151',
          backgroundColor: 'transparent',
          textAlign: 'left',
          padding: { top: 12, right: 16, bottom: 12, left: 16 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      },
      {
        id: `block-${nanoid()}`,
        type: 'text',
        content: '✓ Trusted by over 10,000 businesses worldwide',
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 18,
          fontWeight: 400,
          fontStyle: 'normal',
          color: '#374151',
          backgroundColor: 'transparent',
          textAlign: 'left',
          padding: { top: 12, right: 16, bottom: 12, left: 16 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      },
    ],
  }
}

export function createContactSection(): Section {
  return {
    id: `section-${nanoid()}`,
    style: {
      backgroundColor: '#1f2937',
      padding: { top: 64, right: 16, bottom: 64, left: 16 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: {
        direction: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        wrap: 'nowrap',
      },
    },
    blocks: [
      {
        id: `block-${nanoid()}`,
        type: 'text',
        content: 'Get In Touch',
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 36,
          fontWeight: 700,
          fontStyle: 'normal',
          color: '#ffffff',
          backgroundColor: 'transparent',
          textAlign: 'center',
          padding: { top: 0, right: 16, bottom: 24, left: 16 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      },
      {
        id: `block-${nanoid()}`,
        type: 'text',
        content: 'Ready to start your journey? Contact us today and let\'s discuss how we can help.',
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 18,
          fontWeight: 400,
          fontStyle: 'normal',
          color: '#d1d5db',
          backgroundColor: 'transparent',
          textAlign: 'center',
          padding: { top: 0, right: 16, bottom: 32, left: 16 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      },
      {
        id: `block-${nanoid()}`,
        type: 'button',
        text: 'Contact Us',
        href: '#',
        target: '_self',
        style: {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          fontSize: 18,
          fontWeight: 600,
          fontFamily: 'Arial, sans-serif',
          borderRadius: 8,
          layout: 'center',
          padding: { top: 16, right: 32, bottom: 16, left: 32 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      },
    ],
  }
}

// ============================================
// FACTORY FUNCTION
// ============================================

export function createBlock(type: Block['type']): Block {
  switch (type) {
    case 'text':
      return createDefaultTextBlock()
    case 'image':
      return createDefaultImageBlock()
    case 'video':
      return createDefaultVideoBlock()
    case 'button':
      return createDefaultButtonBlock()
    case 'countdown':
      return createDefaultCountdownBlock()
    case 'faq':
      return createDefaultFAQBlock()
    case 'space':
      return createDefaultSpaceBlock()
    default:
      throw new Error(`Unknown block type: ${type}`)
  }
}
