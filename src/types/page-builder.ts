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

export type BlockType = 'text' | 'image' | 'video' | 'button' | 'countdown' | 'faq' | 'space'

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
}

export interface Section {
  id: string
  style: SectionStyle
  blocks: Block[]
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

// Union type for all blocks
export type Block =
  | TextBlock
  | ImageBlock
  | VideoBlock
  | ButtonBlock
  | CountdownBlock
  | FAQBlock
  | SpaceBlock

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
