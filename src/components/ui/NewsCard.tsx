'use client';

import Image from 'next/image';
import { Article } from '@/lib/types';
import { formatDate, truncateText, getImagePlaceholder } from '@/lib/utils';

interface NewsCardProps {
  article: Article;
  className?: string;
  priority?: boolean;
}

export default function NewsCard({ 
  article, 
  className = '',
  priority = false 
}: NewsCardProps) {
  const handleClick = () => {
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <article
      className={`
        bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200
        cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        overflow-hidden ${className}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Read article: ${article.title}`}
    >
      {/* Image */}
      <div className="relative w-full h-48 bg-gray-200">
        <Image
          src={article.urlToImage || getImagePlaceholder(400, 200)}
          alt={article.title}
          fill
          className="object-cover"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getImagePlaceholder(400, 200);
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {article.title}
        </h2>

        {/* Description */}
        {article.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {truncateText(article.description, 150)}
          </p>
        )}

        {/* Meta information */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{article.source.name}</span>
            <span>•</span>
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
          </div>
          
          {/* External link icon */}
          <svg 
            className="w-4 h-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </div>
      </div>
    </article>
  );
}
