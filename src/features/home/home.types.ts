import type { Song, Album, Artist } from '../../services/saavn.mappers';

// Home tab types
export type HomeTab = 'suggested' | 'songs' | 'artists' | 'albums';

// Hook return types
export interface UseSuggestedFeedResult {
  songs: Song[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseHomeSongsResult {
  songs: Song[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  error: Error | null;
}

export interface UseHomeAlbumsResult {
  albums: Album[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  error: Error | null;
}

export interface UseHomeArtistsResult {
  artists: Artist[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  error: Error | null;
}
