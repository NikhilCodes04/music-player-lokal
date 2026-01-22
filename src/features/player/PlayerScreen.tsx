import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
// import Slider from '@react-native-community/slider'; // Removed to prevent native crash
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { usePlayerStore } from './player.store';
import {
    PlayIcon,
    PauseIcon,
    SkipNextIcon,
    SkipPreviousIcon,
    Rewind10Icon,
    Forward10Icon,
    SpeedIcon,
    TimerIcon,
    CastIcon,
    ArrowLeftIcon,
    MoreVerticalIcon,
    HeartIcon,
    ChevronUpIcon,
    PlaylistIcon
} from '../../shared/components';
import { colors, spacing, borderRadius, typography } from '../../shared/theme';

const { width } = Dimensions.get('window');

// Custom JS Slider to avoid native dependencies requiring rebuild
function CustomProgressBar({ value, maximumValue, onSlidingComplete }: { value: number, maximumValue: number, onSlidingComplete: (val: number) => void }) {
    const [barWidth, setBarWidth] = useState(0);

    const handlePress = (e: any) => {
        if (barWidth === 0) return;
        const x = e.nativeEvent.locationX;
        const ratio = x / barWidth;
        const newValue = ratio * maximumValue;
        onSlidingComplete(Math.max(0, Math.min(newValue, maximumValue)));
    };

    const progressPercent = Math.max(0, Math.min((value / Math.max(maximumValue, 1)) * 100, 100));

    return (
        <Pressable
            style={{ height: 40, justifyContent: 'center' }}
            onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
            onPress={handlePress}
        >
            <View style={{ height: 4, backgroundColor: colors.border, borderRadius: 2 }}>
                <View style={{ width: `${progressPercent}%`, height: 4, backgroundColor: colors.primary, borderRadius: 2 }} />
            </View>
            <View style={{
                position: 'absolute',
                left: `${progressPercent}%`,
                marginLeft: -8,
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: colors.primary,
                borderWidth: 2,
                borderColor: colors.background,
            }} />
        </Pressable>
    );
}

export function PlayerScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const { currentTrack, isPlaying, togglePlayPause, skipToNext, skipToPrevious, seekTo } = usePlayerStore();
    const { position, duration } = useProgress();

    if (!currentTrack) {
        // Fallback if accessed without a track
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <Text>No Track Playing</Text>
            </View>
        );
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleRewind10 = () => seekTo(position - 10);
    const handleForward10 = () => seekTo(position + 10);

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <ArrowLeftIcon size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Now Playing</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Queue')} style={styles.headerButton}>
                    <PlaylistIcon size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            {/* Artwork */}
            <View style={styles.artworkContainer}>
                <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />
            </View>

            {/* Track Info */}
            <View style={styles.trackInfo}>
                <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ArtistDetails', { artist: currentTrack?.artist })}>
                    <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
                </TouchableOpacity>
            </View>

            {/* Progress */}
            <View style={styles.progressContainer}>
                <CustomProgressBar
                    value={position}
                    maximumValue={duration}
                    onSlidingComplete={seekTo}
                />
                <View style={styles.timeRow}>
                    <Text style={styles.timeText}>{formatTime(position)}</Text>
                    <Text style={styles.timeText}>{formatTime(duration)}</Text>
                </View>
            </View>

            {/* Controls Row */}
            {/* Layout: Prev - Back 10s - Play/Pause - Fwd 10s - Next */}
            <View style={styles.controls}>
                <TouchableOpacity onPress={() => skipToPrevious()} style={styles.controlButton}>
                    <SkipPreviousIcon size={28} color={colors.textPrimary} />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleRewind10} style={styles.controlButton}>
                    <Rewind10Icon size={24} color={colors.textPrimary} />
                </TouchableOpacity>

                <TouchableOpacity onPress={togglePlayPause} style={styles.playButtonLarge}>
                    {isPlaying ? (
                        <PauseIcon size={32} color={colors.textOnPrimary} filled={false} />
                    ) : (
                        <PlayIcon size={32} color={colors.textOnPrimary} filled={false} />
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={handleForward10} style={styles.controlButton}>
                    <Forward10Icon size={24} color={colors.textPrimary} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => skipToNext()} style={styles.controlButton}>
                    <SkipNextIcon size={28} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            {/* Bottom Actions Row */}
            {/* Layout: Speed - Timer - Cast - Options */}
            <View style={styles.bottomActions}>
                <TouchableOpacity style={styles.bottomActionButton}>
                    <SpeedIcon size={24} color={colors.textPrimary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomActionButton}>
                    <TimerIcon size={24} color={colors.textPrimary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomActionButton}>
                    <CastIcon size={24} color={colors.textPrimary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomActionButton}>
                    <MoreVerticalIcon size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            {/* Lyrics Up Arrow / Text */}
            <TouchableOpacity style={styles.lyricsContainer} activeOpacity={0.7}>
                <ChevronUpIcon size={24} color={colors.textSecondary} />
                <Text style={styles.lyricsText}>Lyrics</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
        height: 48,
    },
    headerButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        fontSize: typography.sizes.lg,
        fontFamily: typography.fonts.bold,
        color: colors.textPrimary,
        // center?
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: -1,
    },
    artworkContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xxl,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    artwork: {
        width: width - 64,
        height: width - 64,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    } as any,
    trackInfo: {
        alignItems: 'center', // Center children horizontally
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: typography.sizes.xxl,
        fontFamily: typography.fonts.bold,
        color: colors.textPrimary,
        marginBottom: 4,
        textAlign: 'center', // Center text
    },
    artist: {
        fontSize: typography.sizes.md,
        color: colors.textSecondary,
        textAlign: 'center', // Center text
        fontFamily: typography.fonts.medium,
    },
    progressContainer: {
        marginBottom: spacing.xl,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.xs,
    },
    timeText: {
        fontSize: typography.sizes.xs,
        color: colors.textMuted,
        fontFamily: typography.fonts.medium, // Monospace-ish often better but Outfit Medium is fine
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xxl,
        paddingHorizontal: spacing.sm,
    },
    controlButton: {
        padding: spacing.sm,
    },
    playButtonLarge: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    bottomActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.md,
    },
    bottomActionButton: {
        padding: spacing.sm,
    },
    lyricsContainer: {
        alignItems: 'center',
        marginTop: 'auto',
        paddingVertical: spacing.sm,
    },
    lyricsText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.bold,
        color: colors.textPrimary,
        marginTop: -4, // Pull text slightly closer to arrow
    },
});
