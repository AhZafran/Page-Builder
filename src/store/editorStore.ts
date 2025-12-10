import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { PageData, Section, Block } from '@/types'
import { createDefaultSection } from '@/lib/block-defaults'
import { nanoid } from 'nanoid'

interface SelectedElement {
  type: 'section' | 'block' | null
  sectionId?: string
  blockId?: string
}

interface EditorState {
  // Current page data
  currentPage: PageData | null

  // Selection state
  selectedElement: SelectedElement

  // History for undo/redo
  history: PageData[]
  historyIndex: number

  // UI state
  isDirty: boolean
  isSaving: boolean

  // Actions
  setCurrentPage: (page: PageData) => void
  selectElement: (element: SelectedElement) => void
  clearSelection: () => void

  // Section actions
  sections: Section[]
  setSections: (sections: Section[]) => void
  addSection: (section?: Section) => void
  updateSection: (sectionId: string, updates: Partial<Section>) => void
  deleteSection: (sectionId: string) => void
  moveSectionUp: (sectionId: string) => void
  moveSectionDown: (sectionId: string) => void
  moveSection: (oldIndex: number, newIndex: number) => void
  duplicateSection: (sectionId: string) => void

  // Block actions
  addBlock: (sectionId: string, block: Block, index?: number) => void
  updateBlock: (sectionId: string, blockId: string, updates: Partial<Block>) => void
  deleteBlock: (sectionId: string, blockId: string) => void
  moveBlock: (sectionId: string, blockId: string, newSectionId: string, newIndex: number) => void
  duplicateBlock: (sectionId: string, blockId: string) => void

  // History actions
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  // Utility actions
  saveToHistory: () => void
  reset: () => void
}

const initialState = {
  currentPage: null,
  selectedElement: { type: null } as SelectedElement,
  history: [],
  historyIndex: -1,
  isDirty: false,
  isSaving: false,
}

