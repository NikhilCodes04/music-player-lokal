import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface HorizontalArtistCardProps {
    name: string;
    image: string;
    onPress: () => void;
    size?: number;
}

export function HorizontalArtistCard({ name, image, onPress, size = 100 }: HorizontalArtistCardProps) {
    return (
        <TouchableOpacity
            style={[styles.container, { width: size }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Image
                source={{ uri: image }}
                style={[styles.image, { width: size, height: size }]}
            />
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginRight: spacing.lg,
        alignItems: 'center',
    },
    image: {
        borderRadius: 999,
        backgroundColor: colors.surface,
        marginBottom: spacing.sm,
    },
    name: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        color: colors.textPrimary,
        textAlign: 'center',
    },
});
