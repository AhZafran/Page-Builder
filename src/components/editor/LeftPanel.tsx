'use client'

import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Type,
  Image,
  Video,
  MousePointerClick,
  Clock,
  HelpCircle,
  Space,
  LayoutGrid,
} from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import {
  createBlock,
  createHeroSection,
  createProductsSection,
  createTestimonialSection,
  createWhyChooseUsSection,
  createContactSection,
} from '@/lib/block-defaults'
import type { BlockType } from '@/types'
import { useDraggable } from '@dnd-kit/core'

const blockTypes = [
  { type: 'text' as BlockType, label: 'Text', icon: Type },
  { type: 'image' as BlockType, label: 'Image', icon: Image },
  { type: 'video' as BlockType, label: 'Video', icon: Video },
  { type: 'button' as BlockType, label: 'Button', icon: MousePointerClick },
  { type: 'countdown' as BlockType, label: 'Countdown', icon: Clock },
  { type: 'faq' as BlockType, label: 'FAQ', icon: HelpCircle },
  { type: 'space' as BlockType, label: 'Space', icon: Space },
]

const sectionTemplates = [
  { id: '1-col', label: '1 Column', columns: 1, type: 'basic' as const },
  { id: '2-col', label: '2 Columns', columns: 2, type: 'basic' as const },
  { id: '3-col', label: '3 Columns', columns: 3, type: 'basic' as const },
]

const preDefinedTemplates = [
  { id: 'hero', label: 'Hero Section', description: 'Eye-catching header with CTA' },
  { id: 'products', label: 'Products/Services', description: 'Showcase your offerings' },
  { id: 'testimonial', label: 'Testimonial', description: 'Customer reviews' },
  { id: 'why-choose-us', label: 'Why Choose Us', description: 'Your key benefits' },
  { id: 'contact', label: 'Contact Us', description: 'Get in touch section' },
]

interface DraggableBlockItemProps {
  blockType: BlockType
  label: string
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
}

interface DraggableSectionItemProps {
  templateId: string
  label: string
  description?: string
  columns?: number
  onClick: () => void
}

function DraggableBlockItem({ blockType, label, icon: Icon, onClick }: DraggableBlockItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-${blockType}`,
    data: {
      type: 'new-block',
      blockType,
    },
  })

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger onClick if not dragging
    if (!isDragging) {
      onClick()
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="p-3 cursor-grab active:cursor-grabbing hover:border-primary transition-opacity"
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Card>
  )
}

function DraggableSectionItem({ templateId, label, description, columns, onClick }: DraggableSectionItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-section-${templateId}`,
    data: {
      type: 'new-section',
      templateId,
    },
  })

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      onClick()
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="p-3 cursor-grab active:cursor-grabbing hover:border-primary transition-opacity"
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-2 mb-1">
        <LayoutGrid className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      {columns && (
        <div className="mt-2 flex gap-1">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="flex-1 h-8 bg-gray-100 rounded border border-gray-200" />
          ))}
        </div>
      )}
    </Card>
  )
}

export function LeftPanel() {
  const currentPage = useEditorStore((state) => state.currentPage)
  const addBlock = useEditorStore((state) => state.addBlock)
  const addSection = useEditorStore((state) => state.addSection)
  const selectedElement = useEditorStore((state) => state.selectedElement)

  const handleAddBlock = (type: BlockType) => {
    if (!currentPage || currentPage.sections.length === 0) {
      alert('Please add a section first')
      return
    }

    const block = createBlock(type)

    // Add to selected section or first section
    const targetSectionId =
      selectedElement.type === 'section'
        ? selectedElement.sectionId!
        : selectedElement.type === 'block'
        ? selectedElement.sectionId!
        : currentPage.sections[0].id

    addBlock(targetSectionId, block)
  }

  const handleAddSection = (templateId?: string) => {
    if (!templateId) {
      addSection()
      return
    }

    let section
    switch (templateId) {
      case 'hero':
        section = createHeroSection()
        break
      case 'products':
        section = createProductsSection()
        break
      case 'testimonial':
        section = createTestimonialSection()
        break
      case 'why-choose-us':
        section = createWhyChooseUsSection()
        break
      case 'contact':
        section = createContactSection()
        break
      default:
        addSection()
        return
    }

    if (section && currentPage) {
      const newSections = [...currentPage.sections, section]
      useEditorStore.setState({
        currentPage: { ...currentPage, sections: newSections },
        isDirty: true,
      })
    }
  }

  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-sm">Elements</h2>
      </div>

      <Tabs defaultValue="blocks" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="blocks" className="flex-1">
            Blocks
          </TabsTrigger>
          <TabsTrigger value="sections" className="flex-1">
            Sections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blocks" className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {blockTypes.map((block) => (
              <DraggableBlockItem
                key={block.type}
                blockType={block.type}
                label={block.label}
                icon={block.icon}
                onClick={() => handleAddBlock(block.type)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sections" className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Basic Column Layouts */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Basic Layouts</h3>
              <div className="space-y-2">
                {sectionTemplates.map((template) => (
                  <DraggableSectionItem
                    key={template.id}
                    templateId={template.id}
                    label={template.label}
                    columns={template.columns}
                    onClick={() => handleAddSection()}
                  />
                ))}
              </div>
            </div>

            {/* Pre-Defined Templates */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Templates</h3>
              <div className="space-y-2">
                {preDefinedTemplates.map((template) => (
                  <DraggableSectionItem
                    key={template.id}
                    templateId={template.id}
                    label={template.label}
                    description={template.description}
                    onClick={() => handleAddSection(template.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  )
}
