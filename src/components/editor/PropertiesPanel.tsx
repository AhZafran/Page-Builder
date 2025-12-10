'use client'

import { Card } from '@/components/ui/card'
import { Info } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { SectionProperties } from './properties/SectionProperties'
import { TextBlockProperties } from './properties/TextBlockProperties'
import { ImageBlockProperties } from './properties/ImageBlockProperties'
import { VideoBlockProperties } from './properties/VideoBlockProperties'
import { ButtonBlockProperties } from './properties/ButtonBlockProperties'
import { CountdownBlockProperties } from './properties/CountdownBlockProperties'
import { FAQBlockProperties } from './properties/FAQBlockProperties'
import { SpaceBlockProperties } from './properties/SpaceBlockProperties'

export function PropertiesPanel() {
  const currentPage = useEditorStore((state) => state.currentPage)
  const selectedElement = useEditorStore((state) => state.selectedElement)

  // Get the selected section or block
  const getSelectedElement = () => {
    if (!currentPage || !selectedElement.type) return null

    if (selectedElement.type === 'section') {
      return currentPage.sections.find((s) => s.id === selectedElement.sectionId)
    }

    if (selectedElement.type === 'block') {
      const section = currentPage.sections.find((s) => s.id === selectedElement.sectionId)
      if (section) {
        return section.blocks.find((b) => b.id === selectedElement.blockId)
      }
    }

    return null
  }

  const element = getSelectedElement()

  const renderProperties = () => {
    if (!element) {
      return (
        <>
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-sm text-blue-900 mb-1">
                  No Element Selected
                </h3>
                <p className="text-xs text-blue-700">
                  Click on a section or block in the canvas to edit its properties.
                </p>
              </div>
            </div>
          </Card>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Quick Tips</h3>
              <ul className="text-xs text-gray-600 space-y-2">
                <li>• Click blocks from the left panel to add them</li>
                <li>• Click any element to customize its properties</li>
                <li>• Use the canvas to preview your page in real-time</li>
                <li>• Save your work regularly</li>
              </ul>
            </div>
          </div>
        </>
      )
    }

    // Render section properties
    if (selectedElement.type === 'section' && 'blocks' in element) {
      return <SectionProperties section={element} />
    }

    // Render block properties based on type
    if (selectedElement.type === 'block' && 'type' in element) {
      switch (element.type) {
        case 'text':
          return <TextBlockProperties block={element} sectionId={selectedElement.sectionId!} />
        case 'image':
          return <ImageBlockProperties block={element} sectionId={selectedElement.sectionId!} />
        case 'video':
          return <VideoBlockProperties block={element} sectionId={selectedElement.sectionId!} />
        case 'button':
          return <ButtonBlockProperties block={element} sectionId={selectedElement.sectionId!} />
        case 'countdown':
          return <CountdownBlockProperties block={element} sectionId={selectedElement.sectionId!} />
        case 'faq':
          return <FAQBlockProperties block={element} sectionId={selectedElement.sectionId!} />
        case 'space':
          return <SpaceBlockProperties block={element} sectionId={selectedElement.sectionId!} />
        default:
          return <div className="text-sm text-gray-500">Unknown block type</div>
      }
    }

    return null
  }

  return (
    <aside className="w-80 bg-white border-l flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-sm">Properties</h2>
        {element && (
          <p className="text-xs text-gray-500 mt-1 capitalize">
            {selectedElement.type === 'section' ? 'Section' : (element as any).type}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {renderProperties()}
      </div>
    </aside>
  )
}
