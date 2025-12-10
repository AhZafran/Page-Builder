'use client'

import type { SpaceBlock } from '@/types'

interface SpaceBlockComponentProps {
  block: SpaceBlock
}

export function SpaceBlockComponent({ block }: SpaceBlockComponentProps) {
  return (
    <div
      style={{ height: `${block.height}px` }}
      className="bg-transparent"
    />
  )
}
