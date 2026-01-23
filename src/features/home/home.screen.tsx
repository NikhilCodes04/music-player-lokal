import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSuggestedFeed, useHomeSongs, useHomeAlbums, useHomeArtists } from './home.hooks';
import { usePlayerStore } from '../player/player.store';
import type { HomeTab } from './home.types';
import type { Song, Album, Artist } from '../../services/saavn.mappers';
import {
    AppHeader,
    SectionHeader,
    HorizontalCard,
    HorizontalArtistCard,
    MoreVerticalIcon
} from '../../shared/components';
import { ArtistOptionsModal } from '../../shared/components/ArtistOptionsModal';
import { SortOptionsModal, SortOption } from '../../shared/components/SortOptionsModal';
import { colors, spacing, typography, borderRadius } from '../../shared/theme';

const { width } = Dimensions.get('window');
const TABS: HomeTab[] = ['suggested', 'songs', 'artists', 'albums'];

export function HomeScreen() {
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState<HomeTab>('suggested');

    return (
        <View style={styles.container}>
            {/* App Header */}
            <AppHeader onSearchPress={() => navigation.navigate('Search')} />

            {/* Content Tabs */}
            <View style={styles.tabBar}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabScrollContent}
                >
                    {TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={styles.tab}
                            onPress={() => setActiveTab(tab)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.tabText,
                                activeTab === tab && styles.tabTextActive
                            ]}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Text>
                            {activeTab === tab && <View style={styles.tabIndicator} />}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Tab Content */}
            <View style={styles.content}>
                {activeTab === 'suggested' && <SuggestedTab />}
                {activeTab === 'songs' && <SongsTab />}
                {activeTab === 'albums' && <AlbumsTab />}
                {activeTab === 'artists' && <ArtistsTab />}
            </View>
        </View>
    );
}

// --- Tab Components ---

function SuggestedTab() {
    const navigation = useNavigation<any>();
    const { songs: suggestedSongs, isLoading: isSongsLoading, isError: isSongsError, refetch: refetchSongs } = useSuggestedFeed();
    const { artists, isLoading: isArtistsLoading } = useHomeArtists();

    if (isSongsLoading || isArtistsLoading) return <LoadingView />;
    if (isSongsError) return <ErrorView onRetry={refetchSongs} />;

    // Splitting songs for different sections to mimic a real feed
    // Ensure we have data before slicing
    const safeSongs = suggestedSongs || [];
    const recentlyPlayed = safeSongs.slice(0, 5);
    const mostPlayed = safeSongs.slice(5, 10);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Recently Played Section */}
            <View style={styles.section}>
                <SectionHeader
                    title="Recently Played"
                    onSeeAll={() => console.log('See all recently played')}
                />
                <FlatList
                    horizontal
                    data={recentlyPlayed}
                    keyExtractor={(item) => `recent-${item.id}`}
                    renderItem={({ item }) => (
                        <HorizontalCard
                            title={item.title}
                            subtitle={item.artist}
                            image={item.artwork}
                            onPress={() => handlePlaySong(item)}
                        />
                    )}
                    contentContainerStyle={styles.horizontalListContent}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {/* Artists Section */}
            <View style={styles.section}>
                <SectionHeader
                    title="Artists"
                    onSeeAll={() => console.log('See all artists')}
                />
                <FlatList
                    horizontal
                    data={artists ? artists.slice(0, 10) : []}
                    keyExtractor={(item) => `artist-${item.id}`}
                    renderItem={({ item }) => (
                        <HorizontalArtistCard
                            name={item.name}
                            image={item.image}
                            onPress={() => handleArtistPress(item, navigation)}
                        />
                    )}
                    contentContainerStyle={styles.horizontalListContent}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {/* Most Played Section */}
            <View style={styles.section}>
                <SectionHeader
                    title="Most Played"
                    onSeeAll={() => console.log('See all most played')}
                />
                <FlatList
                    horizontal
                    data={mostPlayed}
                    keyExtractor={(item) => `most-${item.id}`}
                    renderItem={({ item }) => (
                        <HorizontalCard
                            title={item.title}
                            subtitle={item.artist}
                            image={item.artwork}
                            onPress={() => handlePlaySong(item)}
                        />
                    )}
                    contentContainerStyle={styles.horizontalListContent}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </ScrollView>
    );
}



