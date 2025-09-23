'use client';

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
