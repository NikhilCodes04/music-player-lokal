import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { Feather, MaterialIcons, FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { HeartIcon } from './Icons';
import type { Song } from '../../services/saavn.mappers';

interface SongOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    song: Song | null;
}

export function SongOptionsModal({ visible, onClose, song }: SongOptionsModalProps) {
    if (!song) return null;

    // Helper to format duration
    const formatDuration = (seconds?: number) => {
        if (!seconds) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} mins`;
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.container}>
                            {/* Handle Bar */}
                            <View style={styles.handleBar} />

                            {/* Header */}
                            <View style={styles.header}>
                                <Image source={{ uri: song.artwork }} style={styles.artwork} />
                                <View style={styles.headerInfo}>
                                    <Text style={styles.title} numberOfLines={1}>{song.title}</Text>
                                    <Text style={styles.subtitle} numberOfLines={1}>
                                        {song.artist}  |  {formatDuration(song.duration)}
                                    </Text>
                                </View>
                                <TouchableOpacity style={styles.heartBtn}>
                                    <HeartIcon size={24} color={colors.textPrimary} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.divider} />

                            {/* Options List */}
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                                <OptionItem
                                    icon={<MaterialIcons name="skip-next" size={24} color={colors.textPrimary} />}
                                    label="Play Next"
                                    onPress={onClose}
                                />
                                <OptionItem
                                    icon={<MaterialIcons name="queue-music" size={24} color={colors.textPrimary} />}
                                    label="Add to Playing Queue"
                                    onPress={onClose}
                                />
                                <OptionItem
                                    icon={<Feather name="plus-circle" size={24} color={colors.textPrimary} />}
                                    label="Add to Playlist"
                                    onPress={onClose}
                                />
                                <OptionItem
                                    icon={<Feather name="disc" size={24} color={colors.textPrimary} />}
                                    label="Go to Album"
                                    onPress={onClose}
                                />
                                <OptionItem
                                    icon={<Feather name="user" size={24} color={colors.textPrimary} />}
                                    label="Go to Artist"
                                    onPress={onClose}
                                />
                                <OptionItem
                                    icon={<Feather name="info" size={24} color={colors.textPrimary} />}
                                    label="Details"
                                    onPress={onClose}
                                />
                                <OptionItem
                                    icon={<Feather name="phone-call" size={24} color={colors.textPrimary} />}
                                    label="Set as Ringtone"
                                    onPress={onClose}
                                />
                                <OptionItem
                                    icon={<Feather name="x-circle" size={24} color={colors.textPrimary} />}
                                    label="Add to Blacklist"
                                    onPress={onClose}
                                />
                                <OptionItem
                                    icon={<Feather name="share" size={24} color={colors.textPrimary} />}
                                    label="Share"
                                    onPress={onClose}
                                />
                                <OptionItem
                                    icon={<Feather name="trash-2" size={24} color={colors.textPrimary} />}
                                    label="Delete from Device"
                                    onPress={onClose}
                                />
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

function OptionItem({ icon, label, onPress }: { icon: React.ReactNode, label: string, onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.optionItem} onPress={onPress}>
            <View style={styles.iconContainer}>{icon}</View>
            <Text style={styles.optionLabel}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: colors.background,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        paddingTop: spacing.md,
        paddingBottom: spacing.xl,
        maxHeight: '85%', // Prevent it from taking full screen
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.lg,
    },
    artwork: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.md,
        marginRight: spacing.md,
        backgroundColor: colors.surface,
    },
    headerInfo: {
        flex: 1,
        marginRight: spacing.md,
    },
    title: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: typography.sizes.sm,
        color: colors.textSecondary,
    },
    heartBtn: {
        padding: spacing.sm,
    },
    divider: {
        height: 1,
        backgroundColor: colors.divider,
        marginBottom: spacing.md,
        marginHorizontal: spacing.xl,
    },
    scrollContent: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xl,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    iconContainer: {
        width: 32,
        marginRight: spacing.lg,
        alignItems: 'center', // Center icon in its fixed width
        // justifyContent: 'center',
    },
    optionLabel: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
        color: colors.textPrimary,
    },
});
