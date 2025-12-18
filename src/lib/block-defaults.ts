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
  DividerBlock,
  IconBlock,
  SocialMediaBlock,
  TestimonialBlock,
  FeatureBlock,
  PricingBlock,
  FormBlock,
  FormField,
  AccordionBlock,
  AccordionItem,
  QuoteBlock,
  StatsBlock,
  StatItem,
  TeamMemberBlock,
  TeamMemberSocialLink,
  GalleryBlock,
  GalleryImage,
  LogoGridBlock,
  LogoItem,
  EmbedBlock,
  NewsletterBlock,
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

export function createDefaultDividerBlock(): DividerBlock {
  return {
    id: `block-${nanoid()}`,
    type: 'divider',
    style: {
      width: '100%',
      height: 1,
      color: '#e5e7eb',
      style: 'solid',
      margin: { top: 16, right: 0, bottom: 16, left: 0 },
    },
  }
}

export function createDefaultIconBlock(): IconBlock {
  return {
    id: `block-${nanoid()}`,
    type: 'icon',
    iconName: 'Heart',
    style: {
      size: 48,
      color: '#3b82f6',
      alignment: 'center',
      margin: { top: 16, right: 0, bottom: 16, left: 0 },
    },
  }
}

export function createDefaultSocialMediaBlock(): SocialMediaBlock {
  return {
    id: `block-${nanoid()}`,
    type: 'social',
    links: [
      { platform: 'facebook', url: 'https://facebook.com' },
      { platform: 'twitter', url: 'https://twitter.com' },
      { platform: 'instagram', url: 'https://instagram.com' },
    ],
    style: {
      size: 32,
      layout: 'horizontal',
      alignment: 'center',
      spacing: 16,
      useBrandColors: true,
      margin: { top: 16, right: 0, bottom: 16, left: 0 },
    },
  }
}

export function createDefaultTestimonialBlock(): TestimonialBlock {
  return {
    id: `block-${nanoid()}`,
    type: 'testimonial',
    quote: 'This product completely transformed my business! The results were beyond my expectations.',
    authorName: 'Jane Doe',
    authorRole: 'CEO, Company Inc.',
    rating: 5,
    style: {
      backgroundColor: '#f9fafb',
      borderRadius: 8,
      padding: { top: 24, right: 24, bottom: 24, left: 24 },
      margin: { top: 16, right: 0, bottom: 16, left: 0 },
      textColor: '#1f2937',
      authorColor: '#111827',
      roleColor: '#6b7280',
      fontSize: 16,
      fontFamily: 'Arial, sans-serif',
      alignment: 'left',
      showRating: true,
      ratingColor: '#fbbf24',
      borderWidth: 1,
      borderColor: '#e5e7eb',
    },
  }
}

export function createDefaultFeatureBlock(): FeatureBlock {
  return {
    id: `block-${nanoid()}`,
    type: 'feature',
    iconName: 'Zap',
    title: 'Amazing Feature',
    description: 'This feature will help you achieve your goals faster and more efficiently than ever before.',
    style: {
      backgroundColor: '#ffffff',
      borderRadius: 8,
      padding: { top: 24, right: 24, bottom: 24, left: 24 },
      margin: { top: 16, right: 0, bottom: 16, left: 0 },
      iconColor: '#3b82f6',
      iconSize: 48,
      titleColor: '#111827',
      titleSize: 20,
      titleWeight: 600,
      descriptionColor: '#6b7280',
      descriptionSize: 14,
      fontFamily: 'Arial, sans-serif',
      alignment: 'left',
      borderWidth: 1,
      borderColor: '#e5e7eb',
      showIcon: true,
    },
  }
}

export function createDefaultPricingBlock(): PricingBlock {
  return {
    id: `block-${nanoid()}`,
    type: 'pricing',
    planName: 'Pro Plan',
    price: '29',
    currency: '$',
    period: '/ month',
    features: [
      'Unlimited projects',
      'Priority support',
      'Advanced analytics',
      'Custom domain',
      'Team collaboration',
    ],
    buttonText: 'Get Started',
    buttonLink: '#',
    highlighted: false,
    style: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: { top: 32, right: 24, bottom: 32, left: 24 },
      margin: { top: 16, right: 0, bottom: 16, left: 0 },
      planNameColor: '#111827',
      planNameSize: 24,
      priceColor: '#111827',
      priceSize: 48,
      periodColor: '#6b7280',
      periodSize: 16,
      featuresColor: '#374151',
      featuresSize: 14,
      fontFamily: 'Arial, sans-serif',
      alignment: 'center',
      highlightColor: '#3b82f6',
      borderWidth: 1,
      borderColor: '#e5e7eb',
    },
  }
}

