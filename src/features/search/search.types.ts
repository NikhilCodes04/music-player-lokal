import { Song, Album, Artist } from '../../services/saavn.mappers';

export type SearchFilter = 'songs' | 'albums' | 'artists' | 'playlists';

export type SearchResultType = Song | Album | Artist;

export interface UseSearchResult {
    results: SearchResultType[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
}
