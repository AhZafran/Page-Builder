const fs = require('fs');
const path = require('path');

// Helper function to generate unique IDs
const generateId = (prefix) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

// Template definitions for all 7 categories with 7 templates each
const templateDefinitions = {
  'Business': [
    {
      name: 'Corporate Website',
      slug: 'corporate-website',
      description: 'Professional corporate website with company values, team showcase, and client testimonials. Perfect for established businesses.',
      colors: ['#1e3a8a', '#3b82f6', '#ffffff'],
      features: ['Hero Section', 'Team Grid', 'Testimonials', 'Contact Form']
    },
    {
      name: 'Startup Landing',
      slug: 'startup-landing',
      description: 'Modern startup landing page with bold hero, feature highlights, and investor-ready stats. Ideal for fundraising and growth.',
      colors: ['#7c3aed', '#a78bfa', '#f5f3ff'],
      features: ['Bold Hero', 'Stats Counter', 'Feature Cards', 'Newsletter']
    },
    {
      name: 'Consulting Firm',
      slug: 'consulting-firm',
      description: 'Professional consulting website highlighting expertise, case studies, and service offerings. Build client trust.',
      colors: ['#0f172a', '#0ea5e9', '#ffffff'],
      features: ['Services Grid', 'Case Studies', 'Why Choose Us', 'Contact']
    },
    {
      name: 'Marketing Agency',
      slug: 'marketing-agency',
      description: 'Creative marketing agency site with portfolio showcase, client logos, and dynamic CTAs. Stand out from competitors.',
      colors: ['#ec4899', '#f472b6', '#fdf2f8'],
      features: ['Creative Hero', 'Portfolio Grid', 'Logo Carousel', 'Pricing']
    },
    {
      name: 'Financial Services',
      slug: 'financial-services',
      description: 'Trustworthy financial services platform with security features, calculators, and client testimonials. Build confidence.',
      colors: ['#065f46', '#10b981', '#f0fdf4'],
      features: ['Trust Indicators', 'Feature List', 'Calculator', 'FAQ']
    },
    {
      name: 'Legal Services',
      slug: 'legal-services',
      description: 'Professional law firm website with practice areas, attorney profiles, and consultation booking. Establish authority.',
      colors: ['#78350f', '#d97706', '#fffbeb'],
      features: ['Practice Areas', 'Attorney Grid', 'Testimonials', 'Booking']
    },
    {
      name: 'Real Estate Agency',
      slug: 'real-estate-agency',
      description: 'Modern real estate site with property listings, location maps, and agent contact. Drive property inquiries.',
      colors: ['#1f2937', '#f59e0b', '#ffffff'],
      features: ['Property Gallery', 'Map Integration', 'Agent Cards', 'Contact']
    }
  ],
  'E-commerce': [
    {
      name: 'Fashion Store',
      slug: 'fashion-store',
      description: 'Elegant fashion e-commerce with seasonal collections, style guides, and size charts. Boost online sales.',
      colors: ['#000000', '#fbbf24', '#ffffff'],
      features: ['Collection Grid', 'Style Guide', 'Size Chart', 'Reviews']
    },
    {
      name: 'Electronics Shop',
      slug: 'electronics-shop',
      description: 'Tech-focused electronics store with product comparisons, specs, and warranty info. Convert tech buyers.',
      colors: ['#1e40af', '#60a5fa', '#eff6ff'],
      features: ['Product Showcase', 'Comparison Table', 'Tech Specs', 'Warranty']
    },
    {
      name: 'Furniture Store',
      slug: 'furniture-store',
      description: 'Sophisticated furniture showroom with room visualizers, material guides, and delivery info. Inspire home makeovers.',
      colors: ['#92400e', '#f59e0b', '#fffbeb'],
      features: ['Room Gallery', 'Material Guide', 'Pricing', 'Delivery Info']
    },
    {
      name: 'Beauty Products',
      slug: 'beauty-products',
      description: 'Luxurious beauty brand site with ingredient lists, before/after, and subscription options. Build beauty community.',
      colors: ['#be185d', '#f9a8d4', '#fdf2f8'],
      features: ['Product Grid', 'Ingredients', 'Before/After', 'Subscribe']
    },
    {
      name: 'Online Bookstore',
      slug: 'online-bookstore',
      description: 'Cozy bookstore with curated collections, author profiles, and reading recommendations. Engage book lovers.',
      colors: ['#431407', '#92400e', '#fef3c7'],
      features: ['Book Collections', 'Authors', 'Recommendations', 'Reviews']
    },
    {
      name: 'Sports Equipment',
      slug: 'sports-equipment',
      description: 'Dynamic sports gear store with activity guides, athlete endorsements, and training tips. Motivate athletes.',
      colors: ['#b91c1c', '#ef4444', '#fef2f2'],
      features: ['Gear Showcase', 'Activity Guide', 'Athlete Quotes', 'Training']
    },
    {
      name: 'Handmade Crafts',
      slug: 'handmade-crafts',
      description: 'Artisan marketplace with maker stories, custom orders, and sustainability info. Support local artisans.',
      colors: ['#16a34a', '#86efac', '#f0fdf4'],
      features: ['Artisan Stories', 'Custom Orders', 'Sustainability', 'Gallery']
    }
  ],
  'Personal': [
    {
      name: 'Designer Portfolio',
      slug: 'designer-portfolio',
      description: 'Stunning designer portfolio with case studies, design process, and client work. Showcase creative excellence.',
      colors: ['#0c4a6e', '#0ea5e9', '#f0f9ff'],
      features: ['Case Studies', 'Design Process', 'Client Work', 'Contact']
    },
    {
      name: 'Developer Portfolio',
      slug: 'developer-portfolio',
      description: 'Clean developer portfolio with projects, tech stack, GitHub stats, and blog. Land dream dev job.',
      colors: ['#1e293b', '#22d3ee', '#ecfeff'],
      features: ['Projects', 'Tech Stack', 'GitHub Stats', 'Blog']
    },
    {
      name: 'Personal Blog',
      slug: 'personal-blog',
      description: 'Modern blog layout with featured posts, categories, author bio, and newsletter signup. Build audience.',
      colors: ['#374151', '#6366f1', '#eef2ff'],
      features: ['Featured Posts', 'Categories', 'Author Bio', 'Newsletter']
    },
    {
      name: 'Resume CV',
      slug: 'resume-cv',
      description: 'Professional online resume with experience timeline, skills chart, and downloadable PDF. Impress employers.',
      colors: ['#1f2937', '#3b82f6', '#ffffff'],
      features: ['Timeline', 'Skills Chart', 'Experience', 'Download']
    },
    {
      name: 'Photography Portfolio',
      slug: 'photography-portfolio',
      description: 'Visual photography portfolio with gallery grids, photo stories, and print shop. Attract photo clients.',
      colors: ['#000000', '#ffffff', '#f5f5f5'],
      features: ['Photo Gallery', 'Stories', 'Print Shop', 'Contact']
    },
    {
      name: 'Artist Showcase',
      slug: 'artist-showcase',
      description: 'Creative artist website with artwork gallery, exhibitions, press coverage, and commissions. Grow art business.',
      colors: ['#581c87', '#c084fc', '#faf5ff'],
      features: ['Artwork Grid', 'Exhibitions', 'Press', 'Commissions']
    },
    {
      name: 'Influencer Page',
      slug: 'influencer-page',
      description: 'Engaging influencer hub with social feeds, brand partnerships, media kit, and collab form. Grow following.',
      colors: ['#db2777', '#f9a8d4', '#fdf2f8'],
      features: ['Social Feed', 'Partnerships', 'Media Kit', 'Collab Form']
    }
  ],
  'Food & Dining': [
    {
      name: 'Fine Dining Restaurant',
      slug: 'fine-dining-restaurant',
      description: 'Elegant fine dining website with seasonal menu, chef profile, wine pairings, and reservations. Create dining desire.',
      colors: ['#1c1917', '#d4a574', '#fafaf9'],
      features: ['Seasonal Menu', 'Chef Profile', 'Wine Pairings', 'Reservations']
    },
    {
      name: 'Cozy Cafe',
      slug: 'cozy-cafe',
      description: 'Warm cafe site with breakfast/lunch menu, coffee guide, loyalty program, and location. Build local community.',
      colors: ['#78350f', '#fb923c', '#fff7ed'],
      features: ['Menu', 'Coffee Guide', 'Loyalty Program', 'Location Map']
    },
    {
      name: 'Artisan Bakery',
      slug: 'artisan-bakery',
      description: 'Delightful bakery showcase with daily specials, baking process, custom cakes, and online ordering. Tempt customers.',
      colors: ['#92400e', '#fbbf24', '#fffbeb'],
      features: ['Daily Specials', 'Baking Process', 'Custom Cakes', 'Order Online']
    },
    {
      name: 'Food Delivery Service',
      slug: 'food-delivery-service',
      description: 'Fast food delivery platform with restaurant partners, live tracking, deals, and app download. Drive orders.',
      colors: ['#dc2626', '#fca5a5', '#fef2f2'],
      features: ['Restaurants', 'Live Tracking', 'Deals', 'App Download']
    },
    {
      name: 'Catering Service',
      slug: 'catering-service',
      description: 'Professional catering business with event packages, menu customization, past events, and quote request. Book events.',
      colors: ['#0f766e', '#5eead4', '#f0fdfa'],
      features: ['Event Packages', 'Menu Options', 'Past Events', 'Get Quote']
    },
    {
      name: 'Bar & Lounge',
      slug: 'bar-lounge',
      description: 'Sophisticated bar website with cocktail menu, happy hours, live music schedule, and VIP booking. Fill tables.',
      colors: ['#1e1b4b', '#818cf8', '#eef2ff'],
      features: ['Cocktail Menu', 'Happy Hours', 'Live Music', 'VIP Booking']
    },
    {
      name: 'Food Truck',
      slug: 'food-truck',
      description: 'Fun food truck site with current location, menu favorites, events calendar, and social media. Track the truck.',
      colors: ['#ea580c', '#fdba74', '#fff7ed'],
      features: ['Current Location', 'Menu', 'Events', 'Social Links']
    }
  ],
  'Events': [
    {
      name: 'Tech Conference',
      slug: 'tech-conference',
      description: 'Professional conference site with speaker lineup, session schedule, sponsor showcase, and ticket sales. Sell out fast.',
      colors: ['#4338ca', '#818cf8', '#eef2ff'],
      features: ['Speakers', 'Schedule', 'Sponsors', 'Tickets']
    },
    {
      name: 'Dream Wedding',
      slug: 'dream-wedding',
      description: 'Romantic wedding website with couple story, venue details, RSVP form, and registry. Share the joy.',
      colors: ['#9f1239', '#fda4af', '#fff1f2'],
      features: ['Couple Story', 'Venue', 'RSVP', 'Registry']
    },
    {
      name: 'Music Festival',
      slug: 'music-festival',
      description: 'Vibrant music festival page with artist lineup, stage schedule, camping info, and ticket tiers. Hype the event.',
      colors: ['#c026d3', '#e879f9', '#fae8ff'],
      features: ['Artist Lineup', 'Stages', 'Camping', 'Tickets']
    },
    {
      name: 'Workshop Series',
      slug: 'workshop-series',
      description: 'Educational workshop platform with instructor bios, learning outcomes, materials list, and registration. Fill seats.',
      colors: ['#0369a1', '#7dd3fc', '#f0f9ff'],
      features: ['Instructors', 'Outcomes', 'Materials', 'Register']
    },
    {
      name: 'Virtual Webinar',
      slug: 'virtual-webinar',
      description: 'Online webinar landing with host intro, agenda, platform access, and email reminders. Maximize attendance.',
      colors: ['#7c3aed', '#c4b5fd', '#f5f3ff'],
      features: ['Host Intro', 'Agenda', 'Platform', 'Email Signup']
    },
    {
      name: 'Trade Show',
      slug: 'trade-show',
      description: 'Industry trade show hub with exhibitor directory, floor plan, networking events, and exhibitor signup. Connect industry.',
      colors: ['#0f766e', '#2dd4bf', '#f0fdfa'],
      features: ['Exhibitors', 'Floor Plan', 'Networking', 'Exhibit']
    },
    {
      name: 'Charity Fundraiser',
      slug: 'charity-fundraiser',
      description: 'Impactful charity event with cause story, donation tiers, progress tracker, and volunteer signup. Make a difference.',
      colors: ['#059669', '#86efac', '#f0fdf4'],
      features: ['Cause Story', 'Donate', 'Progress', 'Volunteer']
    }
  ],
  'Technology': [
    {
      name: 'Cloud Platform',
      slug: 'cloud-platform',
      description: 'Enterprise cloud service with infrastructure features, pricing calculator, security compliance, and free trial. Win enterprise deals.',
      colors: ['#0c4a6e', '#38bdf8', '#f0f9ff'],
      features: ['Features', 'Calculator', 'Security', 'Free Trial']
    },
    {
      name: 'Mobile App Launch',
      slug: 'mobile-app-launch',
      description: 'App launch page with feature showcase, video demo, user testimonials, and store download buttons. Drive installs.',
      colors: ['#6366f1', '#a5b4fc', '#eef2ff'],
      features: ['Features', 'Video Demo', 'Testimonials', 'Downloads']
    },
    {
      name: 'Web3 Platform',
      slug: 'web3-platform',
      description: 'Crypto/blockchain platform with token info, roadmap, whitepaper, and wallet connect. Build community trust.',
      colors: ['#7c3aed', '#d8b4fe', '#faf5ff'],
      features: ['Token Info', 'Roadmap', 'Whitepaper', 'Connect Wallet']
    },
    {
      name: 'AI Assistant Tool',
      slug: 'ai-assistant-tool',
      description: 'AI-powered tool with use case examples, API docs, model comparison, and playground demo. Attract developers.',
      colors: ['#0891b2', '#67e8f9', '#ecfeff'],
      features: ['Use Cases', 'API Docs', 'Comparison', 'Playground']
    },
    {
      name: 'Developer Tools',
      slug: 'developer-tools',
      description: 'Dev tool platform with code examples, integration guides, CLI commands, and community forum. Grow developer adoption.',
      colors: ['#0f172a', '#22c55e', '#f0fdf4'],
      features: ['Code Examples', 'Integrations', 'CLI', 'Community']
    },
    {
      name: 'Cybersecurity Solution',
      slug: 'cybersecurity-solution',
      description: 'Security software with threat detection, compliance features, incident response, and enterprise demo. Protect businesses.',
      colors: ['#991b1b', '#f87171', '#fef2f2'],
      features: ['Threat Detection', 'Compliance', 'Incident Response', 'Demo']
    },
    {
      name: 'Analytics Dashboard',
      slug: 'analytics-dashboard',
      description: 'Data analytics platform with real-time metrics, custom dashboards, data connectors, and ROI calculator. Drive data decisions.',
      colors: ['#1e40af', '#93c5fd', '#dbeafe'],
      features: ['Metrics', 'Dashboards', 'Connectors', 'ROI Calc']
    }
  ],
  'Education': [
    {
      name: 'Online Course Platform',
      slug: 'online-course-platform',
      description: 'E-learning platform with course catalog, instructor profiles, student reviews, and enrollment. Empower learners.',
      colors: ['#3730a3', '#a78bfa', '#ede9fe'],
      features: ['Course Catalog', 'Instructors', 'Reviews', 'Enroll']
    },
    {
      name: 'University Programs',
      slug: 'university-programs',
      description: 'Academic university site with program overview, campus life, admissions info, and application portal. Attract students.',
      colors: ['#7c2d12', '#fb923c', '#fff7ed'],
      features: ['Programs', 'Campus Life', 'Admissions', 'Apply']
    },
    {
      name: 'Training Center',
      slug: 'training-center',
      description: 'Professional training facility with certification courses, corporate training, calendar, and contact. Upskill workforce.',
      colors: ['#065f46', '#34d399', '#d1fae5'],
      features: ['Certifications', 'Corporate', 'Calendar', 'Contact']
    },
    {
      name: 'Tutoring Service',
      slug: 'tutoring-service',
      description: 'Personal tutoring service with subject expertise, tutor matching, pricing plans, and scheduling. Improve grades.',
      colors: ['#0369a1', '#7dd3fc', '#e0f2fe'],
      features: ['Subjects', 'Tutor Match', 'Pricing', 'Schedule']
    },
    {
      name: 'E-Learning SaaS',
      slug: 'elearning-saas',
      description: 'LMS software with course builder, student tracking, assessments, and integrations. Scale education.',
      colors: ['#6366f1', '#c7d2fe', '#eef2ff'],
      features: ['Course Builder', 'Tracking', 'Assessments', 'Integrations']
    },
    {
      name: 'Coding Bootcamp',
      slug: 'coding-bootcamp',
      description: 'Intensive bootcamp with curriculum, outcomes data, financing options, and application. Launch tech careers.',
      colors: ['#0f172a', '#22d3ee', '#cffafe'],
      features: ['Curriculum', 'Outcomes', 'Financing', 'Apply']
    },
    {
      name: 'Language School',
      slug: 'language-school',
      description: 'Language learning center with courses by level, native teachers, cultural immersion, and placement test. Master languages.',
      colors: ['#be123c', '#fda4af', '#ffe4e6'],
      features: ['Levels', 'Teachers', 'Culture', 'Test']
    }
  ]
};

