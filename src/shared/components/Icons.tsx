import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import { colors } from '../theme';

interface IconProps {
    size?: number;
    color?: string;
    filled?: boolean;
}

/**
 * Home Icon
 */
export function HomeIcon({ size = 24, color = colors.textPrimary, filled = false }: IconProps) {
    if (filled) {
        return (
            <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <Path
                    d="M3 10.182V22h6v-6h6v6h6V10.182L12 2 3 10.182Z"
                    fill={color}
                />
            </Svg>
        );
    }
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M3 10.182V22h6v-6h6v6h6V10.182L12 2 3 10.182Z"
                stroke={color}
                strokeWidth={2}
                strokeLinejoin="round"
            />
        </Svg>
    );
}

/**
 * Heart Icon (Favorites)
 */
export function HeartIcon({ size = 24, color = colors.textPrimary, filled = false }: IconProps) {
    if (filled) {
        return (
            <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <Path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z"
                    fill={color}
                />
            </Svg>
        );
    }
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z"
                stroke={color}
                strokeWidth={2}
                strokeLinejoin="round"
            />
        </Svg>
    );
}

/**
 * Playlist Icon
 */
export function PlaylistIcon({ size = 24, color = colors.textPrimary, filled = false }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M3 6h12M3 12h12M3 18h8"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
            />
            <Circle
                cx="18"
                cy="17"
                r="3"
                fill={filled ? color : 'none'}
                stroke={color}
                strokeWidth={2}
            />
            <Path
                d="M21 17V8"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
            />
        </Svg>
    );
}

/**
 * Settings/Gear Icon
 */
export function SettingsIcon({ size = 24, color = colors.textPrimary, filled = false }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle
                cx="12"
                cy="12"
                r="3"
                fill={filled ? color : 'none'}
                stroke={color}
                strokeWidth={2}
            />
            <Path
                d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
            />
        </Svg>
    );
}

/**
 * Search Icon
 */
export function SearchIcon({ size = 24, color = colors.textPrimary }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle
                cx="11"
                cy="11"
                r="7"
                stroke={color}
                strokeWidth={2}
            />
            <Path
                d="M21 21l-4.35-4.35"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
            />
        </Svg>
    );
}

/**
 * Music Note Icon (for Logo)
 */
export function MusicNoteIcon({ size = 24, color = colors.primary }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M9 18V5l12-2v13"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Circle cx="6" cy="18" r="3" fill={color} />
            <Circle cx="18" cy="16" r="3" fill={color} />
        </Svg>
    );
}
