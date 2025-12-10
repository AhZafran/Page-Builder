'use client'

import type { TextBlock } from '@/types'

interface TextBlockComponentProps {
  block: TextBlock
}

export function TextBlockComponent({ block }: TextBlockComponentProps) {
  const style: React.CSSProperties = {
    fontFamily: block.style.fontFamily,
    fontSize: `${block.style.fontSize}px`,
    fontWeight: block.style.fontWeight,
    fontStyle: block.style.fontStyle,
    color: block.style.color,
    backgroundColor: block.style.backgroundColor,
    textAlign: block.style.textAlign,
    paddingTop: `${block.style.padding.top}px`,
    paddingRight: `${block.style.padding.right}px`,
    paddingBottom: `${block.style.padding.bottom}px`,
    paddingLeft: `${block.style.padding.left}px`,
    marginTop: `${block.style.margin.top}px`,
    marginRight: `${block.style.margin.right}px`,
    marginBottom: `${block.style.margin.bottom}px`,
    marginLeft: `${block.style.margin.left}px`,
  }

  return (
    <div style={style}>
      {block.content || 'Enter your text here'}
    </div>
  )
}