// Helper functions for creating blocks with proper styling

const createTextBlock = (content, style = {}) => ({
  id: generateId('text'),
  type: 'text',
  content,
  style: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: 16,
    fontWeight: 400,
    color: '#334155',
    textAlign: 'center',
    padding: { top: 0, right: 16, bottom: 16, left: 16 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    ...style
  }
});

const createButtonBlock = (text, href, style = {}) => ({
  id: generateId('button'),
  type: 'button',
  text,
  href,
  target: '_self',
  style: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    borderRadius: 8,
    layout: 'center',
    padding: { top: 12, right: 32, bottom: 12, left: 32 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    ...style
  }
});

const createImageBlock = (src, alt, style = {}) => ({
  id: generateId('image'),
  type: 'image',
  src,
  alt,
  style: {
    borderRadius: 8,
    objectFit: 'cover',
    width: '100%',
    height: 'auto',
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    margin: { top: 0, right: 0, bottom: 16, left: 0 },
    ...style
  }
});

const createFeatureBlock = (iconName, title, description, colors) => ({
  id: generateId('feature'),
  type: 'feature',
  iconName,
  title,
  description,
  style: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: { top: 24, right: 24, bottom: 24, left: 24 },
    margin: { top: 0, right: 0, bottom: 16, left: 0 },
    iconColor: colors[1],
    iconSize: 48,
    titleColor: colors[0],
    titleSize: 20,
    titleWeight: 600,
    descriptionColor: '#64748b',
    descriptionSize: 16,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    alignment: 'center',
    showIcon: true
  }
});

