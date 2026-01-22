import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../shared/theme';

/**
 * Playlists Screen - Placeholder
 */
export function PlaylistsScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Playlists</Text>
                <Text style={styles.subtitle}>Create and manage your playlists</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
