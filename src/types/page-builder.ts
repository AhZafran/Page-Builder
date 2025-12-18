/**
 * Page Builder Type Definitions
 * Based on the PRD schema for sections, blocks, and pages
 */

// ============================================
// COMMON TYPES
// ============================================

export interface Spacing {
  top: number
  right: number
  bottom: number
  left: number
}

export interface FlexProps {
  direction: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'
  justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
}

export type BlockType = 'text' | 'image' | 'video' | 'button' | 'countdown' | 'faq' | 'space' | 'divider' | 'icon' | 'social' | 'testimonial' | 'feature' | 'pricing' | 'form' | 'accordion' | 'quote' | 'stats' | 'team' | 'gallery' | 'logo-grid' | 'embed' | 'newsletter'

// ============================================
// SECTION TYPES
// ============================================

export interface SectionStyle {
  backgroundColor: string
  backgroundImage?: string
  backgroundSize?: 'cover' | 'contain' | 'auto'
  backgroundPosition?: string
  backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'
  padding: Spacing
  margin: Spacing
  flex: FlexProps
  columnGap?: number
  rowGap?: number
}

export interface Section {
  id: string
  style: SectionStyle
  blocks: Block[]
  columns?: number // Number of columns (1, 2, 3, 4, etc.) - undefined means flex layout
  layout?: 'flex' | 'grid' // Layout type
}

// ============================================
// BLOCK TYPES
// ============================================

// Base Block Interface
export interface BaseBlock {
  id: string
  type: BlockType
}

// Text Block
export interface TextBlockStyle {
  fontFamily: string
  fontSize: number
  fontWeight: number
  fontStyle?: 'normal' | 'italic'
  color: string
  backgroundColor?: string
  textAlign: 'left' | 'center' | 'right' | 'justify'
  padding: Spacing
  margin: Spacing
}

export interface TextBlock extends BaseBlock {
  type: 'text'
  content: string
  style: TextBlockStyle
}

// Image Block
export interface ImageBlockStyle {
  borderRadius: number
  objectFit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  width?: string
  height?: string
  padding: Spacing
  margin: Spacing
}

export interface ImageBlock extends BaseBlock {
  type: 'image'
  src: string
  alt?: string
  style: ImageBlockStyle
}

// Video Block
export type VideoSource = 'youtube' | 'vimeo' | 'instagram' | 'tiktok' | 'direct'
export type AspectRatio = '16:9' | '1:1' | '4:3' | '9:16' | 'auto'

export interface VideoBlockStyle {
  aspectRatio: AspectRatio
  padding: Spacing
  margin: Spacing
}

export interface VideoBlock extends BaseBlock {
  type: 'video'
  url: string
  source: VideoSource
  style: VideoBlockStyle
}

// Button Block
export interface ButtonBlockStyle {
  backgroundColor: string
  color: string
  fontSize: number
  fontWeight: number
  fontFamily: string
  borderRadius: number
  layout: 'inline' | 'center' | 'full-width'
  padding: Spacing
  margin: Spacing
}

export interface ButtonBlock extends BaseBlock {
  type: 'button'
  text: string
  href: string
  target?: '_blank' | '_self'
  style: ButtonBlockStyle
}

// Countdown Block
export interface CountdownBlockStyle {
  fontSize: number
  fontWeight: number
  fontFamily: string
  color: string
  labelColor?: string
  backgroundColor?: string
  padding: Spacing
  margin: Spacing
}

export interface CountdownBlock extends BaseBlock {
  type: 'countdown'
  targetDate: string // ISO 8601 date string
  label?: string
  displayFormat: 'dhms' | 'hms' | 'ms' // days/hours/minutes/seconds
  style: CountdownBlockStyle
}

// FAQ Block
export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface FAQBlockStyle {
  fontSize: number
  fontWeight: number
  fontFamily: string
  questionColor: string
  answerColor: string
  backgroundColor?: string
  padding: Spacing
  margin: Spacing
}

export interface FAQBlock extends BaseBlock {
  type: 'faq'
  items: FAQItem[]
  style: FAQBlockStyle
}

// Space Block
export interface SpaceBlock extends BaseBlock {
  type: 'space'
  height: number // in pixels
}

// Divider Block
export interface DividerBlockStyle {
  width: string // e.g., '100%', '50%', '200px'
  height: number // thickness in pixels
  color: string
  style: 'solid' | 'dashed' | 'dotted'
  margin: Spacing
}

