import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { saavnApi } from '../../services/saavn.api';
import { mapSongs, mapAlbums, mapArtists } from '../../services/saavn.mappers';
import type {
  UseSuggestedFeedResult,
  UseHomeSongsResult,
  UseHomeAlbumsResult,
  UseHomeArtistsResult,
} from './home.types';

// Predefined queries for "Suggested" feed (as per CONTEXT.md)
const SUGGESTED_QUERIES = ['arijit', 'pritam', 'bollywood'];

/**
 * Fetch songs for multiple queries and merge/dedupe by ID
 * This is the locked approach from CONTEXT.md
 */
export function useSuggestedFeed(): UseSuggestedFeedResult {
  const query = useQuery({
    queryKey: ['home', 'suggested'],
    queryFn: async () => {
      console.log('[useSuggestedFeed] Starting fetch...');
      
      // Fetch songs for each predefined query in parallel
      const results = await Promise.all(
        SUGGESTED_QUERIES.map(async (q) => {
          console.log(`[useSuggestedFeed] Fetching: ${q}`);
          const result = await saavnApi.search.songs(q, 0, 15);
          console.log(`[useSuggestedFeed] Got ${result.results?.length || 0} results for: ${q}`);
          return result;
        })
      );

      // Merge all songs
      const allSongs = results.flatMap(r => r.results || []);
      console.log(`[useSuggestedFeed] Total songs merged: ${allSongs.length}`);

      // Deduplicate by song ID
      const seen = new Set<string>();
      const uniqueSongs = allSongs.filter(song => {
        if (seen.has(song.id)) return false;
        seen.add(song.id);
        return true;
      });

      console.log(`[useSuggestedFeed] Unique songs: ${uniqueSongs.length}`);
      const mapped = mapSongs(uniqueSongs);
      console.log(`[useSuggestedFeed] Mapped songs:`, mapped.slice(0, 2));
      return mapped;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log('[useSuggestedFeed] State:', { 
    isLoading: query.isLoading, 
    isError: query.isError,
    error: query.error?.message,
    dataLength: query.data?.length 
  });

  return {
    songs: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Infinite query for Songs tab - uses "latest hindi" as base query
 * Page starts from 0
 */
export function useHomeSongs(): UseHomeSongsResult {
  const query = useInfiniteQuery({
    queryKey: ['home', 'songs'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await saavnApi.search.songs('latest hindi', pageParam, 20);
      return {
        songs: mapSongs(response.results),
        nextPage: response.results.length === 20 ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000,
  });

  const songs = query.data?.pages.flatMap(page => page.songs) || [];

  return {
    songs,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: !!query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
  };
}

/**
 * Infinite query for Albums tab
 * Page starts from 0
 */
export function useHomeAlbums(): UseHomeAlbumsResult {
  const query = useInfiniteQuery({
    queryKey: ['home', 'albums'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await saavnApi.search.albums('new releases', pageParam, 20);
      return {
        albums: mapAlbums(response.results),
        nextPage: response.results.length === 20 ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000,
  });

  const albums = query.data?.pages.flatMap(page => page.albums) || [];

  return {
    albums,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: !!query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
  };
}

/**
 * Infinite query for Artists tab
 * Page starts from 0
 */
export function useHomeArtists(): UseHomeArtistsResult {
  const query = useInfiniteQuery({
    queryKey: ['home', 'artists'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await saavnApi.search.artists('indian', pageParam, 20);
      return {
        artists: mapArtists(response.results),
        nextPage: response.results.length === 20 ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000,
  });

  const artists = query.data?.pages.flatMap(page => page.artists) || [];

  return {
    artists,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: !!query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
  };
}
