import { Article } from './types';

let idCounter = 0;

export const generateArticleId = (url: string): string => {
  // Create a unique ID by combining URL hash with an incrementing counter
  const urlHash = btoa(url).replace(/[^a-zA-Z0-9]/g, '');
  const uniqueId = `${urlHash.substring(0, 12)}_${++idCounter}`;
  return uniqueId;
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

interface RawArticle {
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
}

export const processArticles = (articles: unknown[]): Article[] => {
  return articles
    .filter((article): article is RawArticle => {
      return typeof article === 'object' && 
             article !== null && 
             'title' in article && 
             'url' in article &&
             typeof (article as RawArticle).title === 'string' &&
             typeof (article as RawArticle).url === 'string';
    })
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

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const getImagePlaceholder = (width: number = 400, height: number = 200): string => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">
        No Image
      </text>
    </svg>
  `)}`;
};
