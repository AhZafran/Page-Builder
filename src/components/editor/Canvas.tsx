'use client'

import { useEffect } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useEditorStore } from '@/store/editorStore'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SectionRenderer } from './SectionRenderer'
import { createDefaultSection, createDefaultTextBlock } from '@/lib/block-defaults'
import { nanoid } from 'nanoid'
import { loadFromLocalStorage } from '@/lib/localStorage'

const DEFAULT_PAGE_ID = 'default-page'

export function Canvas() {
  const currentPage = useEditorStore((state) => state.currentPage)
  const setCurrentPage = useEditorStore((state) => state.setCurrentPage)
  const addSection = useEditorStore((state) => state.addSection)
  const clearSelection = useEditorStore((state) => state.clearSelection)

  // Initialize with localStorage or sample data on mount
  useEffect(() => {
    if (!currentPage) {
      // Try to load from localStorage first
      const saved = loadFromLocalStorage(DEFAULT_PAGE_ID)

      if (saved?.data) {
        // Restore from localStorage
        setCurrentPage(saved.data)
      } else {
        // Create a sample page with one section
        const sampleSection = createDefaultSection([createDefaultTextBlock()])
        sampleSection.blocks[0].content = 'Welcome to Page Builder'
        sampleSection.blocks[0].style.fontSize = 32
        sampleSection.blocks[0].style.fontWeight = 700
        sampleSection.blocks[0].style.textAlign = 'center'

        setCurrentPage({
          id: DEFAULT_PAGE_ID,
          name: 'Untitled Page',
          sections: [sampleSection],
        })
      }
    }
  }, [currentPage, setCurrentPage])

  const handleAddSection = () => {
    addSection()
  }

  const handleCanvasClick = () => {
    clearSelection()
  }

  if (!currentPage) {
    return (
      <main className="flex-1 overflow-y-auto bg-gray-100">
        <div className="min-h-full p-8 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gray-100" onClick={handleCanvasClick}>
      <div className="min-h-full p-8">
        {/* Canvas Container */}
        <div className="max-w-5xl mx-auto">
          {/* Page Canvas */}
          <div className="bg-white shadow-lg min-h-[800px] rounded-lg overflow-hidden">
            {currentPage.sections.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center h-[600px] text-center p-8">
                <div className="mb-4 p-4 bg-gray-50 rounded-full">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Start Building Your Page
                </h3>
                <p className="text-sm text-gray-500 mb-6 max-w-md">
                  Click the button below to add your first section, then drag blocks
                  from the left panel to build your landing page.
                </p>
                <Button onClick={handleAddSection}>Add Your First Section</Button>
              </div>
            ) : (
              /* Render sections */
              <div className="p-8">
                <SortableContext items={currentPage.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  {currentPage.sections.map((section, index) => (
                    <SectionRenderer
                      key={section.id}
                      section={section}
                      index={index}
                      totalSections={currentPage.sections.length}
                    />
                  ))}
                </SortableContext>
                <div className="mt-8 text-center">
                  <Button variant="outline" onClick={handleAddSection}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
