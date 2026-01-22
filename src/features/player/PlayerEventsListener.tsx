import React from 'react';
import TrackPlayer, { Event, useTrackPlayerEvents, State, Track } from 'react-native-track-player';
import { usePlayerStore } from './player.store';

const events = [
    Event.PlaybackState,
    Event.PlaybackTrackChanged,
    Event.PlaybackQueueEnded
];

export function PlayerEventsListener() {
    const { setIsPlaying, setCurrentTrack } = usePlayerStore();

    useTrackPlayerEvents(events, async (event) => {
        if (event.type === Event.PlaybackState) {
            const isPlaying = event.state === State.Playing;
            setIsPlaying(isPlaying);
        }

        if (event.type === Event.PlaybackTrackChanged) {
            // Update current track when track changes (e.g. valid 'next' or queue order)
            // event.nextTrack is the index (number) or sometimes id?
            // In v4, nextTrack is index
            if (event.nextTrack !== undefined) {
                const trackObject = await TrackPlayer.getTrack(event.nextTrack);
                if (trackObject) {
                    // Cast to our Track type if needed, usually matches
                    setCurrentTrack(trackObject as any);
                }
            } else {
                // If undefined, maybe stopped?
            }
        }

        if (event.type === Event.PlaybackQueueEnded) {
            setIsPlaying(false);
        }
    });

    return null;
}