export const useEditorStore = create<EditorState>()(
  immer((set, get) => ({
    ...initialState,

    setCurrentPage: (page) => {
      set((state) => {
        state.currentPage = page
        state.history = [page]
        state.historyIndex = 0
        state.isDirty = false
      })
    },

    selectElement: (element) => {
      set((state) => {
        state.selectedElement = element
      })
    },

    clearSelection: () => {
      set((state) => {
        state.selectedElement = { type: null }
      })
    },

    // Section Actions
    get sections() {
      return get().currentPage?.sections || []
    },

    setSections: (sections) => {
      set((state) => {
        if (!state.currentPage) return
        state.currentPage.sections = sections
        state.isDirty = true
      })
      get().saveToHistory()
    },

    addSection: (section) => {
      set((state) => {
        if (!state.currentPage) return
        const newSection = section || createDefaultSection()
        state.currentPage.sections.push(newSection)
        state.isDirty = true
      })
      get().saveToHistory()
    },

    updateSection: (sectionId, updates) => {
      set((state) => {
        if (!state.currentPage) return
        const section = state.currentPage.sections.find((s) => s.id === sectionId)
        if (section) {
          Object.assign(section, updates)
          state.isDirty = true
        }
      })
      get().saveToHistory()
    },

    deleteSection: (sectionId) => {
      set((state) => {
        if (!state.currentPage) return
        state.currentPage.sections = state.currentPage.sections.filter(
          (s) => s.id !== sectionId
        )
        if (state.selectedElement.sectionId === sectionId) {
          state.selectedElement = { type: null }
        }
        state.isDirty = true
      })
      get().saveToHistory()
    },

    moveSectionUp: (sectionId) => {
      set((state) => {
        if (!state.currentPage) return
        const index = state.currentPage.sections.findIndex((s) => s.id === sectionId)
        if (index > 0) {
          const section = state.currentPage.sections[index]
          state.currentPage.sections.splice(index, 1)
          state.currentPage.sections.splice(index - 1, 0, section)
          state.isDirty = true
        }
      })
      get().saveToHistory()
    },

    moveSectionDown: (sectionId) => {
      set((state) => {
        if (!state.currentPage) return
        const index = state.currentPage.sections.findIndex((s) => s.id === sectionId)
        if (index < state.currentPage.sections.length - 1) {
          const section = state.currentPage.sections[index]
          state.currentPage.sections.splice(index, 1)
          state.currentPage.sections.splice(index + 1, 0, section)
          state.isDirty = true
        }
      })
      get().saveToHistory()
    },

    moveSection: (oldIndex, newIndex) => {
      set((state) => {
        if (!state.currentPage) return
        if (oldIndex === newIndex) return
        const [section] = state.currentPage.sections.splice(oldIndex, 1)
        state.currentPage.sections.splice(newIndex, 0, section)
        state.isDirty = true
      })
      get().saveToHistory()
    },

    duplicateSection: (sectionId) => {
      set((state) => {
        if (!state.currentPage) return
        const section = state.currentPage.sections.find((s) => s.id === sectionId)
        if (section) {
          const duplicated = JSON.parse(JSON.stringify(section))
          duplicated.id = `section-${nanoid()}`
          duplicated.blocks = duplicated.blocks.map((block: Block) => ({
            ...block,
            id: `block-${nanoid()}`,
          }))
          const index = state.currentPage.sections.findIndex((s) => s.id === sectionId)
          state.currentPage.sections.splice(index + 1, 0, duplicated)
          state.isDirty = true
        }
      })
      get().saveToHistory()
    },

    // Block Actions
    addBlock: (sectionId, block, index) => {
      set((state) => {
        if (!state.currentPage) return

        const section = state.currentPage.sections.find((s) => s.id === sectionId)
        if (section) {
          // Use immer's direct mutation - it will handle immutability
          if (index !== undefined) {
            section.blocks.splice(index, 0, block)
          } else {
            section.blocks.push(block)
          }
          state.isDirty = true
        }
      })
      get().saveToHistory()
    },

    updateBlock: (sectionId, blockId, updates) => {
      set((state) => {
        if (!state.currentPage) return
        const section = state.currentPage.sections.find((s) => s.id === sectionId)
        if (section) {
          const block = section.blocks.find((b) => b.id === blockId)
          if (block) {
            Object.assign(block, updates)
            state.isDirty = true
          }
        }
      })
      get().saveToHistory()
    },

    deleteBlock: (sectionId, blockId) => {
      set((state) => {
        if (!state.currentPage) return
        const section = state.currentPage.sections.find((s) => s.id === sectionId)
        if (section) {
          section.blocks = section.blocks.filter((b) => b.id !== blockId)
          if (state.selectedElement.blockId === blockId) {
            state.selectedElement = { type: null }
          }
          state.isDirty = true
        }
      })
      get().saveToHistory()
    },

    moveBlock: (sectionId, blockId, newSectionId, newIndex) => {
      set((state) => {
        if (!state.currentPage) return
        const oldSection = state.currentPage.sections.find((s) => s.id === sectionId)
        const newSection = state.currentPage.sections.find((s) => s.id === newSectionId)

        if (oldSection && newSection) {
          const blockIndex = oldSection.blocks.findIndex((b) => b.id === blockId)
          if (blockIndex !== -1) {
            const [block] = oldSection.blocks.splice(blockIndex, 1)
            newSection.blocks.splice(newIndex, 0, block)
            state.isDirty = true
          }
        }
      })
      get().saveToHistory()
    },

    duplicateBlock: (sectionId, blockId) => {
      set((state) => {
        if (!state.currentPage) return
        const section = state.currentPage.sections.find((s) => s.id === sectionId)
        if (section) {
          const block = section.blocks.find((b) => b.id === blockId)
          if (block) {
            const duplicated = JSON.parse(JSON.stringify(block))
            duplicated.id = `block-${nanoid()}`
            const index = section.blocks.findIndex((b) => b.id === blockId)
            section.blocks.splice(index + 1, 0, duplicated)
            state.isDirty = true
          }
        }
      })
      get().saveToHistory()
    },

    // History Actions
    saveToHistory: () => {
      set((state) => {
        if (!state.currentPage) return

        // Remove any history after current index
        state.history = state.history.slice(0, state.historyIndex + 1)

        // Add current state to history
        state.history.push(JSON.parse(JSON.stringify(state.currentPage)))
        state.historyIndex++

        // Limit history to 50 items
        if (state.history.length > 50) {
          state.history.shift()
          state.historyIndex--
        }
      })
    },

    undo: () => {
      const { historyIndex, history } = get()
      if (historyIndex > 0) {
        set((state) => {
          state.historyIndex--
          state.currentPage = JSON.parse(JSON.stringify(history[state.historyIndex]))
          state.isDirty = true
        })
      }
    },

    redo: () => {
      const { historyIndex, history } = get()
      if (historyIndex < history.length - 1) {
        set((state) => {
          state.historyIndex++
          state.currentPage = JSON.parse(JSON.stringify(history[state.historyIndex]))
          state.isDirty = true
        })
      }
    },

    canUndo: () => get().historyIndex > 0,
    canRedo: () => get().historyIndex < get().history.length - 1,

    reset: () => {
      set(initialState)
    },
  }))
)
