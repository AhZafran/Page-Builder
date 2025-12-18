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
import { FileText, Trash2, Check, Sparkles, Download, Eye } from 'lucide-react'
import type { PageData, Section } from '@/types'
import { BlockRenderer } from './BlockRenderer'

interface TemplateMetadata {
  id: string
  name: string
  slug: string
  description: string
  thumbnail: string
  colors: string[]
  features: string[]
}

interface TemplateCategory {
  name: string
  templates: TemplateMetadata[]
}

interface TemplateLibraryData {
  categories: TemplateCategory[]
}

interface TemplatesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'apply' | 'save'
}

export function TemplatesModal({ open, onOpenChange, mode }: TemplatesModalProps) {
  const { sections, setSections, setCurrentPage } = useEditorStore()
  const [customTemplates, setCustomTemplates] = useState<PageTemplate[]>([])
  const [builtInTemplates] = useState<PageTemplate[]>(getBuiltInTemplates())
  const [libraryCategories, setLibraryCategories] = useState<TemplateCategory[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedLibraryTemplate, setSelectedLibraryTemplate] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<PageTemplate | null>(null)
  const [previewLibraryTemplate, setPreviewLibraryTemplate] = useState<PageData | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Save mode state
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')

  useEffect(() => {
    if (open) {
      setCustomTemplates(getTemplates())
      setSelectedTemplate(null)
      setSelectedLibraryTemplate(null)
      setTemplateName('')
      setTemplateDescription('')
      fetchLibraryTemplates()
    }
  }, [open])

  const fetchLibraryTemplates = async () => {
    try {
      const response = await fetch('/templates/index.json')
      const data: TemplateLibraryData = await response.json()
      setLibraryCategories(data.categories)
      if (data.categories.length > 0 && !selectedCategory) {
        setSelectedCategory(data.categories[0].name)
      }
    } catch (error) {
      console.error('Error fetching library templates:', error)
    }
  }

  const handleApplyTemplate = (template: PageTemplate) => {
    setSections(JSON.parse(JSON.stringify(template.sections))) // Deep clone
    onOpenChange(false)
  }

  const handleImportLibraryTemplate = async (template: TemplateMetadata) => {
    setLoading(true)
    try {
      const filePath = `/templates/${template.slug}.json`
      const response = await fetch(filePath)
      const data: PageData = await response.json()
      setCurrentPage(data)
      onOpenChange(false)
    } catch (error) {
      console.error('Error importing template:', error)
      alert('Failed to import template. Please try again.')
    } finally {
      setLoading(false)
    }
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

  const handlePreviewTemplate = (template: PageTemplate) => {
    setPreviewTemplate(template)
    setPreviewLibraryTemplate(null)
    setShowPreview(true)
  }

  const handlePreviewLibraryTemplate = async (template: TemplateMetadata) => {
    try {
      const filePath = `/templates/${template.slug}.json`
      const response = await fetch(filePath)
      const data: PageData = await response.json()
      setPreviewLibraryTemplate(data)
      setPreviewTemplate(null)
      setShowPreview(true)
    } catch (error) {
      console.error('Error loading template preview:', error)
      alert('Failed to load template preview')
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
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                handlePreviewTemplate(template)
              }}
              title="Preview template"
            >
              <Eye className="h-3 w-3 text-blue-500" />
            </Button>
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
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Select a template to start with or apply to your current page
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="library" className="w-full overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="library">
              <Sparkles className="h-3 w-3 mr-1" />
              Library ({libraryCategories.reduce((acc, cat) => acc + cat.templates.length, 0)})
            </TabsTrigger>
            <TabsTrigger value="built-in">Quick Start</TabsTrigger>
            <TabsTrigger value="custom">My Templates ({customTemplates.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="flex flex-col max-h-[400px] p-0 overflow-hidden">
            {libraryCategories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Sparkles className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Loading templates...</p>
              </div>
            ) : (
              <>
                {/* Category Tabs */}
                <div className="flex gap-2 px-4 pt-4 pb-2 overflow-x-auto border-b flex-shrink-0">
                  {libraryCategories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap transition-colors ${
                        selectedCategory === category.name
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {category.name} ({category.templates.length})
                    </button>
                  ))}
                </div>

                {/* Templates Grid */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4">
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {libraryCategories
                      .find((cat) => cat.name === selectedCategory)
                      ?.templates.map((template) => (
                        <div
                          key={template.id}
                          className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer w-full ${
                            selectedLibraryTemplate === template.id
                              ? 'border-purple-500 ring-2 ring-purple-200'
                              : 'border-gray-200'
                          }`}
                          onClick={() => setSelectedLibraryTemplate(template.id)}
                        >
                          {/* Template Preview */}
                          <div
                            className="h-32 bg-gradient-to-br flex items-center justify-center relative"
                            style={{
                              background: `linear-gradient(135deg, ${template.colors[0]} 0%, ${template.colors[1]} 100%)`
                            }}
                          >
                            <div className="text-white/90 text-center px-4">
                              <h4 className="text-lg font-semibold drop-shadow">{template.name}</h4>
                              <div className="flex gap-1 justify-center mt-2">
                                {template.colors.map((color, idx) => (
                                  <div
                                    key={idx}
                                    className="w-4 h-4 rounded-full border border-white/30"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                            </div>
                            {selectedLibraryTemplate === template.id && (
                              <div className="absolute top-2 right-2">
                                <Check className="h-5 w-5 text-white drop-shadow" />
                              </div>
                            )}
                          </div>

                          {/* Template Info */}
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                                {selectedCategory}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handlePreviewLibraryTemplate(template)
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Preview
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              {template.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {template.features.slice(0, 3).map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                                >
                                  {feature}
                                </span>
                              ))}
                              {template.features.length > 3 && (
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                  +{template.features.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="built-in" className="space-y-3 max-h-[400px] overflow-y-auto overflow-x-hidden px-4">
            {builtInTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </TabsContent>

          <TabsContent value="custom" className="space-y-3 max-h-[400px] overflow-y-auto overflow-x-hidden px-4">
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
              if (selectedLibraryTemplate) {
                // Find template in all categories
                const libraryTemplate = libraryCategories
                  .flatMap((cat) => cat.templates)
                  .find((t) => t.id === selectedLibraryTemplate)
                if (libraryTemplate) {
                  handleImportLibraryTemplate(libraryTemplate)
                }
              } else if (selectedTemplate) {
                const template =
                  builtInTemplates.find((t) => t.id === selectedTemplate) ||
                  customTemplates.find((t) => t.id === selectedTemplate)
                if (template) {
                  handleApplyTemplate(template)
                }
              }
            }}
            disabled={!selectedTemplate && !selectedLibraryTemplate || loading}
          >
            {loading ? (
              <>
                <Download className="h-4 w-4 mr-2 animate-pulse" />
                Importing...
              </>
            ) : (
              <>
                {selectedLibraryTemplate ? 'Use Template' : 'Apply Template'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Template Preview: {previewTemplate?.name || previewLibraryTemplate?.name || 'Loading...'}
            </DialogTitle>
            <DialogDescription>
              Preview of the template before applying it to your page
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto border rounded-lg bg-gray-50 p-4">
            {(previewTemplate || previewLibraryTemplate) && (
              <div className="bg-white shadow-sm max-w-5xl mx-auto" style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
                {(previewTemplate?.sections || previewLibraryTemplate?.sections || []).map((section: Section) => (
                  <div
                    key={section.id}
                    style={{
                      backgroundColor: section.style.backgroundColor,
                      backgroundImage: section.style.backgroundImage ? `url(${section.style.backgroundImage})` : undefined,
                      backgroundSize: section.style.backgroundSize,
                      backgroundPosition: section.style.backgroundPosition,
                      backgroundRepeat: section.style.backgroundRepeat,
                      padding: `${section.style.padding.top}px ${section.style.padding.right}px ${section.style.padding.bottom}px ${section.style.padding.left}px`,
                      margin: `${section.style.margin.top}px ${section.style.margin.right}px ${section.style.margin.bottom}px ${section.style.margin.left}px`,
                    }}
                  >
                    <div
                      style={{
                        display: section.layout === 'grid' && section.columns ? 'grid' : 'flex',
                        gridTemplateColumns: section.layout === 'grid' && section.columns ? `repeat(${section.columns}, 1fr)` : undefined,
                        flexDirection: section.layout !== 'grid' ? section.style.flex.direction : undefined,
                        gap: `${section.style.rowGap ?? 16}px ${section.style.columnGap ?? 16}px`,
                      }}
                    >
                      {section.blocks.map((block, index) => (
                        <BlockRenderer
                          key={block.id}
                          block={block}
                          sectionId={section.id}
                          index={index}
                          isPreview={true}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