const createTestimonialBlock = (quote, authorName, authorRole, colors) => ({
  id: generateId('testimonial'),
  type: 'testimonial',
  quote,
  authorName,
  authorRole,
  rating: 5,
  style: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: { top: 32, right: 32, bottom: 32, left: 32 },
    margin: { top: 0, right: 0, bottom: 16, left: 0 },
    textColor: '#1e293b',
    authorColor: colors[0],
    roleColor: '#64748b',
    fontSize: 18,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    alignment: 'center',
    showRating: true,
    ratingColor: '#fbbf24',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  }
});

const createPricingBlock = (planName, price, period, features, buttonText, highlighted, colors) => ({
  id: generateId('pricing'),
  type: 'pricing',
  planName,
  price,
  currency: '$',
  period,
  features,
  buttonText,
  buttonLink: '#signup',
  highlighted,
  highlightLabel: highlighted ? 'Popular' : undefined,
  style: {
    backgroundColor: highlighted ? colors[2] : '#ffffff',
    borderRadius: 12,
    padding: { top: 32, right: 24, bottom: 32, left: 24 },
    margin: { top: 0, right: 8, bottom: 16, left: 8 },
    planNameColor: colors[0],
    planNameSize: 24,
    priceColor: colors[1],
    priceSize: 48,
    periodColor: '#64748b',
    periodSize: 16,
    featuresColor: '#334155',
    featuresSize: 16,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    alignment: 'center',
    highlightColor: colors[1],
    borderWidth: highlighted ? 2 : 1,
    borderColor: highlighted ? colors[1] : '#e2e8f0'
  }
});

const createStatsBlock = (items, colors) => ({
  id: generateId('stats'),
  type: 'stats',
  items,
  style: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: { top: 16, right: 16, bottom: 16, left: 16 },
    margin: { top: 0, right: 0, bottom: 16, left: 0 },
    labelColor: '#64748b',
    labelSize: 14,
    valueColor: colors[0],
    valueSize: 36,
    progressBarColor: colors[1],
    progressBarBackgroundColor: '#e2e8f0',
    progressBarHeight: 8,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    alignment: 'center',
    layout: 'horizontal',
    itemSpacing: 32
  }
});

const createFormBlock = (title, fields, colors) => ({
  id: generateId('form'),
  type: 'form',
  title,
  description: 'Fill out the form below and we\'ll get back to you shortly.',
  fields,
  submitButtonText: 'Submit',
  submitAction: 'none',
  successMessage: 'Thank you! We\'ll be in touch soon.',
  style: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: { top: 32, right: 32, bottom: 32, left: 32 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    labelColor: colors[0],
    labelSize: 14,
    inputBackgroundColor: '#f8fafc',
    inputBorderColor: '#e2e8f0',
    inputTextColor: '#1e293b',
    inputBorderRadius: 8,
    buttonBackgroundColor: colors[1],
    buttonTextColor: '#ffffff',
    buttonBorderRadius: 8,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    spacing: 16
  }
});

