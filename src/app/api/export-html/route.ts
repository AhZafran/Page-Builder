/**
 * API Route for exporting page as HTML
 */

import { NextRequest, NextResponse } from 'next/server'
import { renderPageToHTML } from '@/lib/html-renderer'
import { validatePageData } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate page data
    const validation = validatePageData(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid page data',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    // Render to HTML
    const html = renderPageToHTML(validation.data)

    // Return HTML with proper headers
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${validation.data.name || 'page'}.html"`,
      },
    })
  } catch (error) {
    console.error('Export HTML error:', error)
    return NextResponse.json(
      { error: 'Failed to export HTML' },
      { status: 500 }
    )
  }
}
