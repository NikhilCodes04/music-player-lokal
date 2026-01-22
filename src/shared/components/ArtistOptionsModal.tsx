import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { PlayIcon, SkipNextIcon, PlaylistIcon, CastIcon, CloseIcon } from './Icons';
import { Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import type { Artist } from '../../services/saavn.mappers';

interface ArtistOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    artist: Artist | null;
}

export function ArtistOptionsModal({ visible, onClose, artist }: ArtistOptionsModalProps) {
    if (!artist) return null;

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
                                <Image source={{ uri: artist.image }} style={styles.artwork} />
                                <View style={styles.headerInfo}>
                                    <Text style={styles.title}>{artist.name}</Text>
                                    <Text style={styles.subtitle}>
                                        {artist.albumCount || 1} Album  |  {artist.songCount || 20} Songs
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            {/* Options List */}
                            <OptionItem
                                icon={<FontAwesome name="play-circle-o" size={24} color={colors.textPrimary} />}
                                label="Play"
                                onPress={onClose}
                            />
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
                                icon={<FontAwesome name="plus-square-o" size={24} color={colors.textPrimary} />}
                                label="Add to Playlist"
                                onPress={onClose}
                            />
                            <OptionItem
                                icon={<Feather name="share" size={24} color={colors.textPrimary} />}
                                label="Share"
                                onPress={onClose}
                            />
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
        paddingBottom: spacing.xxxl,
        paddingHorizontal: spacing.xl,
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: spacing.md,
        marginBottom: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    artwork: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: spacing.md,
    },
    headerInfo: {
        flex: 1,
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
    divider: {
        height: 1,
        backgroundColor: colors.divider,
        marginBottom: spacing.md,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    iconContainer: {
        width: 32,
        marginRight: spacing.md,
        alignItems: 'center',
    },
    optionLabel: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
        color: colors.textPrimary,
    },
});