const createFAQBlock = (items, colors) => ({
  id: generateId('faq'),
  type: 'faq',
  items,
  style: {
    fontSize: 16,
    fontWeight: 400,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    questionColor: colors[0],
    answerColor: '#64748b',
    backgroundColor: '#ffffff',
    padding: { top: 16, right: 16, bottom: 16, left: 16 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  }
});

const createDividerBlock = (colors) => ({
  id: generateId('divider'),
  type: 'divider',
  style: {
    width: '100%',
    height: 2,
    color: colors[2] || '#e2e8f0',
    style: 'solid',
    margin: { top: 32, right: 0, bottom: 32, left: 0 }
  }
});

const createIconBlock = (iconName, colors) => ({
  id: generateId('icon'),
  type: 'icon',
  iconName,
  style: {
    size: 64,
    color: colors[1],
    alignment: 'center',
    margin: { top: 0, right: 0, bottom: 16, left: 0 }
  }
});

const createSocialMediaBlock = (links, colors) => ({
  id: generateId('social'),
  type: 'social',
  links,
  style: {
    size: 32,
    layout: 'horizontal',
    alignment: 'center',
    spacing: 16,
    useBrandColors: true,
    margin: { top: 16, right: 0, bottom: 16, left: 0 }
  }
});

const createTeamBlock = (name, role, bio, imageUrl, colors) => ({
  id: generateId('team'),
  type: 'team',
  name,
  role,
  bio,
  imageUrl,
  socialLinks: [],
  style: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: { top: 24, right: 24, bottom: 24, left: 24 },
    margin: { top: 0, right: 8, bottom: 16, left: 8 },
    imageSize: 150,
    imageBorderRadius: 9999,
    nameColor: colors[0],
    nameSize: 20,
    roleColor: colors[1],
    roleSize: 16,
    bioColor: '#64748b',
    bioSize: 14,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    alignment: 'center',
    cardBackgroundColor: '#f8fafc',
    cardBorderColor: '#e2e8f0',
    cardBorderWidth: 1
  }
});

const createGalleryBlock = (images, colors) => ({
  id: generateId('gallery'),
  type: 'gallery',
  images,
  autoPlay: false,
  autoPlayInterval: 3000,
  showNavButtons: true,
  showDots: true,
  loop: true,
  style: {
    aspectRatio: '16:9',
    borderRadius: 12,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    margin: { top: 0, right: 0, bottom: 16, left: 0 },
    imageObjectFit: 'cover',
    showThumbnails: false,
    thumbnailSize: 80,
    showCaptions: true,
    captionColor: '#ffffff',
    captionSize: 14,
    captionBackgroundColor: 'rgba(0,0,0,0.7)',
    navButtonColor: '#ffffff',
    navButtonBackgroundColor: 'rgba(0,0,0,0.5)',
    dotColor: '#ffffff',
    dotActiveColor: colors[1],
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }
});

const createNewsletterBlock = (colors) => ({
  id: generateId('newsletter'),
  type: 'newsletter',
  heading: 'Stay in the loop',
  description: 'Subscribe to our newsletter for updates, tips, and exclusive content.',
  inputPlaceholder: 'Enter your email',
  buttonText: 'Subscribe',
  successMessage: 'Thank you for subscribing!',
  showPrivacyCheckbox: true,
  privacyText: 'I agree to receive marketing emails',
  style: {
    layout: 'inline',
    padding: { top: 32, right: 32, bottom: 32, left: 32 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    backgroundColor: colors[2],
    borderRadius: 12,
    headingColor: colors[0],
    headingSize: 28,
    headingWeight: 700,
    headingAlign: 'center',
    descriptionColor: '#64748b',
    descriptionSize: 16,
    descriptionAlign: 'center',
    inputBackgroundColor: '#ffffff',
    inputTextColor: '#1e293b',
    inputBorderColor: '#e2e8f0',
    inputBorderWidth: 1,
    inputBorderRadius: 8,
    inputPadding: 12,
    buttonBackgroundColor: colors[1],
    buttonTextColor: '#ffffff',
    buttonBorderRadius: 8,
    buttonPadding: 12,
    buttonFontSize: 16,
    buttonFontWeight: 600,
    gap: 16
  }
});

const createLogoGridBlock = (logos, colors) => ({
  id: generateId('logo-grid'),
  type: 'logo-grid',
  logos,
  style: {
    columns: 4,
    gap: 32,
    logoSize: 60,
    padding: { top: 24, right: 24, bottom: 24, left: 24 },
    margin: { top: 0, right: 0, bottom: 16, left: 0 },
    backgroundColor: 'transparent',
    logoBackgroundColor: 'transparent',
    borderRadius: 0,
    alignment: 'center',
    grayscale: true,
    grayscaleHover: true,
    opacity: 0.6,
    hoverOpacity: 1.0
  }
});

const createQuoteBlock = (quote, author, authorTitle, colors) => ({
  id: generateId('quote'),
  type: 'quote',
  quote,
  author,
  authorTitle,
  style: {
    backgroundColor: colors[2],
    borderRadius: 12,
    padding: { top: 32, right: 32, bottom: 32, left: 32 },
    margin: { top: 0, right: 0, bottom: 16, left: 0 },
    quoteColor: colors[0],
    quoteSize: 24,
    authorColor: colors[1],
    authorSize: 16,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    alignment: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors[1],
    fontStyle: 'italic',
    showQuoteMarks: true,
    quoteMarkColor: colors[1]
  }
});

const createVideoBlock = (url, source) => ({
  id: generateId('video'),
  type: 'video',
  url,
  source,
  style: {
    aspectRatio: '16:9',
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    margin: { top: 0, right: 0, bottom: 16, left: 0 }
  }
});

const createAccordionBlock = (items, colors) => ({
  id: generateId('accordion'),
  type: 'accordion',
  items,
  allowMultipleExpanded: false,
  defaultExpandedIndex: -1,
  style: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    margin: { top: 0, right: 0, bottom: 16, left: 0 },
    itemBackgroundColor: '#ffffff',
    itemBorderColor: '#e2e8f0',
    titleColor: colors[0],
    titleSize: 18,
    contentColor: '#64748b',
    contentSize: 16,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    spacing: 12,
    expandedItemBackgroundColor: colors[2]
  }
});

const createSpaceBlock = (height) => ({
  id: generateId('space'),
  type: 'space',
  height
});

