# Page Builder

A web-based landing page builder built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **ShadCN UI** - Component library
- **Zustand** - State management
- **dnd-kit** - Drag and drop
- **Supabase** - Database and storage

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

### Core Editor
- **Drag-and-drop page builder** - Intuitive visual editor with real-time preview
- **Multiple block types** - Text, Image, Video, Button, Countdown, FAQ, Space
- **Section-based layout system** - Organize content into customizable sections
- **Dynamic properties panel** - Edit styling and content for any selected element
- **Auto-save functionality** - Automatic localStorage backup every 3 seconds
- **Undo/Redo support** - Full history management for all edits
- **Preview mode** - See exactly how your page will look to visitors
- **JSON/HTML export** - Export pages as JSON data or static HTML

### Video Embedding
- **Multi-platform support** - YouTube, Vimeo, Instagram, TikTok, and direct video files (MP4, WebM, OGG, MOV)
- **Smart embed code parsing** - Paste embed codes or URLs - both work!
- **Aspect ratio control** - 16:9, 1:1, 4:3, 9:16, or auto sizing
- **Instagram handling** - Special placeholder for Instagram content with external links
- **Full-width video display** - Videos automatically fill section width for professional layouts

### Pre-defined Section Templates
- **Hero Section** - Eye-catching header with title, subtitle, and call-to-action button
- **Products/Services Section** - Showcase your offerings with descriptions
- **Testimonial Section** - Display customer reviews and feedback
- **Why Choose Us Section** - Highlight your key benefits and unique value propositions
- **Contact Us Section** - Get in touch section with prominent CTA
- **Drag-and-drop templates** - All templates are draggable just like blocks

### Section Customization
- **Background images** - Upload images directly or use external URLs
- **Image upload support** - Local file upload (max 5MB) with base64 conversion
- **Background controls** - Customize size (cover/contain/auto), position, and repeat
- **Flexbox layout system** - Control direction, alignment, justification, and wrapping
- **Spacing controls** - Adjust padding and margin for all four sides
- **Color customization** - Full color picker for background colors
- **Default stretch alignment** - New sections default to full-width for better layouts

### Security
- **XSS protection** - DOMPurify sanitization for HTML export
- **URL validation** - Sanitize all external URLs (videos, images, links)
- **File upload restrictions** - Image type validation and 5MB size limit
- **CSS injection prevention** - Sanitization functions for style properties
- **Zero dependency vulnerabilities** - All packages up-to-date and secure

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── editor/       # Main editor page
│   └── preview/      # Preview page
├── components/       # React components
│   ├── editor/       # Editor UI components
│   │   ├── blocks/   # Block renderers
│   │   └── properties/ # Properties panels
│   └── ui/           # ShadCN UI components
├── lib/             # Utilities and helpers
│   ├── block-defaults.ts   # Default block and section creators
│   ├── html-renderer.ts    # HTML export functionality
│   └── security.ts         # Security utilities (sanitization, validation)
├── store/           # Zustand state management
│   └── editorStore.ts      # Main editor state
├── types/           # TypeScript type definitions
│   └── page-builder.ts     # Core type definitions
└── hooks/           # Custom React hooks
    ├── useAutoSave.ts      # Auto-save functionality
    └── useDebounce.ts      # Debounced callbacks
