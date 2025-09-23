'use client';

import { useNews } from '@/hooks/useNews';
import SearchBar from '@/components/ui/SearchBar';
import FilterBar from '@/components/ui/FilterBar';
import NewsCard from '@/components/ui/NewsCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  const {
    articles,
    filterState,
    setCategory,
    setSearchQuery,
    clearSearch,
    refetch,
  } = useNews();

  const { isLoading, error, searchQuery, category } = filterState;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col space-y-4">
            {/* Title */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                News Aggregator
              </h1>
              <p className="mt-2 text-gray-600">
                Stay updated with the latest news from around the world
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto w-full">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={clearSearch}
                placeholder="Search for news articles..."
                className="w-full"
              />
            </div>

            {/* Filter Bar */}
            <FilterBar
              activeCategory={category}
              onCategoryChange={setCategory}
              className="flex justify-center"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" text="Loading news articles..." />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-900 mb-2">
                Error Loading News
              </h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={refetch}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!articles || articles.length === 0) && (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Articles Found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? `No articles found for "${searchQuery}". Try a different search term.`
                  : 'No articles available at the moment. Please try again later.'}
              </p>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {!isLoading && !error && articles && articles.length > 0 && (
          <div className="space-y-6">
            {/* Results Info */}
            <div className="text-center text-gray-600">
              <p>
                {searchQuery
                  ? `Found ${articles.length} articles for "${searchQuery}"`
                  : `Showing ${articles.length} latest ${
                      category === 'all' ? '' : category
                    } articles`}
              </p>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(articles || []).map((article, index) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  priority={index < 3} // Prioritize loading for first 3 images
                  className="animate-fade-in"
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>
              Powered by{' '}
              <a
                href="https://newsapi.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                NewsAPI
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