// Template generator functions for each category
function generateBusinessTemplate(template) {
  const { slug, name, description, colors } = template;

  const sections = [];

  // Hero Section
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: colors[0],
      padding: { top: 100, right: 24, bottom: 100, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock(name, { fontSize: 48, fontWeight: 700, color: colors[2], margin: { top: 0, right: 0, bottom: 24, left: 0 } }),
      createTextBlock(description, { fontSize: 20, color: colors[2] + 'cc', margin: { top: 0, right: 0, bottom: 32, left: 0 } }),
      createButtonBlock('Get Started', '#contact', { backgroundColor: colors[1], color: colors[2], fontSize: 18, padding: { top: 16, right: 48, bottom: 16, left: 48 } })
    ]
  });

  // Features Section
  sections.push({
    id: generateId('section'),
    layout: 'grid',
    columns: 3,
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'row', alignItems: 'stretch', justifyContent: 'center', wrap: 'wrap' },
      columnGap: 24,
      rowGap: 24
    },
    blocks: [
      createTextBlock('Our Services', { fontSize: 36, fontWeight: 700, color: colors[0], textAlign: 'center', margin: { top: 0, right: 0, bottom: 48, left: 0 } }),
      createFeatureBlock('Zap', 'Fast Delivery', 'Get your projects completed on time, every time with our efficient workflow.', colors),
      createFeatureBlock('Shield', 'Secure & Reliable', 'Enterprise-grade security and 99.9% uptime guarantee for peace of mind.', colors),
      createFeatureBlock('Users', 'Expert Team', 'Work with industry experts who bring years of experience to your project.', colors)
    ]
  });

  // Stats Section
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: colors[2],
      padding: { top: 60, right: 24, bottom: 60, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createStatsBlock([
        { id: generateId('stat'), label: 'Happy Clients', value: 500, suffix: '+', showProgressBar: false },
        { id: generateId('stat'), label: 'Projects Completed', value: 1200, suffix: '+', showProgressBar: false },
        { id: generateId('stat'), label: 'Team Members', value: 50, suffix: '+', showProgressBar: false }
      ], colors)
    ]
  });

  // Testimonials Section
  sections.push({
    id: generateId('section'),
    layout: 'grid',
    columns: 2,
    style: {
      backgroundColor: '#f8fafc',
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'row', alignItems: 'stretch', justifyContent: 'center', wrap: 'wrap' },
      columnGap: 24,
      rowGap: 24
    },
    blocks: [
      createTextBlock('What Our Clients Say', { fontSize: 36, fontWeight: 700, color: colors[0], margin: { top: 0, right: 0, bottom: 48, left: 0 } }),
      createTestimonialBlock('Working with this team has transformed our business. Their expertise and dedication are unmatched.', 'Sarah Johnson', 'CEO, TechCorp', colors),
      createTestimonialBlock('Exceptional service and results that exceeded our expectations. Highly recommend!', 'Michael Chen', 'Director, Innovation Labs', colors)
    ]
  });

  // Contact CTA Section
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: colors[1],
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock('Ready to Transform Your Business?', { fontSize: 40, fontWeight: 700, color: '#ffffff', margin: { top: 0, right: 0, bottom: 24, left: 0 } }),
      createTextBlock('Get in touch with us today and let\'s discuss how we can help you achieve your goals.', { fontSize: 18, color: '#ffffff' + 'ee', margin: { top: 0, right: 0, bottom: 32, left: 0 } }),
      createButtonBlock('Contact Us', '#contact', { backgroundColor: '#ffffff', color: colors[1], fontSize: 18, padding: { top: 16, right: 48, bottom: 16, left: 48 } })
    ]
  });

  return {
    id: generateId('template'),
    name,
    slug,
    sections
  };
}

function generateEcommerceTemplate(template) {
  const { slug, name, description, colors } = template;

  const sections = [];

  // Hero with Product Showcase
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: colors[2],
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock(name, { fontSize: 48, fontWeight: 700, color: colors[0], margin: { top: 0, right: 0, bottom: 16, left: 0 } }),
      createTextBlock(description, { fontSize: 20, color: '#64748b', margin: { top: 0, right: 0, bottom: 32, left: 0 } }),
      createImageBlock('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', 'Product showcase', { borderRadius: 12 }),
      createButtonBlock('Shop Now', '#shop', { backgroundColor: colors[1], fontSize: 18, padding: { top: 16, right: 48, bottom: 16, left: 48 } })
    ]
  });

  // Features Grid
  sections.push({
    id: generateId('section'),
    layout: 'grid',
    columns: 4,
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 60, right: 24, bottom: 60, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'row', alignItems: 'stretch', justifyContent: 'center', wrap: 'wrap' },
      columnGap: 16,
      rowGap: 16
    },
    blocks: [
      createFeatureBlock('Truck', 'Free Shipping', 'On orders over $50', colors),
      createFeatureBlock('CreditCard', 'Secure Payment', '100% secure transactions', colors),
      createFeatureBlock('RotateCcw', 'Easy Returns', '30-day return policy', colors),
      createFeatureBlock('Headphones', '24/7 Support', 'Always here to help', colors)
    ]
  });

  // Product Gallery
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: '#f8fafc',
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock('Featured Products', { fontSize: 36, fontWeight: 700, color: colors[0], margin: { top: 0, right: 0, bottom: 48, left: 0 } }),
      createGalleryBlock([
        { id: generateId('img'), url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', alt: 'Product 1', caption: 'Premium Product' },
        { id: generateId('img'), url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800', alt: 'Product 2', caption: 'Best Seller' },
        { id: generateId('img'), url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', alt: 'Product 3', caption: 'New Arrival' }
      ], colors)
    ]
  });

  // Testimonials
  sections.push({
    id: generateId('section'),
    layout: 'grid',
    columns: 3,
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'row', alignItems: 'stretch', justifyContent: 'center', wrap: 'wrap' },
      columnGap: 24,
      rowGap: 24
    },
    blocks: [
      createTextBlock('Customer Reviews', { fontSize: 36, fontWeight: 700, color: colors[0], margin: { top: 0, right: 0, bottom: 48, left: 0 } }),
      createTestimonialBlock('Amazing quality! The product exceeded my expectations. Will definitely order again.', 'Emma Wilson', 'Verified Buyer', colors),
      createTestimonialBlock('Fast shipping and excellent customer service. Very satisfied with my purchase.', 'James Martinez', 'Verified Buyer', colors),
      createTestimonialBlock('Best online shopping experience I\'ve had. The quality is outstanding!', 'Lisa Anderson', 'Verified Buyer', colors)
    ]
  });

  // Newsletter Signup
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: colors[0],
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createNewsletterBlock([colors[2], colors[1], colors[2] + '22'])
    ]
  });

  return {
    id: generateId('template'),
    name,
    slug,
    sections
  };
}

function generatePersonalTemplate(template) {
  const { slug, name, description, colors } = template;

  const sections = [];

  // Hero Introduction
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: colors[0],
      padding: { top: 120, right: 24, bottom: 120, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createIconBlock('Sparkles', colors),
      createTextBlock(name, { fontSize: 48, fontWeight: 700, color: colors[2], margin: { top: 0, right: 0, bottom: 16, left: 0 } }),
      createTextBlock(description, { fontSize: 20, color: colors[2] + 'dd', margin: { top: 0, right: 0, bottom: 32, left: 0 } }),
      createSocialMediaBlock([
        { platform: 'twitter', url: 'https://twitter.com' },
        { platform: 'linkedin', url: 'https://linkedin.com' },
        { platform: 'github', url: 'https://github.com' }
      ], colors)
    ]
  });

  // About Section
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock('About Me', { fontSize: 36, fontWeight: 700, color: colors[0], margin: { top: 0, right: 0, bottom: 32, left: 0 } }),
      createQuoteBlock('Passionate about creating beautiful and functional experiences that make a difference.', 'Your Name', 'Your Title', colors),
      createDividerBlock(colors)
    ]
  });

  // Work/Portfolio Section
  sections.push({
    id: generateId('section'),
    layout: 'grid',
    columns: 2,
    style: {
      backgroundColor: colors[2],
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'row', alignItems: 'stretch', justifyContent: 'center', wrap: 'wrap' },
      columnGap: 32,
      rowGap: 32
    },
    blocks: [
      createTextBlock('Featured Work', { fontSize: 36, fontWeight: 700, color: colors[0], margin: { top: 0, right: 0, bottom: 48, left: 0 } }),
      createImageBlock('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'Project 1', { borderRadius: 16 }),
      createImageBlock('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', 'Project 2', { borderRadius: 16 }),
      createImageBlock('https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800', 'Project 3', { borderRadius: 16 })
    ]
  });

  // Skills/Stats
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock('Skills & Expertise', { fontSize: 36, fontWeight: 700, color: colors[0], margin: { top: 0, right: 0, bottom: 48, left: 0 } }),
      createStatsBlock([
        { id: generateId('stat'), label: 'Design', value: 95, maxValue: 100, suffix: '%', showProgressBar: true },
        { id: generateId('stat'), label: 'Development', value: 90, maxValue: 100, suffix: '%', showProgressBar: true },
        { id: generateId('stat'), label: 'Strategy', value: 85, maxValue: 100, suffix: '%', showProgressBar: true }
      ], colors)
    ]
  });

  // Contact CTA
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: colors[1],
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock('Let\'s Work Together', { fontSize: 40, fontWeight: 700, color: '#ffffff', margin: { top: 0, right: 0, bottom: 24, left: 0 } }),
      createTextBlock('I\'m always open to discussing new projects and creative ideas.', { fontSize: 18, color: '#ffffff' + 'ee', margin: { top: 0, right: 0, bottom: 32, left: 0 } }),
      createButtonBlock('Get in Touch', '#contact', { backgroundColor: '#ffffff', color: colors[1], fontSize: 18, padding: { top: 16, right: 48, bottom: 16, left: 48 } })
    ]
  });

  return {
    id: generateId('template'),
    name,
    slug,
    sections
  };
}

