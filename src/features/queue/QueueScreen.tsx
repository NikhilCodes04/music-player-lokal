import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { usePlayerStore } from '../player/player.store';
import { colors, spacing, borderRadius, typography } from '../../shared/theme';
import { ArrowLeftIcon, CloseIcon, MoreVerticalIcon } from '../../shared/components';
import type { Track } from '../player/player.types';

export function QueueScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { queue, currentTrack, activeId, playTrack, removeFromQueue, clearQueue } = usePlayerStore();

    const renderItem = ({ item, index }: { item: Track; index: number }) => {
        const isActive = item.id === activeId;
        return (
            <TouchableOpacity
                style={[styles.itemContainer, isActive && styles.activeItem]}
                onPress={() => playTrack(item)}
            >
                <Image source={{ uri: item.artwork }} style={styles.artwork} />
                <View style={styles.trackInfo}>
                    <Text style={[styles.title, isActive && styles.activeText]} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.artist} numberOfLines={1}>{item.artist}</Text>
                </View>
                {/* Remove Button */}
                <TouchableOpacity onPress={() => removeFromQueue(item.id)} style={styles.removeButton}>
                    <CloseIcon size={20} color={colors.textSecondary} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <ArrowLeftIcon size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Queue</Text>
                <TouchableOpacity onPress={clearQueue} style={styles.headerButton}>
                    <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                data={queue}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Queue is empty</Text>
                    </View>
                }
            />
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        height: 56,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerButton: {
        padding: spacing.sm,
    },
    headerTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
        color: colors.textPrimary,
    },
    clearText: {
        color: colors.primary,
        fontWeight: typography.weights.medium,
    },
    listContent: {
        padding: spacing.md,
        paddingBottom: 80, // Space for miniplayer if present (though this might be a modal stack)
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        marginBottom: spacing.xs,
        borderRadius: borderRadius.md,
    },
    activeItem: {
        backgroundColor: colors.surface,
    },
    artwork: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.sm,
        marginRight: spacing.md,
    },
    trackInfo: {
        flex: 1,
        marginRight: spacing.sm,
    },
    title: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    activeText: {
        color: colors.primary,
        fontWeight: typography.weights.bold,
    },
    artist: {
        fontSize: typography.sizes.sm,
        color: colors.textSecondary,
    },
    removeButton: {
        padding: spacing.sm,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 64,
    },
    emptyText: {
        fontSize: typography.sizes.md,
        color: colors.textMuted,
    },
});
