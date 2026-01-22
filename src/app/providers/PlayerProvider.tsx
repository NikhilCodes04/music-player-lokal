import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import TrackPlayer, { Capability, AppKilledPlaybackBehavior } from 'react-native-track-player';

interface PlayerProviderProps {
    children: React.ReactNode;
}

// Track if player is already initialized (persists across hot reloads)
let isPlayerInitialized = false;

export function PlayerProvider({ children }: PlayerProviderProps) {
    const [isReady, setIsReady] = useState(isPlayerInitialized);

    useEffect(() => {
        const setupPlayer = async () => {
            // Skip setup if already initialized
            if (isPlayerInitialized) {
                setIsReady(true);
                return;
            }

            try {
                await TrackPlayer.setupPlayer();
                await TrackPlayer.updateOptions({
                    android: {
                        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
                    },
                    capabilities: [
                        Capability.Play,
                        Capability.Pause,
                        Capability.SkipToNext,
                        Capability.SkipToPrevious,
                        Capability.SeekTo,
                    ],
                    compactCapabilities: [
                        Capability.Play,
                        Capability.Pause,
                        Capability.SkipToNext,
                    ],
                    progressUpdateEventInterval: 2,
                });
                isPlayerInitialized = true;
                setIsReady(true);
            } catch (e: any) {
                // Handle "already initialized" error gracefully
                if (e?.message?.includes('already been initialized')) {
                    isPlayerInitialized = true;
                    setIsReady(true);
                } else {
                    console.error('TrackPlayer setup failed', e);
                    // Still let app load to avoid blocking UI
                    setIsReady(true);
                }
            }
        };

        setupPlayer();
    }, []);

    if (!isReady) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#1DB954" />
            </View>
        );
    }

    return <>{children}</>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
});
