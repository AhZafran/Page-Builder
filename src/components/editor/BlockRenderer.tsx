'use client'

import { useState } from 'react'
import type { Block } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Copy, Trash2, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Import individual block components
import { TextBlockComponent } from './blocks/TextBlock'
import { ImageBlockComponent } from './blocks/ImageBlock'
import { VideoBlockComponent } from './blocks/VideoBlock'
import { ButtonBlockComponent } from './blocks/ButtonBlock'
import { CountdownBlockComponent } from './blocks/CountdownBlock'
import { FAQBlockComponent } from './blocks/FAQBlock'
import { SpaceBlockComponent } from './blocks/SpaceBlock'
import { DividerBlock } from './blocks/DividerBlock'
import { IconBlock } from './blocks/IconBlock'
import { SocialMediaBlock } from './blocks/SocialMediaBlock'
import { TestimonialBlock } from './blocks/TestimonialBlock'
import { FeatureBlock } from './blocks/FeatureBlock'
import { PricingBlock } from './blocks/PricingBlock'
import { FormBlock } from './blocks/FormBlock'
import { AccordionBlock } from './blocks/AccordionBlock'
import { QuoteBlock } from './blocks/QuoteBlock'
import { StatsBlock } from './blocks/StatsBlock'
import { TeamMemberBlock } from './blocks/TeamMemberBlock'
import { GalleryBlock } from './blocks/GalleryBlock'
import { LogoGridBlock } from './blocks/LogoGridBlock'
import { EmbedBlock } from './blocks/EmbedBlock'
import { NewsletterBlock } from './blocks/NewsletterBlock'

interface BlockRendererProps {
  block: Block
  sectionId: string
  index?: number
  isSelected?: boolean
  isPreview?: boolean
}

export function BlockRenderer({ block, sectionId, index = 0, isSelected: isSelectedProp = false, isPreview = false }: BlockRendererProps) {
  const [isHovered, setIsHovered] = useState(false)
  const selectedElement = useEditorStore((state) => state.selectedElement)
  const selectElement = useEditorStore((state) => state.selectElement)
  const deleteBlock = useEditorStore((state) => state.deleteBlock)
  const duplicateBlock = useEditorStore((state) => state.duplicateBlock)

  const sortable = useSortable({
    id: block.id,
    data: {
      type: 'block',
      sectionId,
      blockId: block.id,
    },
    disabled: isPreview,
  })

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = sortable

  const style = isPreview ? {} : {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isSelected = isPreview ? isSelectedProp : (
    selectedElement.type === 'block' &&
    selectedElement.sectionId === sectionId &&
    selectedElement.blockId === block.id
  )

  const handleClick = (e: React.MouseEvent) => {
    if (isPreview) return
    e.stopPropagation()
    selectElement({ type: 'block', sectionId, blockId: block.id })
  }

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    duplicateBlock(sectionId, block.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Delete this block?')) {
      deleteBlock(sectionId, block.id)
    }
  }

  // Render the appropriate block component based on type
  const renderBlockContent = () => {
    switch (block.type) {
      case 'text':
        return <TextBlockComponent block={block} />
      case 'image':
        return <ImageBlockComponent block={block} />
      case 'video':
        return <VideoBlockComponent block={block} />
      case 'button':
        return <ButtonBlockComponent block={block} />
      case 'countdown':
        return <CountdownBlockComponent block={block} />
      case 'faq':
        return <FAQBlockComponent block={block} />
      case 'space':
        return <SpaceBlockComponent block={block} />
      case 'divider':
        return <DividerBlock block={block} sectionId={sectionId} />
      case 'icon':
        return <IconBlock block={block} sectionId={sectionId} />
      case 'social':
        return <SocialMediaBlock block={block} sectionId={sectionId} />
      case 'testimonial':
        return <TestimonialBlock block={block} sectionId={sectionId} />
      case 'feature':
        return <FeatureBlock block={block} sectionId={sectionId} />
      case 'pricing':
        return <PricingBlock block={block} sectionId={sectionId} />
      case 'form':
        return <FormBlock block={block} sectionId={sectionId} />
      case 'accordion':
        return <AccordionBlock block={block} sectionId={sectionId} />
      case 'quote':
        return <QuoteBlock block={block} sectionId={sectionId} />
      case 'stats':
        return <StatsBlock block={block} sectionId={sectionId} />
      case 'team':
        return <TeamMemberBlock block={block} sectionId={sectionId} />
      case 'gallery':
        return <GalleryBlock block={block} sectionId={sectionId} />
      case 'logo-grid':
        return <LogoGridBlock block={block} sectionId={sectionId} />
      case 'embed':
        return <EmbedBlock block={block} sectionId={sectionId} />
      case 'newsletter':
        return <NewsletterBlock block={block} sectionId={sectionId} />
      default: {
        // Exhaustiveness check - this should never be reached
        const _exhaustiveCheck: never = block
        return <div className="p-4 bg-red-50 text-red-600 text-sm">Unknown block type</div>
      }
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative transition-all group',
        isSelected && 'ring-2 ring-blue-500',
        isHovered && !isSelected && 'ring-1 ring-gray-300'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      {...attributes}
    >
      {/* Block toolbar */}
      {!isPreview && (isHovered || isSelected) && (
        <div
          className="absolute -top-8 left-0 flex items-center gap-1 bg-white border rounded px-2 py-1 shadow-sm z-20"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-3 w-3 text-gray-400" />
          </div>
          <span className="text-xs font-medium text-gray-600 capitalize">
            {block.type}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleDuplicate}
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Block content */}
      {renderBlockContent()}
    </div>
  )
}
