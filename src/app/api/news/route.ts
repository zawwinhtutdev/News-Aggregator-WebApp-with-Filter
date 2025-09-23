import { NextRequest, NextResponse } from 'next/server';
import { newsApiService } from '@/lib/newsApi';
import { NewsCategory, NewsAPIResponse } from '@/lib/types';
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
      cached: (response as NewsAPIResponse & { cached?: boolean }).cached || false,
    });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
