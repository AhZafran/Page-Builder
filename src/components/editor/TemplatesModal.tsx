'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useEditorStore } from '@/store/editorStore'
import {
  getTemplates,
  getBuiltInTemplates,
  saveTemplate,
  deleteTemplate,
  createTemplate,
  type PageTemplate,
} from '@/lib/templates'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Trash2, Check } from 'lucide-react'

interface TemplatesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'apply' | 'save'
}

export function TemplatesModal({ open, onOpenChange, mode }: TemplatesModalProps) {
  const { sections, setSections } = useEditorStore()
  const [customTemplates, setCustomTemplates] = useState<PageTemplate[]>([])
  const [builtInTemplates] = useState<PageTemplate[]>(getBuiltInTemplates())
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  // Save mode state
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')

  useEffect(() => {
    if (open) {
      setCustomTemplates(getTemplates())
      setSelectedTemplate(null)
      setTemplateName('')
      setTemplateDescription('')
    }
  }, [open])

  const handleApplyTemplate = (template: PageTemplate) => {
    setSections(JSON.parse(JSON.stringify(template.sections))) // Deep clone
    onOpenChange(false)
  }

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name')
      return
    }

    const template = createTemplate(templateName, sections, templateDescription)
    const result = saveTemplate(template)

    if (result.success) {
      setCustomTemplates(getTemplates())
      setTemplateName('')
      setTemplateDescription('')
      onOpenChange(false)
    } else {
      alert(result.error || 'Failed to save template')
    }
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      const result = deleteTemplate(templateId)
      if (result.success) {
        setCustomTemplates(getTemplates())
      } else {
        alert(result.error || 'Failed to delete template')
      }
    }
  }

  const TemplateCard = ({ template, showDelete = false }: { template: PageTemplate; showDelete?: boolean }) => {
    const isSelected = selectedTemplate === template.id

    return (
      <div
        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => setSelectedTemplate(template.id)}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-sm">{template.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            {isSelected && <Check className="h-4 w-4 text-blue-500" />}
            {showDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteTemplate(template.id)
                }}
              >
                <Trash2 className="h-3 w-3 text-red-500" />
              </Button>
            )}
          </div>
        </div>
        {template.description && (
          <p className="text-xs text-gray-600 mb-2">{template.description}</p>
        )}
        <p className="text-xs text-gray-400">
          {template.sections.length} section{template.sections.length !== 1 ? 's' : ''}
        </p>
      </div>
    )
  }

  if (mode === 'save') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
            <DialogDescription>
              Save your current page design as a reusable template
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="My Landing Page"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="template-description">Description (Optional)</Label>
              <Textarea
                id="template-description"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="A brief description of this template"
                rows={3}
                className="mt-2"
              />
            </div>

            <div className="bg-gray-50 rounded p-3 text-sm text-gray-600">
              <p>
                <strong>Sections:</strong> {sections.length}
              </p>
              <p>
                <strong>Blocks:</strong> {sections.reduce((acc, s) => acc + s.blocks.length, 0)}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>Save Template</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Apply mode
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Select a template to start with or apply to your current page
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="built-in" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="built-in">Built-in Templates</TabsTrigger>
            <TabsTrigger value="custom">My Templates ({customTemplates.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="built-in" className="space-y-3 max-h-[400px] overflow-y-auto">
            {builtInTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </TabsContent>

          <TabsContent value="custom" className="space-y-3 max-h-[400px] overflow-y-auto">
            {customTemplates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No custom templates yet</p>
                <p className="text-xs mt-1">
                  Save your current page as a template to see it here
                </p>
              </div>
            ) : (
              customTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} showDelete />
              ))
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const template =
                builtInTemplates.find((t) => t.id === selectedTemplate) ||
                customTemplates.find((t) => t.id === selectedTemplate)
              if (template) {
                handleApplyTemplate(template)
              }
            }}
            disabled={!selectedTemplate}
          >
            Apply Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
