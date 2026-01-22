import React, { useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Text,
    ScrollView,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    SearchBar,
    FilterPill,
    SearchResultItem
} from '../../shared/components';
import { CloseIcon, ReplayIcon } from '../../shared/components/Icons';
import { useDebounce } from '../../shared/hooks/useDebounce';
import { useRecentSearches } from './useRecentSearches';
import { useSearch } from './search.hooks';
import type { SearchFilter } from './search.types';
import type { Song, Album, Artist } from '../../services/saavn.mappers';
import { colors, spacing, typography } from '../../shared/theme/colors';

const FILTERS: { label: string; value: SearchFilter }[] = [
    { label: 'Songs', value: 'songs' },
    { label: 'Artists', value: 'artists' },
    { label: 'Albums', value: 'albums' },
];

export function SearchScreen() {
    const insets = useSafeAreaInsets();
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 500);
    const [activeFilter, setActiveFilter] = useState<SearchFilter>('songs');

    const {
        results,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useSearch(debouncedQuery, activeFilter);

    const { history, addToHistory, removeFromHistory, clearHistory } = useRecentSearches();

    const handleClear = () => {
        setQuery('');
        Keyboard.dismiss();
    };

    const handleBack = () => {
        console.log('Navigate back');
    };

    const handleResultPress = (item: Song | Album | Artist) => {
        if (query.trim()) {
            addToHistory(query);
        } else {
            if ('title' in item && item.title) addToHistory(item.title);
            else if ('name' in item && item.name) addToHistory(item.name);
        }
        console.log('Press', item.id);
    };

    const handleHistoryPress = (term: string) => {
        setQuery(term);
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
            // It's an Album
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

        // Contextual overrides if needed based on activeFilter
        if (activeFilter === 'songs') {
            const song = item as Song;
            title = song.title || title;
            subtitle = song.artist || subtitle;
        } else if (activeFilter === 'albums') {
            const album = item as Album;
            title = album.name || title;
            subtitle = album.artist || subtitle;
        } else if (activeFilter === 'artists') {
            const artist = item as Artist;
            title = artist.name || title;
            image = artist.image || image;
            subtitle = 'Artist';
        }

        return (
            <SearchResultItem
                title={title}
                subtitle={subtitle}
                image={image}
                onPress={() => handleResultPress(item)}
                onPlayPress={() => console.log('Play', item.id)}
                onOptionsPress={() => console.log('Options', item.id)}
            />
        );
    };



    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <SearchBar
                value={query}
                onChangeText={setQuery}
                onClear={handleClear}
                onBack={handleBack}
            />

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
                ) : query.length > 0 ? (
                    // Not Found State
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.notFoundContainer}>
                            {/* Placeholder for the illustration - Using Emoji for now to match vibe */}
                            <Text style={{ fontSize: 120, marginBottom: spacing.lg }}>😔</Text>
                            <Text style={styles.notFoundTitle}>Not Found</Text>
                            <Text style={styles.notFoundText}>
                                Sorry, the keyword you entered cannot be found, please check again or search with another keyword.
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                ) : history.length > 0 ? (
                    <View style={styles.historyContainer}>
                        <View style={styles.historyHeader}>
                            <Text style={styles.sectionTitle}>Recent Searches</Text>
                            <TouchableOpacity onPress={clearHistory}>
                                <Text style={styles.clearAllText}>Clear All</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={history}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <View style={styles.historyItem}>
                                    <TouchableOpacity
                                        style={styles.historyTextContainer}
                                        onPress={() => handleHistoryPress(item)}
                                    >
                                        <Text style={styles.historyText}>{item}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => removeFromHistory(item)} style={styles.removeHistoryBtn}>
                                        <CloseIcon size={20} color={colors.textMuted} />
                                    </TouchableOpacity>
                                </View>
                            )}
                            contentContainerStyle={styles.listContent}
                            keyboardShouldPersistTaps="handled"
                        />
                    </View>
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
        fontFamily: typography.fonts.regular,
    },
    notFoundContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xxl,
    },
    notFoundTitle: {
        fontSize: typography.sizes.xxl,
        fontFamily: typography.fonts.bold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    notFoundText: {
        fontSize: typography.sizes.md,
        fontFamily: typography.fonts.regular,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    historyContainer: {
        flex: 1,
    },
    historyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: spacing.lg,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    sectionTitle: {
        fontSize: typography.sizes.md,
        fontFamily: typography.fonts.bold,
        color: colors.textPrimary,
        marginLeft: spacing.lg,
    },
    clearAllText: {
        fontSize: typography.sizes.md,
        fontFamily: typography.fonts.bold,
        color: colors.primary, // Orange
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    historyTextContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    historyText: {
        fontSize: typography.sizes.md,
        fontFamily: typography.fonts.regular,
        color: colors.textSecondary, // Muted look as per screenshot
    },
    removeHistoryBtn: {
        padding: spacing.sm,
    },
});
