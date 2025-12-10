'use client'

import { useState, useEffect } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { loadFromLocalStorage, clearLocalStorage } from '@/lib/localStorage'
import { useEditorStore } from '@/store/editorStore'
import type { PageData } from '@/types'

interface DraftRestorationDialogProps {
  pageId: string
  serverData: PageData
  serverTimestamp: string
}

export function DraftRestorationDialog({
  pageId,
  serverData,
  serverTimestamp,
}: DraftRestorationDialogProps) {
  const [open, setOpen] = useState(false)
  const [localDraft, setLocalDraft] = useState<{ data: PageData; timestamp: string } | null>(null)
  const { setCurrentPage } = useEditorStore()

  useEffect(() => {
    // Check for local draft
    const draft = loadFromLocalStorage(pageId)
    if (!draft) return

    // Compare timestamps
    const localTime = new Date(draft.timestamp)
    const serverTime = new Date(serverTimestamp)

    if (localTime > serverTime) {
      setLocalDraft(draft)
      setOpen(true)
    }
  }, [pageId, serverTimestamp])

  const handleRestoreLocal = () => {
    if (localDraft) {
      setCurrentPage(localDraft.data)
      setOpen(false)
    }
  }

  const handleUseServer = () => {
    // Clear local draft and use server version
    clearLocalStorage(pageId)
    setCurrentPage(serverData)
    setOpen(false)
  }

  if (!localDraft) return null

  const localDate = new Date(localDraft.timestamp).toLocaleString()
  const serverDate = new Date(serverTimestamp).toLocaleString()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved Changes Detected</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              We found a local draft that's newer than the version saved in the cloud. Which
              version would you like to use?
            </p>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <div className="font-medium text-blue-900">Local Draft (Auto-saved)</div>
                <div className="text-blue-700 text-xs mt-1">Saved: {localDate}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <div className="font-medium text-gray-900">Cloud Version</div>
                <div className="text-gray-700 text-xs mt-1">Saved: {serverDate}</div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleUseServer}>Use Cloud Version</AlertDialogCancel>
          <AlertDialogAction onClick={handleRestoreLocal}>
            Restore Local Draft
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