function generateFoodTemplate(template) {
  const { slug, name, description, colors } = template;

  const sections = [];

  // Hero Section
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: colors[0],
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5))',
      padding: { top: 100, right: 24, bottom: 100, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock(name, { fontSize: 52, fontWeight: 700, color: colors[2], margin: { top: 0, right: 0, bottom: 16, left: 0 } }),
      createTextBlock(description, { fontSize: 20, color: colors[2] + 'dd', margin: { top: 0, right: 0, bottom: 32, left: 0 } }),
      createButtonBlock('View Menu', '#menu', { backgroundColor: colors[1], color: colors[2], fontSize: 18, padding: { top: 16, right: 48, bottom: 16, left: 48 } }),
      createSpaceBlock(16),
      createButtonBlock('Reserve Table', '#reserve', { backgroundColor: 'transparent', color: colors[2], fontSize: 16, padding: { top: 12, right: 32, bottom: 12, left: 32 }, borderRadius: 8 })
    ]
  });

  // Features Section
  sections.push({
    id: generateId('section'),
    layout: 'grid',
    columns: 3,
    style: {
      backgroundColor: colors[2],
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'row', alignItems: 'stretch', justifyContent: 'center', wrap: 'wrap' },
      columnGap: 32,
      rowGap: 32
    },
    blocks: [
      createFeatureBlock('Utensils', 'Fresh Ingredients', 'We source the finest local and organic ingredients daily.', colors),
      createFeatureBlock('ChefHat', 'Expert Chefs', 'Our award-winning chefs bring decades of culinary expertise.', colors),
      createFeatureBlock('Heart', 'Made with Love', 'Every dish is crafted with passion and attention to detail.', colors)
    ]
  });

  // Menu Highlights
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock('Menu Highlights', { fontSize: 40, fontWeight: 700, color: colors[0], margin: { top: 0, right: 0, bottom: 48, left: 0 } }),
      createGalleryBlock([
        { id: generateId('img'), url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800', alt: 'Dish 1', caption: 'Signature Salad' },
        { id: generateId('img'), url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800', alt: 'Dish 2', caption: 'Grilled Salmon' },
        { id: generateId('img'), url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800', alt: 'Dish 3', caption: 'Artisan Dessert' }
      ], colors)
    ]
  });

  // Testimonials
  sections.push({
    id: generateId('section'),
    layout: 'grid',
    columns: 2,
    style: {
      backgroundColor: colors[2],
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'row', alignItems: 'stretch', justifyContent: 'center', wrap: 'wrap' },
      columnGap: 24,
      rowGap: 24
    },
    blocks: [
      createTextBlock('What Diners Say', { fontSize: 36, fontWeight: 700, color: colors[0], margin: { top: 0, right: 0, bottom: 48, left: 0 } }),
      createTestimonialBlock('The best dining experience in the city! Every dish was a masterpiece.', 'Rachel Green', 'Food Critic', colors),
      createTestimonialBlock('Exceptional service and incredible flavors. Can\'t wait to come back!', 'David Kim', 'Regular Customer', colors)
    ]
  });

  // Contact/Location
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: colors[1],
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock('Visit Us Today', { fontSize: 40, fontWeight: 700, color: colors[2], margin: { top: 0, right: 0, bottom: 16, left: 0 } }),
      createTextBlock('Open Daily: 11am - 10pm', { fontSize: 20, color: colors[2] + 'dd', margin: { top: 0, right: 0, bottom: 8, left: 0 } }),
      createTextBlock('123 Culinary Street, Food District', { fontSize: 18, color: colors[2] + 'cc', margin: { top: 0, right: 0, bottom: 32, left: 0 } }),
      createButtonBlock('Make Reservation', '#reserve', { backgroundColor: colors[2], color: colors[1], fontSize: 18, padding: { top: 16, right: 48, bottom: 16, left: 48 } })
    ]
  });

  return {
    id: generateId('template'),
    name,
    slug,
    sections
  };
}

