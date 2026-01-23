import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Platform, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, typography } from '../../shared/theme';
import {
    ArrowLeftIcon,
    MoreVerticalIcon,
    ShuffleIcon,
    PlayIcon,
    HeartIcon
} from '../../shared/components';
import { usePlayerStore } from '../player/player.store';
import type { Track } from '../player/player.types';
import type { Album } from '../../services/saavn.mappers';

// Mock Data generator for Album Details
const getMockAlbumTracks = (albumName: string, artistName: string, image: string): Track[] => {
    return [
        { title: 'Track 1', duration: 220 },
        { title: 'Track 2', duration: 195 },
        { title: 'Track 3', duration: 210 },
        { title: 'Track 4', duration: 180 },
        { title: 'Track 5', duration: 200 },
        { title: 'Track 6', duration: 175 }
    ].map((t, i) => ({
        id: `album-track-${i}`,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // placeholder
        title: t.title,
        artist: artistName,
        artwork: image,
        duration: t.duration,
        album: albumName
    }));
};

export function AlbumDetailsScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { album } = route.params || {};

    // Use passed album or fallback
    const albumData: Album = album || {
        id: '0',
        name: 'Unknown Album',
        artist: 'Unknown Artist',
        artwork: 'https://picsum.photos/300',
        year: '2024'
    };

    const tracks = getMockAlbumTracks(albumData.name, albumData.artist, albumData.artwork);
    const { playTrack, currentTrack } = usePlayerStore();

    const handlePlayAll = () => {
        if (tracks.length > 0) {
            playTrack(tracks[0]);
        }
    };

    const handleShuffle = () => {
        if (tracks.length > 0) {
            playTrack(tracks[Math.floor(Math.random() * tracks.length)]);
        }
    };

    const renderSongItem = (item: Track, index: number) => {
        const isCurrent = currentTrack?.id === item.id;
        return (
            <TouchableOpacity key={index} style={styles.songItem} onPress={() => playTrack(item)}>
                <View style={styles.trackNumberContainer}>
                    <Text style={styles.trackNumber}>{index + 1}</Text>
                </View>
                <View style={styles.songInfo}>
                    <Text style={[styles.songTitle, isCurrent && styles.activeText]} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.songArtist} numberOfLines={1}>{item.artist}</Text>
                </View>
                <TouchableOpacity style={styles.playIconContainer} onPress={() => playTrack(item)}>
                    <View style={styles.playIconCircle}>
                        <PlayIcon size={12} color={colors.textOnPrimary} filled={true} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.moreBtn}>
                    <MoreVerticalIcon size={20} color={colors.textSecondary} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    // Calculate total duration roughly
    const totalDurationMins = Math.floor(tracks.reduce((acc, t) => acc + (t.duration || 0), 0) / 60);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <ArrowLeftIcon size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <HeartIcon size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <MoreVerticalIcon size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Album Info */}
                <View style={styles.albumProfile}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: albumData.artwork }}
                            style={styles.albumImage}
                        />
                    </View>
                    <Text style={styles.albumName}>{albumData.name}</Text>
                    <Text style={styles.albumArtist}>{albumData.artist}</Text>
                    <Text style={styles.albumStats}>
                        {albumData.year || '2024'}  |  {tracks.length} Songs  |  ~{totalDurationMins} mins
                    </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={[styles.actionBtn, styles.shuffleBtn]} onPress={handleShuffle}>
                        <ShuffleIcon size={20} color={colors.textOnPrimary} />
                        <Text style={[styles.btnText, styles.textOnPrimary]}>Shuffle</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionBtn, styles.playBtn]} onPress={handlePlayAll}>
                        <PlayIcon size={20} color={colors.primary} filled={true} />
                        <Text style={[styles.btnText, styles.textPrimary]}>Play</Text>
                    </TouchableOpacity>
                </View>

                {/* Songs Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Songs</Text>
                </View>

                <View style={styles.songsList}>
                    {tracks.map((track, i) => renderSongItem(track, i))}
                </View>
            </ScrollView>
        </View>
    );
}

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
    albumProfile: {
        alignItems: 'center',
        marginTop: spacing.md,
        marginBottom: spacing.xl,
    },
    imageContainer: {
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        marginBottom: spacing.lg,
    },
    albumImage: {
        width: 220,
        height: 220,
        borderRadius: 32,
    },
    albumName: {
        fontSize: 24,
        fontFamily: typography.fonts.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
        textAlign: 'center',
        paddingHorizontal: spacing.xl,
    },
    albumArtist: {
        fontSize: 18,
        fontFamily: typography.fonts.medium,
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    albumStats: {
        fontSize: typography.sizes.sm,
        fontFamily: typography.fonts.medium,
        color: colors.textSecondary,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.lg,
        marginBottom: spacing.xxl,
        paddingHorizontal: spacing.xl,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 54,
        borderRadius: 27,
        gap: spacing.sm,
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
        backgroundColor: '#FFF0E0',
    },
    btnText: {
        fontSize: 18,
        fontFamily: typography.fonts.bold,
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
        fontSize: 20,
        fontFamily: typography.fonts.bold,
        color: colors.textPrimary,
    },
    songsList: {
        paddingBottom: 80,
    },
    songItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.sm + 4,
        marginBottom: 2,
    },
    trackNumberContainer: {
        width: 30,
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    trackNumber: {
        fontSize: 14,
        fontFamily: typography.fonts.medium,
        color: colors.textSecondary,
    },
    songInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    songTitle: {
        fontSize: 16,
        fontFamily: typography.fonts.bold,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    activeText: {
        color: colors.primary,
    },
    songArtist: {
        fontSize: 13,
        fontFamily: typography.fonts.medium,
        color: colors.textSecondary,
    },
    playIconContainer: {
        marginRight: spacing.xs,
        padding: spacing.xs,
    },
    playIconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.primary + '20',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    moreBtn: {
        padding: spacing.xs,
    }
});
