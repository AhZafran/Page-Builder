import { useEffect, useRef, useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { saveToLocalStorage, clearAllAutoSaves, getLocalStorageSize } from '@/lib/localStorage'

/**
 * Auto-save hook with debouncing and quota error handling
 * Saves to localStorage every X seconds when page changes
 */
export function useAutoSave(intervalMs: number = 3000) {
  const { currentPage, isDirty } = useEditorStore()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const [hasShownQuotaWarning, setHasShownQuotaWarning] = useState(false)

  useEffect(() => {
    if (!currentPage || !isDirty) return

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      const result = saveToLocalStorage(currentPage.id, currentPage)

      if (result.success) {
        console.log('Auto-saved to localStorage')
        setHasShownQuotaWarning(false) // Reset warning flag on success
      } else {
        // Handle save failure
        if (result.error === 'quota_exceeded' && !hasShownQuotaWarning) {
          const storageSize = getLocalStorageSize()
          const sizeMB = (storageSize / (1024 * 1024)).toFixed(2)

          console.error(`localStorage quota exceeded (using ~${sizeMB}MB)`)

          // Show user-friendly alert
          if (confirm(
            `Auto-save failed: Storage is full (using ~${sizeMB}MB).\n\n` +
            'Would you like to clear old auto-save data to free up space?\n\n' +
            'Note: Make sure to manually save your work before clearing!'
          )) {
            const clearedCount = clearAllAutoSaves()
            alert(`Cleared ${clearedCount} old auto-save entries. Please save your work manually.`)
          } else {
            alert('Auto-save is disabled. Please save your work manually and consider clearing browser data.')
          }

          setHasShownQuotaWarning(true) // Prevent repeated alerts
        } else if (result.error === 'unknown') {
          console.error('Unknown error during auto-save')
        }
      }
    }, intervalMs)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentPage, isDirty, intervalMs, hasShownQuotaWarning])
}
