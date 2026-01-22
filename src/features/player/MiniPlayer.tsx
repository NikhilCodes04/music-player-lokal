import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePlayerStore } from './player.store';
import { PlayIcon, PauseIcon } from '../../shared/components';
import { colors, spacing, borderRadius, typography } from '../../shared/theme';

export function MiniPlayer() {
    const navigation = useNavigation<any>();
    const { currentTrack, isPlaying, togglePlayPause } = usePlayerStore();

    if (!currentTrack) return null;

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('PlayerModal')}
        >
            <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />

            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
                <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
                    {isPlaying ? (
                        <PauseIcon size={32} color={colors.primary} filled={false} />
                    ) : (
                        <PlayIcon size={32} color={colors.primary} filled={false} />
                    )}
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        height: 60,
    },
    artwork: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.background,
    },
    info: {
        flex: 1,
        marginLeft: spacing.sm,
        justifyContent: 'center',
    },
    title: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        color: colors.textPrimary,
    },
    artist: {
        fontSize: typography.sizes.xs,
        color: colors.textSecondary,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playButton: {
        padding: spacing.xs,
    },
});
