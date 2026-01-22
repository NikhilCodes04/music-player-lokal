import { http } from './http';
import type {
  ApiSong,
  ApiAlbum,
  ApiArtist,
  SearchSongsResponse,
  SearchAlbumsResponse,
  SearchArtistsResponse,
  SearchPlaylistsResponse,
} from './saavn.types';

// Search endpoints - page starts from 0
export async function searchSongs(query: string, page = 0, limit = 20): Promise<SearchSongsResponse> {
  return http.get<SearchSongsResponse>('/search/songs', {
    params: { query, page, limit },
  });
}

export async function searchAlbums(query: string, page = 0, limit = 20): Promise<SearchAlbumsResponse> {
  return http.get<SearchAlbumsResponse>('/search/albums', {
    params: { query, page, limit },
  });
}

export async function searchArtists(query: string, page = 0, limit = 20): Promise<SearchArtistsResponse> {
  return http.get<SearchArtistsResponse>('/search/artists', {
    params: { query, page, limit },
  });
}

export async function searchPlaylists(query: string, page = 0, limit = 20): Promise<SearchPlaylistsResponse> {
  return http.get<SearchPlaylistsResponse>('/search/playlists', {
    params: { query, page, limit },
  });
}

// Detail endpoints
export async function getSongById(id: string): Promise<ApiSong[]> {
  return http.get<ApiSong[]>('/songs/' + id);
}

export async function getAlbumById(id: string): Promise<ApiAlbum> {
  return http.get<ApiAlbum>('/albums', {
    params: { id },
  });
}

export async function getArtistById(id: string): Promise<ApiArtist> {
  return http.get<ApiArtist>('/artists/' + id);
}

// Export all API functions
export const saavnApi = {
  search: {
    songs: searchSongs,
    albums: searchAlbums,
    artists: searchArtists,
    playlists: searchPlaylists,
  },
  get: {
    song: getSongById,
    album: getAlbumById,
    artist: getArtistById,
  },
};
