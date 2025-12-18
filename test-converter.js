// Test script to convert product schema to page builder format
// Run with: node test-converter.js

const fs = require('fs');
const path = require('path');

// Read the product schema JSON
const productData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../../Downloads/auto_care_products.json'), 'utf8')
);

// Simple nanoid replacement for testing
function nanoid() {
  return Math.random().toString(36).substring(2, 11);
}

// Simplified converter (same logic as the TypeScript version)
function convertProductSchemaToPageBuilder(productData, pageName = 'Imported Product Page') {
  const sections = [];
  const theme = productData.theme || {};

  const primaryColor = theme.primary || '#3b82f6';
  const bgColor = theme.bg || '#ffffff';
  const textColor = theme.text || '#000000';
  const lightBgColor = theme.light_bg || '#f9fafb';
  const headingFont = theme.font_heading || 'Arial, sans-serif';
  const bodyFont = theme.font_body || 'Arial, sans-serif';

  // Hero Section
  if (productData.hero) {
    sections.push({
      id: `section-${nanoid()}`,
      style: {
        backgroundColor: bgColor,
        padding: { top: 80, right: 16, bottom: 80, left: 16 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        flex: {
          direction: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          wrap: 'nowrap',
        },
      },
      blocks: [
        {
          id: `block-${nanoid()}`,
          type: 'image',
          src: productData.hero.media_url,
          alt: productData.hero.headline,
          style: {
            borderRadius: 8,
            objectFit: 'cover',
            width: '100%',
            height: 'auto',
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
            margin: { top: 0, right: 0, bottom: 32, left: 0 },
          },
        },
        {
          id: `block-${nanoid()}`,
          type: 'text',
          content: productData.hero.headline,
          style: {
            fontFamily: headingFont,
            fontSize: 48,
            fontWeight: 800,
            color: textColor,
            backgroundColor: 'transparent',
            textAlign: 'center',
            padding: { top: 0, right: 16, bottom: 16, left: 16 },
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
          },
        },
        {
          id: `block-${nanoid()}`,
          type: 'text',
          content: productData.hero.subheadline,
          style: {
            fontFamily: bodyFont,
            fontSize: 20,
            fontWeight: 400,
            color: textColor,
            backgroundColor: 'transparent',
            textAlign: 'center',
            padding: { top: 0, right: 16, bottom: 24, left: 16 },
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
          },
        },
        {
          id: `block-${nanoid()}`,
          type: 'button',
          text: productData.hero.cta_text,
          href: '#order',
          target: '_self',
          style: {
            backgroundColor: primaryColor,
            color: '#ffffff',
            fontSize: 18,
            fontWeight: 600,
            fontFamily: bodyFont,
            borderRadius: 8,
            layout: 'center',
            padding: { top: 16, right: 32, bottom: 16, left: 32 },
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
          },
        },
      ],
    });
  }

  // FAQ Section
  if (productData.faq && productData.faq.length > 0) {
    sections.push({
      id: `section-${nanoid()}`,
      style: {
        backgroundColor: bgColor,
        padding: { top: 64, right: 16, bottom: 64, left: 16 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        flex: {
          direction: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          wrap: 'nowrap',
        },
      },
      blocks: [
        {
          id: `block-${nanoid()}`,
          type: 'text',
          content: 'Frequently Asked Questions',
          style: {
            fontFamily: headingFont,
            fontSize: 36,
            fontWeight: 700,
            color: textColor,
            backgroundColor: 'transparent',
            textAlign: 'center',
            padding: { top: 0, right: 16, bottom: 32, left: 16 },
            margin: { top: 0, right: 0, bottom: 24, left: 0 },
          },
        },
        {
          id: `block-${nanoid()}`,
          type: 'faq',
          items: productData.faq.map((item) => ({
            id: `faq-${nanoid()}`,
            question: item.q,
            answer: item.a,
          })),
          style: {
            fontSize: 16,
            fontWeight: 400,
            fontFamily: bodyFont,
            questionColor: textColor,
            answerColor: textColor,
            backgroundColor: 'transparent',
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
          },
        },
      ],
    });
  }

  return {
    id: `page-${nanoid()}`,
    name: pageName,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Convert and save
const result = convertProductSchemaToPageBuilder(productData, 'Auto Care Products Landing Page');

// Save the converted file
fs.writeFileSync(
  path.join(__dirname, '../../../Downloads/auto_care_products_converted.json'),
  JSON.stringify(result, null, 2)
);

console.log('✅ Conversion successful!');
console.log('📄 Converted file saved to: Downloads/auto_care_products_converted.json');
console.log('\n📊 Conversion Summary:');
console.log(`   - Sections created: ${result.sections.length}`);
console.log(`   - Total blocks: ${result.sections.reduce((sum, s) => sum + s.blocks.length, 0)}`);
console.log('\n🎨 You can now import this file into the page builder!');
