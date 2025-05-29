import { tool } from 'ai';
import { z } from 'zod';

export const webSearch = tool({
  description: 'Search the web for current information and real-time data. Use this when users ask about recent events, current data, or information that may have changed recently.',
  parameters: z.object({
    query: z.string().describe('The search query to find relevant information'),
    maxResults: z.number().optional().default(5).describe('Maximum number of search results to return'),
  }),
  execute: async ({ query, maxResults = 5 }) => {
    try {
      // Using Brave Search API (or you can substitute with your preferred search API)
      const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${maxResults}`, {
        headers: {
          'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY!,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Search API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      const results = data.web?.results?.slice(0, maxResults).map((result: any) => ({
        title: result.title,
        url: result.url,
        description: result.description,
        publishedTime: result.age,
      })) || [];

      return {
        query,
        results,
        totalResults: data.web?.results?.length || 0,
        searchTime: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Web search error:', error);
      return {
        query,
        results: [],
        error: 'Search temporarily unavailable',
        totalResults: 0,
      };
    }
  },
});