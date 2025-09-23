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

export interface APIError {
  code: string;
  message: string;
  status?: number;
}

export type ErrorType = 
  | 'NETWORK_ERROR'
  | 'API_RATE_LIMIT'
  | 'API_KEY_INVALID'
  | 'NO_RESULTS'
  | 'UNKNOWN_ERROR';