export function createDefaultFormBlock(): FormBlock {
  const defaultFields: FormField[] = [
    {
      id: `field-${nanoid()}`,
      type: 'text',
      label: 'Name',
      placeholder: 'Enter your name',
      required: true,
    },
    {
      id: `field-${nanoid()}`,
      type: 'email',
      label: 'Email',
      placeholder: 'your@email.com',
      required: true,
    },
    {
      id: `field-${nanoid()}`,
      type: 'textarea',
      label: 'Message',
      placeholder: 'Tell us more...',
      required: false,
    },
  ]

  return {
    id: `block-${nanoid()}`,
    type: 'form',
    title: 'Get in Touch',
    description: 'Fill out the form below and we\'ll get back to you soon.',
    fields: defaultFields,
    submitButtonText: 'Submit',
    submitAction: 'none',
    successMessage: 'Thank you! Your message has been sent.',
    style: {
      backgroundColor: '#f9fafb',
      borderRadius: 8,
      padding: { top: 32, right: 32, bottom: 32, left: 32 },
      margin: { top: 16, right: 0, bottom: 16, left: 0 },
      labelColor: '#111827',
      labelSize: 14,
      inputBackgroundColor: '#ffffff',
      inputBorderColor: '#d1d5db',
      inputTextColor: '#111827',
      inputBorderRadius: 6,
      buttonBackgroundColor: '#3b82f6',
      buttonTextColor: '#ffffff',
      buttonBorderRadius: 6,
      fontFamily: 'Arial, sans-serif',
      spacing: 20,
    },
  }
}

export function createDefaultAccordionBlock(): AccordionBlock {
  const defaultItems: AccordionItem[] = [
    {
      id: `item-${nanoid()}`,
      title: 'What is your refund policy?',
      content: 'We offer a 30-day money-back guarantee for all purchases. If you\'re not satisfied with your purchase, contact our support team for a full refund.',
    },
    {
      id: `item-${nanoid()}`,
      title: 'How long does shipping take?',
      content: 'Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout for faster delivery.',
    },
    {
      id: `item-${nanoid()}`,
      title: 'Do you offer customer support?',
      content: 'Yes! Our customer support team is available 24/7 via email and live chat. We\'re here to help with any questions or concerns.',
    },
  ]

  return {
    id: `block-${nanoid()}`,
    type: 'accordion',
    items: defaultItems,
    allowMultipleExpanded: false,
    defaultExpandedIndex: 0,
    style: {
      backgroundColor: '#ffffff',
      borderRadius: 8,
      padding: { top: 24, right: 24, bottom: 24, left: 24 },
      margin: { top: 16, right: 0, bottom: 16, left: 0 },
      itemBackgroundColor: '#ffffff',
      itemBorderColor: '#e5e7eb',
      titleColor: '#111827',
      titleSize: 16,
      contentColor: '#6b7280',
      contentSize: 14,
      fontFamily: 'Arial, sans-serif',
      spacing: 12,
      expandedItemBackgroundColor: '#f9fafb',
    },
  }
}

export function createDefaultQuoteBlock(): QuoteBlock {
  return {
    id: `block-${nanoid()}`,
    type: 'quote',
    quote: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
    authorTitle: 'Former Prime Minister of the United Kingdom',
    style: {
      backgroundColor: '#f9fafb',
      borderRadius: 8,
      padding: { top: 32, right: 32, bottom: 32, left: 32 },
      margin: { top: 16, right: 0, bottom: 16, left: 0 },
      quoteColor: '#111827',
      quoteSize: 20,
      authorColor: '#6b7280',
      authorSize: 14,
      fontFamily: 'Georgia, serif',
      alignment: 'left',
      borderLeftWidth: 4,
      borderLeftColor: '#3b82f6',
      fontStyle: 'italic',
      quoteMarkColor: '#3b82f6',
      showQuoteMarks: true,
    },
  }
}

export function createDefaultStatsBlock(): StatsBlock {
  const defaultItems: StatItem[] = [
    {
      id: `item-${nanoid()}`,
      label: 'Projects Completed',
      value: 250,
      maxValue: 300,
      suffix: '+',
      prefix: '',
      showProgressBar: true,
    },
    {
      id: `item-${nanoid()}`,
      label: 'Client Satisfaction',
      value: 98,
      maxValue: 100,
      suffix: '%',
      prefix: '',
      showProgressBar: true,
    },
    {
      id: `item-${nanoid()}`,
      label: 'Years Experience',
      value: 15,
      maxValue: 15,
      suffix: '+',
      prefix: '',
      showProgressBar: false,
    },
  ]

  return {
    id: `block-${nanoid()}`,
    type: 'stats',
    items: defaultItems,
    style: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: { top: 32, right: 32, bottom: 32, left: 32 },
      margin: { top: 16, right: 0, bottom: 16, left: 0 },
      labelColor: '#6b7280',
      labelSize: 14,
      valueColor: '#111827',
      valueSize: 36,
      progressBarColor: '#3b82f6',
      progressBarBackgroundColor: '#e5e7eb',
      progressBarHeight: 8,
      fontFamily: 'Arial, sans-serif',
      alignment: 'center',
      layout: 'horizontal',
      itemSpacing: 24,
    },
  }
}

