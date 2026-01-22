import type { ApiSong, ApiAlbum, ApiArtist, SongQuality, ImageQuality } from './saavn.types';

// App-level types (domain models)
export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  duration: number; // in seconds
  artwork: string;
  url: string; // playback URL (160kbps preferred)
  url96: string; // fallback URL (96kbps)
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  year: string;
  artwork: string;
  songCount?: number;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  role: string;
  albumCount?: number;
  songCount?: number;
}

// Helper to get best quality image (prefer 500x500)
function getBestImage(images: ImageQuality[]): string {
  if (!images || images.length === 0) return '';
  const preferred = images.find(img => img.quality === '500x500');
  return preferred?.url || images[images.length - 1]?.url || '';
}

// Helper to get audio URL by quality
function getAudioUrl(downloadUrls: SongQuality[], quality: '160kbps' | '96kbps'): string {
  if (!downloadUrls || downloadUrls.length === 0) return '';
  const match = downloadUrls.find(u => u.quality === quality);
  return match?.url || '';
}

// Mappers
export function mapSong(apiSong: ApiSong): Song {
  const primaryArtist = apiSong.artists?.primary?.[0];
  return {
    id: apiSong.id,
    title: apiSong.name,
    artist: primaryArtist?.name || 'Unknown Artist',
    artistId: primaryArtist?.id || '',
    album: apiSong.album?.name || 'Unknown Album',
    albumId: apiSong.album?.id || '',
    duration: apiSong.duration || 0,
    artwork: getBestImage(apiSong.image),
    url: getAudioUrl(apiSong.downloadUrl, '160kbps'),
    url96: getAudioUrl(apiSong.downloadUrl, '96kbps'),
  };
}

export function mapAlbum(apiAlbum: ApiAlbum): Album {
  const artistName = apiAlbum.artists?.primary?.[0]?.name || '';
  return {
    id: apiAlbum.id,
    name: apiAlbum.name,
    artist: artistName,
    year: apiAlbum.year?.toString() || '',
    artwork: getBestImage(apiAlbum.image),
    songCount: apiAlbum.songCount || undefined,
  };
}

export function mapArtist(apiArtist: ApiArtist): Artist {
  return {
    id: apiArtist.id,
    name: apiArtist.name,
    image: getBestImage(apiArtist.image),
    role: apiArtist.role || 'artist',
    // Mocking stats for UI demo as API doesn't always provide them in search
    albumCount: Math.floor(Math.random() * 5) + 1,
    songCount: Math.floor(Math.random() * 20) + 10,
  };
}

// Batch mappers
export function mapSongs(apiSongs: ApiSong[]): Song[] {
  return apiSongs.map(mapSong);
}

export function mapAlbums(apiAlbums: ApiAlbum[]): Album[] {
  return apiAlbums.map(mapAlbum);
}

export function mapArtists(apiArtists: ApiArtist[]): Artist[] {
  return apiArtists.map(mapArtist);
}
