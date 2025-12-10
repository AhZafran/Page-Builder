/**
 * Templates management utilities
 * Handles saving, loading, and managing page templates
 */

import type { Section } from '@/types'

export interface PageTemplate {
  id: string
  name: string
  description?: string
  thumbnail?: string
  sections: Section[]
  createdAt: string
}

const TEMPLATES_STORAGE_KEY = 'page-builder-templates'

/**
 * Get all templates from localStorage
 */
export function getTemplates(): PageTemplate[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY)
    if (!stored) return []

    const templates = JSON.parse(stored)
    return Array.isArray(templates) ? templates : []
  } catch (error) {
    console.error('Error loading templates:', error)
    return []
  }
}

/**
 * Save a template to localStorage
 */
export function saveTemplate(template: PageTemplate): { success: boolean; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, error: 'localStorage not available' }
  }

  try {
    const templates = getTemplates()

    // Check if template with same ID exists
    const existingIndex = templates.findIndex((t) => t.id === template.id)

    if (existingIndex >= 0) {
      // Update existing template
      templates[existingIndex] = template
    } else {
      // Add new template
      templates.push(template)
    }

    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates))
    return { success: true }
  } catch (error) {
    console.error('Error saving template:', error)
    return { success: false, error: 'Failed to save template' }
  }
}

/**
 * Delete a template from localStorage
 */
export function deleteTemplate(templateId: string): { success: boolean; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, error: 'localStorage not available' }
  }

  try {
    const templates = getTemplates()
    const filtered = templates.filter((t) => t.id !== templateId)

    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(filtered))
    return { success: true }
  } catch (error) {
    console.error('Error deleting template:', error)
    return { success: false, error: 'Failed to delete template' }
  }
}

/**
 * Get a single template by ID
 */
export function getTemplateById(templateId: string): PageTemplate | null {
  const templates = getTemplates()
  return templates.find((t) => t.id === templateId) || null
}

/**
 * Create a template from sections
 */
export function createTemplate(
  name: string,
  sections: Section[],
  description?: string
): PageTemplate {
  return {
    id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    sections: JSON.parse(JSON.stringify(sections)), // Deep clone
    createdAt: new Date().toISOString(),
  }
}

/**
 * Get default/built-in templates
 */
export function getBuiltInTemplates(): PageTemplate[] {
  return [
    {
      id: 'blank',
      name: 'Blank Page',
      description: 'Start with an empty page',
      sections: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'simple-landing',
      name: 'Simple Landing Page',
      description: 'A basic landing page with hero and CTA',
      sections: [
        {
          id: 'section-hero',
          blocks: [
            {
              id: 'block-hero-title',
              type: 'text',
              content: 'Welcome to Our Product',
              style: {
                fontSize: 48,
                fontWeight: 700,
                fontFamily: 'system-ui',
                color: '#000000',
                backgroundColor: 'transparent',
                textAlign: 'center',
                padding: { top: 0, right: 0, bottom: 20, left: 0 },
                margin: { top: 0, right: 0, bottom: 0, left: 0 },
              },
            },
            {
              id: 'block-hero-subtitle',
              type: 'text',
              content: 'The best solution for your needs',
              style: {
                fontSize: 24,
                fontWeight: 400,
                fontFamily: 'system-ui',
                color: '#666666',
                backgroundColor: 'transparent',
                textAlign: 'center',
                padding: { top: 0, right: 0, bottom: 30, left: 0 },
                margin: { top: 0, right: 0, bottom: 0, left: 0 },
              },
            },
            {
              id: 'block-hero-button',
              type: 'button',
              text: 'Get Started',
              href: '#',
              target: '_self',
              style: {
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                fontSize: 18,
                fontWeight: 600,
                fontFamily: 'system-ui',
                borderRadius: 8,
                padding: { top: 12, right: 24, bottom: 12, left: 24 },
                margin: { top: 0, right: 0, bottom: 0, left: 0 },
                layout: 'center',
              },
            },
          ],
          style: {
            backgroundColor: '#f9fafb',
            padding: { top: 80, right: 20, bottom: 80, left: 20 },
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
            flex: {
              direction: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              wrap: 'nowrap',
            },
          },
        },
      ],
      createdAt: new Date().toISOString(),
    },
  ]
}
