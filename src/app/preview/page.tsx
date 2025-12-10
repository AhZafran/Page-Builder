'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PageData } from '@/types'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { Button } from '@/components/ui/button'
import { X, Smartphone, Tablet, Monitor, Maximize } from 'lucide-react'
import { cn } from '@/lib/utils'

type DevicePreset = 'mobile' | 'tablet' | 'desktop' | 'full'

const devicePresets = {
  mobile: { width: 375, icon: Smartphone, label: 'Mobile' },
  tablet: { width: 768, icon: Tablet, label: 'Tablet' },
  desktop: { width: 1024, icon: Monitor, label: 'Desktop' },
  full: { width: '100%', icon: Maximize, label: 'Full' },
}

export default function PreviewPage() {
  const router = useRouter()
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [device, setDevice] = useState<DevicePreset>('full')

  useEffect(() => {
    // Get page data from sessionStorage (set by the editor)
    const savedData = sessionStorage.getItem('preview-page-data')
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        setPageData(data)
      } catch (e) {
        console.error('Failed to parse preview data:', e)
      }
    }
  }, [])

  const handleClose = () => {
    router.back()
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading preview...</div>
      </div>
    )
  }

  const containerWidth = device === 'full' ? '100%' : `${devicePresets[device].width}px`

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Preview Header */}
      <div className="fixed top-0 left-0 right-0 h-12 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="text-white text-sm font-medium">Preview Mode</div>

          {/* Device Presets */}
          <div className="flex items-center gap-1 bg-white/10 rounded p-1">
            {(Object.keys(devicePresets) as DevicePreset[]).map((preset) => {
              const Icon = devicePresets[preset].icon
              return (
                <button
                  key={preset}
                  onClick={() => setDevice(preset)}
                  className={cn(
                    'px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5',
                    device === preset
                      ? 'bg-white text-black'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                  title={devicePresets[preset].label}
                >
                  <Icon className="h-3 w-3" />
                  <span>{devicePresets[preset].label}</span>
                </button>
              )
            })}
          </div>

          {/* Width indicator */}
          {device !== 'full' && (
            <div className="text-white/60 text-xs">
              {devicePresets[device].width}px
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="text-white hover:bg-white/20"
        >
          <X className="h-4 w-4 mr-2" />
          Close Preview
        </Button>
      </div>

      {/* Preview Content */}
      <div className="pt-12 min-h-[calc(100vh-3rem)] flex justify-center p-4">
        {/* Responsive container with device width */}
        <div
          className={cn(
            'bg-white shadow-lg transition-all duration-300 overflow-hidden',
            device !== 'full' && 'rounded-lg'
          )}
          style={{
            width: containerWidth,
            maxWidth: device === 'full' ? '100%' : containerWidth,
          }}
        >
          {pageData.sections.map((section) => {
            const paddingStyle = `${section.style.padding.top}px ${section.style.padding.right}px ${section.style.padding.bottom}px ${section.style.padding.left}px`
            const marginStyle = `${section.style.margin.top}px ${section.style.margin.right}px ${section.style.margin.bottom}px ${section.style.margin.left}px`

            return (
              <section
                key={section.id}
                style={{
                  backgroundColor: section.style.backgroundColor,
                  padding: paddingStyle,
                  margin: marginStyle,
                  display: 'flex',
                  flexDirection: section.style.flex.direction,
                  alignItems: section.style.flex.alignItems,
                  justifyContent: section.style.flex.justifyContent,
                  flexWrap: section.style.flex.wrap,
                }}
              >
                {section.blocks.map((block) => (
                  <BlockRenderer
                    key={block.id}
                    block={block}
                    sectionId={section.id}
                    isSelected={false}
                    isPreview={true}
                  />
                ))}
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
