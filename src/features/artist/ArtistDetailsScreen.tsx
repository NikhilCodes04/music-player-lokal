import React, { useLayoutEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TouchableHighlight, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../../shared/theme';
import {
    ArrowLeftIcon,
    SearchIcon,
    MoreVerticalIcon,
    ShuffleIcon,
    PlayIcon,
    PauseIcon
} from '../../shared/components';
import { usePlayerStore } from '../player/player.store';
import type { Track } from '../player/player.types';

// Mock Data generator for Artist Details
const getMockArtistTracks = (artistName: string): Track[] => {
    return Array.from({ length: 5 }).map((_, i) => ({
        id: `artist-${i}`,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // placeholder
        title: `Song ${i + 1}`,
        artist: artistName,
        artwork: 'https://picsum.photos/200', // placeholder
        duration: 210,
    }));
};

export function ArtistDetailsScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { artist } = route.params || { artist: 'Unknown Artist' }; // Param passed from navigation

    // In a real app, useQuery here to fetch artist details
    const tracks = getMockArtistTracks(artist);
    const { playTrack, currentTrack, isPlaying } = usePlayerStore();

    const handlePlayAll = () => {
        // Play first track, queue rest?
        if (tracks.length > 0) {
            playTrack(tracks[0]);
        }
    };

    const handleShuffle = () => {
        // Logic to shuffle and play
        if (tracks.length > 0) {
            // simplified for demo
            playTrack(tracks[Math.floor(Math.random() * tracks.length)]);
        }
    };

    const renderSongItem = ({ item }: { item: Track }) => {
        const isCurrent = currentTrack?.id === item.id;
        return (
            <TouchableOpacity style={styles.songItem} onPress={() => playTrack(item)}>
                <Image source={{ uri: item.artwork }} style={styles.songImg} />
                <View style={styles.songInfo}>
                    <Text style={[styles.songTitle, isCurrent && styles.activeText]}>{item.title}</Text>
                    <Text style={styles.songArtist}>{item.artist}</Text>
                </View>
                <TouchableOpacity style={styles.playIconContainer} onPress={() => playTrack(item)}>
                    <PlayIcon size={16} color={colors.primary} filled={false} />
                    {/* The design shows a filled orange circle with white play icon inside. 
                         Let's use a custom view or existing icon if it matches. 
                         Design check: Orange circle, white play. 
                         Our PlayIcon with filled=true does exactly that (Orange circle, white triangle). 
                      */}
                </TouchableOpacity>
                <TouchableOpacity style={styles.moreBtn}>
                    <MoreVerticalIcon size={20} color={colors.textSecondary} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <ArrowLeftIcon size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <SearchIcon size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <MoreVerticalIcon size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Artist Info */}
                <View style={styles.artistProfile}>
                    <Image
                        source={{ uri: 'https://picsum.photos/300' }}
                        style={styles.artistImage}
                    />
                    <Text style={styles.artistName}>{artist}</Text>
                    <Text style={styles.artistStats}>1 Album  |  20 Songs  |  01:25:43 mins</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={[styles.actionBtn, styles.shuffleBtn]} onPress={handleShuffle}>
                        <ShuffleIcon size={20} color={colors.textOnPrimary} />
                        <Text style={[styles.btnText, styles.textOnPrimary]}>Shuffle</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionBtn, styles.playBtn]} onPress={handlePlayAll}>
                        <PlayIcon size={20} color={colors.primary} filled={false} />
                        {/* Design shows filled orange text/icon on light background? 
                             Or maybe light orange bg, orange text/icon. 
                             Let's assume secondary style.
                          */}
                        <Text style={[styles.btnText, styles.textPrimary]}>Play</Text>
                    </TouchableOpacity>
                </View>

                {/* Songs Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Songs</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    {tracks.map((track, i) => (
                        // Using simple map for scrollview nesting, or could use FlatList if detached
                        <View key={i}>{renderSongItem({ item: track })}</View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        height: 56,
    },
    headerRight: {
        flexDirection: 'row',
    },
    iconBtn: {
        padding: spacing.sm,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    artistProfile: {
        alignItems: 'center',
        marginTop: spacing.md,
        marginBottom: spacing.xl,
    },
    artistImage: {
        width: 200,
        height: 200,
        borderRadius: 32, // Large rounded corners
        marginBottom: spacing.md,
    },
    artistName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    artistStats: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.md,
        marginBottom: spacing.xxl,
        paddingHorizontal: spacing.xl,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        borderRadius: 24,
        gap: spacing.xs,
    },
    shuffleBtn: {
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    playBtn: {
        backgroundColor: '#FFF0E0', // Light orange
    },
    btnText: {
        fontSize: 16,
        fontWeight: "600",
    },
    textOnPrimary: {
        color: colors.textOnPrimary,
    },
    textPrimary: {
        color: colors.primary,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    seeAll: {
        fontSize: 14,
        color: colors.primary,
    },
    songItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.sm,
        marginBottom: spacing.xs,
    },
    songImg: {
        width: 50,
        height: 50,
        borderRadius: 12,
        marginRight: spacing.md,
    },
    songInfo: {
        flex: 1,
    },
    songTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    activeText: {
        color: colors.primary,
    },
    songArtist: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    playIconContainer: {
        marginRight: spacing.sm,
        padding: spacing.xs,
    },
    moreBtn: {
        padding: spacing.xs,
    }
});