function SongsTab() {
    const { songs, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } = useHomeSongs();
    const [sortOption, setSortOption] = useState<SortOption>('Ascending');
    const [modalVisible, setModalVisible] = useState(false);

    // Client-side sort (demo purpose, ideally API managed)
    const sortedSongs = React.useMemo(() => {
        if (!songs) return [];
        const sorted = [...songs];
        switch (sortOption) {
            case 'Ascending':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'Descending':
                return sorted.sort((a, b) => b.title.localeCompare(a.title));
            case 'Artist':
                return sorted.sort((a, b) => a.artist.localeCompare(b.artist));
            case 'Album':
                return sorted.sort((a, b) => (a.album || '').localeCompare(b.album || ''));
            // Others like Year, Date Added require metadata field not present in simple mock
            default:
                return sorted;
        }
    }, [songs, sortOption]);

    if (isLoading) return <LoadingView />;
    if (error) return <ErrorView onRetry={() => fetchNextPage()} error={error?.message} />;

    return (
        <View style={{ flex: 1 }}>
            {/* Songs Header */}
            <View style={styles.tabHeader}>
                <Text style={styles.tabHeaderTitle}>{songs.length} songs</Text>
                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.sortText}>{sortOption}</Text>
                    {/* Reusing existing icon or simple placeholder */}
                    <MoreVerticalIcon size={16} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={sortedSongs}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item }) => <SongItem song={item} onPress={() => handlePlaySong(item)} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                onEndReached={() => hasNextPage && fetchNextPage()}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.primary} /> : null}
            />

            <SortOptionsModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                currentSort={sortOption}
                onSelectSort={setSortOption}
            />
        </View>
    );
}

function AlbumsTab() {
    const { albums, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } = useHomeAlbums();

    if (isLoading) return <LoadingView />;
    if (error) return <ErrorView onRetry={() => fetchNextPage()} error={error?.message} />;

    return (
        <FlatList
            data={albums}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item }) => <AlbumItem album={item} onPress={() => handleAlbumPress(item)} />}
            numColumns={2}
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.primary} /> : null}
        />
    );
}

const ARTIST_SORT_OPTIONS: SortOption[] = ['Date Added', 'Name', 'Most Played'];

function ArtistsTab() {
    const navigation = useNavigation<any>();
    const { artists, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } = useHomeArtists();
    const [sortOption, setSortOption] = useState<SortOption>('Date Added');
    const [modalVisible, setModalVisible] = useState(false);

    // Artist Options Modal State
    const [optionsModalVisible, setOptionsModalVisible] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

    const handleOpenOptions = (artist: Artist) => {
        setSelectedArtist(artist);
        setOptionsModalVisible(true);
    };

    return (
        <View style={{ flex: 1 }}>
            {isLoading ? (
                <LoadingView />
            ) : error ? (
                <ErrorView onRetry={() => fetchNextPage()} error={error?.message} />
            ) : (
                <>
                    {/* Artists Header */}
                    <View style={styles.tabHeader}>
                        <Text style={styles.tabHeaderTitle}>{artists ? artists.length : 0} artists</Text>
                        <TouchableOpacity
                            style={styles.sortButton}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={styles.sortText}>{sortOption}</Text>
                            <MoreVerticalIcon size={16} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={artists}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                        renderItem={({ item }) => (
                            <ArtistListItem
                                artist={item}
                                onPress={() => handleArtistPress(item, navigation)}
                                onOptionPress={() => handleOpenOptions(item)}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        onEndReached={() => hasNextPage && fetchNextPage()}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.primary} /> : null}
                    />
                </>
            )}

            <SortOptionsModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                currentSort={sortOption}
                onSelectSort={setSortOption}
                options={ARTIST_SORT_OPTIONS}
            />

            <ArtistOptionsModal
                visible={optionsModalVisible}
                onClose={() => setOptionsModalVisible(false)}
                artist={selectedArtist}
            />
        </View>
    );
}

// --- Item Components ---

interface SongItemProps {
    song: Song;
    onPress: () => void;
}

function SongItem({ song, onPress }: SongItemProps) {
    return (
        <TouchableOpacity style={styles.songItem} onPress={onPress} activeOpacity={0.7}>
            <Image source={{ uri: song.artwork }} style={styles.songArtwork} />
            <View style={styles.songInfo}>
                <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
                <Text style={styles.songArtist} numberOfLines={1}>{song.artist}</Text>
            </View>
            <View style={styles.songDuration}>
                <Text style={styles.durationText}>{formatDuration(song.duration)}</Text>
            </View>
        </TouchableOpacity>
    );
}

interface AlbumItemProps {
    album: Album;
    onPress: () => void;
}

function AlbumItem({ album, onPress }: AlbumItemProps) {
    const itemWidth = (width - 48) / 2;
    return (
        <TouchableOpacity style={[styles.albumItem, { width: itemWidth }]} onPress={onPress} activeOpacity={0.7}>
            <Image source={{ uri: album.artwork }} style={[styles.albumArtwork, { width: itemWidth, height: itemWidth }]} />
            <Text style={styles.albumName} numberOfLines={1}>{album.name}</Text>
            <Text style={styles.albumArtist} numberOfLines={1}>{album.artist}</Text>
        </TouchableOpacity>
    );
}

interface ArtistListItemProps {
    artist: Artist;
    onPress: () => void;
    onOptionPress: () => void;
}

