'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Save, Eye, Download, Upload, Undo, Redo, Loader2, ChevronDown, FileText } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { savePage } from '@/lib/supabase/pages'
import { clearLocalStorage } from '@/lib/localStorage'
import { exportPageAsJSON, exportPageAsHTML, triggerFileImport } from '@/lib/export'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TemplatesModal } from './TemplatesModal'

export function EditorHeader() {
  const router = useRouter()
  const { currentPage, setCurrentPage, undo, redo, canUndo, canRedo, isDirty } = useEditorStore()
  const [isSaving, setIsSaving] = useState(false)
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false)
  const [templatesModalMode, setTemplatesModalMode] = useState<'apply' | 'save'>('apply')

  const handleSave = async () => {
    if (!currentPage) return

    setIsSaving(true)
    try {
      const result = await savePage({
        id: currentPage.id,
        name: currentPage.name || 'Untitled Page',
        slug: currentPage.slug,
        data: currentPage,
      })

      if (result.success) {
        // Clear localStorage auto-save after successful save
        clearLocalStorage(currentPage.id)
        alert('Page saved successfully!')
      } else {
        alert(`Failed to save: ${result.error}`)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save page')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUndo = () => {
    if (canUndo()) undo()
  }

  const handleRedo = () => {
    if (canRedo()) redo()
  }

  const handleExportJSON = () => {
    if (!currentPage) return

    const result = exportPageAsJSON(currentPage)

    if (result.success) {
      alert('Page exported as JSON successfully!')
    } else {
      alert(`Export failed: ${result.error}`)
    }
  }

  const handleExportHTML = async () => {
    if (!currentPage) return

    const result = await exportPageAsHTML(currentPage)

    if (result.success) {
      alert('Page exported as HTML successfully!')
    } else {
      alert(`Export failed: ${result.error}`)
    }
  }

  const handleImport = () => {
    const confirmed = confirm(
      'Importing will replace your current page. Make sure to save any changes first. Continue?'
    )

    if (!confirmed) return

    triggerFileImport((data) => {
      setCurrentPage(data)
      alert('Page imported successfully!')
    })
  }

  const handlePreview = () => {
    if (!currentPage) return

    // Save page data to sessionStorage for preview
    sessionStorage.setItem('preview-page-data', JSON.stringify(currentPage))

    // Navigate to preview page
    router.push('/preview')
  }

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold">Page Builder</h1>
        <div className="text-sm text-gray-500">
          {currentPage?.name || 'Untitled Page'}
          {isDirty && <span className="text-orange-500 ml-1">•</span>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleUndo}
          disabled={!canUndo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRedo}
          disabled={!canRedo()}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        {/* Actions */}
        <Button variant="ghost" size="sm" onClick={handlePreview} disabled={!currentPage}>
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Templates
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setTemplatesModalMode('apply')
                setTemplatesModalOpen(true)
              }}
            >
              Load Template
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setTemplatesModalMode('save')
                setTemplatesModalOpen(true)
              }}
              disabled={!currentPage}
            >
              Save as Template
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm" onClick={handleImport}>
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" disabled={!currentPage}>
              <Download className="h-4 w-4 mr-2" />
              Export
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportJSON}>
              Export as JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportHTML}>
              Export as HTML
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" onClick={handleSave} disabled={isSaving || !currentPage}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save
            </>
          )}
        </Button>
      </div>

      {/* Templates Modal */}
      <TemplatesModal
        open={templatesModalOpen}
        onOpenChange={setTemplatesModalOpen}
        mode={templatesModalMode}
      />
    </header>
  )
}