export function createDefaultTeamMemberBlock(): TeamMemberBlock {
  const defaultSocialLinks: TeamMemberSocialLink[] = [
    {
      platform: 'twitter',
      url: 'https://twitter.com',
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com',
    },
  ]

  return {
    id: `block-${nanoid()}`,
    type: 'team',
    name: 'Jane Doe',
    role: 'CEO & Founder',
    bio: 'Passionate about building innovative solutions and leading teams to success.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    socialLinks: defaultSocialLinks,
    style: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: { top: 24, right: 24, bottom: 24, left: 24 },
      margin: { top: 16, right: 0, bottom: 16, left: 0 },
      imageSize: 120,
      imageBorderRadius: 60,
      nameColor: '#111827',
      nameSize: 24,
      roleColor: '#6b7280',
      roleSize: 16,
      bioColor: '#9ca3af',
      bioSize: 14,
      fontFamily: 'Arial, sans-serif',
      alignment: 'center',
      cardBackgroundColor: '#f9fafb',
      cardBorderColor: '#e5e7eb',
      cardBorderWidth: 1,
    },
  }
}

export function createDefaultGalleryBlock(): GalleryBlock {
  const defaultImages: GalleryImage[] = [
    {
      id: `image-${nanoid()}`,
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      alt: 'Mountain landscape',
      caption: 'Beautiful mountain landscape',
    },
    {
      id: `image-${nanoid()}`,
      url: 'https://images.unsplash.com/photo-1518710843675-2540dd79065c?w=800&h=600&fit=crop',
      alt: 'Forest path',
      caption: 'Peaceful forest path',
    },
    {
      id: `image-${nanoid()}`,
      url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop',
      alt: 'Ocean waves',
      caption: 'Ocean waves at sunset',
    },
  ]

  return {
    id: `block-${nanoid()}`,
    type: 'gallery',
    images: defaultImages,
    autoPlay: false,
    autoPlayInterval: 3000,
    showNavButtons: true,
    showDots: true,
    loop: true,
    style: {
      aspectRatio: '16:9',
      borderRadius: 8,
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      margin: { top: 16, right: 0, bottom: 16, left: 0 },
      imageObjectFit: 'cover',
      showThumbnails: false,
      thumbnailSize: 80,
      showCaptions: true,
      captionColor: '#ffffff',
      captionSize: 14,
      captionBackgroundColor: 'rgba(0, 0, 0, 0.7)',
      navButtonColor: '#ffffff',
      navButtonBackgroundColor: 'rgba(0, 0, 0, 0.5)',
      dotColor: 'rgba(255, 255, 255, 0.5)',
      dotActiveColor: '#ffffff',
      fontFamily: 'Arial, sans-serif',
    },
  }
}

export function createDefaultLogoGridBlock(): LogoGridBlock {
  const defaultLogos: LogoItem[] = [
    {
      id: `logo-${nanoid()}`,
      imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=100&fit=crop',
      alt: 'Company Logo 1',
      link: 'https://example.com',
      target: '_blank',
    },
    {
      id: `logo-${nanoid()}`,
      imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=100&fit=crop',
      alt: 'Company Logo 2',
      link: 'https://example.com',
      target: '_blank',
    },
    {
      id: `logo-${nanoid()}`,
      imageUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop',
      alt: 'Company Logo 3',
      link: 'https://example.com',
      target: '_blank',
    },
    {
      id: `logo-${nanoid()}`,
      imageUrl: 'https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=200&h=100&fit=crop',
      alt: 'Company Logo 4',
      link: 'https://example.com',
      target: '_blank',
    },
    {
      id: `logo-${nanoid()}`,
      imageUrl: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=200&h=100&fit=crop',
      alt: 'Company Logo 5',
      link: 'https://example.com',
      target: '_blank',
    },
    {
      id: `logo-${nanoid()}`,
      imageUrl: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=200&h=100&fit=crop',
      alt: 'Company Logo 6',
      link: 'https://example.com',
      target: '_blank',
    },
  ]

  return {
    id: `block-${nanoid()}`,
    type: 'logo-grid',
    logos: defaultLogos,
    style: {
      columns: 3,
      gap: 24,
      logoSize: 60,
      padding: { top: 32, right: 24, bottom: 32, left: 24 },
      margin: { top: 16, right: 0, bottom: 16, left: 0 },
      backgroundColor: '#ffffff',
      logoBackgroundColor: '#f9fafb',
      borderRadius: 8,
      alignment: 'center',
      grayscale: true,
      grayscaleHover: true,
      opacity: 0.7,
      hoverOpacity: 1,
    },
  }
}