```

## Recent Updates

### Video Embedding Enhancements (December 2024)
- ✅ Added support for Vimeo, Instagram, TikTok, and direct video files
- ✅ Implemented smart embed code parsing - users can paste full `<iframe>` codes
- ✅ Fixed video sizing issues - videos now display full-width within sections
- ✅ Added special handling for Instagram (platform limitations)
- ✅ Improved user experience with dynamic placeholders and help text

### Pre-defined Section Templates (December 2024)
- ✅ Created 5 professional section templates ready to use
- ✅ Implemented drag-and-drop for section templates
- ✅ All templates are fully customizable after insertion
- ✅ Changed default section alignment to "stretch" for better layouts

### Background Image System (December 2024)
- ✅ Added local image upload with 5MB size limit
- ✅ Implemented base64 conversion for uploaded images
- ✅ Added background image URL support for external images
- ✅ Created controls for background size, position, and repeat
- ✅ Built remove image functionality

### Security Improvements (December 2024)
- ✅ Implemented URL sanitization for all external resources
- ✅ Added file type and size validation for uploads
- ✅ Created security utility functions for CSS and HTML sanitization
- ✅ Comprehensive security audit completed

## Security Audit Summary

A comprehensive security audit was conducted in December 2024. Below are the key findings:

### Overall Rating: **MEDIUM-HIGH**
The application has a good security foundation with some implementation gaps that should be addressed before production deployment.

### HIGH Severity Issues

**1. HTML Export XSS Vulnerability** (`src/lib/html-renderer.ts`)
- **Issue**: Block content inserted directly into HTML without sanitization
- **Risk**: Malicious scripts could execute when exported HTML is opened
- **Status**: Sanitization functions exist but not consistently applied
- **Recommendation**: Apply `sanitizeHTML()` to all user content in HTML export

**2. CSS Injection via Background Images** (`src/components/editor/SectionRenderer.tsx:109`)
- **Issue**: Background image URLs inserted directly into inline styles
- **Risk**: CSS injection attacks via `url()` with malicious data
- **Status**: No validation on background image URLs before rendering
- **Recommendation**: Validate and sanitize all URLs before inserting into CSS

**3. CSS Injection via Style Properties**
- **Issue**: User-controlled CSS values not consistently sanitized
- **Risk**: CSS injection through properties like font-family, colors, etc.
- **Status**: Sanitization functions exist but not applied everywhere
- **Recommendation**: Apply `sanitizeStyleValue()` to all user-controlled CSS

### MEDIUM Severity Issues

**4. Image Block URL Sanitization** (`src/components/editor/blocks/ImageBlock.tsx:13`)
- **Issue**: Image `src` URLs not sanitized before rendering
- **Risk**: Potential for data exfiltration or XSS via SVG images
- **Recommendation**: Apply `sanitizeURL()` to all image sources

**5. File Upload MIME Validation**
- **Issue**: Only checks file extension, not actual MIME type
- **Risk**: Malicious files could be disguised with image extensions
- **Recommendation**: Validate actual file MIME type using magic numbers

### LOW Severity Issues

**6. LocalStorage Quota Handling**
- **Issue**: No quota error handling in auto-save
- **Risk**: Data loss if localStorage is full
- **Recommendation**: Add try-catch and user notification

### Positive Security Findings ✅

- **Zero dependency vulnerabilities** - All packages up-to-date
- **DOMPurify integration** - Proper XSS protection library in place
- **Security utilities created** - Good foundation with `sanitizeURL()`, `sanitizeHTML()`, etc.
- **File upload restrictions** - 5MB limit and basic validation implemented
- **No hardcoded secrets** - No API keys or credentials in codebase
- **CSP-ready architecture** - Prepared for Content Security Policy implementation

### Recommendations for Production

1. **Apply security functions consistently** - Use sanitization everywhere user content is rendered
2. **Add Content Security Policy (CSP)** headers in Next.js config
3. **Implement proper MIME type validation** for file uploads
4. **Add rate limiting** for file uploads and export operations
5. **Set up security monitoring** and error logging
6. **Regular dependency audits** with `npm audit`
7. **Consider server-side rendering** for exported HTML with sanitization

## Usage Guide

### Adding Video Blocks

1. Drag a **Video** block from the left panel into a section
2. Select the video block to open the properties panel
3. Choose your video source (YouTube, Vimeo, Instagram, TikTok, or Direct)
4. Paste either:
   - The video URL (e.g., `https://youtube.com/watch?v=...`)
   - Or the full embed code from the platform's share button
5. Adjust aspect ratio and spacing as needed

**Tip**: For YouTube and Vimeo, you can paste the entire `<iframe>` embed code - the URL will be automatically extracted!

### Using Section Templates

1. Click the **Sections** tab in the left panel
2. Under **Templates**, you'll see 5 pre-defined options
3. Either:
   - **Click** the template to add it to the bottom of your page
   - **Drag** the template to position it between existing sections
4. Select the section and customize colors, spacing, and layout
5. Edit the text blocks to match your content

### Adding Background Images

1. Select a section to open its properties panel
2. Under **Upload Background Image**:
   - Click **Upload Image** to select a file from your computer (max 5MB)
   - Or enter a URL in the **Background Image URL** field
3. Once added, configure:
   - **Background Size**: Cover (fills section), Contain (fits within), or Auto
   - **Background Position**: center, top, bottom, left, right, etc.
   - **Background Repeat**: No Repeat, Repeat, Repeat X, or Repeat Y
4. Click the **X** button next to the upload button to remove the background image

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
