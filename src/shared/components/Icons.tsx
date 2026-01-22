import React from 'react';
import {
    FontAwesome,
    MaterialIcons,
    Feather,
    Entypo,
    MaterialCommunityIcons
} from '@expo/vector-icons';
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
    // Entypo Home is nice and bold
    return <Entypo name="home" size={size} color={color} />;
}

/**
 * Heart Icon (Favorites)
 */
export function HeartIcon({ size = 24, color = colors.textPrimary, filled = false }: IconProps) {
    if (filled) {
        return <FontAwesome name="heart" size={size} color={color} />;
    }
    return <FontAwesome name="heart-o" size={size} color={color} />;
}

/**
 * Playlist Icon
 */
export function PlaylistIcon({ size = 24, color = colors.textPrimary, filled = false }: IconProps) {
    return <MaterialIcons name="queue-music" size={size} color={color} />;
}

/**
 * Settings/Gear Icon
 */
export function SettingsIcon({ size = 24, color = colors.textPrimary, filled = false }: IconProps) {
    return <Feather name="settings" size={size} color={color} />;
}

/**
 * Search Icon
 */
export function SearchIcon({ size = 24, color = colors.textPrimary }: IconProps) {
    return <Feather name="search" size={size} color={color} />;
}

/**
 * Music Note Icon (for Logo)
 */
export function MusicNoteIcon({ size = 24, color = colors.primary }: IconProps) {
    return <FontAwesome name="music" size={size} color={color} />;
}

/**
 * Arrow Left Icon (Back)
 */
export function ArrowLeftIcon({ size = 24, color = colors.textPrimary }: IconProps) {
    return <Feather name="arrow-left" size={size} color={color} />;
}

/**
 * Close Icon (X)
 */
export function CloseIcon({ size = 24, color = colors.textPrimary }: IconProps) {
    return <Feather name="x" size={size} color={color} />;
}

/**
 * Chevron Up Icon (Lyrics)
 */
export function ChevronUpIcon({ size = 24, color = colors.textPrimary }: IconProps) {
    return <Feather name="chevron-up" size={size} color={color} />;
}

/**
 * Play Icon
 */
export function PlayIcon({ size = 24, color = colors.primary, filled = true }: IconProps) {
    // FontAwesome Play is standard
    return <FontAwesome name="play" size={size} color={color} />;
}

/**
 * Pause Icon
 */
export function PauseIcon({ size = 24, color = colors.primary, filled = true }: IconProps) {
    return <FontAwesome name="pause" size={size} color={color} />;
}

/**
 * Skip Next Icon
 */
export function SkipNextIcon({ size = 24, color = colors.textPrimary }: IconProps) {
    return <FontAwesome name="step-forward" size={size} color={color} />;
}

/**
 * Skip Previous Icon
 */
export function SkipPreviousIcon({ size = 24, color = colors.textPrimary }: IconProps) {
    return <FontAwesome name="step-backward" size={size} color={color} />;
}

/**
 * Rewind 10s Icon
 */
export function Rewind10Icon({ size = 24, color = colors.textPrimary }: IconProps) {
    // MaterialIcons has replay-10 which is exactly what we want
    return <MaterialIcons name="replay-10" size={size} color={color} />;
}

/**
 * Forward 10s Icon
 */
export function Forward10Icon({ size = 24, color = colors.textPrimary }: IconProps) {
    // MaterialIcons has forward-10
    return <MaterialIcons name="forward-10" size={size} color={color} />;
}

/**
 * Speed Icon (Speedometer)
 */
export function SpeedIcon({ size = 24, color = colors.textPrimary }: IconProps) {
    return <MaterialCommunityIcons name="speedometer" size={size} color={color} />;
}

/**
 * Timer Icon (Timer)
 */
export function TimerIcon({ size = 24, color = colors.textPrimary }: IconProps) {
    return <MaterialCommunityIcons name="timer-outline" size={size} color={color} />;
}

/**
 * Cast Icon
 */
export function CastIcon({ size = 24, color = colors.textPrimary }: IconProps) {
    return <MaterialIcons name="cast" size={size} color={color} />;
}

/**
 * More Vertical Icon (Options)
 */
export function MoreVerticalIcon({ size = 24, color = colors.textPrimary }: IconProps) {
    return <Feather name="more-vertical" size={size} color={color} />;
}

/**
 * Replay Icon (General)
 */
export function ReplayIcon({ size = 24, color = colors.textPrimary }: IconProps) {
    return <MaterialIcons name="replay" size={size} color={color} />;
}

/**
 * Shuffle Icon
 */
export function ShuffleIcon({ size = 24, color = colors.textPrimary }: IconProps) {
    return <MaterialIcons name="shuffle" size={size} color={color} />;
}
