'use client'

import type { FAQBlock } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useDebouncedCallback } from '@/hooks/useDebounce'

interface FAQBlockPropertiesProps {
  block: FAQBlock
  sectionId: string
}

export function FAQBlockProperties({ block, sectionId }: FAQBlockPropertiesProps) {
  const { updateBlock } = useEditorStore()

  const handleAddItem = () => {
    const newItems = [
      ...block.items,
      {
        id: `faq-${nanoid()}`,
        question: 'New question',
        answer: 'New answer',
      },
    ]
    updateBlock(sectionId, block.id, { items: newItems })
  }

  const handleRemoveItem = (id: string) => {
    const newItems = block.items.filter((item) => item.id !== id)
    updateBlock(sectionId, block.id, { items: newItems })
  }

  const handleUpdateItem = (id: string, field: 'question' | 'answer', value: string) => {
    const newItems = block.items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    )
    updateBlock(sectionId, block.id, { items: newItems })
  }

  // Debounced handler for text inputs
  const debouncedHandleUpdateItem = useDebouncedCallback(handleUpdateItem, 300)

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-xs font-semibold">FAQ Items</Label>
          <Button variant="outline" size="sm" onClick={handleAddItem}>
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>

        <div className="space-y-4">
          {block.items.map((item) => (
            <div key={item.id} className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-gray-600">Question</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <Input
                value={item.question}
                onChange={(e) => debouncedHandleUpdateItem(item.id, 'question', e.target.value)}
                placeholder="Question"
              />
              <Label className="text-xs text-gray-600">Answer</Label>
              <Textarea
                value={item.answer}
                onChange={(e) => debouncedHandleUpdateItem(item.id, 'answer', e.target.value)}
                placeholder="Answer"
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
