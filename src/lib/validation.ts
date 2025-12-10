/**
 * Zod validation schemas for Page Builder data structures
 * Ensures data integrity for import/export operations
 */

import { z } from 'zod'

// ============================================
// COMMON SCHEMAS
// ============================================

export const SpacingSchema = z.object({
  top: z.number(),
  right: z.number(),
  bottom: z.number(),
  left: z.number(),
})

export const FlexPropsSchema = z.object({
  direction: z.enum(['row', 'column', 'row-reverse', 'column-reverse']),
  alignItems: z.enum(['flex-start', 'center', 'flex-end', 'stretch', 'baseline']),
  justifyContent: z.enum([
    'flex-start',
    'center',
    'flex-end',
    'space-between',
    'space-around',
    'space-evenly',
  ]),
  wrap: z.enum(['nowrap', 'wrap', 'wrap-reverse']).optional(),
})

// ============================================
// SECTION SCHEMAS
// ============================================

export const SectionStyleSchema = z.object({
  backgroundColor: z.string(),
  padding: SpacingSchema,
  margin: SpacingSchema,
  flex: FlexPropsSchema,
})

// ============================================
// BLOCK SCHEMAS
// ============================================

// Text Block
export const TextBlockStyleSchema = z.object({
  fontFamily: z.string(),
  fontSize: z.number(),
  fontWeight: z.number(),
  fontStyle: z.enum(['normal', 'italic']).optional(),
  color: z.string(),
  backgroundColor: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right', 'justify']),
  padding: SpacingSchema,
  margin: SpacingSchema,
})

export const TextBlockSchema = z.object({
  id: z.string(),
  type: z.literal('text'),
  content: z.string(),
  style: TextBlockStyleSchema,
})

// Image Block
export const ImageBlockStyleSchema = z.object({
  borderRadius: z.number(),
  objectFit: z.enum(['cover', 'contain', 'fill', 'none', 'scale-down']),
  width: z.string().optional(),
  height: z.string().optional(),
  padding: SpacingSchema,
  margin: SpacingSchema,
})

export const ImageBlockSchema = z.object({
  id: z.string(),
  type: z.literal('image'),
  src: z.string(),
  alt: z.string().optional(),
  style: ImageBlockStyleSchema,
})

// Video Block
export const VideoBlockStyleSchema = z.object({
  aspectRatio: z.enum(['16:9', '1:1', '4:3', '9:16', 'auto']),
  padding: SpacingSchema,
  margin: SpacingSchema,
})

export const VideoBlockSchema = z.object({
  id: z.string(),
  type: z.literal('video'),
  url: z.string(),
  source: z.enum(['youtube', 'instagram', 'tiktok']),
  style: VideoBlockStyleSchema,
})

// Button Block
export const ButtonBlockStyleSchema = z.object({
  backgroundColor: z.string(),
  color: z.string(),
  fontSize: z.number(),
  fontWeight: z.number(),
  fontFamily: z.string(),
  borderRadius: z.number(),
  layout: z.enum(['inline', 'center', 'full-width']),
  padding: SpacingSchema,
  margin: SpacingSchema,
})

export const ButtonBlockSchema = z.object({
  id: z.string(),
  type: z.literal('button'),
  text: z.string(),
  href: z.string(),
  target: z.enum(['_blank', '_self']).optional(),
  style: ButtonBlockStyleSchema,
})

// Countdown Block
export const CountdownBlockStyleSchema = z.object({
  fontSize: z.number(),
  fontWeight: z.number(),
  fontFamily: z.string(),
  color: z.string(),
  labelColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  padding: SpacingSchema,
  margin: SpacingSchema,
})

export const CountdownBlockSchema = z.object({
  id: z.string(),
  type: z.literal('countdown'),
  targetDate: z.string(), // ISO 8601 date string
  label: z.string().optional(),
  displayFormat: z.enum(['dhms', 'hms', 'ms']),
  style: CountdownBlockStyleSchema,
})

// FAQ Block
export const FAQItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
})

export const FAQBlockStyleSchema = z.object({
  fontSize: z.number(),
  fontWeight: z.number(),
  fontFamily: z.string(),
  questionColor: z.string(),
  answerColor: z.string(),
  backgroundColor: z.string().optional(),
  padding: SpacingSchema,
  margin: SpacingSchema,
})

export const FAQBlockSchema = z.object({
  id: z.string(),
  type: z.literal('faq'),
  items: z.array(FAQItemSchema),
  style: FAQBlockStyleSchema,
})

// Space Block
export const SpaceBlockSchema = z.object({
  id: z.string(),
  type: z.literal('space'),
  height: z.number(),
})

// Discriminated union for all block types
export const BlockSchema = z.discriminatedUnion('type', [
  TextBlockSchema,
  ImageBlockSchema,
  VideoBlockSchema,
  ButtonBlockSchema,
  CountdownBlockSchema,
  FAQBlockSchema,
  SpaceBlockSchema,
])

// Section Schema
export const SectionSchema = z.object({
  id: z.string(),
  style: SectionStyleSchema,
  blocks: z.array(BlockSchema),
})

// ============================================
// PAGE SCHEMA
// ============================================

export const PageDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string().optional(),
  sections: z.array(SectionSchema),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),
})

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validates page data and returns typed result
 */
export function validatePageData(data: unknown) {
  return PageDataSchema.safeParse(data)
}

/**
 * Validates and throws if invalid
 */
export function assertValidPageData(data: unknown) {
  return PageDataSchema.parse(data)
}

/**
 * Validates a section
 */
export function validateSection(data: unknown) {
  return SectionSchema.safeParse(data)
}

/**
 * Validates a block
 */
export function validateBlock(data: unknown) {
  return BlockSchema.safeParse(data)
}

// ============================================
// TYPE EXPORTS
// ============================================

// Export inferred types for convenience
export type ValidatedPageData = z.infer<typeof PageDataSchema>
export type ValidatedSection = z.infer<typeof SectionSchema>
export type ValidatedBlock = z.infer<typeof BlockSchema>
