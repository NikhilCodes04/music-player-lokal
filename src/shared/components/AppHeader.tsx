import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';
import { MusicNoteIcon, SearchIcon } from './Icons';

interface AppHeaderProps {
    onSearchPress?: () => void;
}

/**
 * App Header Component
 * Matches Figma design with Mume logo and search icon
 */
export function AppHeader({ onSearchPress }: AppHeaderProps) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
            <View style={styles.logoContainer}>
                <MusicNoteIcon size={28} color={colors.primary} />
                <Text style={styles.logoText}>Mume</Text>
            </View>
            <TouchableOpacity
                style={styles.searchButton}
                onPress={onSearchPress}
                activeOpacity={0.7}
            >
                <SearchIcon size={24} color={colors.textPrimary} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        backgroundColor: colors.background,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    logoText: {
        fontSize: typography.sizes.xxl,
        fontWeight: typography.weights.bold,
        color: colors.textPrimary,
        marginLeft: spacing.xs,
    },
    searchButton: {
        padding: spacing.sm,
    },
});
