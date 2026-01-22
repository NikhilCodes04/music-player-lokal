import type { Track as RNTrack } from 'react-native-track-player';

export interface Track extends RNTrack {
    id: string;
    url: string;
    title: string;
    artist: string;
    artwork?: string;
    duration?: number;
    // Add any custom fields here if needed
    album?: string;
}

export interface PlayerState {
    currentTrack: Track | null;
    isPlaying: boolean;
    queue: Track[];
    activeId: string | null;
    isBuffering: boolean;
    duration: number;
    position: number;
}
