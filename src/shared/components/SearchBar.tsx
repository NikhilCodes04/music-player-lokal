import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { SearchIcon, ArrowLeftIcon, CloseIcon } from './Icons';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onClear: () => void;
    onBack: () => void;
    placeholder?: string;
    autoFocus?: boolean;
}

export function SearchBar({
    value,
    onChangeText,
    onClear,
    onBack,
    placeholder = 'Search songs, artists, albums...',
    autoFocus = false,
}: SearchBarProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.iconButton}>
                <ArrowLeftIcon size={24} color={colors.textPrimary} />
            </TouchableOpacity>

            <View style={styles.inputContainer}>
                <SearchIcon size={20} color={colors.textMuted} />
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textMuted}
                    autoFocus={autoFocus}
                    returnKeyType="search"
                />
                {value.length > 0 && (
                    <TouchableOpacity
                        onPress={onClear}
                        activeOpacity={0.7}
                        style={styles.clearButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <CloseIcon size={20} color={colors.textMuted} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.background,
    },
    iconButton: {
        marginRight: spacing.md,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        height: 48,
        borderWidth: 1,
        borderColor: colors.border,
    },
    input: {
        flex: 1,
        marginLeft: spacing.sm,
        fontSize: typography.sizes.md,
        color: colors.textPrimary,
        height: '100%',
    },
    clearButton: {
        padding: spacing.xs,
    },
});