export function createDefaultEmbedBlock(): EmbedBlock {
  return {
    id: `block-${nanoid()}`,
    type: 'embed',
    embedUrl: '',
    embedType: 'map',
    title: '',
    allowFullScreen: true,
    style: {
      width: '100%',
      height: '450px',
      aspectRatio: '16:9',
      padding: { top: 16, right: 16, bottom: 16, left: 16 },
      margin: { top: 16, right: 0, bottom: 16, left: 0 },
      backgroundColor: '#ffffff',
      borderRadius: 8,
      border: {
        width: 1,
        color: '#e5e7eb',
        style: 'solid',
      },
    },
  }
}

export function createDefaultNewsletterBlock(): NewsletterBlock {
  return {
    id: `block-${nanoid()}`,
    type: 'newsletter',
    heading: 'Subscribe to Our Newsletter',
    description: 'Get the latest updates and exclusive offers delivered to your inbox',
    inputPlaceholder: 'Enter your email',
    buttonText: 'Subscribe',
    successMessage: 'Thanks for subscribing!',
    showPrivacyCheckbox: false,
    privacyText: 'I agree to receive marketing emails and accept the privacy policy',
    style: {
      layout: 'inline',
      padding: { top: 32, right: 32, bottom: 32, left: 32 },
      margin: { top: 16, right: 0, bottom: 16, left: 0 },
      backgroundColor: '#f9fafb',
      borderRadius: 12,
      // Heading styles
      headingColor: '#1f2937',
      headingSize: 28,
      headingWeight: 700,
      headingAlign: 'center',
      // Description styles
      descriptionColor: '#6b7280',
      descriptionSize: 16,
      descriptionAlign: 'center',
      // Input styles
      inputBackgroundColor: '#ffffff',
      inputTextColor: '#1f2937',
      inputBorderColor: '#d1d5db',
      inputBorderWidth: 1,
      inputBorderRadius: 8,
      inputPadding: 12,
      // Button styles
      buttonBackgroundColor: '#3b82f6',
      buttonTextColor: '#ffffff',
      buttonBorderRadius: 8,
      buttonPadding: 12,
      buttonFontSize: 16,
      buttonFontWeight: 600,
      // Gap between elements
      gap: 16,
    },
  }
}

// ============================================
// SECTION DEFAULTS
// ============================================

export function createDefaultSection(blocks: Block[] = []): Section {
  return {
    id: `section-${nanoid()}`,
    layout: 'flex',
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
      columnGap: 16,
      rowGap: 16,
    },
    blocks,
  }
}

export function createTwoColumnSection(): Section {
  return {
    id: `section-${nanoid()}`,
    layout: 'grid',
    columns: 2,
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 32, right: 16, bottom: 32, left: 16 },
      margin: { top: 0, right: 0, bottom: 24, left: 0 },
      flex: {
        direction: 'row',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        wrap: 'wrap',
      },
      columnGap: 24,
      rowGap: 24,
    },
    blocks: [],
  }
}

export function createThreeColumnSection(): Section {
  return {
    id: `section-${nanoid()}`,
    layout: 'grid',
    columns: 3,
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 32, right: 16, bottom: 32, left: 16 },
      margin: { top: 0, right: 0, bottom: 24, left: 0 },
      flex: {
        direction: 'row',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        wrap: 'wrap',
      },
      columnGap: 24,
      rowGap: 24,
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
    case 'divider':
      return createDefaultDividerBlock()
    case 'icon':
      return createDefaultIconBlock()
    case 'social':
      return createDefaultSocialMediaBlock()
    case 'testimonial':
      return createDefaultTestimonialBlock()
    case 'feature':
      return createDefaultFeatureBlock()
    case 'pricing':
      return createDefaultPricingBlock()
    case 'form':
      return createDefaultFormBlock()
    case 'accordion':
      return createDefaultAccordionBlock()
    case 'quote':
      return createDefaultQuoteBlock()
    case 'stats':
      return createDefaultStatsBlock()
    case 'team':
      return createDefaultTeamMemberBlock()
    case 'gallery':
      return createDefaultGalleryBlock()
    case 'logo-grid':
      return createDefaultLogoGridBlock()
    case 'embed':
      return createDefaultEmbedBlock()
    case 'newsletter':
      return createDefaultNewsletterBlock()
    default:
      throw new Error(`Unknown block type: ${type}`)
  }
}
