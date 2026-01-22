import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer, { State, useTrackPlayerEvents, Event } from 'react-native-track-player';
import type { PlayerState, Track } from './player.types';

interface PlayerStore extends PlayerState {
    setQueue: (tracks: Track[]) => Promise<void>;
    addToQueue: (track: Track) => Promise<void>;
    removeFromQueue: (trackId: string) => Promise<void>;
    clearQueue: () => Promise<void>;
    
    playTrack: (track: Track) => Promise<void>;
    togglePlayPause: () => Promise<void>;
    skipToNext: () => Promise<void>;
    skipToPrevious: () => Promise<void>;
    seekTo: (position: number) => Promise<void>;
    
    // Internal state updaters
    setIsPlaying: (isPlaying: boolean) => void;
    setCurrentTrack: (track: Track | null) => void;
}

export const usePlayerStore = create<PlayerStore>()(
    persist(
        (set, get) => ({
            currentTrack: null,
            isPlaying: false,
            queue: [],
            activeId: null,
            isBuffering: false,
            duration: 0,
            position: 0,

            setQueue: async (tracks) => {
                await TrackPlayer.reset();
                await TrackPlayer.add(tracks);
                set({ queue: tracks });
            },

            addToQueue: async (track) => {
                const { queue } = get();
                // Check if already in queue to avoid duplicates if desired, or allow
                // For now, allow duplicates or check id
                const exists = queue.some(t => t.id === track.id);
                if (!exists) {
                    await TrackPlayer.add(track);
                    set({ queue: [...queue, track] });
                }
            },

            removeFromQueue: async (trackId) => {
                const { queue } = get();
                const index = queue.findIndex(t => t.id === trackId);
                if (index !== -1) {
                    // TrackPlayer.remove expects index
                    await TrackPlayer.remove(index);
                    const newQueue = queue.filter(t => t.id !== trackId);
                    set({ queue: newQueue });
                }
            },

            clearQueue: async () => {
                await TrackPlayer.reset();
                set({ queue: [], currentTrack: null, isPlaying: false });
            },

            playTrack: async (track) => {
                const { queue } = get();
                const trackIndex = queue.findIndex(t => t.id === track.id);
                
                if (trackIndex === -1) {
                    // If not in queue, reset and play just this (or add to front/end? - Requirements say "Song list... full controls". Usually clicking a song plays it. We'll reset queue for now to Playlist of 1, or logic can be "Play Next")
                    // Default behavior: Replace queue with this song (or user might want context. For now, simple.)
                    await TrackPlayer.reset();
                    await TrackPlayer.add([track]);
                    set({ queue: [track] });
                    await TrackPlayer.play();
                } else {
                     await TrackPlayer.skip(trackIndex);
                     await TrackPlayer.play();
                }
                
                set({ currentTrack: track, activeId: track.id, isPlaying: true });
            },

            togglePlayPause: async () => {
                const { isPlaying } = get();
                if (isPlaying) {
                    await TrackPlayer.pause();
                } else {
                    await TrackPlayer.play();
                }
                set({ isPlaying: !isPlaying });
            },

            skipToNext: async () => {
                await TrackPlayer.skipToNext();
            },

            skipToPrevious: async () => {
                await TrackPlayer.skipToPrevious();
            },

            seekTo: async (position) => {
                await TrackPlayer.seekTo(position);
            },

            setIsPlaying: (isPlaying) => set({ isPlaying }),
            setCurrentTrack: (track) => set({ currentTrack: track, activeId: track?.id || null }),
        }),
        {
            name: 'player-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ queue: state.queue, currentTrack: state.currentTrack }), // Only persist queue and current track
        }
    )
);
