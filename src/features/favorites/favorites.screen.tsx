import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../shared/theme';

/**
 * Favorites Screen - Placeholder
 */
export function FavoritesScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Favorites</Text>
                <Text style={styles.subtitle}>Your liked songs will appear here</Text>
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