function generateEventTemplate(template) {
  const { slug, name, description, colors } = template;

  const sections = [];

  // Hero Section
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: colors[0],
      padding: { top: 100, right: 24, bottom: 100, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock(name, { fontSize: 52, fontWeight: 700, color: colors[2], margin: { top: 0, right: 0, bottom: 16, left: 0 } }),
      createTextBlock(description, { fontSize: 20, color: colors[2] + 'dd', margin: { top: 0, right: 0, bottom: 32, left: 0 } }),
      createTextBlock('📅 June 15-17, 2024 | 🌍 San Francisco, CA', { fontSize: 18, color: colors[2], margin: { top: 0, right: 0, bottom: 32, left: 0 } }),
      createButtonBlock('Get Tickets', '#tickets', { backgroundColor: colors[1], color: colors[2], fontSize: 18, padding: { top: 16, right: 48, bottom: 16, left: 48 } })
    ]
  });

  // Event Info
  sections.push({
    id: generateId('section'),
    layout: 'grid',
    columns: 3,
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'row', alignItems: 'stretch', justifyContent: 'center', wrap: 'wrap' },
      columnGap: 24,
      rowGap: 24
    },
    blocks: [
      createFeatureBlock('Calendar', '3 Days', 'Full event schedule', colors),
      createFeatureBlock('Users', '50+ Speakers', 'Industry experts', colors),
      createFeatureBlock('MapPin', 'Prime Location', 'Downtown venue', colors)
    ]
  });

  // Speakers/Team Section
  sections.push({
    id: generateId('section'),
    layout: 'grid',
    columns: 3,
    style: {
      backgroundColor: colors[2],
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'row', alignItems: 'stretch', justifyContent: 'center', wrap: 'wrap' },
      columnGap: 24,
      rowGap: 24
    },
    blocks: [
      createTextBlock('Featured Speakers', { fontSize: 36, fontWeight: 700, color: colors[0], margin: { top: 0, right: 0, bottom: 48, left: 0 } }),
      createTeamBlock('Dr. Sarah Williams', 'Keynote Speaker', 'Tech innovation expert with 20+ years experience', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300', colors),
      createTeamBlock('James Chen', 'Industry Leader', 'CEO of leading tech company', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300', colors),
      createTeamBlock('Maria Garcia', 'Innovation Director', 'Pioneer in digital transformation', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300', colors)
    ]
  });

  // Schedule/Accordion
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock('Event Schedule', { fontSize: 36, fontWeight: 700, color: colors[0], margin: { top: 0, right: 0, bottom: 32, left: 0 } }),
      createAccordionBlock([
        { id: generateId('item'), title: 'Day 1 - Opening & Keynotes', content: '9:00 AM - Registration\n10:00 AM - Opening Ceremony\n11:00 AM - Keynote Presentations\n1:00 PM - Lunch & Networking' },
        { id: generateId('item'), title: 'Day 2 - Workshops & Sessions', content: '9:00 AM - Morning Workshops\n12:00 PM - Lunch Break\n2:00 PM - Afternoon Sessions\n5:00 PM - Evening Reception' },
        { id: generateId('item'), title: 'Day 3 - Closing & Awards', content: '9:00 AM - Final Sessions\n12:00 PM - Awards Ceremony\n2:00 PM - Closing Remarks\n3:00 PM - Networking Mixer' }
      ], colors)
    ]
  });

  // Pricing/Tickets
  sections.push({
    id: generateId('section'),
    layout: 'grid',
    columns: 3,
    style: {
      backgroundColor: colors[2],
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'row', alignItems: 'stretch', justifyContent: 'center', wrap: 'wrap' },
      columnGap: 24,
      rowGap: 24
    },
    blocks: [
      createTextBlock('Ticket Options', { fontSize: 36, fontWeight: 700, color: colors[0], margin: { top: 0, right: 0, bottom: 48, left: 0 } }),
      createPricingBlock('Early Bird', '299', '/ ticket', ['Access to all sessions', 'Conference materials', 'Lunch included', 'Networking events'], 'Buy Now', false, colors),
      createPricingBlock('Standard', '399', '/ ticket', ['Access to all sessions', 'Conference materials', 'Lunch included', 'Networking events', 'VIP lounge access'], 'Buy Now', true, colors),
      createPricingBlock('VIP', '599', '/ ticket', ['All Standard features', 'Meet & greet with speakers', 'Premium seating', 'Exclusive dinners', 'Gift package'], 'Buy Now', false, colors)
    ]
  });

  // CTA Section
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: colors[1],
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock('Don\'t Miss Out!', { fontSize: 40, fontWeight: 700, color: colors[2], margin: { top: 0, right: 0, bottom: 16, left: 0 } }),
      createTextBlock('Limited seats available. Secure your spot today!', { fontSize: 18, color: colors[2] + 'ee', margin: { top: 0, right: 0, bottom: 32, left: 0 } }),
      createButtonBlock('Register Now', '#register', { backgroundColor: colors[2], color: colors[1], fontSize: 18, padding: { top: 16, right: 48, bottom: 16, left: 48 } })
    ]
  });

  return {
    id: generateId('template'),
    name,
    slug,
    sections
  };
}

function generateTechnologyTemplate(template) {
  const { slug, name, description, colors } = template;

  const sections = [];

  // Hero Section
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: colors[0],
      padding: { top: 120, right: 24, bottom: 120, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createIconBlock('Cpu', [colors[2], colors[1], colors[2]]),
      createTextBlock(name, { fontSize: 52, fontWeight: 700, color: colors[2], margin: { top: 0, right: 0, bottom: 16, left: 0 } }),
      createTextBlock(description, { fontSize: 20, color: colors[2] + 'dd', margin: { top: 0, right: 0, bottom: 32, left: 0 } }),
      createButtonBlock('Start Free Trial', '#trial', { backgroundColor: colors[1], color: '#ffffff', fontSize: 18, padding: { top: 16, right: 48, bottom: 16, left: 48 } }),
      createTextBlock('No credit card required • 14-day trial', { fontSize: 14, color: colors[2] + 'aa', margin: { top: 16, right: 0, bottom: 0, left: 0 } })
    ]
  });

  // Logo Grid
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 60, right: 24, bottom: 60, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock('Trusted by Leading Companies', { fontSize: 16, fontWeight: 600, color: '#64748b', textAlign: 'center', margin: { top: 0, right: 0, bottom: 32, left: 0 } }),
      createLogoGridBlock([
        { id: generateId('logo'), imageUrl: 'https://via.placeholder.com/150x60/e2e8f0/64748b?text=Company+1', alt: 'Company 1' },
        { id: generateId('logo'), imageUrl: 'https://via.placeholder.com/150x60/e2e8f0/64748b?text=Company+2', alt: 'Company 2' },
        { id: generateId('logo'), imageUrl: 'https://via.placeholder.com/150x60/e2e8f0/64748b?text=Company+3', alt: 'Company 3' },
        { id: generateId('logo'), imageUrl: 'https://via.placeholder.com/150x60/e2e8f0/64748b?text=Company+4', alt: 'Company 4' }
      ], colors)
    ]
  });

  // Features Grid
  sections.push({
    id: generateId('section'),
    layout: 'grid',
    columns: 3,
    style: {
      backgroundColor: colors[2],
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'row', alignItems: 'stretch', justifyContent: 'center', wrap: 'wrap' },
      columnGap: 24,
      rowGap: 24
    },
    blocks: [
      createTextBlock('Powerful Features', { fontSize: 36, fontWeight: 700, color: colors[0], margin: { top: 0, right: 0, bottom: 48, left: 0 } }),
      createFeatureBlock('Zap', 'Lightning Fast', 'Optimized performance for blazing fast response times.', colors),
      createFeatureBlock('Lock', 'Enterprise Security', 'Bank-grade encryption and SOC 2 compliance.', colors),
      createFeatureBlock('BarChart', 'Real-time Analytics', 'Monitor your metrics with live dashboards.', colors),
      createFeatureBlock('Globe', 'Global Scale', 'Deploy worldwide with our CDN infrastructure.', colors),
      createFeatureBlock('Code', 'Developer Friendly', 'Well-documented APIs and SDKs for all platforms.', colors),
      createFeatureBlock('Users', '24/7 Support', 'Expert support team always ready to help.', colors)
    ]
  });

  // Video Demo
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock('See It In Action', { fontSize: 36, fontWeight: 700, color: colors[0], margin: { top: 0, right: 0, bottom: 32, left: 0 } }),
      createVideoBlock('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube')
    ]
  });

  // Stats Section
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: colors[1],
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock('By The Numbers', { fontSize: 36, fontWeight: 700, color: '#ffffff', margin: { top: 0, right: 0, bottom: 48, left: 0 } }),
      createStatsBlock([
        { id: generateId('stat'), label: 'Active Users', value: 10000, suffix: '+', showProgressBar: false },
        { id: generateId('stat'), label: 'API Calls Daily', value: 1000000, prefix: '', suffix: 'M+', showProgressBar: false },
        { id: generateId('stat'), label: 'Uptime', value: 99.9, suffix: '%', showProgressBar: false }
      ], [colors[2], colors[2], colors[2]])
    ]
  });

  // FAQ Section
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock('Frequently Asked Questions', { fontSize: 36, fontWeight: 700, color: colors[0], margin: { top: 0, right: 0, bottom: 32, left: 0 } }),
      createFAQBlock([
        { id: generateId('faq'), question: 'How does the free trial work?', answer: 'You get full access to all features for 14 days, no credit card required. Cancel anytime.' },
        { id: generateId('faq'), question: 'Can I upgrade or downgrade later?', answer: 'Yes, you can change your plan at any time. Changes take effect immediately.' },
        { id: generateId('faq'), question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, PayPal, and wire transfers for enterprise customers.' },
        { id: generateId('faq'), question: 'Is my data secure?', answer: 'Absolutely. We use bank-grade encryption and are SOC 2 certified.' }
      ], colors)
    ]
  });

  // Final CTA
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: colors[0],
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock('Ready to Get Started?', { fontSize: 40, fontWeight: 700, color: colors[2], margin: { top: 0, right: 0, bottom: 16, left: 0 } }),
      createTextBlock('Join thousands of companies already using our platform', { fontSize: 18, color: colors[2] + 'dd', margin: { top: 0, right: 0, bottom: 32, left: 0 } }),
      createButtonBlock('Start Free Trial', '#signup', { backgroundColor: colors[1], color: '#ffffff', fontSize: 18, padding: { top: 16, right: 48, bottom: 16, left: 48 } })
    ]
  });

  return {
    id: generateId('template'),
    name,
    slug,
    sections
  };
}

