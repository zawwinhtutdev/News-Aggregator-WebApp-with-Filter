# Technical Specifications: News Aggregator WebApp with Filter

## System Architecture

### Technology Stack
- **Frontend Framework**: Next.js 14.2+ with App Router
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS 3.4+
- **Runtime**: Node.js 18+
- **Package Manager**: npm or yarn
- **Deployment**: Vercel (recommended) or similar platform

### Project Structure
```
news-aggregator/
├── app/
│   ├── api/
│   │   └── news/
│   │       └── route.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── NewsCard.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   ├── newsApi.ts
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── useNews.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   ├── favicon.ico
│   └── images/
├── .env.local
├── .env.example
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## API Specifications

### NewsAPI Integration

#### Base Configuration
```typescript
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
```

#### Endpoints Used
1. **Top Headlines**: `/top-headlines`
2. **Everything**: `/everything` (for search)

#### Request Parameters
```typescript
interface NewsAPIParams {
  apiKey: string;
  country?: string;
  category?: string;
  q?: string;
  pageSize?: number;
  page?: number;
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
}
```

#### Response Format
```typescript
interface NewsAPIResponse {
  status: 'ok' | 'error';
  totalResults: number;
  articles: Article[];
  code?: string;
  message?: string;
}
```

### Internal API Routes

#### GET /api/news
**Purpose**: Fetch news articles with filtering and search

**Query Parameters**:
```typescript
interface NewsQuery {
  category?: string;
  search?: string;
  page?: string;
  limit?: string;
}
```

**Response Format**:
```typescript
interface NewsResponse {
  success: boolean;
  data?: {
    articles: Article[];
    totalResults: number;
    page: number;
    hasMore: boolean;
  };
  error?: string;
  cached?: boolean;
}
```

## Data Models

### Core Types

#### Article Interface
```typescript
interface Article {
  id: string; // Generated from URL hash
  title: string;
  description: string | null;
  content: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  category?: NewsCategory;
}
```

#### News Categories
```typescript
type NewsCategory = 
  | 'general'
  | 'business'
  | 'entertainment'
  | 'health'
  | 'science'
  | 'sports'
  | 'technology';

interface CategoryConfig {
  id: NewsCategory;
  label: string;
  icon?: string;
  color?: string;
}
```

#### Filter State
```typescript
interface FilterState {
  category: NewsCategory | 'all';
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}
```

#### API Error Types
```typescript
interface APIError {
  code: string;
  message: string;
  status?: number;
}

type ErrorType = 
  | 'NETWORK_ERROR'
  | 'API_RATE_LIMIT'
  | 'API_KEY_INVALID'
  | 'NO_RESULTS'
  | 'UNKNOWN_ERROR';
```

## Component Specifications

### NewsCard Component
```typescript
interface NewsCardProps {
  article: Article;
  className?: string;
  priority?: boolean; // For image loading priority
}

// Features:
// - Responsive image with Next.js Image
// - Truncated description with "Read more"
// - Source attribution
// - Published date formatting
// - External link handling
```

### FilterBar Component
```typescript
interface FilterBarProps {
  activeCategory: NewsCategory | 'all';
  onCategoryChange: (category: NewsCategory | 'all') => void;
  className?: string;
}

// Features:
// - Horizontal scrollable on mobile
// - Active state styling
// - Keyboard navigation
// - Touch-friendly buttons
```

### SearchBar Component
```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

// Features:
// - Debounced input (300ms default)
// - Clear button when has value
// - Loading indicator
// - Keyboard shortcuts (Escape to clear)
```

### LoadingSpinner Component
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

// Features:
// - Multiple sizes
// - Accessible with proper ARIA labels
// - Smooth animation
// - Optional loading text
```

## Styling Specifications

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
```

### Design System

#### Typography Scale
```css
/* Headings */
.text-headline: text-3xl font-bold tracking-tight
.text-title: text-xl font-semibold
.text-subtitle: text-lg font-medium
.text-body: text-base font-normal
.text-caption: text-sm text-gray-600

/* Responsive Typography */
.text-responsive-headline: text-2xl md:text-3xl lg:text-4xl
```

#### Spacing System
```css
/* Container Spacing */
.container-padding: px-4 sm:px-6 lg:px-8
.section-spacing: py-8 md:py-12 lg:py-16
.component-spacing: space-y-4 md:space-y-6

