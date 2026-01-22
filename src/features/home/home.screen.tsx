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
} from 'react-native';
import { useSuggestedFeed, useHomeSongs, useHomeAlbums, useHomeArtists } from './home.hooks';
import type { HomeTab } from './home.types';
import type { Song, Album, Artist } from '../../services/saavn.mappers';

const { width } = Dimensions.get('window');
const TABS: HomeTab[] = ['suggested', 'songs', 'artists', 'albums'];

export function HomeScreen() {
    const [activeTab, setActiveTab] = useState<HomeTab>('suggested');

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Music</Text>
            </View>

            {/* Tab Bar */}
            <View style={styles.tabBar}>
                {TABS.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.tabActive]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
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
    const { songs, isLoading, isError, refetch } = useSuggestedFeed();

    if (isLoading) return <LoadingView />;
    if (isError) return <ErrorView onRetry={refetch} />;

    return (
        <FlatList
            data={songs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SongItem song={item} onPress={() => handlePlaySong(item)} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
        />
    );
}

function SongsTab() {
    const { songs, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } = useHomeSongs();

    if (isLoading) return <LoadingView />;
    if (error) return <ErrorView onRetry={() => fetchNextPage()} error={error?.message} />;

    return (
        <FlatList
            data={songs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SongItem song={item} onPress={() => handlePlaySong(item)} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color="#1DB954" /> : null}
        />
    );
}

function AlbumsTab() {
    const { albums, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } = useHomeAlbums();

    if (isLoading) return <LoadingView />;
    if (error) return <ErrorView onRetry={() => fetchNextPage()} error={error?.message} />;

    return (
        <FlatList
            data={albums}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AlbumItem album={item} onPress={() => handleAlbumPress(item)} />}
            numColumns={2}
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color="#1DB954" /> : null}
        />
    );
}

function ArtistsTab() {
    const { artists, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } = useHomeArtists();

    if (isLoading) return <LoadingView />;
    if (error) return <ErrorView onRetry={() => fetchNextPage()} error={error?.message} />;

    return (
        <FlatList
            data={artists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ArtistItem artist={item} onPress={() => handleArtistPress(item)} />}
            numColumns={3}
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color="#1DB954" /> : null}
        />
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

interface ArtistItemProps {
    artist: Artist;
    onPress: () => void;
}

function ArtistItem({ artist, onPress }: ArtistItemProps) {
    const itemWidth = (width - 64) / 3;
    return (
        <TouchableOpacity style={[styles.artistItem, { width: itemWidth }]} onPress={onPress} activeOpacity={0.7}>
            <Image source={{ uri: artist.image }} style={[styles.artistImage, { width: itemWidth - 8, height: itemWidth - 8 }]} />
            <Text style={styles.artistName} numberOfLines={1}>{artist.name}</Text>
        </TouchableOpacity>
    );
}

// --- Utility Components ---

function LoadingView() {
    return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color="#1DB954" />
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
    // TODO: Replace queue and start playback via player store
}

function handleAlbumPress(album: Album) {
    console.log('Navigate to album:', album.name);
    // TODO: Navigate to album detail screen
}

function handleArtistPress(artist: Artist) {
    console.log('Navigate to artist:', artist.name);
    // TODO: Navigate to artist detail screen
}

// --- Styles ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 48,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 8,
        borderRadius: 20,
        backgroundColor: '#282828',
    },
    tabActive: {
        backgroundColor: '#1DB954',
    },
    tabText: {
        fontSize: 14,
        color: '#B3B3B3',
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    gridContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    songItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    songArtwork: {
        width: 56,
        height: 56,
        borderRadius: 4,
        backgroundColor: '#282828',
    },
    songInfo: {
        flex: 1,
        marginLeft: 12,
    },
    songTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    songArtist: {
        fontSize: 14,
        color: '#B3B3B3',
    },
    songDuration: {
        marginLeft: 12,
    },
    durationText: {
        fontSize: 13,
        color: '#B3B3B3',
    },
    albumItem: {
        marginBottom: 16,
        marginRight: 16,
    },
    albumArtwork: {
        borderRadius: 4,
        backgroundColor: '#282828',
        marginBottom: 8,
    },
    albumName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    albumArtist: {
        fontSize: 12,
        color: '#B3B3B3',
    },
    artistItem: {
        alignItems: 'center',
        marginBottom: 16,
        marginRight: 16,
    },
    artistImage: {
        borderRadius: 100,
        backgroundColor: '#282828',
        marginBottom: 8,
    },
    artistName: {
        fontSize: 13,
        fontWeight: '500',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#B3B3B3',
        marginBottom: 8,
    },
    errorDetail: {
        fontSize: 12,
        color: '#888',
        marginBottom: 16,
        paddingHorizontal: 20,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#1DB954',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
    },
    retryText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
