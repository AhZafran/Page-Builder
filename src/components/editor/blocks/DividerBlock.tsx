'use client'

import { useEditorStore } from '@/store/editorStore'
import type { DividerBlock as DividerBlockType } from '@/types'

interface DividerBlockProps {
  block: DividerBlockType
  sectionId: string
}

export function DividerBlock({ block, sectionId }: DividerBlockProps) {
  const { selectedElement, selectElement } = useEditorStore()
  const isSelected =
    selectedElement.type === 'block' &&
    selectedElement.sectionId === sectionId &&
    selectedElement.blockId === block.id

  const dividerStyle: React.CSSProperties = {
    width: block.style.width,
    height: `${block.style.height}px`,
    backgroundColor: block.style.color,
    borderStyle: block.style.style === 'solid' ? 'none' : block.style.style,
    borderWidth: block.style.style !== 'solid' ? `${block.style.height}px 0 0 0` : undefined,
    borderColor: block.style.style !== 'solid' ? block.style.color : undefined,
    marginTop: `${block.style.margin.top}px`,
    marginRight: `${block.style.margin.right}px`,
    marginBottom: `${block.style.margin.bottom}px`,
    marginLeft: block.style.margin.left === 0 ? 'auto' : `${block.style.margin.left}px`,
    marginInline: 'auto',
  }

  return (
    <div
      className={`cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      onClick={(e) => {
        e.stopPropagation()
        selectElement({ type: 'block', sectionId, blockId: block.id })
      }}
    >
      <hr style={dividerStyle} />
    </div>
  )
}
