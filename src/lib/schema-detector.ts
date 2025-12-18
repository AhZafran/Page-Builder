/**
 * Schema Detector and Auto-Converter
 * Automatically detects JSON schema types and routes to appropriate converters
 */

import { convertProductSchemaToPageBuilder } from './product-schema-converter'
import type { PageData } from '@/types/page-builder'

export type SchemaType = 'page-builder' | 'product-ecommerce' | 'unknown'

export interface DetectionResult {
  type: SchemaType
  confidence: number // 0-1
  description: string
}

/**
 * Detects the type of JSON schema
 */
export function detectSchemaType(data: any): DetectionResult {
  // Check for Page Builder schema
  if (isPageBuilderSchema(data)) {
    return {
      type: 'page-builder',
      confidence: 1.0,
      description: 'Native page builder schema - ready to use',
    }
  }

  // Check for Product/E-commerce schema
  if (isProductSchema(data)) {
    return {
      type: 'product-ecommerce',
      confidence: 0.95,
      description: 'E-commerce product schema - will be converted',
    }
  }

  return {
    type: 'unknown',
    confidence: 0,
    description: 'Unknown schema format',
  }
}

/**
 * Checks if data matches page builder schema
 */
function isPageBuilderSchema(data: any): boolean {
  return (
    typeof data === 'object' &&
    data !== null &&
    'sections' in data &&
    Array.isArray(data.sections) &&
    (data.sections.length === 0 ||
      (data.sections[0] &&
        'blocks' in data.sections[0] &&
        'style' in data.sections[0]))
  )
}

/**
 * Checks if data matches product/e-commerce schema
 */
function isProductSchema(data: any): boolean {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  // Check for common product schema fields
  const hasHero = 'hero' in data && typeof data.hero === 'object'
  const hasVariants = 'variants' in data && Array.isArray(data.variants)
  const hasProducts = 'products' in data && typeof data.products === 'object'
  const hasFaq = 'faq' in data && Array.isArray(data.faq)
  const hasReviews = 'reviews' in data && Array.isArray(data.reviews)
  const hasTheme = 'theme' in data && typeof data.theme === 'object'

  // Need at least 2 of these fields to be confident
  const matchCount = [hasHero, hasVariants, hasProducts, hasFaq, hasReviews, hasTheme].filter(
    Boolean
  ).length

  return matchCount >= 2
}

/**
 * Automatically converts JSON to PageData based on detected schema
 */
export function autoConvertToPageBuilder(
  data: any,
  pageName?: string
): { success: boolean; data?: PageData; error?: string; schemaType: SchemaType } {
  const detection = detectSchemaType(data)

  try {
    switch (detection.type) {
      case 'page-builder':
        // Already in correct format, just validate basic structure
        if (isPageBuilderSchema(data)) {
          return {
            success: true,
            data: data as PageData,
            schemaType: 'page-builder',
          }
        }
        return {
          success: false,
          error: 'Invalid page builder schema structure',
          schemaType: 'page-builder',
        }

      case 'product-ecommerce':
        // Convert product schema to page builder
        const converted = convertProductSchemaToPageBuilder(data, pageName)
        return {
          success: true,
          data: converted,
          schemaType: 'product-ecommerce',
        }

      case 'unknown':
      default:
        return {
          success: false,
          error: 'Unknown or unsupported JSON schema format. Please use a page builder schema or product schema.',
          schemaType: 'unknown',
        }
    }
  } catch (error) {
    return {
      success: false,
      error: `Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      schemaType: detection.type,
    }
  }
}

/**
 * Gets a user-friendly message about the detected schema
 */
export function getSchemaMessage(detection: DetectionResult): string {
  switch (detection.type) {
    case 'page-builder':
      return '✓ Page builder format detected - ready to import'
    case 'product-ecommerce':
      return '✓ E-commerce product format detected - will auto-convert to page builder'
    case 'unknown':
      return '✗ Unknown format - please check your JSON structure'
  }
}
