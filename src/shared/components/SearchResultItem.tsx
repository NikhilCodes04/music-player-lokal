import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { PlayIcon, MoreVerticalIcon } from './Icons';

interface SearchResultItemProps {
    title: string;
    subtitle: string;
    image: string;
    onPress: () => void;
    onPlayPress: () => void;
    onOptionsPress: () => void;
}

export function SearchResultItem({
    title,
    subtitle,
    image,
    onPress,
    onPlayPress,
    onOptionsPress,
}: SearchResultItemProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <Image source={{ uri: image }} style={styles.image} />

            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity onPress={onPlayPress} activeOpacity={0.7} style={styles.actionButton}>
                    <PlayIcon size={32} />
                </TouchableOpacity>

                <TouchableOpacity onPress={onOptionsPress} activeOpacity={0.7} style={styles.actionButton}>
                    <MoreVerticalIcon size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    image: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.md,
        backgroundColor: colors.surface,
    },
    info: {
        flex: 1,
        marginLeft: spacing.md,
    },
    title: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: typography.sizes.sm,
        color: colors.textSecondary,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: spacing.xs,
        marginLeft: spacing.xs,
    },
});