export interface DividerBlock extends BaseBlock {
  type: 'divider'
  style: DividerBlockStyle
}

// Icon Block
export interface IconBlockStyle {
  size: number // in pixels
  color: string
  alignment: 'left' | 'center' | 'right'
  margin: Spacing
}

export interface IconBlock extends BaseBlock {
  type: 'icon'
  iconName: string // Lucide icon name
  href?: string // optional link
  target?: '_blank' | '_self'
  style: IconBlockStyle
}

// Social Media Block
export type SocialPlatform = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'github' | 'discord'

export interface SocialLink {
  platform: SocialPlatform
  url: string
}

export interface SocialMediaBlockStyle {
  size: number // icon size in pixels
  layout: 'horizontal' | 'vertical'
  alignment: 'left' | 'center' | 'right'
  spacing: number // gap between icons
  useBrandColors: boolean // use platform brand colors or custom color
  customColor?: string // custom color when useBrandColors is false
  margin: Spacing
}

export interface SocialMediaBlock extends BaseBlock {
  type: 'social'
  links: SocialLink[]
  style: SocialMediaBlockStyle
}

// Testimonial Block
export interface TestimonialBlockStyle {
  backgroundColor: string
  borderRadius: number
  padding: Spacing
  margin: Spacing
  textColor: string
  authorColor: string
  roleColor: string
  fontSize: number
  fontFamily: string
  alignment: 'left' | 'center' | 'right'
  showRating: boolean
  ratingColor: string
  borderWidth?: number
  borderColor?: string
}

export interface TestimonialBlock extends BaseBlock {
  type: 'testimonial'
  quote: string
  authorName: string
  authorRole?: string
  authorImage?: string
  rating?: number // 1-5 stars
  style: TestimonialBlockStyle
}

// Feature Card Block
export interface FeatureBlockStyle {
  backgroundColor: string
  borderRadius: number
  padding: Spacing
  margin: Spacing
  iconColor: string
  iconSize: number
  titleColor: string
  titleSize: number
  titleWeight: number
  descriptionColor: string
  descriptionSize: number
  fontFamily: string
  alignment: 'left' | 'center' | 'right'
  borderWidth?: number
  borderColor?: string
  showIcon: boolean
}

export interface FeatureBlock extends BaseBlock {
  type: 'feature'
  iconName: string // Lucide icon name
  title: string
  description: string
  style: FeatureBlockStyle
}

// Pricing Table Block
export interface PricingBlockStyle {
  backgroundColor: string
  borderRadius: number
  padding: Spacing
  margin: Spacing
  planNameColor: string
  planNameSize: number
  priceColor: string
  priceSize: number
  periodColor: string
  periodSize: number
  featuresColor: string
  featuresSize: number
  fontFamily: string
  alignment: 'left' | 'center' | 'right'
  highlightColor: string
  borderWidth?: number
  borderColor?: string
}

export interface PricingBlock extends BaseBlock {
  type: 'pricing'
  planName: string
  price: string
  currency: string
  period: string // e.g., "/ month", "/ year", "one-time"
  features: string[]
  buttonText: string
  buttonLink: string
  highlighted: boolean
  highlightLabel?: string // e.g., "Popular", "Best Value"
  style: PricingBlockStyle
}

// Accordion Block
export interface AccordionItem {
  id: string
  title: string
  content: string
}

export interface AccordionBlockStyle {
  backgroundColor: string
  borderRadius: number
  padding: Spacing
  margin: Spacing
  itemBackgroundColor: string
  itemBorderColor: string
  titleColor: string
  titleSize: number
  contentColor: string
  contentSize: number
  fontFamily: string
  spacing: number // gap between items
  expandedItemBackgroundColor: string
}

export interface AccordionBlock extends BaseBlock {
  type: 'accordion'
  items: AccordionItem[]
  allowMultipleExpanded: boolean // Allow multiple items open at once
  defaultExpandedIndex?: number // Which item is expanded by default (-1 for none)
  style: AccordionBlockStyle
}

// Form Block
export type FormFieldType = 'text' | 'email' | 'textarea' | 'tel' | 'number' | 'select' | 'checkbox' | 'radio'

export interface FormField {
  id: string
  type: FormFieldType
  label: string
  placeholder?: string
  required: boolean
  options?: string[] // For select, checkbox, radio
}

