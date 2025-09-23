import { NewsAPIResponse, NewsCategory } from './types';
import { API_CONFIG } from './constants';
import { processArticles } from './utils';

class NewsAPIService {
  private baseUrl = API_CONFIG.BASE_URL;
  private apiKey = process.env.NEWS_API_KEY;
  private cache = new Map<string, { data: NewsAPIResponse; timestamp: number }>();

  private getCacheKey(endpoint: string, params: Record<string, string>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${endpoint}?${sortedParams}`;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < API_CONFIG.CACHE_DURATION;
  }

  private async fetchWithCache(url: string, cacheKey: string): Promise<NewsAPIResponse & { cached?: boolean }> {
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
      pageSize: Math.min(pageSize, API_CONFIG.MAX_PAGE_SIZE).toString(),
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
      pageSize: Math.min(pageSize, API_CONFIG.MAX_PAGE_SIZE).toString(),
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
