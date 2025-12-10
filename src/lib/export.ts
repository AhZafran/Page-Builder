/**
 * Export and Import utilities for Page Builder
 */

import type { PageData } from '@/types'
import { validatePageData } from './validation'

/**
 * Exports page data as a JSON file download
 */
export function exportPageAsJSON(pageData: PageData) {
  try {
    // Create a clean JSON string with proper formatting
    const jsonString = JSON.stringify(pageData, null, 2)

    // Create a blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' })

    // Create a download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    // Generate filename from page name and timestamp
    const timestamp = new Date().toISOString().split('T')[0]
    const safeName = (pageData.name || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    link.download = `${safeName}-${timestamp}.json`

    // Trigger download
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return { success: true }
  } catch (error) {
    console.error('Export error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export page'
    }
  }
}

/**
 * Imports and validates page data from a JSON file
 */
export async function importPageFromJSON(file: File): Promise<{
  success: boolean
  data?: PageData
  error?: string
}> {
  try {
    // Read file as text
    const text = await file.text()

    // Parse JSON
    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch (e) {
      return { success: false, error: 'Invalid JSON format' }
    }

    // Validate against schema
    const validation = validatePageData(parsed)

    if (!validation.success) {
      const errors = validation.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      return {
        success: false,
        error: `Validation failed: ${errors}`
      }
    }

    return {
      success: true,
      data: validation.data
    }
  } catch (error) {
    console.error('Import error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to import page'
    }
  }
}

/**
 * Creates a file input element and triggers file selection
 */
export function triggerFileImport(onImport: (data: PageData) => void) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json,application/json'

  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    const result = await importPageFromJSON(file)

    if (result.success && result.data) {
      onImport(result.data)
    } else {
      alert(`Import failed: ${result.error}`)
    }
  }

  input.click()
}

/**
 * Exports page data as HTML file using API route
 */
export async function exportPageAsHTML(pageData: PageData): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // Send page data to API route
    const response = await fetch('/api/export-html', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pageData),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.error || 'Failed to export HTML'
      }
    }

    // Get HTML content as blob
    const blob = await response.blob()

    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    // Generate filename
    const safeName = (pageData.name || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    link.download = `${safeName}.html`

    // Trigger download
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return { success: true }
  } catch (error) {
    console.error('HTML export error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export HTML'
    }
  }
}
