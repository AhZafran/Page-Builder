import { supabase } from './client'
import type { PageData } from '@/types'

export interface SavePageParams {
  id?: string
  name: string
  slug?: string
  data: PageData
}

export interface SavePageResult {
  success: boolean
  pageId?: string
  error?: string
}

/**
 * Save a page to Supabase
 */
export async function savePage(params: SavePageParams): Promise<SavePageResult> {
  try {
    const { id, name, slug, data } = params

    if (id) {
      // Update existing page
      const { data: updatedPage, error } = await supabase
        .from('pages')
        .update({
          name,
          slug,
          data: data as any,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating page:', error)
        return { success: false, error: error.message }
      }

      return { success: true, pageId: updatedPage.id }
    } else {
      // Create new page
      const { data: newPage, error } = await supabase
        .from('pages')
        .insert({
          name,
          slug,
          data: data as any,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating page:', error)
        return { success: false, error: error.message }
      }

      return { success: true, pageId: newPage.id }
    }
  } catch (error) {
    console.error('Unexpected error saving page:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Load a page from Supabase
 */
export async function loadPage(pageId: string) {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single()

    if (error) {
      console.error('Error loading page:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Unexpected error loading page:', error)
    return null
  }
}

/**
 * List all pages
 */
export async function listPages() {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('id, name, slug, created_at, updated_at')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error listing pages:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error listing pages:', error)
    return []
  }
}

/**
 * Delete a page
 */
export async function deletePage(pageId: string) {
  try {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', pageId)

    if (error) {
      console.error('Error deleting page:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error deleting page:', error)
    return false
  }
}
