'use client'

import { useState, useEffect } from 'react'
import { X, Download, Sparkles, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PageData } from '@/types'
import { autoConvertToPageBuilder, detectSchemaType, getSchemaMessage } from '@/lib/schema-detector'

interface TemplateMetadata {
  id: string
  name: string
  slug: string
  description: string
  category: string
  thumbnail: string
  file: string
  colors: string[]
  features: string[]
}

interface TemplateLibraryProps {
  isOpen: boolean
  onClose: () => void
  onImport: (data: PageData) => void
}

export function TemplateLibrary({ isOpen, onClose, onImport }: TemplateLibraryProps) {
  const [templates, setTemplates] = useState<TemplateMetadata[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [loading, setLoading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      fetchTemplates()
    }
  }, [isOpen])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/templates/index.json')
      const data = await response.json()
      setTemplates(data)
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  const handleImportTemplate = async (template: TemplateMetadata) => {
    setLoading(true)
    try {
      const response = await fetch(template.file)
      const data = await response.json()

      // Auto-detect and convert if needed
      const detection = detectSchemaType(data)
      const conversionResult = autoConvertToPageBuilder(data, template.name)

      if (!conversionResult.success) {
        alert(`Import failed: ${conversionResult.error}`)
        return
      }

      // Show conversion message if schema was converted
      if (conversionResult.schemaType === 'product-ecommerce') {
        const message = `✓ Auto-converted from e-commerce format to page builder format!\n\nOriginal: Product schema\nConverted: ${conversionResult.data!.sections.length} sections with blocks\n\nYou can now edit this page in the builder.`
        alert(message)
      }

      onImport(conversionResult.data!)
      onClose()
    } catch (error) {
      console.error('Error importing template:', error)
      alert('Failed to import template. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setUploadMessage('')

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // Detect schema type
      const detection = detectSchemaType(data)
      setUploadMessage(getSchemaMessage(detection))

      // Auto-convert
      const conversionResult = autoConvertToPageBuilder(data, file.name.replace('.json', ''))

      if (!conversionResult.success) {
        alert(`Import failed: ${conversionResult.error}`)
        setUploadMessage('')
        return
      }

      // Show detailed conversion message
      if (conversionResult.schemaType === 'product-ecommerce') {
        const totalBlocks = conversionResult.data!.sections.reduce((sum, s) => sum + s.blocks.length, 0)
        const message = `✓ Auto-converted from e-commerce format!\n\nFile: ${file.name}\nSections: ${conversionResult.data!.sections.length}\nBlocks: ${totalBlocks}\n\nThe template is now compatible with the page builder.`
        alert(message)
      } else if (conversionResult.schemaType === 'page-builder') {
        alert(`✓ Page builder format detected - imported successfully!\n\nFile: ${file.name}`)
      }

      onImport(conversionResult.data!)
      onClose()
    } catch (error) {
      console.error('Error uploading file:', error)
      alert(`Failed to import file: ${error instanceof Error ? error.message : 'Invalid JSON'}`)
      setUploadMessage('')
    } finally {
      setLoading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))]
  const filteredTemplates = selectedCategory === 'All'
    ? templates
    : templates.filter(t => t.category === selectedCategory)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Template Library</h2>
          </div>
          <div className="flex items-center gap-2">
            {/* File Upload Button */}
            <label htmlFor="json-upload" className="cursor-pointer">
              <Button variant="outline" size="sm" disabled={loading} asChild>
                <span>
                  <Download className="h-4 w-4 mr-2" />
                  Upload JSON
                </span>
              </Button>
              <input
                id="json-upload"
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Upload Message */}
        {uploadMessage && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <AlertCircle className="h-4 w-4" />
              <span>{uploadMessage}</span>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No templates found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
                >
                  {/* Thumbnail Placeholder */}
                  <div
                    className="h-48 bg-gradient-to-br flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${template.colors[0]} 0%, ${template.colors[1]} 100%)`
                    }}
                  >
                    <div className="text-white/90 text-center px-4">
                      <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                      <div className="flex gap-2 justify-center flex-wrap">
                        {template.colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full border-2 border-white/50"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                        {template.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {template.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-4">
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
                          +{template.features.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Import Button */}
                    <Button
                      onClick={() => handleImportTemplate(template)}
                      disabled={loading}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {loading ? 'Importing...' : 'Use Template'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'} available
          </p>
        </div>
      </div>
    </div>
  )
}
