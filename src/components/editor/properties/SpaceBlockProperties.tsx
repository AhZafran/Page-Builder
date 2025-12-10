'use client'

import type { SpaceBlock } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { useDebouncedCallback } from '@/hooks/useDebounce'

interface SpaceBlockPropertiesProps {
  block: SpaceBlock
  sectionId: string
}

export function SpaceBlockProperties({ block, sectionId }: SpaceBlockPropertiesProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock)

  const handleChange = (value: number) => {
    updateBlock(sectionId, block.id, { height: value })
  }

  // Debounced handler for slider
  const debouncedHandleChange = useDebouncedCallback(handleChange, 150)

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-xs font-semibold">Height</Label>
        <div className="flex items-center gap-3 mt-2">
          <Slider
            value={[block.height]}
            onValueChange={(value) => debouncedHandleChange(value[0])}
            min={0}
            max={200}
            step={10}
            className="flex-1"
          />
          <span className="text-xs text-gray-600 w-12 text-right">
            {block.height}px
          </span>
        </div>
      </div>
    </div>
  )
}