/* Grid Spacing */
.news-grid: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
```

#### Color Usage
```css
/* Backgrounds */
.bg-primary: bg-white dark:bg-gray-900
.bg-secondary: bg-gray-50 dark:bg-gray-800
.bg-accent: bg-blue-50 dark:bg-blue-900/20

/* Text Colors */
.text-primary: text-gray-900 dark:text-white
.text-secondary: text-gray-600 dark:text-gray-300
.text-muted: text-gray-500 dark:text-gray-400

/* Interactive Elements */
.interactive-primary: bg-blue-600 hover:bg-blue-700 text-white
.interactive-secondary: bg-gray-200 hover:bg-gray-300 text-gray-900
```

## Performance Specifications

### Loading Performance Targets
- **First Contentful Paint (FCP)**: < 1.5 seconds
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **Time to Interactive (TTI)**: < 3.0 seconds
- **Cumulative Layout Shift (CLS)**: < 0.1

### Bundle Size Targets
- **Initial JavaScript Bundle**: < 200KB gzipped
- **Total Page Weight**: < 1MB
- **Image Optimization**: WebP format, responsive sizes
- **Font Loading**: Preload critical fonts

### Caching Strategy
```typescript
// API Response Caching
const CACHE_CONFIG = {
  headlines: 30 * 60 * 1000, // 30 minutes
  search: 15 * 60 * 1000,    // 15 minutes
  images: 24 * 60 * 60 * 1000, // 24 hours
};

// Browser Caching Headers
const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
  'ETag': 'generated-etag',
};
```

## Accessibility Specifications

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators

### Semantic HTML Structure
```html
<main role="main">
  <header>
    <h1>News Aggregator</h1>
    <nav aria-label="Category filters">
      <!-- Filter buttons -->
    </nav>
    <search role="search">
      <!-- Search input -->
    </search>
  </header>
  
  <section aria-label="News articles">
    <article>
      <!-- News card content -->
    </article>
  </section>
</main>
```

### ARIA Labels and Roles
```typescript
// Component ARIA specifications
const ARIA_LABELS = {
  searchInput: 'Search news articles',
  filterButton: (category: string) => `Filter by ${category}`,
  newsCard: (title: string) => `Read article: ${title}`,
  loadingSpinner: 'Loading news articles',
  errorMessage: 'Error loading news',
};
```

## Security Specifications

### Environment Variables
```bash
# .env.local
NEWS_API_KEY=your_newsapi_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# .env.example
NEWS_API_KEY=your_newsapi_key_here
NEXT_PUBLIC_APP_URL=your_app_url_here
```

### API Security
- **API Key Protection**: Never expose API keys on client-side
- **Rate Limiting**: Implement request throttling
- **Input Validation**: Sanitize all user inputs
- **CORS Configuration**: Proper CORS headers for API routes

### Content Security Policy
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self' https://newsapi.org;
    `.replace(/\s{2,}/g, ' ').trim()
  }
];
```

## Testing Specifications

### Unit Testing
```typescript
// Test coverage targets
const COVERAGE_TARGETS = {
  statements: 80,
  branches: 75,
  functions: 80,
  lines: 80,
};

// Key test scenarios
const TEST_SCENARIOS = [
  'Component rendering',
  'User interactions',
  'API error handling',
  'Loading states',
  'Search functionality',
  'Filter operations',
];
```

### Integration Testing
- API route testing with mock data
- Component integration testing
- Error boundary testing
- Performance testing

### Browser Support Matrix
| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | 90+ | Full |
| Firefox | 88+ | Full |
| Safari | 14+ | Full |
| Edge | 90+ | Full |
| Mobile Safari | 14+ | Full |
| Chrome Mobile | 90+ | Full |

## Deployment Specifications

### Build Configuration
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['newsapi.org', 'cdn.newsapi.org'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};
```

### Environment Setup
- **Development**: Local development with hot reload
- **Staging**: Preview deployments for testing
- **Production**: Optimized build with performance monitoring

### Performance Monitoring
- Core Web Vitals tracking
- Error monitoring and reporting
- API response time monitoring
- User experience metrics

This specification provides the technical foundation for building a robust, performant, and accessible news aggregator web application.
