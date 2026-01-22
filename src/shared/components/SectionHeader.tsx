import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface SectionHeaderProps {
    title: string;
    onSeeAll?: () => void;
    seeAllText?: string;
}

export function SectionHeader({ title, onSeeAll, seeAllText = 'See All' }: SectionHeaderProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {onSeeAll && (
                <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
                    <Text style={styles.seeAll}>{seeAllText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
        marginTop: spacing.lg,
    },
    title: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
        color: colors.textPrimary,
    },
    seeAll: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
        color: colors.primary,
    },
});