function generateEducationTemplate(template) {
  const { slug, name, description, colors } = template;

  const sections = [];

  // Hero Section
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: colors[0],
      padding: { top: 100, right: 24, bottom: 100, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createIconBlock('GraduationCap', [colors[2], colors[1], colors[2]]),
      createTextBlock(name, { fontSize: 48, fontWeight: 700, color: colors[2], margin: { top: 0, right: 0, bottom: 16, left: 0 } }),
      createTextBlock(description, { fontSize: 20, color: colors[2] + 'dd', margin: { top: 0, right: 0, bottom: 32, left: 0 } }),
      createButtonBlock('Explore Courses', '#courses', { backgroundColor: colors[1], color: colors[2], fontSize: 18, padding: { top: 16, right: 48, bottom: 16, left: 48 } })
    ]
  });

  // Features/Benefits
  sections.push({
    id: generateId('section'),
    layout: 'grid',
    columns: 3,
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'row', alignItems: 'stretch', justifyContent: 'center', wrap: 'wrap' },
      columnGap: 24,
      rowGap: 24
    },
    blocks: [
      createTextBlock('Why Choose Us', { fontSize: 36, fontWeight: 700, color: colors[0], margin: { top: 0, right: 0, bottom: 48, left: 0 } }),
      createFeatureBlock('BookOpen', 'Expert Instructors', 'Learn from industry professionals with real-world experience.', colors),
      createFeatureBlock('Award', 'Certified Programs', 'Earn recognized certifications upon course completion.', colors),
      createFeatureBlock('Clock', 'Flexible Learning', 'Study at your own pace with lifetime access to materials.', colors)
    ]
  });

  // Course Preview/Gallery
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: colors[2],
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock('Popular Courses', { fontSize: 36, fontWeight: 700, color: colors[0], margin: { top: 0, right: 0, bottom: 48, left: 0 } }),
      createGalleryBlock([
        { id: generateId('img'), url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800', alt: 'Course 1', caption: 'Web Development Bootcamp' },
        { id: generateId('img'), url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800', alt: 'Course 2', caption: 'Data Science Fundamentals' },
        { id: generateId('img'), url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', alt: 'Course 3', caption: 'Digital Marketing Mastery' }
      ], colors)
    ]
  });

  // Success Stats
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: colors[1],
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock('Our Impact', { fontSize: 36, fontWeight: 700, color: colors[2], margin: { top: 0, right: 0, bottom: 48, left: 0 } }),
      createStatsBlock([
        { id: generateId('stat'), label: 'Students Enrolled', value: 50000, suffix: '+', showProgressBar: false },
        { id: generateId('stat'), label: 'Courses Available', value: 200, suffix: '+', showProgressBar: false },
        { id: generateId('stat'), label: 'Satisfaction Rate', value: 98, suffix: '%', showProgressBar: false }
      ], [colors[2], colors[2], colors[2]])
    ]
  });

  // Testimonials
  sections.push({
    id: generateId('section'),
    layout: 'grid',
    columns: 2,
    style: {
      backgroundColor: '#ffffff',
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'row', alignItems: 'stretch', justifyContent: 'center', wrap: 'wrap' },
      columnGap: 24,
      rowGap: 24
    },
    blocks: [
      createTextBlock('Student Success Stories', { fontSize: 36, fontWeight: 700, color: colors[0], margin: { top: 0, right: 0, bottom: 48, left: 0 } }),
      createTestimonialBlock('This course changed my career! I landed my dream job within 3 months of completing the program.', 'Alex Thompson', 'Software Engineer', colors),
      createTestimonialBlock('The instructors are amazing and the content is top-notch. Best investment I\'ve made in my education.', 'Maria Rodriguez', 'Product Manager', colors)
    ]
  });

  // Contact Form
  sections.push({
    id: generateId('section'),
    style: {
      backgroundColor: colors[2],
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center', wrap: 'nowrap' }
    },
    blocks: [
      createTextBlock('Get Started Today', { fontSize: 36, fontWeight: 700, color: colors[0], margin: { top: 0, right: 0, bottom: 32, left: 0 } }),
      createFormBlock('Request More Information', [
        { id: generateId('field'), type: 'text', label: 'Full Name', placeholder: 'John Doe', required: true },
        { id: generateId('field'), type: 'email', label: 'Email Address', placeholder: 'john@example.com', required: true },
        { id: generateId('field'), type: 'select', label: 'Course Interest', required: true, options: ['Web Development', 'Data Science', 'Digital Marketing', 'Business', 'Other'] },
        { id: generateId('field'), type: 'textarea', label: 'Questions or Comments', placeholder: 'Tell us what you\'d like to learn...', required: false }
      ], colors)
    ]
  });

  return {
    id: generateId('template'),
    name,
    slug,
    sections
  };
}

// Generate all templates
console.log('Generating templates...\n');

const outputDir = path.join(__dirname, 'public', 'templates');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const indexData = {
  categories: []
};

let totalTemplates = 0;

// Process each category
for (const [category, templates] of Object.entries(templateDefinitions)) {
  console.log(`\nGenerating ${category} templates...`);

  const categoryData = {
    name: category,
    templates: []
  };

  templates.forEach((template, index) => {
    let generatedTemplate;

    // Use appropriate generator based on category
    switch(category) {
      case 'Business':
        generatedTemplate = generateBusinessTemplate(template);
        break;
      case 'E-commerce':
        generatedTemplate = generateEcommerceTemplate(template);
        break;
      case 'Personal':
        generatedTemplate = generatePersonalTemplate(template);
        break;
      case 'Food & Dining':
        generatedTemplate = generateFoodTemplate(template);
        break;
      case 'Events':
        generatedTemplate = generateEventTemplate(template);
        break;
      case 'Technology':
        generatedTemplate = generateTechnologyTemplate(template);
        break;
      case 'Education':
        generatedTemplate = generateEducationTemplate(template);
        break;
      default:
        generatedTemplate = generateBusinessTemplate(template);
    }

    // Write template to file
    const filename = `${template.slug}.json`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(generatedTemplate, null, 2));

    console.log(`  ✓ ${template.name} (${filename})`);

    // Add to index
    categoryData.templates.push({
      id: generatedTemplate.id,
      name: template.name,
      slug: template.slug,
      description: template.description,
      thumbnail: `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop`,
      colors: template.colors,
      features: template.features
    });

    totalTemplates++;
  });

  indexData.categories.push(categoryData);
}

// Write index.json
const indexPath = path.join(outputDir, 'index.json');
fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));

console.log(`\n✅ Successfully generated ${totalTemplates} templates across ${Object.keys(templateDefinitions).length} categories!`);
console.log(`📁 Templates saved to: ${outputDir}`);
console.log(`📄 Index file: ${indexPath}\n`);
