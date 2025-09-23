# Implementation Guide: News Aggregator WebApp with Filter

## Implementation Strategy

### Development Approach
1. **Incremental Development**: Build and test features incrementally
2. **Component-First**: Start with reusable components, then compose pages
3. **API-First**: Establish data flow before complex UI interactions
4. **Mobile-First**: Design for mobile, enhance for larger screens
5. **Type-Safe**: Leverage TypeScript throughout the development process

## Phase 1: Project Setup and Foundation

### Step 1: Initialize Next.js Project
```bash
# Create Next.js project with TypeScript
npx create-next-app@latest news-aggregator --typescript --tailwind --eslint --app --src-dir=false

# Navigate to project directory
cd news-aggregator

# Install additional dependencies
npm install @types/node
```

### Step 2: Configure TypeScript
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./app/*"],
      "@/components/*": ["./app/components/*"],
      "@/lib/*": ["./app/lib/*"],
      "@/hooks/*": ["./app/hooks/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Step 3: Configure Tailwind CSS
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
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
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
```

### Step 4: Environment Configuration
```bash
# .env.local
NEWS_API_KEY=your_newsapi_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# .env.example
NEWS_API_KEY=your_newsapi_key_here
NEXT_PUBLIC_APP_URL=your_app_url_here
```

## Phase 2: Type Definitions and Core Infrastructure

### Step 1: Create Type Definitions
```typescript
// app/lib/types.ts
export interface Article {
  id: string;
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

export type NewsCategory = 
  | 'general'
  | 'business'
  | 'entertainment'
  | 'health'
  | 'science'
  | 'sports'
  | 'technology';

export interface CategoryConfig {
  id: NewsCategory | 'all';
  label: string;
  icon?: string;
}

export interface NewsAPIResponse {
  status: 'ok' | 'error';
  totalResults: number;
  articles: Article[];
  code?: string;
  message?: string;
}

export interface NewsResponse {
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

export interface FilterState {
  category: NewsCategory | 'all';
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}
```

### Step 2: Create Constants
```typescript
// app/lib/constants.ts
import { CategoryConfig } from './types';

export const NEWS_CATEGORIES: CategoryConfig[] = [
  { id: 'all', label: 'All' },
  { id: 'general', label: 'General' },
  { id: 'business', label: 'Business' },
  { id: 'technology', label: 'Technology' },
  { id: 'sports', label: 'Sports' },
  { id: 'health', label: 'Health' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'science', label: 'Science' },
];

export const API_CONFIG = {
  BASE_URL: 'https://newsapi.org/v2',
  CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  MOBILE_BREAKPOINT: 768,
};
```

### Step 3: Create Utility Functions
```typescript
// app/lib/utils.ts
import { Article } from './types';

export const generateArticleId = (url: string): string => {
  return btoa(url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const sanitizeSearchQuery = (query: string): string => {
  return query.trim().replace(/[^\w\s-]/g, '').substring(0, 100);
};

export const processArticles = (articles: any[]): Article[] => {
  return articles
    .filter(article => article.title && article.url)
    .map(article => ({
      id: generateArticleId(article.url),
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
      source: {
        id: article.source?.id || null,
        name: article.source?.name || 'Unknown Source',
      },
    }));
};
```

## Phase 3: API Integration

### Step 1: Create NewsAPI Service
```typescript
// app/lib/newsApi.ts
import { NewsAPIResponse, NewsCategory, Article } from './types';
import { API_CONFIG } from './constants';
import { processArticles } from './utils';

class NewsAPIService {
  private baseUrl = API_CONFIG.BASE_URL;
  private apiKey = process.env.NEWS_API_KEY;
  private cache = new Map<string, { data: any; timestamp: number }>();

  private getCacheKey(endpoint: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${endpoint}?${sortedParams}`;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < API_CONFIG.CACHE_DURATION;
  }

  private async fetchWithCache(url: string, cacheKey: string): Promise<any> {
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && this.isValidCache(cached.timestamp)) {
      return { ...cached.data, cached: true };
    }

    // Fetch from API
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache the response
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return data;
  }

  async getTopHeadlines(
    category?: NewsCategory,
    pageSize: number = API_CONFIG.DEFAULT_PAGE_SIZE
  ): Promise<NewsAPIResponse> {
    const params = {
      apiKey: this.apiKey!,
      country: 'us',
      pageSize: Math.min(pageSize, API_CONFIG.MAX_PAGE_SIZE),
      ...(category && category !== 'general' && { category }),
    };

    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}/top-headlines?${queryString}`;
    const cacheKey = this.getCacheKey('top-headlines', params);

    try {
      const data = await this.fetchWithCache(url, cacheKey);
      return {
        ...data,
        articles: processArticles(data.articles),
      };
    } catch (error) {
      console.error('Error fetching top headlines:', error);
      throw error;
    }
  }

  async searchNews(
    query: string,
    pageSize: number = API_CONFIG.DEFAULT_PAGE_SIZE
  ): Promise<NewsAPIResponse> {
    const params = {
      apiKey: this.apiKey!,
      q: query,
      pageSize: Math.min(pageSize, API_CONFIG.MAX_PAGE_SIZE),
      sortBy: 'publishedAt' as const,
      language: 'en',
    };

    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}/everything?${queryString}`;
    const cacheKey = this.getCacheKey('everything', params);

    try {
      const data = await this.fetchWithCache(url, cacheKey);
      return {
        ...data,
        articles: processArticles(data.articles),
      };
    } catch (error) {
      console.error('Error searching news:', error);
      throw error;
    }
  }
}

export const newsApiService = new NewsAPIService();
```

### Step 2: Create API Route
```typescript
// app/api/news/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { newsApiService } from '@/lib/newsApi';
import { NewsCategory } from '@/lib/types';
import { sanitizeSearchQuery } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as NewsCategory | null;
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');

    let response;

    if (search) {
      const sanitizedQuery = sanitizeSearchQuery(search);
      if (!sanitizedQuery) {
        return NextResponse.json(
          { success: false, error: 'Invalid search query' },
          { status: 400 }
        );
      }
      response = await newsApiService.searchNews(sanitizedQuery, limit);
    } else {
      response = await newsApiService.getTopHeadlines(
        category || undefined,
        limit
      );
    }

    if (response.status === 'error') {
      return NextResponse.json(
        { success: false, error: response.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        articles: response.articles,
        totalResults: response.totalResults,
        page: 1,
        hasMore: response.articles.length === limit,
      },
      cached: (response as any).cached || false,
    });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
```

## Phase 4: Custom Hooks

### Step 1: Create useDebounce Hook
```typescript
// app/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### Step 2: Create useNews Hook
```typescript
// app/hooks/useNews.ts
import { useState, useEffect, useCallback } from 'react';
import { Article, NewsCategory, FilterState } from '@/lib/types';
import { useDebounce } from './useDebounce';

interface UseNewsReturn {
  articles: Article[];
  filterState: FilterState;
  setCategory: (category: NewsCategory | 'all') => void;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  refetch: () => void;
}

export function useNews(): UseNewsReturn {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filterState, setFilterState] = useState<FilterState>({
    category: 'all',
    searchQuery: '',
    isLoading: true,
    error: null,
  });

  const debouncedSearchQuery = useDebounce(filterState.searchQuery, 300);

  const fetchNews = useCallback(async (category: NewsCategory | 'all', search?: string) => {
    setFilterState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      params.append('limit', '20');

      const response = await fetch(`/api/news?${params.toString()}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch news');
      }

      setArticles(data.data.articles);
      setFilterState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Error fetching news:', error);
      setFilterState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, []);

  const setCategory = useCallback((category: NewsCategory | 'all') => {
    setFilterState(prev => ({ ...prev, category }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilterState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const clearSearch = useCallback(() => {
    setFilterState(prev => ({ ...prev, searchQuery: '' }));
  }, []);

  const refetch = useCallback(() => {
    fetchNews(filterState.category, debouncedSearchQuery || undefined);
  }, [fetchNews, filterState.category, debouncedSearchQuery]);

  // Fetch news when category or search query changes
  useEffect(() => {
    fetchNews(filterState.category, debouncedSearchQuery || undefined);
  }, [fetchNews, filterState.category, debouncedSearchQuery]);

  return {
    articles,
    filterState,
    setCategory,
    setSearchQuery,
    clearSearch,
    refetch,
  };
}
```

## Phase 5: UI Components

### Step 1: Create LoadingSpinner Component
```typescript
// app/components/ui/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  className = '',
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600" aria-live="polite">
          {text}
        </p>
      )}
    </div>
  );
}
```

### Step 2: Create SearchBar Component
```typescript
// app/components/ui/SearchBar.tsx
import { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search news...',
  className = '',
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClear();
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full px-4 py-2 pl-10 pr-10 text-gray-900 bg-white border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors
            ${isFocused ? 'ring-2 ring-blue-500 border-blue-500' : ''}
          `}
          aria-label="Search news articles"
        />
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Clear Button */}
        {value && (
          <button
            onClick={onClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
```

### Step 3: Create FilterBar Component
```typescript
// app/components/ui/FilterBar.tsx
import { NewsCategory } from '@/lib/types';
import { NEWS_CATEGORIES } from '@/lib/constants';

interface FilterBarProps {
  activeCategory: NewsCategory | 'all';
  onCategoryChange: (category: NewsCategory | 'all') => void;
  className?: string;
}

export default function FilterBar({
  activeCategory,
  onCategoryChange,
  className = '',
}: FilterBarProps) {
  return (
    <div className={`${className}`}>
      <div className="flex overflow-x-auto scrollbar-hide space-x-2 pb-2">
        {NEWS_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            aria-label={`Filter by ${category.label}`}
            aria-pressed={activeCategory === category.id}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

This implementation guide provides the foundation for building the News Aggregator WebApp. Continue with the remaining components (NewsCard, main page layout) and styling in the next phase.
