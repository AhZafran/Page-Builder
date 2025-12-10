'use client'

import { LeftPanel } from './LeftPanel'
import { Canvas } from './Canvas'
import { PropertiesPanel } from './PropertiesPanel'
import { EditorHeader } from './EditorHeader'
import { useAutoSave } from '@/hooks/useAutoSave'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useState, useEffect } from 'react'
import { useEditorStore } from '@/store/editorStore'
import {
  createBlock,
  createHeroSection,
  createProductsSection,
  createTestimonialSection,
  createWhyChooseUsSection,
  createContactSection,
  createDefaultSection,
} from '@/lib/block-defaults'
import type { BlockType } from '@/types'

export function EditorLayout() {
  // Enable auto-save to localStorage every 3 seconds
  useAutoSave(3000)

  const [activeId, setActiveId] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const currentPage = useEditorStore((state) => state.currentPage)
  const addBlock = useEditorStore((state) => state.addBlock)
  const moveBlock = useEditorStore((state) => state.moveBlock)
  const moveSection = useEditorStore((state) => state.moveSection)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || !currentPage) return

    const activeData = active.data.current
    const overData = over.data.current

    // Handle dragging a new block from the left panel to a section
    if (activeData?.type === 'new-block' && overData?.type === 'section') {
      const blockType = activeData.blockType as BlockType
      const sectionId = overData.sectionId as string
      const newBlock = createBlock(blockType)
      addBlock(sectionId, newBlock)
      return
    }

    // Handle dragging a new block from the left panel over an existing block
    if (activeData?.type === 'new-block' && overData?.type === 'block') {
      const blockType = activeData.blockType as BlockType
      const sectionId = overData.sectionId as string
      const overBlockId = over.id as string

      const section = currentPage.sections.find((s) => s.id === sectionId)
      if (section) {
        const newBlock = createBlock(blockType)
        const overBlockIndex = section.blocks.findIndex((b) => b.id === overBlockId)
        addBlock(sectionId, newBlock, overBlockIndex + 1)
      }
      return
    }

    // Handle dragging a new section from the left panel
    if (activeData?.type === 'new-section') {
      const templateId = activeData.templateId as string
      let newSection

      // Create section based on template ID
      switch (templateId) {
        case 'hero':
          newSection = createHeroSection()
          break
        case 'products':
          newSection = createProductsSection()
          break
        case 'testimonial':
          newSection = createTestimonialSection()
          break
        case 'why-choose-us':
          newSection = createWhyChooseUsSection()
          break
        case 'contact':
          newSection = createContactSection()
          break
        default:
          newSection = createDefaultSection()
      }

      if (newSection) {
        // Determine where to insert the section
        let insertIndex = currentPage.sections.length

        // If dropped over a section, insert after it
        if (overData?.type === 'section') {
          const overSectionIndex = currentPage.sections.findIndex(
            (s) => s.id === overData.sectionId
          )
          if (overSectionIndex !== -1) {
            insertIndex = overSectionIndex + 1
          }
        }

        // Add section to store
        const newSections = [...currentPage.sections]
        newSections.splice(insertIndex, 0, newSection)

        useEditorStore.setState({
          currentPage: { ...currentPage, sections: newSections },
          isDirty: true,
        })
      }
      return
    }

    // Handle reordering blocks within sections
    if (activeData?.type === 'block' && overData?.type === 'block') {
      const activeSectionId = activeData.sectionId
      const activeBlockId = active.id as string
      const overSectionId = overData.sectionId
      const overBlockId = over.id as string

      if (activeSectionId === overSectionId) {
        // Same section - reorder
        const section = currentPage.sections.find((s) => s.id === activeSectionId)
        if (section) {
          const oldIndex = section.blocks.findIndex((b) => b.id === activeBlockId)
          const newIndex = section.blocks.findIndex((b) => b.id === overBlockId)

          if (oldIndex !== newIndex) {
            moveBlock(activeSectionId, activeBlockId, overSectionId, newIndex)
          }
        }
      } else {
        // Different section - move
        const overSection = currentPage.sections.find((s) => s.id === overSectionId)
        if (overSection) {
          const newIndex = overSection.blocks.findIndex((b) => b.id === overBlockId)
          moveBlock(activeSectionId, activeBlockId, overSectionId, newIndex)
        }
      }
    }

    // Handle dropping block into empty section
    if (activeData?.type === 'block' && overData?.type === 'section') {
      const activeSectionId = activeData.sectionId
      const activeBlockId = active.id as string
      const overSectionId = overData.sectionId as string

      if (activeSectionId !== overSectionId) {
        moveBlock(activeSectionId, activeBlockId, overSectionId, 0)
      }
    }

    // Handle section reordering
    if (activeData?.type === 'section' && overData?.type === 'section') {
      const oldIndex = activeData.index as number
      const newIndex = overData.index as number

      if (oldIndex !== newIndex) {
        moveSection(oldIndex, newIndex)
      }
    }
  }

  // Show loading state until mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      autoScroll={false}
    >
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <EditorHeader />

        {/* Three-panel layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Blocks Library */}
          <LeftPanel />

          {/* Canvas - Page Preview */}
          <Canvas />

          {/* Right Panel - Properties */}
          <PropertiesPanel />
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeId ? (
          <div className="bg-white border-2 border-blue-500 rounded p-4 shadow-lg">
            Dragging...
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