export interface FormBlockStyle {
  backgroundColor: string
  borderRadius: number
  padding: Spacing
  margin: Spacing
  labelColor: string
  labelSize: number
  inputBackgroundColor: string
  inputBorderColor: string
  inputTextColor: string
  inputBorderRadius: number
  buttonBackgroundColor: string
  buttonTextColor: string
  buttonBorderRadius: number
  fontFamily: string
  spacing: number // gap between fields
}

export interface FormBlock extends BaseBlock {
  type: 'form'
  title?: string
  description?: string
  fields: FormField[]
  submitButtonText: string
  submitAction: 'email' | 'webhook' | 'none' // Future: can add integrations
  submitEndpoint?: string // Email address or webhook URL
  successMessage: string
  style: FormBlockStyle
}

// ============================================
// QUOTE BLOCK
// ============================================

export interface QuoteBlockStyle {
  backgroundColor: string
  borderRadius: number
  padding: Spacing
  margin: Spacing
  quoteColor: string
  quoteSize: number
  authorColor: string
  authorSize: number
  fontFamily: string
  alignment: 'left' | 'center' | 'right'
  borderLeftWidth?: number
  borderLeftColor?: string
  fontStyle: 'normal' | 'italic'
  quoteMarkColor?: string
  showQuoteMarks: boolean
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote'
  quote: string
  author?: string
  authorTitle?: string
  style: QuoteBlockStyle
}

// ============================================
// STATS/PROGRESS BAR BLOCK
// ============================================

export interface StatItem {
  id: string
  label: string
  value: number
  maxValue?: number
  suffix?: string
  prefix?: string
  showProgressBar: boolean
}

export interface StatsBlockStyle {
  backgroundColor: string
  borderRadius: number
  padding: Spacing
  margin: Spacing
  labelColor: string
  labelSize: number
  valueColor: string
  valueSize: number
  progressBarColor: string
  progressBarBackgroundColor: string
  progressBarHeight: number
  fontFamily: string
  alignment: 'left' | 'center' | 'right'
  layout: 'vertical' | 'horizontal'
  itemSpacing: number
}

export interface StatsBlock extends BaseBlock {
  type: 'stats'
  items: StatItem[]
  style: StatsBlockStyle
}

// ============================================
// TEAM MEMBER BLOCK
// ============================================

export interface TeamMemberSocialLink {
  platform: 'twitter' | 'linkedin' | 'github' | 'email' | 'website'
  url: string
}

export interface TeamMemberBlockStyle {
  backgroundColor: string
  borderRadius: number
  padding: Spacing
  margin: Spacing
  imageSize: number
  imageBorderRadius: number
  nameColor: string
  nameSize: number
  roleColor: string
  roleSize: number
  bioColor: string
  bioSize: number
  fontFamily: string
  alignment: 'left' | 'center' | 'right'
  cardBackgroundColor: string
  cardBorderColor?: string
  cardBorderWidth?: number
}

export interface TeamMemberBlock extends BaseBlock {
  type: 'team'
  name: string
  role: string
  bio?: string
  imageUrl?: string
  socialLinks: TeamMemberSocialLink[]
  style: TeamMemberBlockStyle
}

// ============================================
// GALLERY/CAROUSEL BLOCK
// ============================================

export interface GalleryImage {
  id: string
  url: string
  alt?: string
  caption?: string
}

export interface GalleryBlockStyle {
  aspectRatio: '16:9' | '1:1' | '4:3' | '3:2' | 'auto'
  borderRadius: number
  padding: Spacing
  margin: Spacing
  imageObjectFit: 'cover' | 'contain' | 'fill' | 'none'
  showThumbnails: boolean
  thumbnailSize: number
  showCaptions: boolean
  captionColor: string
  captionSize: number
  captionBackgroundColor: string
  navButtonColor: string
  navButtonBackgroundColor: string
  dotColor: string
  dotActiveColor: string
  fontFamily: string
}

export interface GalleryBlock extends BaseBlock {
  type: 'gallery'
  images: GalleryImage[]
  autoPlay: boolean
  autoPlayInterval: number // in milliseconds
  showNavButtons: boolean
  showDots: boolean
  loop: boolean
  style: GalleryBlockStyle
}

// ============================================
// LOGO GRID BLOCK
// ============================================

export interface LogoItem {
  id: string
  imageUrl: string
  alt?: string
  link?: string
  target?: '_blank' | '_self'
}