function ArtistListItem({ artist, onPress, onOptionPress }: ArtistListItemProps) {
    return (
        <TouchableOpacity style={styles.artistListRow} onPress={onPress} activeOpacity={0.7}>
            <Image source={{ uri: artist.image }} style={styles.artistListImage} />
            <View style={styles.artistListInfo}>
                <Text style={styles.artistNameList} numberOfLines={1}>{artist.name}</Text>
                <Text style={styles.artistStats}>
                    {artist.albumCount || 0} Albums  |  {artist.songCount || 0} Songs
                </Text>
            </View>
            <TouchableOpacity style={styles.menuIcon} onPress={onOptionPress}>
                <MoreVerticalIcon size={20} color={colors.textSecondary} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

// --- Utility Components ---

function LoadingView() {
    return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
}

function ErrorView({ onRetry, error }: { onRetry: () => void; error?: string }) {
    return (
        <View style={styles.centered}>
            <Text style={styles.errorText}>Something went wrong</Text>
            {error && <Text style={styles.errorDetail}>{error}</Text>}
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
        </View>
    );
}

// --- Helpers ---

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Placeholder handlers - will be connected to player store
function handlePlaySong(song: Song) {
    console.log('Play song:', song.title);
    usePlayerStore.getState().playTrack({
        id: song.id,
        url: song.url,
        title: song.title,
        artist: song.artist,
        artwork: song.artwork,
        duration: song.duration,
    });
}

function handleAlbumPress(album: Album) {
    console.log('Navigate to album:', album.name);
}

function handleArtistPress(artist: Artist, navigation: any) {
    navigation.navigate('ArtistDetails', { artist });
}

// --- Styles ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    tabBar: {
        backgroundColor: colors.background,
        borderBottomWidth: 0,
        marginBottom: spacing.xs,
    },
    tabScrollContent: {
        paddingHorizontal: spacing.lg,
        gap: spacing.xl,
    },
    tab: {
        paddingVertical: spacing.sm,
        position: 'relative',
    },
    tabText: {
        fontSize: typography.sizes.md,
        fontFamily: typography.fonts.medium,
        color: colors.textSecondary,
    },
    tabTextActive: {
        color: colors.primary,
        fontFamily: typography.fonts.semibold,
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: colors.primary,
        borderRadius: 1,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    section: {
        marginBottom: spacing.xl,
    },
    horizontalListContent: {
        paddingHorizontal: spacing.lg,
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 100,
    },
    gridContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 100,
    },
    songItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    songArtwork: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.surface,
    },
    songInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    songTitle: {
        fontSize: typography.sizes.lg,
        fontFamily: typography.fonts.medium,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    songArtist: {
        fontSize: typography.sizes.md,
        fontFamily: typography.fonts.regular,
        color: colors.textSecondary,
    },
    songDuration: {
        marginLeft: spacing.md,
    },
    durationText: {
        fontSize: typography.sizes.sm,
        color: colors.textMuted,
    },
    albumItem: {
        marginBottom: spacing.xl,
        marginRight: spacing.lg,
    },
    albumArtwork: {
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        marginBottom: spacing.sm,
    },
    albumDetailsRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    albumName: {
        fontSize: typography.sizes.lg, // Bigger as per design
        fontFamily: typography.fonts.bold,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    albumArtist: {
        fontSize: typography.sizes.sm,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    songCount: {
        fontSize: typography.sizes.xs,
        color: colors.textSecondary,
    },
    menuIcon: {
        paddingLeft: spacing.xs,
        marginTop: 4,
    },
    tabHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
    },
    tabHeaderTitle: {
        fontSize: typography.sizes.lg,
        fontFamily: typography.fonts.bold,
        color: colors.textPrimary,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortText: {
        fontSize: typography.sizes.sm,
        color: colors.primary, // Orange as per design
        marginRight: spacing.xs,
        fontFamily: typography.fonts.medium,
    },
    artistItem: {
        alignItems: 'center',
        marginBottom: spacing.lg,
        marginRight: spacing.lg,
    },
    artistImage: {
        borderRadius: 100,
        backgroundColor: colors.surface,
        marginBottom: spacing.sm,
    },
    artistName: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        color: colors.textPrimary,
        textAlign: 'center',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: typography.sizes.lg,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    errorDetail: {
        fontSize: typography.sizes.sm,
        color: colors.textMuted,
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.xl,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xxl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.round,
    },
    retryText: {
        color: colors.textOnPrimary,
        fontWeight: typography.weights.semibold,
    },
    artistListRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
        paddingVertical: spacing.xs,
    },
    artistListImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: spacing.md,
        backgroundColor: colors.surface,
    },
    artistListInfo: {
        flex: 1,
    },
    artistNameList: {
        fontSize: typography.sizes.lg,
        fontFamily: typography.fonts.bold,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    artistStats: {
        fontSize: typography.sizes.sm,
        color: colors.textSecondary,
        fontFamily: typography.fonts.regular,
    },
});
