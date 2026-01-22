/**
 * Theme Colors - Based on Figma Design
 * Light theme with orange accent
 */

export const colors = {
    // Primary accent
    primary: '#FF6B00',
    primaryLight: '#FF8A3D',
    primaryDark: '#E55A00',

    // Backgrounds
    background: '#FFFFFF',
    surface: '#F8F8F8',
    card: '#FFFFFF',

    // Text
    textPrimary: '#1A1A1A',
    textSecondary: '#666666',
    textMuted: '#999999',
    textOnPrimary: '#FFFFFF',

    // Tab bar
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#E5E5E5',
    tabInactive: '#999999',
    tabActive: '#FF6B00',

    // Dividers & borders
    divider: '#E5E5E5',
    border: '#E0E0E0',

    // Status
    error: '#FF4444',
    success: '#00C853',

    // Overlays
    overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
} as const;

export const typography = {
    sizes: {
        xs: 10,
        sm: 12,
        md: 14,
        lg: 16,
        xl: 18,
        xxl: 24,
        xxxl: 32,
    },
    weights: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },
    fonts: {
        regular: 'Outfit_400Regular',
        medium: 'Outfit_500Medium',
        semibold: 'Outfit_600SemiBold',
        bold: 'Outfit_700Bold',
    },
} as const;

export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
} as const;
