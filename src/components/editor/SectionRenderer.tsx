'use client'

import { useState, useCallback } from 'react'
import type { Section } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { cn } from '@/lib/utils'
import { sanitizeURL } from '@/lib/security'
import { Button } from '@/components/ui/button'
import {
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  GripVertical,
  Plus,
} from 'lucide-react'
import { BlockRenderer } from './BlockRenderer'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

interface SectionRendererProps {
  section: Section
  index: number
  totalSections: number
}

export function SectionRenderer({ section, index, totalSections }: SectionRendererProps) {
  const [isHovered, setIsHovered] = useState(false)
  const selectedElement = useEditorStore((state) => state.selectedElement)
  const selectElement = useEditorStore((state) => state.selectElement)
  const moveSectionUp = useEditorStore((state) => state.moveSectionUp)
  const moveSectionDown = useEditorStore((state) => state.moveSectionDown)
  const deleteSection = useEditorStore((state) => state.deleteSection)
  const duplicateSection = useEditorStore((state) => state.duplicateSection)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: section.id,
    data: {
      type: 'section',
      sectionId: section.id,
      index,
    },
  })

  // Make the section content area droppable for new blocks
  const { setNodeRef: setDroppableRef, isOver: isOverDroppable } = useDroppable({
    id: `section-droppable-${section.id}`,
    data: {
      type: 'section',
      sectionId: section.id,
    },
  })

  // Combine refs using a callback ref
  const combinedContentRef = useCallback(
    (node: HTMLDivElement | null) => {
      setDroppableRef(node)
    },
    [setDroppableRef]
  )

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isSelected =
    selectedElement.type === 'section' && selectedElement.sectionId === section.id

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectElement({ type: 'section', sectionId: section.id })
  }

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation()
    moveSectionUp(section.id)
  }

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    moveSectionDown(section.id)
  }

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    duplicateSection(section.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Delete this section?')) {
      deleteSection(section.id)
    }
  }

  // Convert section style to CSS with sanitization
  const sanitizedBgImage = section.style.backgroundImage ? sanitizeURL(section.style.backgroundImage) : null

  const sectionStyle: React.CSSProperties = {
    backgroundColor: section.style.backgroundColor,
    backgroundImage: sanitizedBgImage ? `url(${sanitizedBgImage})` : undefined,
    backgroundSize: section.style.backgroundSize || 'cover',
    backgroundPosition: section.style.backgroundPosition || 'center',
    backgroundRepeat: section.style.backgroundRepeat || 'no-repeat',
    paddingTop: `${section.style.padding.top}px`,
    paddingRight: `${section.style.padding.right}px`,
    paddingBottom: `${section.style.padding.bottom}px`,
    paddingLeft: `${section.style.padding.left}px`,
    marginTop: `${section.style.margin.top}px`,
    marginRight: `${section.style.margin.right}px`,
    marginBottom: `${section.style.margin.bottom}px`,
    marginLeft: `${section.style.margin.left}px`,
    display: 'flex',
    flexDirection: section.style.flex.direction,
    alignItems: section.style.flex.alignItems,
    justifyContent: section.style.flex.justifyContent,
    flexWrap: section.style.flex.wrap,
    minHeight: section.blocks.length === 0 ? '120px' : 'auto',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative transition-all',
        isSelected && 'ring-2 ring-blue-500',
        isHovered && !isSelected && 'ring-1 ring-gray-300',
        isOver && 'ring-2 ring-green-500 bg-green-50/50'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      {...attributes}
    >
      {/* Section toolbar */}
      {(isHovered || isSelected) && (
        <div
          className="absolute -top-10 left-0 right-0 flex items-center justify-between bg-white border rounded-t px-2 py-1 shadow-sm z-10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center gap-1">
            <div {...listeners} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <span className="text-xs font-medium text-gray-600">
              Section {index + 1}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleMoveUp}
              disabled={index === 0}
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleMoveDown}
              disabled={index === totalSections - 1}
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleDuplicate}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Section content */}
      <div ref={combinedContentRef} style={sectionStyle}>
        {section.blocks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded">
            <div className="text-center">
              <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Drag blocks here</p>
            </div>
          </div>
        ) : (
          <SortableContext items={section.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            {section.blocks.map((block, blockIndex) => (
              <BlockRenderer
                key={block.id}
                block={block}
                sectionId={section.id}
                index={blockIndex}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  )
}
