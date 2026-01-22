import { useInfiniteQuery } from '@tanstack/react-query';
import { saavnApi } from '../../services/saavn.api';
import { mapSongs, mapAlbums, mapArtists } from '../../services/saavn.mappers';
import type { SearchFilter, UseSearchResult, SearchResultType } from './search.types';

export function useSearch(query: string, type: SearchFilter): UseSearchResult {
    const enabled = query.length >= 2;

    const infinityQuery = useInfiniteQuery({
        queryKey: ['search', type, query],
        queryFn: async ({ pageParam = 0 }) => {
            if (!enabled) return { results: [], nextPage: undefined };

            console.log(`[useSearch] Searching for "${query}" type "${type}" page ${pageParam}`);
            
            // Explicitly type results to match the union type
            let results: SearchResultType[] = [];
            let response;

            switch (type) {
                case 'songs':
                    response = await saavnApi.search.songs(query, pageParam, 20);
                    results = mapSongs(response.results);
                    break;
                case 'albums':
                    response = await saavnApi.search.albums(query, pageParam, 20);
                    results = mapAlbums(response.results);
                    break;
                case 'artists':
                    response = await saavnApi.search.artists(query, pageParam, 20);
                    results = mapArtists(response.results);
                    break;
                // Playlists/Folders not fully implemented in API wrapper yet, defaulting to empty
                default:
                    return { results: [], nextPage: undefined };
            }

            return {
                results,
                nextPage: response.results.length === 20 ? pageParam + 1 : undefined,
            };
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        enabled: enabled,
        staleTime: 5 * 60 * 1000,
    });

    // Clear results if query is too short (disabled)
    const results = enabled ? (infinityQuery.data?.pages.flatMap(page => page.results) || []) : [];

    return {
        results,
        isLoading: infinityQuery.isLoading && enabled,
        isError: infinityQuery.isError,
        error: infinityQuery.error,
        fetchNextPage: infinityQuery.fetchNextPage,
        hasNextPage: !!infinityQuery.hasNextPage,
        isFetchingNextPage: infinityQuery.isFetchingNextPage,
    };
}
