'use client'

import { useState } from 'react'
import type { FAQBlock } from '@/types'
import { ChevronDown } from 'lucide-react'

interface FAQBlockComponentProps {
  block: FAQBlock
}

export function FAQBlockComponent({ block }: FAQBlockComponentProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const containerStyle: React.CSSProperties = {
    paddingTop: `${block.style.padding.top}px`,
    paddingRight: `${block.style.padding.right}px`,
    paddingBottom: `${block.style.padding.bottom}px`,
    paddingLeft: `${block.style.padding.left}px`,
    marginTop: `${block.style.margin.top}px`,
    marginRight: `${block.style.margin.right}px`,
    marginBottom: `${block.style.margin.bottom}px`,
    marginLeft: `${block.style.margin.left}px`,
    backgroundColor: block.style.backgroundColor,
  }

  const questionStyle: React.CSSProperties = {
    fontSize: `${block.style.fontSize}px`,
    fontWeight: block.style.fontWeight,
    fontFamily: block.style.fontFamily,
    color: block.style.questionColor,
  }

  const answerStyle: React.CSSProperties = {
    fontSize: `${block.style.fontSize * 0.9}px`,
    fontFamily: block.style.fontFamily,
    color: block.style.answerColor,
  }

  return (
    <div style={containerStyle}>
      <div className="space-y-2">
        {block.items.map((item, index) => (
          <div key={item.id} className="border rounded overflow-hidden">
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              style={questionStyle}
            >
              <span className="text-left">{item.question}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  openIndexes.includes(index) ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndexes.includes(index) && (
              <div className="px-4 py-3 border-t bg-gray-50" style={answerStyle}>
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
