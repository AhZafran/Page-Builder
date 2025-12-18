'use client'

import type { StatsBlock as StatsBlockType } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { TrendingUp } from 'lucide-react'

interface StatsBlockProps {
  block: StatsBlockType
  sectionId: string
}

export function StatsBlock({ block, sectionId }: StatsBlockProps) {
  const { selectedElement, selectElement } = useEditorStore()

  const isSelected =
    selectedElement.type === 'block' &&
    selectedElement.sectionId === sectionId &&
    selectedElement.blockId === block.id

  const containerStyle: React.CSSProperties = {
    backgroundColor: block.style.backgroundColor,
    borderRadius: `${block.style.borderRadius}px`,
    padding: `${block.style.padding.top}px ${block.style.padding.right}px ${block.style.padding.bottom}px ${block.style.padding.left}px`,
    margin: `${block.style.margin.top}px ${block.style.margin.right}px ${block.style.margin.bottom}px ${block.style.margin.left}px`,
    fontFamily: block.style.fontFamily,
  }

  const itemsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: block.style.layout === 'vertical' ? 'column' : 'row',
    gap: `${block.style.itemSpacing}px`,
    flexWrap: block.style.layout === 'horizontal' ? 'wrap' : 'nowrap',
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
      <div style={itemsContainerStyle}>
        {block.items.map((item) => {
          const percentage = item.maxValue ? (item.value / item.maxValue) * 100 : 100

          const itemStyle: React.CSSProperties = {
            flex: block.style.layout === 'horizontal' ? '1 1 200px' : 'none',
            minWidth: block.style.layout === 'horizontal' ? '200px' : 'auto',
          }

          const labelStyle: React.CSSProperties = {
            color: block.style.labelColor,
            fontSize: `${block.style.labelSize}px`,
            fontWeight: 500,
            marginBottom: '8px',
            textAlign: block.style.alignment,
          }

          const valueStyle: React.CSSProperties = {
            color: block.style.valueColor,
            fontSize: `${block.style.valueSize}px`,
            fontWeight: 700,
            marginBottom: item.showProgressBar ? '12px' : '0',
            textAlign: block.style.alignment,
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              block.style.alignment === 'center'
                ? 'center'
                : block.style.alignment === 'right'
                ? 'flex-end'
                : 'flex-start',
            gap: '8px',
          }

          const progressBarContainerStyle: React.CSSProperties = {
            width: '100%',
            height: `${block.style.progressBarHeight}px`,
            backgroundColor: block.style.progressBarBackgroundColor,
            borderRadius: `${block.style.progressBarHeight / 2}px`,
            overflow: 'hidden',
            position: 'relative',
          }

          const progressBarFillStyle: React.CSSProperties = {
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: block.style.progressBarColor,
            transition: 'width 0.5s ease-in-out',
            borderRadius: `${block.style.progressBarHeight / 2}px`,
          }

          return (
            <div key={item.id} style={itemStyle}>
              <div style={labelStyle}>{item.label}</div>
              <div style={valueStyle}>
                <TrendingUp size={block.style.valueSize * 0.8} />
                <span>
                  {item.prefix}
                  {item.value.toLocaleString()}
                  {item.suffix}
                </span>
              </div>
              {item.showProgressBar && (
                <div style={progressBarContainerStyle}>
                  <div style={progressBarFillStyle} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
