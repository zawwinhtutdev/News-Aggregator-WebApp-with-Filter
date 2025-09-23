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

      setArticles(data.data.articles || []);
      setFilterState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Error fetching news:', error);
      setArticles([]); // Ensure articles is always an array
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
