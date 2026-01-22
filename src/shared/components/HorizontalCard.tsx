import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';

interface HorizontalCardProps {
    title: string;
    subtitle: string;
    image: string;
    onPress: () => void;
    imageSize?: number;
}

export function HorizontalCard({ title, subtitle, image, onPress, imageSize = 140 }: HorizontalCardProps) {
    return (
        <TouchableOpacity
            style={[styles.container, { width: imageSize }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Image
                source={{ uri: image }}
                style={[styles.image, { width: imageSize, height: imageSize }]}
            />
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginRight: spacing.lg,
    },
    image: {
        borderRadius: borderRadius.xl,
        backgroundColor: colors.surface,
        marginBottom: spacing.sm,
    },
    title: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: typography.sizes.xs,
        color: colors.textSecondary,
    },
});
