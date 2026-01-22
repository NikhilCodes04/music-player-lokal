// API Response Types from saavn.sumit.co

export interface SongQuality {
  quality: string;
  url: string;
}

export interface ImageQuality {
  quality: string;
  url: string;
}

export interface ArtistBasic {
  id: string;
  name: string;
  role: string;
  type: string;
  image: ImageQuality[];
  url: string;
}

export interface ApiSong {
  id: string;
  name: string;
  type: 'song';
  year: string | null;
  releaseDate: string | null;
  duration: number | null;
  label: string | null;
  explicitContent: boolean;
  playCount: number | null;
  language: string;
  hasLyrics: boolean;
  lyricsId: string | null;
  url: string;
  copyright: string | null;
  album: {
    id: string | null;
    name: string | null;
    url: string | null;
  };
  artists: {
    primary: ArtistBasic[];
    featured: ArtistBasic[];
    all: ArtistBasic[];
  };
  image: ImageQuality[];
  downloadUrl: SongQuality[];
}

export interface ApiAlbum {
  id: string;
  name: string;
  description: string;
  year: number | null;
  type: 'album';
  playCount: number | null;
  language: string;
  explicitContent: boolean;
  artists: {
    primary: ArtistBasic[];
    featured: ArtistBasic[];
    all: ArtistBasic[];
  };
  songCount: number | null;
  url: string;
  image: ImageQuality[];
  songs?: ApiSong[] | null;
}

export interface ApiArtist {
  id: string;
  name: string;
  role: string;
  type: 'artist';
  image: ImageQuality[];
  url: string;
}

export interface ApiPlaylist {
  id: string;
  name: string;
  type: 'playlist';
  url: string;
  image: ImageQuality[];
  songCount: number | null;
  language: string;
  explicitContent: boolean;
}

// Search Response Types
export interface SearchSongsResponse {
  total: number;
  start: number;
  results: ApiSong[];
}

export interface SearchAlbumsResponse {
  total: number;
  start: number;
  results: ApiAlbum[];
}

export interface SearchArtistsResponse {
  total: number;
  start: number;
  results: ApiArtist[];
}

export interface SearchPlaylistsResponse {
  total: number;
  start: number;
  results: ApiPlaylist[];
}
