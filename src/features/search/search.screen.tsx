import React, { useState, useCallback } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Text,
    ScrollView,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    SearchBar,
    FilterPill,
    SearchResultItem
} from '../../shared/components';
import { useSearch } from './search.hooks';
import type { SearchFilter } from './search.types';
import type { Song, Album, Artist } from '../../services/saavn.mappers';
import { colors, spacing, typography } from '../../shared/theme';

const FILTERS: { label: string; value: SearchFilter }[] = [
    { label: 'Songs', value: 'songs' },
    { label: 'Artists', value: 'artists' },
    { label: 'Albums', value: 'albums' },
    // { label: 'Folders', value: 'playlists' }, 
];

export function SearchScreen() {
    const insets = useSafeAreaInsets();
    const [query, setQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<SearchFilter>('songs');

    const {
        results,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useSearch(query, activeFilter);

    const handleClear = () => {
        setQuery('');
        Keyboard.dismiss();
    };

    const handleBack = () => {
        console.log('Navigate back');
    };

    const renderItem = ({ item }: { item: Song | Album | Artist }) => {
        let title = '';
        let subtitle = '';
        let image = '';

        if ('title' in item) {
            // It's a Song
            title = item.title;
            subtitle = item.artist;
            image = item.artwork;
        } else if ('year' in item) {
            // It's an Album (assuming Album has year or we check strict keys)
            // simplified check: if it has name and NOT generic artist props maybe?
            // Safest is to check keys present in specific interfaces
            const album = item as Album;
            title = album.name;
            subtitle = album.artist || 'Album';
            image = album.artwork;
        } else {
            // It's an Artist
            const artist = item as Artist;
            title = artist.name;
            subtitle = artist.role || 'Artist';
            image = artist.image;
        }

        // To be safe with the activeFilter context:
        if (activeFilter === 'songs') {
            const song = item as Song;
            title = song.title || '';
            subtitle = song.artist || '';
            image = song.artwork || '';
        } else if (activeFilter === 'albums') {
            const album = item as Album;
            title = album.name || '';
            subtitle = album.artist || '';
            image = album.artwork || '';
        } else if (activeFilter === 'artists') {
            const artist = item as Artist;
            title = artist.name || '';
            subtitle = 'Artist';
            image = artist.image || '';
        }

        return (
            <SearchResultItem
                title={title}
                subtitle={subtitle}
                image={image}
                onPress={() => console.log('Press', item.id)}
                onPlayPress={() => console.log('Play', item.id)}
                onOptionsPress={() => console.log('Options', item.id)}
            />
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Search Header */}
            <SearchBar
                value={query}
                onChangeText={setQuery}
                onClear={handleClear}
                onBack={handleBack}
            />

            {/* Filters */}
            <View style={styles.filterContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContent}
                >
                    {FILTERS.map((filter) => (
                        <FilterPill
                            key={filter.value}
                            label={filter.label}
                            isActive={activeFilter === filter.value}
                            onPress={() => setActiveFilter(filter.value)}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Results */}
            <View style={styles.content}>
                {isLoading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : results.length > 0 ? (
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        onEndReached={() => hasNextPage && fetchNextPage()}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.primary} /> : null}
                    />
                ) : query.length >= 2 ? (
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>No results found for "{query}"</Text>
                        </View>
                    </TouchableWithoutFeedback>
                ) : (
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>Search for songs, artists, or albums</Text>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    filterContainer: {
        paddingVertical: spacing.sm,
    },
    filterContent: {
        paddingHorizontal: spacing.lg,
    },
    content: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 100,
    },
    emptyText: {
        fontSize: typography.sizes.md,
        color: colors.textSecondary,
    },
});
