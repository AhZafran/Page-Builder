import type { PageData } from '@/types'

const AUTOSAVE_KEY_PREFIX = 'lpb_autosave_'

export type SaveResult =
  | { success: true }
  | { success: false; error: 'quota_exceeded' | 'unknown' }

/**
 * Save page to localStorage for auto-save
 * Returns a result object indicating success or specific error type
 */
export function saveToLocalStorage(pageId: string, data: PageData): SaveResult {
  try {
    const key = `${AUTOSAVE_KEY_PREFIX}${pageId}`
    const payload = {
      data,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(key, JSON.stringify(payload))
    return { success: true }
  } catch (error) {
    console.error('Error saving to localStorage:', error)

    // Check if error is due to quota exceeded
    if (error instanceof DOMException && (
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED' || // Firefox
      error.code === 22 || // Legacy browsers
      error.code === 1014 // Firefox
    )) {
      console.warn('localStorage quota exceeded. Consider clearing old data.')
      return { success: false, error: 'quota_exceeded' }
    }

    return { success: false, error: 'unknown' }
  }
}

/**
 * Load page from localStorage
 */
export function loadFromLocalStorage(pageId: string): { data: PageData; timestamp: string } | null {
  try {
    const key = `${AUTOSAVE_KEY_PREFIX}${pageId}`
    const stored = localStorage.getItem(key)
    if (!stored) return null

    return JSON.parse(stored)
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return null
  }
}

/**
 * Clear auto-save from localStorage
 */
export function clearLocalStorage(pageId: string) {
  try {
    const key = `${AUTOSAVE_KEY_PREFIX}${pageId}`
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Error clearing localStorage:', error)
    return false
  }
}

/**
 * Check if local version is newer than server version
 */
export function isLocalNewer(pageId: string, serverTimestamp: string): boolean {
  const local = loadFromLocalStorage(pageId)
  if (!local) return false

  return new Date(local.timestamp) > new Date(serverTimestamp)
}

/**
 * Clear all auto-save data from localStorage
 * Useful when quota is exceeded
 */
export function clearAllAutoSaves(): number {
  let clearedCount = 0
  try {
    const keys = Object.keys(localStorage)
    const autosaveKeys = keys.filter(key => key.startsWith(AUTOSAVE_KEY_PREFIX))

    for (const key of autosaveKeys) {
      localStorage.removeItem(key)
      clearedCount++
    }

    console.log(`Cleared ${clearedCount} auto-save entries`)
  } catch (error) {
    console.error('Error clearing auto-saves:', error)
  }

  return clearedCount
}

/**
 * Get the total size of localStorage in bytes (approximate)
 */
export function getLocalStorageSize(): number {
  let total = 0
  try {
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length
      }
    }
  } catch (error) {
    console.error('Error calculating localStorage size:', error)
  }
  return total
}
