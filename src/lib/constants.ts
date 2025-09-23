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

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  API_RATE_LIMIT: 'Too many requests. Please try again later.',
  API_KEY_INVALID: 'Invalid API key. Please check your configuration.',
  NO_RESULTS: 'No articles found for your search.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
};