export interface LogoGridBlockStyle {
  columns: number // 2, 3, 4, 5, 6
  gap: number
  logoSize: number // max height in pixels
  padding: Spacing
  margin: Spacing
  backgroundColor: string
  logoBackgroundColor: string
  borderRadius: number
  alignment: 'left' | 'center' | 'right'
  grayscale: boolean // Apply grayscale filter to logos
  grayscaleHover: boolean // Remove grayscale on hover
  opacity: number // 0-1
  hoverOpacity: number // 0-1
}

export interface LogoGridBlock extends BaseBlock {
  type: 'logo-grid'
  logos: LogoItem[]
  style: LogoGridBlockStyle
}

export interface EmbedBlockStyle {
  width: string // e.g., '100%', '800px'
  height: string // e.g., '450px', '600px'
  aspectRatio: '16:9' | '4:3' | '1:1' | '21:9' | 'custom'
  padding: Spacing
  margin: Spacing
  backgroundColor: string
  borderRadius: number
  border: {
    width: number
    color: string
    style: 'solid' | 'dashed' | 'dotted' | 'none'
  }
}

export interface EmbedBlock extends BaseBlock {
  type: 'embed'
  embedUrl: string // URL for iframe src (e.g., Google Maps embed, forms, etc.)
  embedType: 'map' | 'form' | 'calendar' | 'custom' // Type of embed for better UX
  title?: string // Optional title displayed above embed
  allowFullScreen: boolean
  style: EmbedBlockStyle
}

export interface NewsletterBlockStyle {
  layout: 'inline' | 'stacked' // Input and button layout
  padding: Spacing
  margin: Spacing
  backgroundColor: string
  borderRadius: number
  // Heading styles
  headingColor: string
  headingSize: number
  headingWeight: number
  headingAlign: 'left' | 'center' | 'right'
  // Description styles
  descriptionColor: string
  descriptionSize: number
  descriptionAlign: 'left' | 'center' | 'right'
  // Input styles
  inputBackgroundColor: string
  inputTextColor: string
  inputBorderColor: string
  inputBorderWidth: number
  inputBorderRadius: number
  inputPadding: number
  // Button styles
  buttonBackgroundColor: string
  buttonTextColor: string
  buttonBorderRadius: number
  buttonPadding: number
  buttonFontSize: number
  buttonFontWeight: number
  // Gap between elements
  gap: number
}

export interface NewsletterBlock extends BaseBlock {
  type: 'newsletter'
  heading: string
  description: string
  inputPlaceholder: string
  buttonText: string
  successMessage: string
  showPrivacyCheckbox: boolean
  privacyText: string
  style: NewsletterBlockStyle
}

// Union type for all blocks
export type Block =
  | TextBlock
  | ImageBlock
  | VideoBlock
  | ButtonBlock
  | CountdownBlock
  | FAQBlock
  | SpaceBlock
  | DividerBlock
  | IconBlock
  | SocialMediaBlock
  | TestimonialBlock
  | FeatureBlock
  | PricingBlock
  | FormBlock
  | AccordionBlock
  | QuoteBlock
  | StatsBlock
  | TeamMemberBlock
  | GalleryBlock
  | LogoGridBlock
  | EmbedBlock
  | NewsletterBlock

// ============================================
// PAGE TYPES
// ============================================

export interface PageData {
  id: string
  name: string
  slug?: string
  sections: Section[]
  updatedAt?: string
  createdAt?: string
}

export interface Page {
  id: string
  name: string
  slug: string | null
  data: PageData
  created_at: string
  updated_at: string
}

// ============================================
// EDITOR STATE TYPES
// ============================================

export interface EditorState {
  currentPage: PageData | null
  selectedElement: {
    type: 'section' | 'block' | null
    id: string | null
  }
  isDirty: boolean
  history: PageData[]
  historyIndex: number
}

// ============================================
// HELPER TYPES
// ============================================

export interface BlockDefinition {
  type: BlockType
  label: string
  icon?: string
  createDefault: () => Block
}

export interface SectionTemplate {
  id: string
  name: string
  columns: number
  createSection: () => Section
}

// ============================================
// DEFAULT VALUES
// ============================================

export const defaultSpacing: Spacing = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
}

export const defaultFlexProps: FlexProps = {
  direction: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  wrap: 'nowrap',
}

export const defaultSectionStyle: SectionStyle = {
  backgroundColor: '#ffffff',
  padding: { top: 32, right: 16, bottom: 32, left: 16 },
  margin: { top: 0, right: 0, bottom: 24, left: 0 },
  flex: defaultFlexProps,
}
