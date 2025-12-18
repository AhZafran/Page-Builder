'use client'

import type { AccordionBlock as AccordionBlockType } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionBlockProps {
  block: AccordionBlockType
  sectionId: string
}

export function AccordionBlock({ block, sectionId }: AccordionBlockProps) {
  const { selectedElement, selectElement } = useEditorStore()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(block.defaultExpandedIndex !== undefined && block.defaultExpandedIndex >= 0
      ? [block.items[block.defaultExpandedIndex]?.id]
      : []
    )
  )

  const isSelected =
    selectedElement.type === 'block' &&
    selectedElement.sectionId === sectionId &&
    selectedElement.blockId === block.id

  const containerStyle: React.CSSProperties = {
    backgroundColor: block.style.backgroundColor,
    borderRadius: `${block.style.borderRadius}px`,
    padding: `${block.style.padding.top}px ${block.style.padding.right}px ${block.style.padding.bottom}px ${block.style.padding.left}px`,
    marginTop: `${block.style.margin.top}px`,
    marginRight: `${block.style.margin.right}px`,
    marginBottom: `${block.style.margin.bottom}px`,
    marginLeft: `${block.style.margin.left}px`,
    fontFamily: block.style.fontFamily,
  }

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)

      if (newSet.has(itemId)) {
        // Collapse this item
        newSet.delete(itemId)
      } else {
        // Expand this item
        if (!block.allowMultipleExpanded) {
          // Single mode: close all others
          newSet.clear()
        }
        newSet.add(itemId)
      }

      return newSet
    })
  }

  return (
    <div
      style={containerStyle}
      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        selectElement({ type: 'block', sectionId, blockId: block.id })
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${block.style.spacing}px` }}>
        {block.items.map((item) => {
          const isExpanded = expandedItems.has(item.id)

          const itemStyle: React.CSSProperties = {
            backgroundColor: isExpanded ? block.style.expandedItemBackgroundColor : block.style.itemBackgroundColor,
            border: `1px solid ${block.style.itemBorderColor}`,
            borderRadius: '8px',
            overflow: 'hidden',
            transition: 'background-color 0.2s',
          }

          const titleStyle: React.CSSProperties = {
            color: block.style.titleColor,
            fontSize: `${block.style.titleSize}px`,
            fontWeight: 600,
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none',
          }

          const contentStyle: React.CSSProperties = {
            color: block.style.contentColor,
            fontSize: `${block.style.contentSize}px`,
            padding: isExpanded ? '0 16px 16px 16px' : '0',
            maxHeight: isExpanded ? '1000px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease, padding 0.3s ease',
            lineHeight: '1.6',
          }

          const chevronStyle: React.CSSProperties = {
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }

          return (
            <div key={item.id} style={itemStyle}>
              <div
                style={titleStyle}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleItem(item.id)
                }}
              >
                <span>{item.title}</span>
                <ChevronDown size={20} style={chevronStyle} />
              </div>
              <div style={contentStyle}>
                {item.content}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
