import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

interface FilterPillProps {
    label: string;
    isActive: boolean;
    onPress: () => void;
}

export function FilterPill({ label, isActive, onPress }: FilterPillProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[
                styles.container,
                isActive ? styles.activeContainer : styles.inactiveContainer,
            ]}
        >
            <Text
                style={[
                    styles.text,
                    isActive ? styles.activeText : styles.inactiveText,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.round,
        marginRight: spacing.sm,
        borderWidth: 1,
    },
    activeContainer: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    inactiveContainer: {
        backgroundColor: colors.background,
        borderColor: colors.primary,
    },
    text: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
    },
    activeText: {
        color: colors.textOnPrimary,
    },
    inactiveText: {
        color: colors.primary,
    },
});
